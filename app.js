// Daily Meal Planner — menu suggestions, shopping list and WhatsApp sharing.
// Everything runs in the browser; data is kept in localStorage.

const MEALS = [
  { key: "breakfast", label: "Breakfast", emoji: "🍳" },
  { key: "lunch", label: "Lunch", emoji: "🍛" },
  { key: "dinner", label: "Dinner", emoji: "🍲" },
];

const STORAGE_KEY = "meal-planner:v1";

// ---------- storage ----------

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    saved = null;
  }
  return {
    settings: Object.assign({ people: 4, diet: "veg", phone: "" }, saved && saved.settings),
    days: (saved && saved.days) || {},
  };
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

function allowedDiets(diet) {
  if (diet === "veg") return ["veg"];
  if (diet === "egg") return ["veg", "egg"];
  return ["veg", "egg", "nonveg"];
}

function candidates(meal) {
  const ok = allowedDiets(state.settings.diet);
  return RECIPES[meal].filter((r) => ok.includes(r.diet));
}

function findRecipe(meal, id) {
  return RECIPES[meal].find((r) => r.id === id);
}

// Get (and create if needed) the plan for a date. Default picks are
// deterministic per date so the same day always suggests the same menu
// until you shuffle. Also avoids repeating yesterday's dishes.
function getDay(date) {
  let day = state.days[date];
  if (!day) {
    day = { have: [], extras: [] };
    state.days[date] = day;
  }
  const yesterday = state.days[shiftDate(date, -1)] || {};
  MEALS.forEach(({ key }) => {
    const list = candidates(key);
    const current = day[key] && list.find((r) => r.id === day[key]);
    if (current) return;
    const fresh = list.filter((r) => r.id !== yesterday[key]);
    const pool = fresh.length ? fresh : list;
    day[key] = pool[hash(date + key + state.settings.diet) % pool.length].id;
  });
  return day;
}

function shuffleMeal(meal) {
  const day = getDay(currentDate);
  const list = candidates(meal).filter((r) => r.id !== day[meal]);
  if (!list.length) return;
  day[meal] = list[Math.floor(Math.random() * list.length)].id;
  saveState();
  render();
}

// ---------- shopping list ----------

function roundTo(n, step) {
  return Math.max(step, Math.round(n / step) * step);
}

function formatQty(qty, unit) {
  if (unit === "g" || unit === "ml") {
    const big = unit === "g" ? "kg" : "L";
    if (qty >= 1000) {
      const v = Math.round((qty / 1000) * 4) / 4; // nearest 0.25
      return `${v} ${big}`;
    }
    return `${roundTo(qty, qty >= 100 ? 50 : 10)} ${unit}`;
  }
  const n = Math.ceil(qty);
  if (unit === "pcs") return `${n}`;
  if (unit === "bunch") return `${n} ${n === 1 ? "bunch" : "bunches"}`;
  if (unit === "pack") return `${n} ${n === 1 ? "pack" : "packs"}`;
  return `${n} ${unit}`;
}

function buildShoppingList(day) {
  const scale = state.settings.people / BASE_SERVINGS;
  const items = new Map();
  MEALS.forEach(({ key }) => {
    const recipe = findRecipe(key, day[key]);
    if (!recipe) return;
    recipe.ingredients.forEach((ing) => {
      const id = ing.name + "|" + ing.unit;
      const existing = items.get(id);
      // A pack of masala/sauce covers the whole day, so don't add packs up.
      const amount = ing.unit === "pack" ? ing.qty : ing.qty * scale;
      if (existing) {
        existing.qty = ing.unit === "pack" ? Math.max(existing.qty, amount) : existing.qty + amount;
        existing.usedIn.push(recipe.name);
      } else {
        items.set(id, { id, name: ing.name, unit: ing.unit, category: ing.category,
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

function menuText(day) {
  const lines = [`*Menu for ${prettyDate(currentDate)}*`];
  MEALS.forEach(({ key, label, emoji }) => {
    const r = findRecipe(key, day[key]);
    lines.push(`${emoji} *${label}:* ${r ? r.name : "-"}`);
  });
  return lines.join("\n");
}

function orderText(day) {
  const have = new Set(day.have || []);
  const items = buildShoppingList(day).filter((it) => !have.has(it.id));
  const lines = [`*Order list – ${prettyDate(currentDate)}* (${state.settings.people} people)`];
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

function renderMenu(day) {
  const wrap = $("#menu");
  wrap.innerHTML = "";
  const scale = state.settings.people / BASE_SERVINGS;
  MEALS.forEach(({ key, label, emoji }) => {
    const recipe = findRecipe(key, day[key]);
    const select = el("select", {
      "aria-label": `Choose ${label}`,
      onchange: (e) => { day[key] = e.target.value; saveState(); render(); },
    }, candidates(key).map((r) => el("option", { value: r.id, selected: r.id === day[key] }, r.name)));

    wrap.append(el("article", { class: "meal" },
      el("div", { class: "meal-head" },
        el("span", { class: "meal-label" }, `${emoji} ${label}`),
        el("span", { class: `badge ${recipe.diet}` }, DIET_BADGE[recipe.diet])),
      el("h3", {}, recipe.name),
      el("div", { class: "meal-actions" },
        select,
        el("button", { class: "btn ghost", onclick: () => shuffleMeal(key), title: "Suggest another" }, "🔀 Shuffle")),
      el("details", {},
        el("summary", {}, "Ingredients"),
        el("ul", { class: "ing" }, recipe.ingredients.map((ing) =>
          el("li", {}, `${ing.name} – ${ing.unit === "pack" ? formatQty(ing.qty, ing.unit) : formatQty(ing.qty * scale, ing.unit)}`))))
    ));
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
      it.extra ? el("button", { class: "icon", title: "Remove", onclick: () => {
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
  $("#date").value = currentDate;
  $("#date-label").textContent = currentDate === todayISO() ? "Today" : prettyDate(currentDate);
  $("#people").value = state.settings.people;
  $("#diet").value = state.settings.diet;
  $("#phone").value = state.settings.phone;
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

function init() {
  $("#prev").addEventListener("click", () => { currentDate = shiftDate(currentDate, -1); render(); });
  $("#next").addEventListener("click", () => { currentDate = shiftDate(currentDate, 1); render(); });
  $("#date").addEventListener("change", (e) => { if (e.target.value) { currentDate = e.target.value; render(); } });
  $("#people").addEventListener("change", (e) => {
    state.settings.people = Math.min(30, Math.max(1, parseInt(e.target.value, 10) || 1));
    render();
  });
  $("#diet").addEventListener("change", (e) => { state.settings.diet = e.target.value; render(); });
  $("#phone").addEventListener("change", (e) => { state.settings.phone = e.target.value.trim(); render(); });
  $("#shuffle-all").addEventListener("click", () => MEALS.forEach(({ key }) => shuffleMeal(key)));
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
      $("#copy").textContent = "Copied ✓";
    } catch (e) {
      $("#copy").textContent = "Copy failed";
    }
    setTimeout(() => ($("#copy").textContent = "Copy text"), 1500);
  });
  render();
}

document.addEventListener("DOMContentLoaded", init);
