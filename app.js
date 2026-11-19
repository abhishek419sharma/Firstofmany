// Daily Meal Planner — Indian thali menus that hit protein, fibre and good-fat
// targets, a shopping list and WhatsApp sharing.
// Everything runs in the browser; choices are kept in localStorage.

const STORAGE_KEY = "meal-planner:v6";
const DEFAULT_KCAL = 2800;
const DEFAULT_DINNER_KCAL = 650; // keep dinner light
const GOOD_FAT_TARGET = 20; // grams per person per day from nuts, seeds and fish

// How many dishes in one day may use the same main protein before the
// planner starts to avoid it.
const PROTEIN_LIMIT = { Paneer: 3, Eggs: 4, Chicken: 1, Fish: 1 };

// ---------- storage ----------

const DIETS = ["egg", "nonveg"];
const SEND_MODES = ["choose", "number", "group"];

function clampInt(v, fallback, lo, hi) {
  if (v === null || v === undefined || v === "") return fallback;
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
}

// Make sure settings read from storage are usable, whatever was saved.
function sanitizeSettings(raw) {
  const s = raw && typeof raw === "object" ? raw : {};
  const phone = typeof s.phone === "string" ? s.phone : "";
  return {
    people: clampInt(s.people, 1, 1, 30),
    diet: s.diet === "veg" ? "egg" : DIETS.includes(s.diet) ? s.diet : "nonveg", // breakfast always has eggs
    phone,
    groupLink: typeof s.groupLink === "string" ? s.groupLink : "",
    sendMode: SEND_MODES.includes(s.sendMode) ? s.sendMode
      : (phone.replace(/\D/g, "").length >= 10 ? "number" : "choose"),
    mealIngredients: s.mealIngredients === true,
    protein: clampInt(s.protein, 150, 30, 300),
    fibre: clampInt(s.fibre, 30, 10, 80),
    kcal: clampInt(s.kcal, DEFAULT_KCAL, 1000, 5000),
    dinnerKcal: clampInt(s.dinnerKcal, DEFAULT_DINNER_KCAL, 300, 2000),
  };
}

function loadState() {
  let saved = null;
  let old = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Menus from earlier versions used different slots, so only keep their settings.
    if (!saved) {
      for (const key of ["meal-planner:v5", "meal-planner:v4", "meal-planner:v3", "meal-planner:v2"]) {
        const v = JSON.parse(localStorage.getItem(key));
        if (v) { old = v; break; }
      }
    }
  } catch (e) {
    saved = null;
  }
  if (!saved || typeof saved !== "object") saved = null;
  const carried = Object.assign({}, old && old.settings);
  delete carried.whey;
  if (carried.kcal === 2400 || carried.kcal === 2600) delete carried.kcal; // old defaults
  if (carried.dinnerKcal === 750) delete carried.dinnerKcal; // old default; dinner is lighter now
  const days = saved && saved.days && typeof saved.days === "object" ? saved.days : {};
  const pantry = saved && Array.isArray(saved.pantry) ? saved.pantry.filter((x) => typeof x === "string") : [];
  const merged = Object.assign({}, carried, saved && saved.settings);
  if (merged.dinnerKcal === 750) delete merged.dinnerKcal; // old default; dinner is lighter now
  return { settings: sanitizeSettings(merged), days, pantry };
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

// Seasonal dishes only appear in their months. This follows the date being planned
// or viewed: getDay() and planDay() set it first.
let planMonth = new Date().getMonth() + 1;
function setViewDate(date) {
  const m = Number(String(date).slice(5, 7));
  if (m >= 1 && m <= 12) planMonth = m;
}

// Dishes a slot may use: its pool, for the chosen diet, in season, and no legumes at dinner.
function slotCandidates(slot) {
  return candidates(slot.pool).filter((r) => !(slot.noLegumes && r.legume));
}

function candidates(pool) {
  const ok = allowedDiets(state.settings.diet);
  return RECIPES[pool].filter((r) => ok.includes(r.diet) && (!r.months || r.months.includes(planMonth)));
}

function findRecipe(pool, id) {
  return RECIPES[pool].find((r) => r.id === id);
}

function slotRecipe(day, slot) {
  return findRecipe(slot.pool, day[slot.key]);
}

// A slot is shown unless it only offers "No side". A slot with a single dish
// (the haldi-nimbu tea) is shown as fixed.
function slotVisible(slot) {
  const c = slotCandidates(slot);
  return c.length > 1 || (c.length === 1 && c[0].id !== "none");
}

const DINNER_IDX = SLOTS.map((s, i) => (s.group === "dinner" ? i : -1)).filter((i) => i >= 0);

// Pairs of slots that should not repeat a dish: lunch vs dinner parts with the
// same role (dal with dal, and so on), and the two fruits.
const PAIRS = ["dal", "sabzi", "saag", "salad", "dahi", "side", "chutney"].map((part) => ({
  a: SLOTS.findIndex((s) => s.group === "lunch" && s.part === part),
  b: SLOTS.findIndex((s) => s.group === "dinner" && s.part === part),
  hard: part !== "side",
}));
PAIRS.push({
  a: SLOTS.findIndex((s) => s.key === "breakfastFruit"),
  b: SLOTS.findIndex((s) => s.key === "snackFruit"),
  hard: true,
});
// Dinner has no dal, so that pair does not exist.
for (let i = PAIRS.length - 1; i >= 0; i--) {
  if (PAIRS[i].a < 0 || PAIRS[i].b < 0) PAIRS.splice(i, 1);
}

// ---------- nutrition & planning ----------

function totals(recipes) {
  const t = { protein: 0, fibre: 0, fat: 0, goodFat: 0, kcal: 0 };
  recipes.forEach((r) => {
    if (!r) return;
    Object.keys(t).forEach((k) => (t[k] += r.nutrition[k]));
  });
  return t;
}

// Index superfoods, bowel-friendly foods and main proteins once, so scoring is fast.
const SF_INDEX = {};
Object.keys(SUPERFOODS).forEach((n, i) => (SF_INDEX[n] = i));
const GUT_INDEX = {};
GUT_FRIENDLY.forEach((n, i) => (GUT_INDEX[n] = i));
const PG_LIST = ["Paneer", "Eggs", "Chicken", "Fish"];
const PG_LIMIT = PG_LIST.map((g) => PROTEIN_LIMIT[g] || 3);
Object.values(RECIPES).flat().forEach((r) => {
  r.sfIdx = r.superfoods.map((n) => SF_INDEX[n]);
  r.gutIdx = r.gut.map((n) => GUT_INDEX[n]);
  r.pgIdx = r.proteinGroups.map((g) => PG_LIST.indexOf(g)).filter((x) => x >= 0);
});
const IS_DINNER = SLOTS.map((s) => s.group === "dinner");
const sfBuf = new Uint8Array(Object.keys(SUPERFOODS).length);
const gutBuf = new Uint8Array(GUT_FRIENDLY.length);
const pgBuf = new Uint8Array(PG_LIST.length);

// What was eaten yesterday, so today can avoid repeats and add new superfoods.
function dayContext(date) {
  const yesterday = state.days[shiftDate(date, -1)] || {};
  const ySf = new Uint8Array(sfBuf.length);
  SLOTS.forEach((s) => {
    const r = yesterday[s.key] && findRecipe(s.pool, yesterday[s.key]);
    if (r) r.sfIdx.forEach((i) => (ySf[i] = 1));
  });
  return { yesterday, ySf };
}

// Lower is better. Heavily penalises missing protein / fibre / good-fat targets,
// penalises going over calories, repeats and too much of one protein, and
// rewards a wide range of superfoods and bowel-friendly foods. This runs
// thousands of times per plan, so it avoids allocating.
function score(plan, ctx, jitter) {
  const s = state.settings;
  sfBuf.fill(0);
  gutBuf.fill(0);
  pgBuf.fill(0);
  let protein = 0, fibre = 0, goodFat = 0, kcal = 0, dinnerKcal = 0, sc = 0;
  for (let idx = 0; idx < plan.length; idx++) {
    const r = plan[idx];
    const n = r.nutrition;
    protein += n.protein;
    fibre += n.fibre;
    goodFat += n.goodFat;
    kcal += n.kcal;
    for (let k = 0; k < r.sfIdx.length; k++) sfBuf[r.sfIdx[k]] = 1;
    for (let k = 0; k < r.gutIdx.length; k++) gutBuf[r.gutIdx[k]] = 1;
    for (let k = 0; k < r.pgIdx.length; k++) pgBuf[r.pgIdx[k]]++;
    if (IS_DINNER[idx]) {
      dinnerKcal += n.kcal;
      if (r.heavy) sc += 25; // rich or heavy dishes stay away from dinner
    }
    // Chicken / fish / egg side is expected at lunch and dinner.
    if (r.id === "none") sc += 40;
    // Avoid repeating yesterday's dishes.
    else if (ctx.yesterday[SLOTS[idx].key] === r.id) sc += 8;
    // Per-day random preference so menus vary.
    if (jitter) sc += jitter[r.id] || 0;
  }
  sc += 4 * Math.max(0, s.protein + 3 - protein); // small margin so rounding never shows a miss
  sc += 8 * Math.max(0, s.fibre + 1 - fibre);
  sc += 10 * Math.max(0, GOOD_FAT_TARGET + 2 - goodFat);
  sc += 1.5 * Math.max(0, kcal - (s.kcal - 10)) + 0.01 * kcal; // stay under the calorie limit, lighter is slightly better
  sc += 0.3 * Math.max(0, protein - (s.protein + 40)); // don't overshoot protein by a lot
  sc += 3 * Math.max(0, dinnerKcal - (s.dinnerKcal - 10)) + 0.01 * dinnerKcal;
  // Lunch and dinner shouldn't repeat a dish.
  for (let k = 0; k < PAIRS.length; k++) {
    const p = PAIRS[k];
    const x = plan[p.a];
    if (x.id === plan[p.b].id && x.id !== "none") sc += p.hard ? 1000 : 4;
  }
  // Don't lean on one protein all day.
  for (let g = 0; g < pgBuf.length; g++) {
    if (pgBuf[g] > PG_LIMIT[g]) sc += 6 * (pgBuf[g] - PG_LIMIT[g]);
  }
  // Reward many superfoods, and ones that were not eaten yesterday; reward bowel-friendly foods.
  let sfCount = 0, fresh = 0, gutCount = 0;
  for (let i = 0; i < sfBuf.length; i++) {
    if (sfBuf[i]) { sfCount++; if (!ctx.ySf[i]) fresh++; }
  }
  for (let i = 0; i < gutBuf.length; i++) if (gutBuf[i]) gutCount++;
  sc -= 0.6 * Math.min(sfCount, 20) + 0.6 * Math.min(fresh, 14) + 0.8 * Math.min(gutCount, 8);
  return sc;
}

function makeJitter(rand) {
  const j = {};
  Object.values(RECIPES).flat().forEach((r) => (j[r.id] = rand() * 4));
  return j;
}

// Build a full day: random starts, then improve one slot at a time.
function planDay(date, rand) {
  setViewDate(date);
  const ctx = dayContext(date);
  const jitter = makeJitter(rand);
  const pools = SLOTS.map((s) => slotCandidates(s));
  let best = null;
  let bestScore = Infinity;
  for (let start = 0; start < 14; start++) {
    let plan = pools.map((list) => list[Math.floor(rand() * list.length)]);
    let current = score(plan, ctx, jitter);
    for (let pass = 0; pass < 6; pass++) {
      let improved = false;
      SLOTS.forEach((_, idx) => {
        pools[idx].forEach((r) => {
          if (r === plan[idx]) return;
          const trial = plan.slice();
          trial[idx] = r;
          const sc = score(trial, ctx, jitter);
          if (sc < current - 1e-9) { plan = trial; current = sc; improved = true; }
        });
      });
      if (!improved) break;
    }
    if (current < bestScore) { best = plan; bestScore = current; }
  }
  const prev = state.days[date];
  const day = prev && typeof prev === "object" ? prev : { have: [], extras: [] };
  SLOTS.forEach((s, idx) => (day[s.key] = best[idx].id));
  day.diet = state.settings.diet;
  state.days[date] = day;
  return day;
}

// Get (and plan if needed) the day. A new day's first plan is the same
// every time you open it, until you shuffle.
function getDay(date) {
  setViewDate(date);
  const day = state.days[date];
  const valid = day && day.diet === state.settings.diet && SLOTS.every((s) => {
    const r = findRecipe(s.pool, day[s.key]);
    return r && slotCandidates(s).includes(r);
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
  const ctx = dayContext(currentDate);
  const plan = SLOTS.map((s) => slotRecipe(day, s));
  const options = slotCandidates(SLOTS[slotIdx])
    .filter((r) => r.id !== plan[slotIdx].id)
    .map((r) => {
      const trial = plan.slice();
      trial[slotIdx] = r;
      return { r, sc: score(trial, ctx, null) };
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
    recipe.ingredients.forEach((raw) => {
      const ing = raw.buy || raw; // egg whites and yolk are bought as eggs
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

// "At home" is remembered per day, except spice packs, which stay ticked on every day.
function isHave(day, it) {
  return it.unit === "pack" ? state.pantry.includes(it.id) : (day.have || []).includes(it.id);
}

function setHave(day, it, on) {
  const next = new Set(it.unit === "pack" ? state.pantry : (day.have || []));
  if (on) next.add(it.id);
  else next.delete(it.id);
  if (it.unit === "pack") state.pantry = Array.from(next);
  else day.have = Array.from(next);
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
  const items = buildShoppingList(day).filter((it) => !isHave(day, it));
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

// One meal as a WhatsApp message, for the Send button on each meal card.
function mealText(groupKey, day) {
  const g = MEAL_GROUPS.find((x) => x.key === groupKey);
  const n = state.settings.people;
  const rows = groupSlots(groupKey)
    .map(({ slot }) => ({ slot, r: slotRecipe(day, slot) }))
    .filter(({ r }) => r && r.id !== "none");
  const title = g.label.replace(" (light)", "");
  const lines = [`${g.emoji} *${title} – ${prettyDate(currentDate)}*${n > 1 ? ` (for ${n} people)` : ""}`];
  rows.forEach(({ slot, r }) => lines.push(`• ${slot.part === "side" ? "Side" : slot.label}: ${r.name}`));
  lines.push("", `_Per person: ${nutritionLine(totals(rows.map((x) => x.r)))}_`);
  if (state.settings.mealIngredients) {
    lines.push("", `*Ingredients${n > 1 ? ` (for ${n} people)` : ""}*`);
    rows.forEach(({ r }) => {
      const list = r.ingredients.filter((ing) => ing.unit !== "pack")
        .map((ing) => `${ing.name} ${formatQty(ing.qty * n, ing.unit)}`);
      if (list.length) lines.push(`• ${r.name}: ${list.join(", ")}`);
    });
  }
  return lines.join("\n");
}

// ---------- sending ----------

const GROUP_RE = /chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/;
const MAX_LINK = 7500; // longer links may be cut off by some browsers

function phoneDigits() {
  return (state.settings.phone || "").replace(/\D/g, "");
}

function groupInviteUrl() {
  const m = (state.settings.groupLink || "").match(GROUP_RE);
  return m ? `https://chat.whatsapp.com/${m[1]}` : null;
}

// In group mode the message is copied and the group opens, because WhatsApp
// cannot pre-fill a message into a group from a link.
function sendCopiesFirst() {
  return state.settings.sendMode === "group" && !!groupInviteUrl();
}

function sendHref(text) {
  const mode = state.settings.sendMode;
  if (mode === "group" && groupInviteUrl()) return groupInviteUrl();
  const q = `?text=${encodeURIComponent(text)}`;
  if (mode === "number" && phoneDigits()) return `https://wa.me/${phoneDigits()}${q}`;
  return `https://wa.me/${q}`; // WhatsApp lets you pick any chat or group
}

function sendTargetText() {
  const mode = state.settings.sendMode;
  if (mode === "number") {
    return phoneDigits() ? `Sends to +${phoneDigits()}.`
      : "Add a number in the settings below. Until then, WhatsApp lets you pick any chat or group.";
  }
  if (mode === "group") {
    return groupInviteUrl() ? "Sends to your saved group. The message is copied first, so paste it in the group and send."
      : "Add your group's invite link in the settings below. Until then, WhatsApp lets you pick any chat or group.";
  }
  return "WhatsApp opens with the message ready. Pick a person or a group.";
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}

let toastTimer = null;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 6000);
}

// Point a Send anchor at the right place for its message.
function setSend(a, text) {
  a.href = sendHref(text);
  a._text = text;
}

// A Send button for one meal. refreshSend() keeps its link and text up to date.
function sendButton(groupKey, label, aria) {
  const a = el("a", { class: "btn wa sm", target: "_blank", rel: "noopener", "data-send": "1", "aria-label": aria || label }, label);
  a._meal = groupKey;
  setSend(a, mealText(groupKey, getDay(currentDate)));
  return a;
}

function onSendClick(e) {
  const a = e.target.closest && e.target.closest("a[data-send]");
  if (!a) return;
  if (sendCopiesFirst()) {
    copyText(a._text).then((ok) => toast(ok
      ? "Message copied. Paste it in the group and send."
      : "Could not copy. Use Copy text near the bottom, then paste it in the group."));
  } else if (a.href.length > MAX_LINK) {
    e.preventDefault();
    copyText(a._text).then((ok) => toast(ok
      ? "This message is too long for a link, so it was copied. Paste it in WhatsApp."
      : "This message is too long for a link. Use Copy text near the bottom."));
  }
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

function dinnerKcalOf(day) {
  return DINNER_IDX.reduce((sum, idx) => sum + slotRecipe(day, SLOTS[idx]).nutrition.kcal, 0);
}

function renderTargets(day) {
  const s = state.settings;
  const t = totals(SLOTS.map((sl) => slotRecipe(day, sl)));
  const rows = [
    { label: "Protein", value: t.protein, target: s.protein, unit: "g", min: true },
    { label: "Fibre", value: t.fibre, target: s.fibre, unit: "g", min: true },
    { label: "Good fats", value: t.goodFat, target: GOOD_FAT_TARGET, unit: "g", min: true },
    { label: "Calories", value: t.kcal, target: s.kcal, unit: "kcal", min: false },
    { label: "Dinner calories", value: dinnerKcalOf(day), target: s.dinnerKcal, unit: "kcal", min: false },
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

const POOL_NOTE = { wake: "Unsweetened", nuts: "Soak overnight", tea: "Unsweetened", chutney: "No added salt" };

// The small grey line under a dish: a note, then nutrition when it is worth showing.
function rowSub(slot, r) {
  if (r.id === "none") {
    return el("div", { class: "row-sub" }, "Skipped to stay within your calorie limits. Pick one from the list if you want it.");
  }
  const bits = [];
  if (POOL_NOTE[slot.pool]) bits.push(POOL_NOTE[slot.pool]);
  if (r.nutrition.kcal >= 20) {
    bits.push(`${Math.round(r.nutrition.protein)} g protein · ${Math.round(r.nutrition.fibre)} g fibre · ${Math.round(r.nutrition.kcal)} kcal`);
  }
  return bits.length ? el("div", { class: "row-sub" }, bits.join(" · ")) : null;
}

// A dropdown with the current dish plus a Shuffle button.
function slotControls(day, slot, idx) {
  const options = slotCandidates(slot);
  if (options.length === 1) {
    return el("div", { class: "fixed-dish" }, options[0].name);
  }
  const select = el("select", {
    id: `pick-${slot.key}`,
    "aria-label": `Choose ${slot.label}`,
    onchange: (e) => { day[slot.key] = e.target.value; saveState(); render(); },
  }, options.map((r) => el("option", { value: r.id, selected: r.id === day[slot.key] }, r.name)));
  return el("div", { class: "meal-actions" },
    select,
    el("button", { class: "btn ghost", onclick: () => shuffleSlot(idx), title: "Suggest another dish that keeps the day on target" }, "Shuffle"));
}

const editing = new Set(); // meals that are open for changing dishes

function summaryItem(slot, r) {
  const none = r.id === "none";
  return el("li", {},
    el("span", { class: "k" }, slot.part === "side" ? "Side" : slot.label),
    el("span", { class: `v${none ? " dim" : ""}` },
      none ? "None today (skipped to stay within your calorie limits)" : r.name));
}

function renderMenu(day) {
  const wrap = $("#menu");
  wrap.innerHTML = "";
  const people = state.settings.people;
  MEAL_GROUPS.forEach((g) => {
    const rows = groupSlots(g.key).filter(({ slot }) => slotVisible(slot));
    const recipes = rows.map(({ slot }) => slotRecipe(day, slot));
    const open = editing.has(g.key);
    const card = el("article", { class: "meal" });
    card.append(
      el("div", { class: "meal-head" },
        el("h3", { class: "meal-title" }, g.label),
        el("div", { class: "head-actions" },
          sendButton(g.key, "Send", `Send ${g.label.replace(" (light)", "")} on WhatsApp`),
          el("button", {
            class: "btn sm", "aria-expanded": String(open),
            onclick: () => { if (open) editing.delete(g.key); else editing.add(g.key); renderMenu(day); },
          }, open ? "Done" : "Change"))),
      nutritionChips(totals(recipes), true));

    if (open) {
      rows.forEach(({ slot, idx }, n) => {
        const r = recipes[n];
        card.append(el("div", { class: "row" },
          el("div", { class: "part" },
            el("span", {}, slot.label),
            r.diet !== "veg" ? el("span", { class: `badge ${r.diet}` }, DIET_BADGE[r.diet]) : null),
          slotControls(day, slot, idx),
          rowSub(slot, r)));
      });
    } else {
      card.append(el("ul", { class: "summary" }, rows.map(({ slot }, n) => summaryItem(slot, recipes[n]))));
    }

    card.append(el("details", {},
      el("summary", {}, people === 1 ? "Ingredients (1 person)" : `Ingredients (${people} people)`),
      recipes.filter((r) => r.id !== "none").map((r) =>
        el("div", { class: "ing-group" },
          el("strong", {}, r.name),
          el("ul", { class: "ing" }, r.ingredients.map((ing) =>
            el("li", {}, `${ing.name} – ${formatQty(ing.unit === "pack" ? ing.qty : ing.qty * people, ing.unit)}`)))))));
    wrap.append(card);
  });
}

function sfItem(name, dishes) {
  const f = SUPERFOODS[name];
  return el("li", {},
    el("div", { class: "sf-head" },
      el("strong", {}, name),
      el("span", { class: `tag ${f.kind}` }, f.kind === "fact" ? "Nutrition fact" : "Traditional use")),
    el("div", { class: "sf-why" }, f.why),
    dishes ? el("div", { class: "sf-in" }, `In: ${dishes.join(", ")}`) : null);
}

function renderSuperfoods(day) {
  const used = new Map(); // superfood -> dishes it is in today
  const plants = new Set();
  SLOTS.forEach((sl) => {
    const r = slotRecipe(day, sl);
    r.ingredients.forEach((ing) => {
      if (isPlantFood(ing.name)) plants.add(ing.name);
      if (SUPERFOODS[ing.name]) {
        if (!used.has(ing.name)) used.set(ing.name, []);
        if (!used.get(ing.name).includes(r.name)) used.get(ing.name).push(r.name);
      }
    });
  });
  $("#sf-count").textContent = `${used.size} superfoods · ${plants.size} plant foods`;
  const chips = $("#sf-chips");
  chips.innerHTML = "";
  Array.from(used.keys()).forEach((n) => chips.append(el("span", { class: "chip" }, n)));
  const gutToday = new Set();
  SLOTS.forEach((sl) => slotRecipe(day, sl).gut.forEach((n) => gutToday.add(n)));
  $("#gut-today").textContent = gutToday.size
    ? `Bowel-friendly today: ${Array.from(gutToday).join(", ")}.`
    : "No bowel-friendly foods today. Shuffle a fruit or salad.";
  const today = $("#sf-today");
  const rest = $("#sf-all");
  today.innerHTML = "";
  rest.innerHTML = "";
  SUPERFOOD_GROUPS.forEach((g) => {
    const names = Object.keys(SUPERFOODS).filter((n) => SUPERFOODS[n].group === g);
    const inToday = names.filter((n) => used.has(n));
    const others = names.filter((n) => !used.has(n));
    if (inToday.length) today.append(el("h4", {}, g), el("ul", { class: "sf" }, inToday.map((n) => sfItem(n, used.get(n)))));
    if (others.length) rest.append(el("h4", {}, g), el("ul", { class: "sf" }, others.map((n) => sfItem(n, null))));
  });
  const notes = $("#sf-notes");
  notes.innerHTML = "";
  SUPERFOOD_NOTES.forEach((t) => notes.append(el("li", {}, t)));
}

function renderList(day) {
  const wrap = $("#list");
  wrap.innerHTML = "";
  const items = buildShoppingList(day);
  let cat = null;
  let group = null;
  items.forEach((it) => {
    if (it.category !== cat) {
      cat = it.category;
      group = el("ul", { class: "items" });
      wrap.append(el("h4", {}, cat), group);
    }
    const checked = isHave(day, it);
    // One dish: name it under the item. More: a short count on the same line.
    const note = it.usedIn.length === 1 ? el("small", {}, it.usedIn[0])
      : it.usedIn.length > 1 ? el("small", { class: "inline" }, `${it.usedIn.length} dishes`) : null;
    group.append(el("li", { class: checked ? "have" : "" },
      el("label", {},
        el("input", { type: "checkbox", checked, onchange: (e) => {
          setHave(day, it, e.target.checked);
          saveState();
          render();
        } }),
        el("span", { class: "name" }, itemLabel(it)),
        note),
      it.extra ? el("button", { class: "icon", title: "Remove", "aria-label": `Remove ${it.name}`, onclick: () => {
        day.extras = day.extras.filter((x) => x !== it.name);
        saveState();
        render();
      } }, "✕") : null));
  });
  const toOrder = items.filter((it) => !isHave(day, it)).length;
  $("#list-count").textContent = `${toOrder} to order · ${items.length - toOrder} at home`;
}

function fieldHints() {
  const s = state.settings;
  const digits = phoneDigits();
  const ph = $("#phone-hint");
  ph.classList.remove("warn");
  ph.textContent = "Country code first, no + or leading 0. For India: 91 then the 10-digit number.";
  if (digits && (digits.length < 10 || (s.phone || "").trim().startsWith("0"))) {
    ph.textContent = "This looks incomplete. Start with the country code, for example 91, with no leading 0.";
    ph.classList.add("warn");
  }
  const gh = $("#group-hint");
  gh.classList.remove("warn");
  if (!s.groupLink) {
    gh.textContent = "Paste the group's invite link from WhatsApp.";
  } else if (groupInviteUrl()) {
    gh.textContent = "Saved. Send buttons copy the message and open this group.";
  } else {
    gh.textContent = "That is not an invite link. It should start with https://chat.whatsapp.com/.";
    gh.classList.add("warn");
  }
}

// Update every Send link, the hints and the preview in place. Settings changes
// call this instead of render(), so a tap on a Send button is never lost to a
// rebuild when a text field loses focus.
function refreshSend() {
  const s = state.settings;
  const day = getDay(currentDate);
  $("#phone-field").hidden = s.sendMode !== "number";
  $("#group-field").hidden = s.sendMode !== "group";
  fieldHints();
  $("#send-target").textContent = sendTargetText();
  document.querySelectorAll("#menu a[data-send]").forEach((a) => setSend(a, mealText(a._meal, day)));
  const menu = menuText(day);
  const order = orderText(day);
  setSend($("#top-menu"), menu);
  setSend($("#top-order"), order);
  setSend($("#wa-menu"), menu);
  setSend($("#wa-order"), order);
  setSend($("#wa-both"), menu + "\n\n" + order);
  $("#preview").textContent = menu + "\n\n" + order;
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
  $("#group-link").value = s.groupLink;
  $("#send-mode").value = s.sendMode;
  $("#meal-ing").checked = s.mealIngredients;
  $("#t-protein").value = s.protein;
  $("#t-fibre").value = s.fibre;
  $("#t-kcal").value = s.kcal;
  $("#t-dinner").value = s.dinnerKcal;
  renderTargets(day);
  renderMenu(day);
  renderSuperfoods(day);
  renderList(day);
  refreshSend();
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
  numberSetting("#t-dinner", "dinnerKcal", 300, 2000, true);
  $("#diet").addEventListener("change", (e) => {
    state.settings.diet = e.target.value;
    planDay(currentDate, Math.random);
    render();
  });
  // Send settings only touch the links, so they update in place (see refreshSend).
  const sendSetting = (key, read) => (e) => { state.settings[key] = read(e.target); saveState(); refreshSend(); };
  $("#phone").addEventListener("change", sendSetting("phone", (t) => t.value.trim()));
  $("#group-link").addEventListener("change", sendSetting("groupLink", (t) => t.value.trim()));
  $("#send-mode").addEventListener("change", sendSetting("sendMode", (t) => t.value));
  $("#meal-ing").addEventListener("change", sendSetting("mealIngredients", (t) => t.checked));
  document.addEventListener("click", onSendClick);
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
