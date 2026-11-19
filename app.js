// Daily Meal Planner — Indian thali menus that hit protein, fibre and good-fat
// targets, a shopping list and WhatsApp sharing.
// Everything runs in the browser; choices are kept in localStorage.

const STORAGE_KEY = "meal-planner:v4";
const GOOD_FAT_TARGET = 20; // grams per person per day from nuts, seeds and fish

// How many dishes in one day may use the same main protein before the
// planner starts to avoid it.
const PROTEIN_LIMIT = { Paneer: 3, Soya: 3, Eggs: 4, Chicken: 1, Fish: 1 };

// ---------- storage ----------

function loadState() {
  let saved = null;
  let old = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Menus from earlier versions used different dishes, so only keep their settings.
    if (!saved) old = JSON.parse(localStorage.getItem("meal-planner:v3")) ||
      JSON.parse(localStorage.getItem("meal-planner:v2"));
  } catch (e) {
    saved = null;
  }
  const carried = Object.assign({}, old && old.settings);
  delete carried.whey;
  delete carried.diet; // the menu structure changed, so the diet is chosen again
  if (carried.kcal === 2400) delete carried.kcal; // old default; the new default is higher
  const settings = Object.assign(
    { people: 1, diet: "nonveg", phone: "", protein: 150, fibre: 30, kcal: 2600 },
    carried, saved && saved.settings);
  return { settings, days: (saved && saved.days) || {} };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* storage unavailable (private mode) — app still works for this visit */
  }
}

const state = loadState();
let currentDate = todayISO();

// ---------- helpers ----------

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function shiftDate(iso, days) {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function prettyDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "short",
  });
}

function hash(str) {
  let h = 2166136261;
  for (let c = 0; c < str.length; c++) {
    h ^= str.charCodeAt(c);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Small seeded random generator so a date always gets the same first plan.
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function allowedDiets(diet) {
  if (diet === "veg") return ["veg"];
  if (diet === "egg") return ["veg", "egg"];
  return ["veg", "egg", "nonveg"];
}

function candidates(pool) {
  const ok = allowedDiets(state.settings.diet);
  return RECIPES[pool].filter((r) => ok.includes(r.diet));
}

function findRecipe(pool, id) {
  return RECIPES[pool].find((r) => r.id === id);
}

function slotRecipe(day, slot) {
  return findRecipe(slot.pool, day[slot.key]);
}

// A slot is shown only when there is a real choice to make. In a vegetarian
// diet the side slots only offer "No side", so they stay hidden.
function slotVisible(slot) {
  return candidates(slot.pool).length > 1;
}

// Pairs of lunch/dinner slots with the same role (dal with dal, and so on).
const PAIRS = ["dal", "sabzi", "saag", "salad", "dahi", "staple", "side"].map((part) => ({
  a: SLOTS.findIndex((s) => s.group === "lunch" && s.part === part),
  b: SLOTS.findIndex((s) => s.group === "dinner" && s.part === part),
  hard: part !== "staple" && part !== "side",
}));

// ---------- nutrition & planning ----------

function totals(recipes) {
  const t = { protein: 0, fibre: 0, fat: 0, goodFat: 0, kcal: 0 };
  recipes.forEach((r) => {
    if (!r) return;
    Object.keys(t).forEach((k) => (t[k] += r.nutrition[k]));
  });
  return t;
}

// Lower is better. Heavily penalises missing protein / fibre / good-fat targets,
// penalises going over calories, repeats and too much of one protein.
function score(plan, yesterday, jitter) {
  const s = state.settings;
  const t = totals(plan);
  let sc = 0;
  sc += 4 * Math.max(0, s.protein + 3 - t.protein); // small margin so rounding never shows a miss
  sc += 8 * Math.max(0, s.fibre + 1 - t.fibre);
  sc += 10 * Math.max(0, GOOD_FAT_TARGET + 2 - t.goodFat);
  sc += 1.5 * Math.max(0, t.kcal - (s.kcal - 10)) + 0.01 * t.kcal; // stay under the calorie limit, lighter is slightly better
  // Soft caps so the day doesn't overshoot by a lot.
  sc += 0.3 * Math.max(0, t.protein - (s.protein + 40));
  sc += 1 * Math.max(0, t.fibre - (s.fibre + 15));
  // Lunch and dinner shouldn't repeat a dish.
  PAIRS.forEach(({ a, b, hard }) => {
    if (plan[a].id === plan[b].id && plan[a].id !== "none") sc += hard ? 1000 : 4;
  });
  // Don't lean on one protein all day.
  const counts = {};
  plan.forEach((r) => r.proteinGroups.forEach((g) => (counts[g] = (counts[g] || 0) + 1)));
  Object.keys(counts).forEach((g) => {
    sc += 6 * Math.max(0, counts[g] - (PROTEIN_LIMIT[g] || 3));
  });
  plan.forEach((r, idx) => {
    // Chicken / fish / egg side is expected at lunch and dinner unless the diet is veg.
    if (r.id === "none" && s.diet !== "veg") sc += 40;
    // Avoid repeating yesterday's dishes.
    if (r.id !== "none" && yesterday[SLOTS[idx].key] === r.id) sc += 8;
    // Per-day random preference so menus vary.
    if (jitter) sc += jitter[r.id] || 0;
  });
  return sc;
}

function makeJitter(rand) {
  const j = {};
  Object.values(RECIPES).flat().forEach((r) => (j[r.id] = rand() * 4));
  return j;
}

// Build a full day: random starts, then improve one slot at a time.
function planDay(date, rand) {
  const yesterday = state.days[shiftDate(date, -1)] || {};
  const jitter = makeJitter(rand);
  const pools = SLOTS.map((s) => candidates(s.pool));
  let best = null;
  let bestScore = Infinity;
  for (let start = 0; start < 20; start++) {
    let plan = pools.map((list) => list[Math.floor(rand() * list.length)]);
    let current = score(plan, yesterday, jitter);
    for (let pass = 0; pass < 6; pass++) {
      let improved = false;
      SLOTS.forEach((_, idx) => {
        pools[idx].forEach((r) => {
          if (r === plan[idx]) return;
          const trial = plan.slice();
          trial[idx] = r;
          const sc = score(trial, yesterday, jitter);
          if (sc < current - 1e-9) { plan = trial; current = sc; improved = true; }
        });
      });
      if (!improved) break;
    }
    if (current < bestScore) { best = plan; bestScore = current; }
  }
  const day = state.days[date] || { have: [], extras: [] };
  SLOTS.forEach((s, idx) => (day[s.key] = best[idx].id));
  day.diet = state.settings.diet;
  state.days[date] = day;
  return day;
}

// Get (and plan if needed) the day. A new day's first plan is the same
// every time you open it, until you shuffle.
function getDay(date) {
  const day = state.days[date];
  const valid = day && day.diet === state.settings.diet && SLOTS.every((s) => {
    const r = findRecipe(s.pool, day[s.key]);
    return r && candidates(s.pool).includes(r);
  });
  if (valid) return day;
  const s = state.settings;
  return planDay(date, rng(hash([date, s.diet, s.protein, s.fibre, s.kcal].join("|"))));
}

function replanToday() {
  planDay(currentDate, Math.random);
  saveState();
  render();
}

// Swap one dish for a different one that still keeps the day on target.
function shuffleSlot(slotIdx) {
  const day = getDay(currentDate);
  const yesterday = state.days[shiftDate(currentDate, -1)] || {};
  const plan = SLOTS.map((s) => slotRecipe(day, s));
  const options = candidates(SLOTS[slotIdx].pool)
    .filter((r) => r.id !== plan[slotIdx].id)
    .map((r) => {
      const trial = plan.slice();
      trial[slotIdx] = r;
      return { r, sc: score(trial, yesterday, null) };
    })
    .sort((a, b) => a.sc - b.sc);
  if (!options.length) return;
  const good = options.filter((o) => o.sc <= options[0].sc + 15).slice(0, 4);
  day[SLOTS[slotIdx].key] = good[Math.floor(Math.random() * good.length)].r.id;
  saveState();
  render();
}

// ---------- shopping list ----------

function roundTo(n, step) {
  return Math.max(step, Math.round(n / step) * step);
}

function plural(n, word) {
  return `${n} ${n === 1 ? word : word === "bunch" ? "bunches" : word + "s"}`;
}

function formatQty(qty, unit) {
  if (unit === "g" || unit === "ml") {
    const big = unit === "g" ? "kg" : "L";
    if (qty >= 1000) return `${Math.round((qty / 1000) * 4) / 4} ${big}`;
    return `${roundTo(qty, qty >= 100 ? 50 : qty >= 20 ? 10 : 5)} ${unit}`;
  }
  const n = Math.ceil(qty - 1e-9);
  if (unit === "pcs") return `${n}`;
  return plural(n, unit);
}

function buildShoppingList(day) {
  const people = state.settings.people;
  const items = new Map();
  SLOTS.forEach((slot) => {
    const recipe = slotRecipe(day, slot);
    if (!recipe) return;
    recipe.ingredients.forEach((ing) => {
      const id = ing.name + "|" + ing.unit;
      // A pack of masala covers the whole day, so packs are not added up.
      const amount = ing.unit === "pack" ? ing.qty : ing.qty * people;
      const existing = items.get(id);
      if (existing) {
        existing.qty = ing.unit === "pack" ? Math.max(existing.qty, amount) : existing.qty + amount;
        if (!existing.usedIn.includes(recipe.name)) existing.usedIn.push(recipe.name);
      } else {
        items.set(id, { id, name: ing.name, unit: ing.unit, category: NUTRITION[ing.name][0],
          qty: amount, usedIn: [recipe.name] });
      }
    });
  });
  (day.extras || []).forEach((text) => {
    const id = "extra|" + text;
    items.set(id, { id, name: text, unit: "", category: "Other", qty: 0, usedIn: [], extra: true });
  });
  return Array.from(items.values()).sort((a, b) =>
    CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.name.localeCompare(b.name));
}

function itemLabel(item) {
  return item.extra ? item.name : `${item.name} – ${formatQty(item.qty, item.unit)}`;
}

// ---------- WhatsApp ----------

function nutritionLine(t) {
  return `Protein ${Math.round(t.protein)} g · Fibre ${Math.round(t.fibre)} g · ` +
    `Good fats ${Math.round(t.goodFat)} g · ${Math.round(t.kcal).toLocaleString()} kcal`;
}

function groupSlots(groupKey) {
  return SLOTS.map((slot, idx) => ({ slot, idx })).filter((x) => x.slot.group === groupKey);
}

function menuText(day) {
  const lines = [`*Menu for ${prettyDate(currentDate)}*`];
  MEAL_GROUPS.forEach((g) => {
    const parts = groupSlots(g.key)
      .map(({ slot }) => ({ slot, r: slotRecipe(day, slot) }))
      .filter(({ r }) => r && r.id !== "none");
    lines.push("");
    if (parts.length === 1) {
      lines.push(`${g.emoji} *${g.label}:* ${parts[0].r.name}`);
    } else {
      lines.push(`${g.emoji} *${g.label}*`);
      parts.forEach(({ slot, r }) => {
        const label = slot.part === "side" ? "Side" : slot.label;
        lines.push(`• ${label}: ${r.name}`);
      });
    }
  });
  const t = totals(SLOTS.map((s) => slotRecipe(day, s)));
  lines.push("", `_Per person: ${nutritionLine(t)}_`);
  return lines.join("\n");
}

function orderText(day) {
  const have = new Set(day.have || []);
  const items = buildShoppingList(day).filter((it) => !have.has(it.id));
  const n = state.settings.people;
  const lines = [`*Order list – ${prettyDate(currentDate)}* (${n} ${n === 1 ? "person" : "people"})`];
  if (!items.length) {
    lines.push("Nothing to order 🎉");
    return lines.join("\n");
  }
  let cat = null;
  items.forEach((it) => {
    if (it.category !== cat) {
      cat = it.category;
      lines.push("", `_${cat}_`);
    }
    lines.push(`• ${itemLabel(it)}`);
  });
  return lines.join("\n");
}

function whatsappLink(text) {
  const phone = (state.settings.phone || "").replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// ---------- rendering ----------

const $ = (sel) => document.querySelector(sel);

function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "style") node.setAttribute("style", v);
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (v === true) node.setAttribute(k, "");
    else if (v !== false && v != null) node.setAttribute(k, v);
  });
  children.flat().forEach((c) => {
    if (c != null) node.append(c.nodeType ? c : document.createTextNode(c));
  });
  return node;
}

const DIET_BADGE = { veg: "Veg", egg: "Egg", nonveg: "Non-veg" };

function renderTargets(day) {
  const s = state.settings;
  const t = totals(SLOTS.map((sl) => slotRecipe(day, sl)));
  const rows = [
    { label: "Protein", value: t.protein, target: s.protein, unit: "g", min: true },
    { label: "Fibre", value: t.fibre, target: s.fibre, unit: "g", min: true },
    { label: "Good fats", value: t.goodFat, target: GOOD_FAT_TARGET, unit: "g", min: true },
    { label: "Calories", value: t.kcal, target: s.kcal, unit: "kcal", min: false },
  ];
  const wrap = $("#targets");
  wrap.innerHTML = "";
  rows.forEach((row) => {
    const pct = Math.min(100, (row.value / row.target) * 100);
    let status;
    if (row.min) status = row.value >= row.target ? "ok" : row.value >= row.target * 0.9 ? "near" : "low";
    else status = row.value <= row.target ? "ok" : row.value <= row.target * 1.1 ? "near" : "low";
    const statusText = row.min
      ? (status === "ok" ? "Target met" : `${Math.round(row.target - row.value)} ${row.unit} short`)
      : (status === "ok" ? "Within limit" : `${Math.round(row.value - row.target)} kcal over`);
    wrap.append(el("div", { class: `target ${status}` },
      el("div", { class: "target-top" },
        el("span", { class: "target-label" }, row.label),
        el("span", { class: "target-value" },
          el("strong", {}, Math.round(row.value).toLocaleString()),
          ` / ${row.target.toLocaleString()} ${row.unit}`)),
      el("div", { class: "bar" }, el("span", { style: `width:${pct}%` })),
      el("div", { class: "target-status" }, statusText)));
  });
  const sources = new Set();
  SLOTS.forEach((sl) => (slotRecipe(day, sl).goodFatSources || []).forEach((x) => sources.add(x)));
  $("#fat-sources").textContent = sources.size
    ? `Good fats from: ${Array.from(sources).join(", ")}.`
    : "No good-fat sources today. Shuffle a salad or snack to add nuts or seeds.";
}

function chip(value, label) {
  return el("span", { class: "chip" }, el("b", {}, value), ` ${label}`);
}

function nutritionChips(n, withKcal) {
  return el("div", { class: "chips" },
    chip(`${Math.round(n.protein)} g`, "protein"),
    chip(`${Math.round(n.fibre)} g`, "fibre"),
    n.goodFat >= 1 ? chip(`${Math.round(n.goodFat)} g`, "good fats") : null,
    withKcal ? el("span", { class: "chip muted" }, `${Math.round(n.kcal)} kcal`) : null);
}

// A dropdown with the current dish plus a Shuffle button.
function slotControls(day, slot, idx) {
  const select = el("select", {
    id: `pick-${slot.key}`,
    "aria-label": `Choose ${slot.label}`,
    onchange: (e) => { day[slot.key] = e.target.value; saveState(); render(); },
  }, candidates(slot.pool).map((r) => el("option", { value: r.id, selected: r.id === day[slot.key] }, r.name)));
  return el("div", { class: "meal-actions" },
    select,
    el("button", { class: "btn ghost", onclick: () => shuffleSlot(idx), title: "Suggest another dish that keeps the day on target" }, "Shuffle"));
}

function renderMenu(day) {
  const wrap = $("#menu");
  wrap.innerHTML = "";
  const people = state.settings.people;
  MEAL_GROUPS.forEach((g) => {
    const rows = groupSlots(g.key).filter(({ slot }) => slotVisible(slot));
    const recipes = rows.map(({ slot }) => slotRecipe(day, slot));
    const single = rows.length === 1;
    const card = el("article", { class: "meal" });

    if (single) {
      const { slot, idx } = rows[0];
      const r = recipes[0];
      card.append(
        el("div", { class: "meal-head" },
          el("span", { class: "meal-label" }, g.label),
          el("span", { class: `badge ${r.diet}` }, DIET_BADGE[r.diet])),
        el("h3", {}, r.name),
        nutritionChips(r.nutrition, true),
        slotControls(day, slot, idx));
    } else {
      card.append(
        el("div", { class: "meal-head" },
          el("h3", { class: "meal-title" }, g.label)),
        nutritionChips(totals(recipes), true));
      rows.forEach(({ slot, idx }, n) => {
        const r = recipes[n];
        const withBadge = r.diet !== "veg";
        card.append(el("div", { class: "row" },
          el("div", { class: "part" },
            el("span", {}, slot.label),
            withBadge ? el("span", { class: `badge ${r.diet}` }, DIET_BADGE[r.diet]) : null),
          slotControls(day, slot, idx),
          r.id === "none" ? null : el("div", { class: "row-sub" },
            `${Math.round(r.nutrition.protein)} g protein · ${Math.round(r.nutrition.fibre)} g fibre · ${Math.round(r.nutrition.kcal)} kcal`)));
      });
    }

    card.append(el("details", {},
      el("summary", {}, people === 1 ? "Ingredients (1 person)" : `Ingredients (${people} people)`),
      recipes.filter((r) => r.id !== "none").map((r) =>
        el("div", { class: "ing-group" },
          single ? null : el("strong", {}, r.name),
          el("ul", { class: "ing" }, r.ingredients.map((ing) =>
            el("li", {}, `${ing.name} – ${formatQty(ing.unit === "pack" ? ing.qty : ing.qty * people, ing.unit)}`)))))));
    wrap.append(card);
  });
}

function renderList(day) {
  const wrap = $("#list");
  wrap.innerHTML = "";
  const have = new Set(day.have || []);
  const items = buildShoppingList(day);
  let cat = null;
  let group = null;
  items.forEach((it) => {
    if (it.category !== cat) {
      cat = it.category;
      group = el("ul", { class: "items" });
      wrap.append(el("h4", {}, cat), group);
    }
    const checked = have.has(it.id);
    group.append(el("li", { class: checked ? "have" : "" },
      el("label", {},
        el("input", { type: "checkbox", checked, onchange: (e) => {
          const set = new Set(day.have || []);
          e.target.checked ? set.add(it.id) : set.delete(it.id);
          day.have = Array.from(set);
          saveState();
          render();
        } }),
        el("span", { class: "name" }, itemLabel(it)),
        it.usedIn.length ? el("small", {}, it.usedIn.join(", ")) : null),
      it.extra ? el("button", { class: "icon", title: "Remove", "aria-label": `Remove ${it.name}`, onclick: () => {
        day.extras = day.extras.filter((x) => x !== it.name);
        saveState();
        render();
      } }, "✕") : null));
  });
  const toOrder = items.filter((it) => !have.has(it.id)).length;
  $("#list-count").textContent = `${toOrder} to order · ${items.length - toOrder} at home`;
}

function render() {
  const day = getDay(currentDate);
  saveState();
  const s = state.settings;
  $("#date").value = currentDate;
  $("#date-label").textContent = currentDate === todayISO() ? "Today" : prettyDate(currentDate);
  $("#people").value = s.people;
  $("#diet").value = s.diet;
  $("#phone").value = s.phone;
  $("#t-protein").value = s.protein;
  $("#t-fibre").value = s.fibre;
  $("#t-kcal").value = s.kcal;
  renderTargets(day);
  renderMenu(day);
  renderList(day);

  const menu = menuText(day);
  const order = orderText(day);
  $("#wa-menu").href = whatsappLink(menu);
  $("#wa-order").href = whatsappLink(order);
  $("#wa-both").href = whatsappLink(menu + "\n\n" + order);
  $("#preview").textContent = menu + "\n\n" + order;
}

// ---------- events ----------

function numberSetting(id, key, min, max, replan) {
  $(id).addEventListener("change", (e) => {
    const v = parseInt(e.target.value, 10);
    state.settings[key] = Math.min(max, Math.max(min, isNaN(v) ? min : v));
    if (replan) planDay(currentDate, Math.random);
    render();
  });
}

function init() {
  $("#prev").addEventListener("click", () => { currentDate = shiftDate(currentDate, -1); render(); });
  $("#next").addEventListener("click", () => { currentDate = shiftDate(currentDate, 1); render(); });
  $("#date").addEventListener("change", (e) => { if (e.target.value) { currentDate = e.target.value; render(); } });
  numberSetting("#people", "people", 1, 30, false);
  numberSetting("#t-protein", "protein", 30, 300, true);
  numberSetting("#t-fibre", "fibre", 10, 80, true);
  numberSetting("#t-kcal", "kcal", 1000, 5000, true);
  $("#diet").addEventListener("change", (e) => {
    state.settings.diet = e.target.value;
    planDay(currentDate, Math.random);
    render();
  });
  $("#phone").addEventListener("change", (e) => { state.settings.phone = e.target.value.trim(); render(); });
  $("#shuffle-all").addEventListener("click", replanToday);
  $("#extra-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#extra");
    const text = input.value.trim();
    if (!text) return;
    const day = getDay(currentDate);
    day.extras = day.extras || [];
    if (!day.extras.includes(text)) day.extras.push(text);
    input.value = "";
    saveState();
    render();
  });
  $("#copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#preview").textContent);
      $("#copy").textContent = "Copied";
    } catch (e) {
      // Clipboard blocked: select the text so it can be copied by hand.
      const range = document.createRange();
      range.selectNodeContents($("#preview"));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      $("#copy").textContent = "Text selected – copy it";
    }
    setTimeout(() => ($("#copy").textContent = "Copy text"), 1800);
  });
  render();
}

document.addEventListener("DOMContentLoaded", init);
