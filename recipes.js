// Dish database for the meal planner. All dishes are Indian home-style food.
//
// House rules built into every dish:
//   - Gluten-free: no wheat, maida, daliya, sooji or barley. Rotis use jowar,
//     bajra, ragi, makki, besan or rajgira.
//   - No fried food: dishes are roasted, steamed, grilled, pressure-cooked or
//     given a light tadka.
//   - No added sugar, honey or jaggery. Whole fruit only.
//   - No red chilli: masalas are red-chilli-free (black pepper, ajwain, garam
//     masala, dhania-jeera). Fresh green chilli is small and optional.
//   - No soya anywhere.
//   - Lunch always has buttermilk (chaas) with ground flax.
//   - Breakfast always has 4 egg whites + 1 yolk and a collagen protein shake.
//   - Chicken and fish only ever appear as a GRILLED side at lunch and dinner,
//     never in gravy or as the main course. No eggs at lunch or dinner, because
//     eggs are at breakfast.
//   - Dinner is lighter: no dal or legumes, a smaller roti, and rich or heavy
//     dishes are avoided.
//
// A day is built like this:
//   On waking = digestive drink + soaked almonds, walnuts & anjeer (fixed)
//   Breakfast = egg dish + gluten-free side + collagen shake + fruit
//   Lunch  = dal + sabzi + saag + salad + dahi + chutney + roti/rice
//            (+ grilled chicken or fish side) + chaas with flax + haldi-nimbu tea
//   Evening snack = snack + fruit
//   Dinner = sabzi + saag + salad + dahi + chutney + a smaller roti/rice
//            (+ grilled chicken or fish side) + tea. No dal or legumes at dinner.
//
// Quantities are PER PERSON and get multiplied by the number of people.
// Nutrition is calculated from the ingredients using NUTRITION below
// (values per 100 g of raw / dry weight, from standard food tables —
// estimates, not lab values). Cooking oil, ghee, salt and dry spices
// are not counted.
//
// diet: "veg" | "egg" | "nonveg"

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat, Fish & Eggs",
  "Pulses & Dals",
  "Grains & Flour",
  "Nuts, Seeds & Dry Fruits",
  "Spices & Masala",
  "Other",
];

// name: [category, protein g, fibre g, fat g, kcal, goodFat?, grams per piece]
// All per 100 g. "goodFat" marks sources of mostly unsaturated fat
// (nuts, seeds, fish). Pieces: eggs, whites, yolks, lemon, chilli, scoops.
const NUTRITION = {
  // Pulses & dals
  "Moong dal":          ["Pulses & Dals", 24.5, 8.2, 1.2, 348],
  "Green moong (whole)": ["Pulses & Dals", 22.5, 16.3, 1.2, 334],
  "Toor dal":           ["Pulses & Dals", 22.3, 15, 1.7, 343],
  "Masoor dal":         ["Pulses & Dals", 24.6, 10.8, 1.1, 352],
  "Chana dal":          ["Pulses & Dals", 21, 10, 5, 370],
  "Rajma":              ["Pulses & Dals", 22.5, 15.2, 1.1, 333],
  "Kabuli chana":       ["Pulses & Dals", 20.5, 12.2, 6, 378],
  "Kala chana":         ["Pulses & Dals", 20, 17, 5, 360],
  "Lobia (black-eyed peas)": ["Pulses & Dals", 24, 11, 1.4, 336],
  "Roasted chana":      ["Pulses & Dals", 22, 15, 5, 370],
  "Sattu (chana)":      ["Pulses & Dals", 22, 15, 5.5, 380],
  "Besan":              ["Grains & Flour", 22, 10.8, 6.7, 387],
  // Dairy
  "Paneer":             ["Dairy", 18, 0, 20, 265],
  "Dahi (curd)":        ["Dairy", 3.5, 0, 4, 61],
  "Hung curd (chakka)": ["Dairy", 10, 0, 4, 100],
  "Milk (toned)":       ["Dairy", 3.3, 0, 3, 58],
  // Meat, fish & eggs
  "Eggs":               ["Meat, Fish & Eggs", 12.6, 0, 9.5, 143, false, 50],
  "Egg whites":         ["Meat, Fish & Eggs", 10.9, 0, 0.2, 52, false, 33],
  "Egg yolk":           ["Meat, Fish & Eggs", 15.9, 0, 26.5, 322, false, 17],
  "Chicken breast (boneless)": ["Meat, Fish & Eggs", 23, 0, 2.6, 120],
  "Chicken (curry cut, skinless)": ["Meat, Fish & Eggs", 20, 0, 5, 140],
  "Chicken mince (keema)": ["Meat, Fish & Eggs", 20, 0, 6, 143],
  "Fish (rohu / basa)": ["Meat, Fish & Eggs", 19, 0, 3, 110, true],
  "Collagen protein powder": ["Other", 90, 0, 0, 360, false, 25],
  // Gluten-free grains and flours
  "Jowar atta":         ["Grains & Flour", 10.4, 9.7, 1.9, 349],
  "Bajra atta":         ["Grains & Flour", 11.6, 11.3, 5, 361],
  "Ragi atta":          ["Grains & Flour", 7.3, 11.5, 1.3, 328],
  "Makki atta (maize flour)": ["Grains & Flour", 6.9, 7.3, 3.9, 361],
  "Rajgira atta (amaranth)": ["Grains & Flour", 13.6, 6.7, 7, 371],
  "Foxtail millet (kangni)": ["Grains & Flour", 12.3, 8, 4.3, 331],
  "Brown rice":         ["Grains & Flour", 7.5, 3.5, 2.7, 362],
  "Poha":               ["Grains & Flour", 6.6, 2, 1.2, 346],
  // Vegetables and greens
  "Onion":              ["Vegetables", 1.1, 1.7, 0.1, 40],
  "Tomato":             ["Vegetables", 0.9, 1.2, 0.2, 18],
  "Cucumber":           ["Vegetables", 0.7, 0.5, 0.1, 15],
  "Carrot":             ["Vegetables", 0.9, 2.8, 0.2, 41],
  "Spinach (palak)":    ["Vegetables", 2.9, 2.2, 0.4, 23],
  "Methi leaves":       ["Vegetables", 4.4, 4.9, 0.9, 49],
  "Mustard greens (sarson)": ["Vegetables", 2.7, 3.3, 0.4, 27],
  "Amaranth leaves (chaulai)": ["Vegetables", 2.5, 2.2, 0.3, 23],
  "Moringa leaves (sahjan patta)": ["Vegetables", 7.4, 2, 1.4, 64],
  "Capsicum":           ["Vegetables", 1, 2.1, 0.3, 26],
  "Cabbage":            ["Vegetables", 1.3, 2.5, 0.1, 25],
  "Bottle gourd (lauki)": ["Vegetables", 0.6, 0.5, 0.1, 14],
  "Cauliflower":        ["Vegetables", 1.9, 2, 0.3, 25],
  "Bhindi (okra)":      ["Vegetables", 1.9, 3.2, 0.2, 33],
  "Brinjal":            ["Vegetables", 1.4, 3, 0.2, 24],
  "Mushrooms":          ["Vegetables", 3.1, 1, 0.3, 22],
  "Radish (mooli)":     ["Vegetables", 0.7, 1.6, 0.1, 16],
  "Lettuce":            ["Vegetables", 1.4, 1.3, 0.2, 15],
  "Drumstick pods (sahjan phali)": ["Vegetables", 2.1, 3.2, 0.2, 37],
  "Karela (bitter gourd)": ["Vegetables", 1, 2.8, 0.2, 17],
  "Sweet potato (shakarkandi)": ["Vegetables", 1.6, 3, 0.1, 86],
  "Pumpkin (kaddu)":    ["Vegetables", 1, 0.5, 0.1, 26],
  "Green peas":         ["Vegetables", 5.4, 5.7, 0.4, 81],
  "Beetroot":           ["Vegetables", 1.6, 2.8, 0.2, 43],
  "French beans":       ["Vegetables", 1.8, 2.7, 0.2, 31],
  "Moong sprouts":      ["Vegetables", 3, 1.8, 0.2, 30],
  "Coconut (fresh)":    ["Vegetables", 3.3, 9, 33, 354],
  "Ginger":             ["Vegetables", 0, 0, 0, 0],
  "Garlic":             ["Vegetables", 0, 0, 0, 0],
  "Green chilli":       ["Vegetables", 0, 0, 0, 0, false, 5],
  "Lemon":              ["Vegetables", 0, 0, 0, 0, false, 60],
  "Coriander":          ["Vegetables", 0, 0, 0, 0],
  "Mint (pudina)":      ["Vegetables", 0, 0, 0, 0],
  "Curry leaves":       ["Vegetables", 0, 0, 0, 0],
  "Tulsi leaves":       ["Vegetables", 0, 0, 0, 0],
  // Fruits
  "Amla (Indian gooseberry)": ["Fruits", 0.9, 3.4, 0.6, 58],
  "Guava":              ["Fruits", 2.6, 5.4, 1, 68],
  "Pomegranate":        ["Fruits", 1.7, 4, 1.2, 83],
  "Papaya":             ["Fruits", 0.5, 1.7, 0.3, 43],
  "Apple":              ["Fruits", 0.3, 2.4, 0.2, 52],
  "Orange / mosambi":   ["Fruits", 0.9, 2.4, 0.1, 47],
  "Pear":               ["Fruits", 0.4, 3.1, 0.1, 57],
  "Kiwi":               ["Fruits", 1.1, 3, 0.5, 61],
  "Banana":             ["Fruits", 1.1, 2.6, 0.3, 89],
  // Nuts, seeds and dry fruit (good fats)
  "Almonds":            ["Nuts, Seeds & Dry Fruits", 21, 12.5, 50, 579, true],
  "Walnuts":            ["Nuts, Seeds & Dry Fruits", 15, 6.7, 65, 654, true],
  "Peanuts":            ["Nuts, Seeds & Dry Fruits", 26, 8.5, 49, 567, true],
  "Flax seeds (alsi)":  ["Nuts, Seeds & Dry Fruits", 18, 27, 42, 534, true],
  "Pumpkin seeds":      ["Nuts, Seeds & Dry Fruits", 30, 6, 49, 559, true],
  "Sesame seeds (til)": ["Nuts, Seeds & Dry Fruits", 18, 11.8, 50, 573, true],
  "Sunflower seeds":    ["Nuts, Seeds & Dry Fruits", 20.8, 8.6, 51.5, 584, true],
  "Chia seeds":         ["Nuts, Seeds & Dry Fruits", 16.5, 34.4, 30.7, 486, true],
  "Pistachios":         ["Nuts, Seeds & Dry Fruits", 20.2, 10.6, 45.3, 562, true],
  "Cashews":            ["Nuts, Seeds & Dry Fruits", 18.2, 3.3, 43.9, 553, true],
  "Makhana (fox nuts)": ["Nuts, Seeds & Dry Fruits", 9.7, 14.5, 0.1, 347],
  "Anjeer (dried fig)": ["Nuts, Seeds & Dry Fruits", 3.3, 9.8, 0.9, 249],
  // Added in the recipe expansion: more vegetables, millets, fruit and spices
  "Potato": ["Vegetables", 2, 2.2, 0.1, 77],
  "Turnip": ["Vegetables", 0.9, 1.8, 0.1, 28],
  "Kohlrabi (gaanth gobi)": ["Vegetables", 1.7, 3.6, 0.1, 27],
  "Colocasia (arbi)": ["Vegetables", 1.5, 4.1, 0.2, 112],
  "Ridge gourd (turai)": ["Vegetables", 0.6, 1.1, 0.2, 20],
  "Ash gourd (petha)": ["Vegetables", 0.4, 2.9, 0.2, 13],
  "Parwal (pointed gourd)": ["Vegetables", 2, 3, 0.3, 20],
  "Tinda (apple gourd)": ["Vegetables", 1.4, 1.5, 0.4, 21],
  "Kundru (ivy gourd)": ["Vegetables", 1.2, 1.6, 0.1, 18],
  "Malabar spinach (pui shak)": ["Vegetables", 1.8, 2.1, 0.3, 19],
  "Beet greens (beetroot leaves)": ["Vegetables", 2.2, 3.7, 0.1, 22],
  "Dill leaves (suva)": ["Vegetables", 3.5, 2.1, 1.1, 43],
  "Raw mango": ["Vegetables", 0.8, 1.8, 0.4, 60],
  "Watermelon": ["Fruits", 0.6, 0.4, 0.2, 30],
  "Muskmelon": ["Fruits", 0.8, 0.9, 0.2, 34],
  "Pineapple": ["Fruits", 0.5, 1.4, 0.1, 50],
  "Plum (aloo bukhara)": ["Fruits", 0.7, 1.4, 0.3, 46],
  "Peach": ["Fruits", 0.9, 1.5, 0.3, 39],
  "Jamun": ["Fruits", 0.7, 0.9, 0.3, 62],
  "Rice flour": ["Grains & Flour", 5.9, 2.4, 1.4, 366],
  "Buckwheat flour (kuttu)": ["Grains & Flour", 12.6, 10, 3.1, 335],
  "Barnyard millet (samak)": ["Grains & Flour", 6.2, 9.8, 2.2, 307],
  "Kodo millet": ["Grains & Flour", 8.3, 9, 3.6, 309],
  "Little millet (kutki)": ["Grains & Flour", 7.7, 7.6, 4.7, 341],
  "Horse gram (kulthi)": ["Pulses & Dals", 22, 5.3, 0.5, 321],
  "Poppy seeds (khus khus)": ["Nuts, Seeds & Dry Fruits", 17.9, 19.5, 41.6, 525, true],
  "Rai (mustard seeds)": ["Spices & Masala", 0, 0, 0, 0],
  "Kalonji (nigella seeds)": ["Spices & Masala", 0, 0, 0, 0],
  "Panch phoron": ["Spices & Masala", 0, 0, 0, 0],
  "Amchur (dry mango powder)": ["Spices & Masala", 0, 0, 0, 0],
  "Dalchini (cinnamon)": ["Spices & Masala", 0, 0, 0, 0],
  "Laung (cloves)": ["Spices & Masala", 0, 0, 0, 0],
  "Elaichi (green cardamom)": ["Spices & Masala", 0, 0, 0, 0],
  // Red-chilli-free masalas and spices (bought as packs, nutrition negligible)
  "Garam masala (red-chilli-free)": ["Spices & Masala", 0, 0, 0, 0],
  "Dhania-jeera powder": ["Spices & Masala", 0, 0, 0, 0],
  "Roasted jeera powder": ["Spices & Masala", 0, 0, 0, 0],
  "Jeera (cumin seeds)": ["Spices & Masala", 0, 0, 0, 0],
  "Ajwain (carom seeds)": ["Spices & Masala", 0, 0, 0, 0],
  "Saunf (fennel seeds)": ["Spices & Masala", 0, 0, 0, 0],
  "Methi seeds":        ["Spices & Masala", 0, 0, 0, 0],
  "Haldi (turmeric powder)": ["Spices & Masala", 0, 0, 0, 0],
  "Kali mirch (black pepper)": ["Spices & Masala", 0, 0, 0, 0],
};

// i(name, qty, unit, buy) — unit: g, ml, pcs, bunch, pack, scoop.
// "buy" says what goes on the shopping list when it differs from the
// ingredient (egg whites and yolk are bought as eggs).
function i(name, qty, unit = "g", buy) {
  if (!NUTRITION[name]) throw new Error("Missing nutrition data for " + name);
  return buy ? { name, qty, unit, buy } : { name, qty, unit };
}

// Common bits
const herbs = () => [i("Coriander", 0.25, "bunch"), i("Green chilli", 1, "pcs")];
const tadka = () => [i("Garlic", 5), i("Coriander", 0.25, "bunch")];
const tandoori = () => [i("Kali mirch (black pepper)", 1, "pack"), i("Ajwain (carom seeds)", 1, "pack"),
  i("Garam masala (red-chilli-free)", 1, "pack")];
// 4 egg whites and 1 yolk: the same 4 eggs are bought, the other 3 yolks are not used.
const eggBreakfast = () => [
  i("Egg whites", 4, "pcs", { name: "Eggs", qty: 4, unit: "pcs" }),
  i("Egg yolk", 1, "pcs", { name: "Eggs", qty: 0, unit: "pcs" }),
];

const RECIPES = {
  // ---- On waking ----

  wake: [
    { id: "jas-water", name: "Jeera-Ajwain-Saunf Water", diet: "veg", ingredients: [
      i("Jeera (cumin seeds)", 1, "pack"), i("Ajwain (carom seeds)", 1, "pack"), i("Saunf (fennel seeds)", 1, "pack")] },
    { id: "methi-water", name: "Methi Dana Water (soaked overnight)", diet: "veg", ingredients: [
      i("Methi seeds", 1, "pack")] },
    { id: "lemon-ginger-water", name: "Warm Lemon-Ginger Water", diet: "veg", ingredients: [
      i("Lemon", 0.5, "pcs"), i("Ginger", 5)] },
    { id: "amla-shot", name: "Amla-Ginger Shot", diet: "veg", ingredients: [
      i("Amla (Indian gooseberry)", 40), i("Ginger", 5)] },
    { id: "haldi-water", name: "Haldi-Kali Mirch Warm Water", diet: "veg", ingredients: [
      i("Haldi (turmeric powder)", 1, "pack"), i("Kali mirch (black pepper)", 1, "pack"), i("Lemon", 0.5, "pcs")] },
    { id: "chia-water", name: "Chia-Lemon Water", diet: "veg", ingredients: [
      i("Chia seeds", 10), i("Lemon", 0.5, "pcs")] },
    { id: "ccf-water", name: "Cumin-Coriander-Fennel Water", diet: "veg", ingredients: [
      i("Jeera (cumin seeds)", 1, "pack"), i("Dhania-jeera powder", 1, "pack"),
      i("Saunf (fennel seeds)", 1, "pack")] },
    { id: "ajwain-water", name: "Warm Ajwain Water", diet: "veg", ingredients: [
      i("Ajwain (carom seeds)", 1, "pack")] },
    { id: "dalchini-water", name: "Dalchini-Ginger Water", diet: "veg", ingredients: [
      i("Dalchini (cinnamon)", 1, "pack"), i("Ginger", 5)] },
    { id: "tulsi-water", name: "Tulsi-Ginger Water", diet: "veg", ingredients: [
      i("Tulsi leaves", 0.25, "bunch"), i("Ginger", 5), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "curry-leaf-water", name: "Curry Leaf-Lemon Water", diet: "veg", ingredients: [
      i("Curry leaves", 0.25, "bunch"), i("Lemon", 0.5, "pcs")] },
    { id: "pepper-lemon-water", name: "Warm Lemon-Black Pepper Water", diet: "veg", ingredients: [
      i("Lemon", 0.5, "pcs"), i("Kali mirch (black pepper)", 1, "pack")] },
  ],

  // Fixed every morning: soaked almonds, walnuts and anjeer.
  nuts: [
    { id: "almond-walnut-anjeer", name: "Soaked Almonds, Walnuts & Anjeer", diet: "veg", ingredients: [
      i("Almonds", 10), i("Walnuts", 10), i("Anjeer (dried fig)", 30)] },
  ],

  // ---- Breakfast: egg dish + gluten-free side + collagen shake + fruit ----

  eggs: [
    { id: "egg-omelette", name: "Masala Omelette (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Onion", 30), i("Tomato", 30), i("Spinach (palak)", 30), ...herbs()] },
    { id: "egg-bhurji-veg", name: "Egg-White Bhurji with Veggies (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Onion", 40), i("Tomato", 40), i("Capsicum", 30), ...herbs()] },
    { id: "egg-palak-mushroom", name: "Palak-Mushroom Egg Scramble (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Spinach (palak)", 60), i("Mushrooms", 60), i("Onion", 30), i("Garlic", 3),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "egg-sprouts-omelette", name: "Sprouts-Stuffed Omelette (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Moong sprouts", 60), i("Carrot", 30), i("Onion", 20), i("Coriander", 0.25, "bunch")] },
    { id: "egg-methi-omelette", name: "Methi Omelette (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Methi leaves", 40), i("Onion", 30), i("Tomato", 30), i("Green chilli", 1, "pcs")] },
    { id: "egg-chaat-bf", name: "Boiled Egg Chaat (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Cucumber", 50), i("Onion", 20), i("Tomato", 30), i("Lemon", 0.5, "pcs"),
      i("Roasted jeera powder", 1, "pack"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "egg-akuri", name: "Parsi Akuri (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Onion", 30), i("Tomato", 40), i("Ginger", 5),
      i("Coriander", 0.25, "bunch"), i("Green chilli", 1, "pcs"),
      i("Haldi (turmeric powder)", 1, "pack"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "egg-podimas", name: "Egg Podimas, Tamil style (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Onion", 40), i("Ginger", 5), i("Curry leaves", 0.25, "bunch"),
      i("Green chilli", 1, "pcs"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "egg-capsicum-omelette", name: "Capsicum Omelette (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Capsicum", 50), i("Onion", 20), i("Coriander", 0.25, "bunch"),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "egg-mushroom-bhurji", name: "Mushroom Egg Bhurji (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Mushrooms", 80), i("Onion", 30), i("Garlic", 3),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "egg-moringa-omelette", name: "Sahjan Patta (Moringa) Omelette (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Moringa leaves (sahjan patta)", 40), i("Onion", 20), i("Garlic", 3),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "egg-tomato-bhurji", name: "Tomato-Onion Egg Bhurji (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Tomato", 60), i("Onion", 40), i("Coriander", 0.25, "bunch"),
      i("Haldi (turmeric powder)", 1, "pack")] },
    { id: "egg-hara-omelette", name: "Hara Pudina Omelette (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Mint (pudina)", 0.25, "bunch"), i("Coriander", 0.5, "bunch"),
      i("Onion", 20), i("Green chilli", 1, "pcs")] },
    { id: "egg-thoran", name: "Kerala Egg Thoran with Coconut (4 whites + 1 yolk)", diet: "egg", ingredients: [
      ...eggBreakfast(), i("Coconut (fresh)", 10), i("Onion", 30), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack")] },
  ],

  bside: [
    { id: "moong-chilla", name: "Moong Dal Chilla", diet: "veg", ingredients: [
      i("Moong dal", 40), i("Onion", 20), i("Spinach (palak)", 20), i("Ginger", 5), ...herbs()] },
    { id: "besan-chilla", name: "Besan Chilla with Palak", diet: "veg", ingredients: [
      i("Besan", 40), i("Spinach (palak)", 30), i("Onion", 20), i("Tomato", 20), ...herbs()] },
    { id: "ragi-besan-chilla", name: "Ragi-Besan Chilla", diet: "veg", ingredients: [
      i("Ragi atta", 30), i("Besan", 20), i("Spinach (palak)", 30), i("Onion", 20), ...herbs()] },
    { id: "jowar-roti-dahi", name: "Jowar Roti with Hung Curd", diet: "veg", ingredients: [
      i("Jowar atta", 30), i("Hung curd (chakka)", 80), i("Cucumber", 30)] },
    { id: "veg-poha", name: "Vegetable Poha with Peanuts", diet: "veg", ingredients: [
      i("Poha", 40), i("Peanuts", 10), i("Green peas", 20), i("Onion", 30), i("Lemon", 0.5, "pcs"),
      i("Curry leaves", 0.25, "bunch")] },
    { id: "millet-upma", name: "Foxtail Millet Vegetable Upma", diet: "veg", ingredients: [
      i("Foxtail millet (kangni)", 40), i("Carrot", 30), i("Green peas", 30), i("Onion", 20),
      i("Ginger", 5), i("Curry leaves", 0.25, "bunch")] },
    { id: "sattu-paratha", name: "Sattu-Jowar Paratha", diet: "veg", ingredients: [
      i("Sattu (chana)", 30), i("Jowar atta", 30), i("Onion", 20), i("Lemon", 0.5, "pcs"), ...herbs()] },
    { id: "methi-thepla", name: "Methi Thepla (Jowar + Besan) with Hung Curd", diet: "veg", ingredients: [
      i("Jowar atta", 35), i("Besan", 15), i("Methi leaves", 30), i("Flax seeds (alsi)", 5),
      i("Hung curd (chakka)", 80)] },
    { id: "moong-dosa", name: "Moong Dal Dosa with Sambar", diet: "veg", ingredients: [
      i("Moong dal", 50), i("Toor dal", 30), i("Carrot", 30), i("Tomato", 30), i("Onion", 20),
      i("Dhania-jeera powder", 1, "pack"), i("Kali mirch (black pepper)", 1, "pack"),
      i("Curry leaves", 0.25, "bunch")] },
    { id: "pesarattu", name: "Pesarattu (green moong dosa)", diet: "veg", ingredients: [
      i("Green moong (whole)", 50), i("Ginger", 5), i("Green chilli", 1, "pcs"), i("Onion", 20),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "ragi-dosa", name: "Ragi Dosa", diet: "veg", ingredients: [
      i("Ragi atta", 40), i("Rice flour", 15), i("Onion", 20), i("Curry leaves", 0.25, "bunch"),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "jowar-dosa", name: "Jowar Dosa with Veggies", diet: "veg", ingredients: [
      i("Jowar atta", 40), i("Rice flour", 15), i("Carrot", 20), i("Onion", 20),
      i("Coriander", 0.25, "bunch")] },
    { id: "akki-rotti", name: "Akki Rotti (rice flour, dill & veg)", diet: "veg", ingredients: [
      i("Rice flour", 45), i("Dill leaves (suva)", 15), i("Onion", 20), i("Carrot", 20),
      i("Coconut (fresh)", 10), i("Green chilli", 1, "pcs")] },
    { id: "barnyard-upma", name: "Barnyard Millet (Samak) Veg Upma", diet: "veg", ingredients: [
      i("Barnyard millet (samak)", 40), i("Carrot", 30), i("Green peas", 20), i("Onion", 20),
      i("Ginger", 5), i("Curry leaves", 0.25, "bunch"), i("Rai (mustard seeds)", 1, "pack")] },
    { id: "kodo-upma", name: "Kodo Millet Upma with Methi", diet: "veg", ingredients: [
      i("Kodo millet", 40), i("Methi leaves", 30), i("Onion", 20), i("Ginger", 5),
      i("Curry leaves", 0.25, "bunch"), i("Rai (mustard seeds)", 1, "pack")] },
    { id: "little-millet-pongal", name: "Little Millet Pongal (pepper & cumin)", diet: "veg", ingredients: [
      i("Little millet (kutki)", 35), i("Moong dal", 15), i("Ginger", 5),
      i("Curry leaves", 0.25, "bunch"), i("Kali mirch (black pepper)", 1, "pack"),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "lemon-millet", name: "Lemon Foxtail Millet with Peanuts", diet: "veg", ingredients: [
      i("Foxtail millet (kangni)", 40), i("Peanuts", 10), i("Lemon", 0.5, "pcs"),
      i("Curry leaves", 0.25, "bunch"), i("Green chilli", 1, "pcs"), i("Rai (mustard seeds)", 1, "pack")] },
    { id: "thalipeeth", name: "Thalipeeth (jowar, bajra, besan, rice)", diet: "veg", ingredients: [
      i("Jowar atta", 20), i("Bajra atta", 15), i("Besan", 10), i("Rice flour", 10), i("Onion", 25),
      i("Coriander", 0.25, "bunch"), i("Ajwain (carom seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "idiyappam", name: "Idiyappam (steamed rice noodles) with Coconut", diet: "veg", ingredients: [
      i("Rice flour", 50), i("Coconut (fresh)", 15)] },
    { id: "ragi-puttu", name: "Ragi Puttu with Fresh Coconut", diet: "veg", ingredients: [
      i("Ragi atta", 45), i("Coconut (fresh)", 15)] },
    { id: "kuttu-cheela", name: "Kuttu (Buckwheat) Cheela with Veg", diet: "veg", ingredients: [
      i("Buckwheat flour (kuttu)", 40), i("Onion", 20), i("Carrot", 20), i("Coriander", 0.25, "bunch"),
      i("Ajwain (carom seeds)", 1, "pack")] },
    { id: "beet-poha", name: "Poha with Beetroot & Carrot", diet: "veg", ingredients: [
      i("Poha", 40), i("Beetroot", 30), i("Carrot", 30), i("Peanuts", 8), i("Lemon", 0.5, "pcs"),
      i("Curry leaves", 0.25, "bunch")] },
  ],

  collagen: [
    { id: "collagen-water", name: "Collagen Protein Shake (1 scoop, in water)", diet: "veg", ingredients: [
      i("Collagen protein powder", 1, "scoop")] },
    { id: "collagen-milk", name: "Collagen Protein Shake (1 scoop, in warm milk)", diet: "veg", ingredients: [
      i("Collagen protein powder", 1, "scoop"), i("Milk (toned)", 200, "ml")] },
  ],

  fruit: [
    { id: "guava", name: "Guava", diet: "veg", ingredients: [i("Guava", 150)] },
    { id: "papaya", name: "Papaya", diet: "veg", ingredients: [i("Papaya", 200)] },
    { id: "pomegranate", name: "Pomegranate", diet: "veg", ingredients: [i("Pomegranate", 100)] },
    { id: "apple", name: "Apple (with skin)", diet: "veg", ingredients: [i("Apple", 150)] },
    { id: "orange", name: "Orange / Mosambi", diet: "veg", ingredients: [i("Orange / mosambi", 150)] },
    { id: "pear", name: "Pear (with skin)", diet: "veg", ingredients: [i("Pear", 150)] },
    { id: "kiwi", name: "Kiwi", diet: "veg", ingredients: [i("Kiwi", 150)] },
    { id: "banana", name: "Banana", diet: "veg", ingredients: [i("Banana", 100)] },
    { id: "amla-pepper", name: "Fresh Amla with Black Pepper", diet: "veg", ingredients: [
      i("Amla (Indian gooseberry)", 60), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "fruit-chaat", name: "Fruit Chaat (papaya, pomegranate, guava)", diet: "veg", ingredients: [
      i("Papaya", 80), i("Pomegranate", 50), i("Guava", 60), i("Lemon", 0.5, "pcs"),
      i("Roasted jeera powder", 1, "pack"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "watermelon", name: "Watermelon", diet: "veg", ingredients: [
      i("Watermelon", 250)] },
    { id: "muskmelon", name: "Muskmelon (kharbuja)", diet: "veg", ingredients: [
      i("Muskmelon", 200)] },
    { id: "pineapple", name: "Pineapple", diet: "veg", ingredients: [
      i("Pineapple", 150)] },
    { id: "plum", name: "Plum (aloo bukhara)", diet: "veg", ingredients: [
      i("Plum (aloo bukhara)", 150)] },
    { id: "peach", name: "Peach", diet: "veg", ingredients: [
      i("Peach", 150)] },
    { id: "jamun", name: "Jamun", diet: "veg", ingredients: [
      i("Jamun", 100)] },
  ],

  snack: [
    { id: "chana-lassi", name: "Roasted Chana, Almonds & Thick Salted Lassi", diet: "veg", ingredients: [
      i("Roasted chana", 40), i("Almonds", 10), i("Hung curd (chakka)", 150)] },
    { id: "sattu-drink", name: "Sattu Drink with Milk & Peanuts (unsweetened)", diet: "veg", ingredients: [
      i("Sattu (chana)", 40), i("Milk (toned)", 250, "ml"), i("Peanuts", 15), i("Roasted jeera powder", 1, "pack")] },
    { id: "paneer-tikka", name: "Paneer Tikka (grilled) with Pudina Chutney", diet: "veg", ingredients: [
      i("Paneer", 120), i("Hung curd (chakka)", 40), i("Capsicum", 60), i("Onion", 30),
      i("Mint (pudina)", 0.25, "bunch"), ...tandoori()] },
    { id: "sprouts-paneer-chaat", name: "Sprouts, Kala Chana & Paneer Chaat with Peanuts", diet: "veg", ingredients: [
      i("Moong sprouts", 100), i("Kala chana", 30), i("Paneer", 60), i("Peanuts", 15), i("Onion", 30),
      i("Tomato", 40), i("Lemon", 0.5, "pcs"), i("Roasted jeera powder", 1, "pack"),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "makhana-chaat", name: "Roasted Makhana & Chana Chaat with Peanuts", diet: "veg", ingredients: [
      i("Makhana (fox nuts)", 30), i("Roasted chana", 40), i("Peanuts", 10), i("Onion", 20),
      i("Tomato", 30), i("Lemon", 0.5, "pcs"), i("Roasted jeera powder", 1, "pack")] },
    { id: "chana-seeds-chaas", name: "Roasted Chana, Pumpkin Seeds & Masala Chaas", diet: "veg", ingredients: [
      i("Roasted chana", 40), i("Pumpkin seeds", 10), i("Dahi (curd)", 150),
      i("Roasted jeera powder", 1, "pack"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "egg-chaat", name: "Boiled Egg Chaat (2 eggs) & Guava", diet: "egg", ingredients: [
      i("Eggs", 2, "pcs"), i("Guava", 150), i("Onion", 20), i("Roasted jeera powder", 1, "pack"),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "jowar-muthia", name: "Steamed Jowar-Dudhi Muthia with Coconut", diet: "veg", ingredients: [
      i("Jowar atta", 40), i("Besan", 15), i("Bottle gourd (lauki)", 100), i("Methi leaves", 20),
      i("Coconut (fresh)", 10), i("Rai (mustard seeds)", 1, "pack"),
      i("Jeera (cumin seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "besan-dhokla", name: "Besan Dhokla (steamed, no sugar)", diet: "veg", ingredients: [
      i("Besan", 50), i("Dahi (curd)", 40), i("Lemon", 0.5, "pcs"), i("Ginger", 5),
      i("Green chilli", 1, "pcs"), i("Rai (mustard seeds)", 1, "pack")] },
    { id: "peanut-chaat", name: "Boiled Peanut Chaat", diet: "veg", ingredients: [
      i("Peanuts", 40), i("Onion", 30), i("Tomato", 40), i("Cucumber", 40), i("Lemon", 0.5, "pcs"),
      i("Coriander", 0.25, "bunch"), i("Roasted jeera powder", 1, "pack")] },
    { id: "kakdi-koshimbir", name: "Kakdi (Cucumber) Koshimbir with Peanuts", diet: "veg", ingredients: [
      i("Cucumber", 150), i("Peanuts", 20), i("Coconut (fresh)", 10), i("Lemon", 0.5, "pcs"),
      i("Green chilli", 1, "pcs"), i("Coriander", 0.25, "bunch")] },
    { id: "kala-chana-chaat", name: "Kala Chana Chaat (onion, tomato, lemon)", diet: "veg", ingredients: [
      i("Kala chana", 40), i("Onion", 30), i("Tomato", 40), i("Cucumber", 40), i("Lemon", 0.5, "pcs"),
      i("Roasted jeera powder", 1, "pack"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "makhana-pepper", name: "Roasted Makhana with Black Pepper", diet: "veg", ingredients: [
      i("Makhana (fox nuts)", 30), i("Kali mirch (black pepper)", 1, "pack"),
      i("Roasted jeera powder", 1, "pack")] },
    { id: "makhana-chaas", name: "Makhana & Masala Chaas", diet: "veg", ingredients: [
      i("Makhana (fox nuts)", 25), i("Dahi (curd)", 200), i("Roasted jeera powder", 1, "pack"),
      i("Mint (pudina)", 0.25, "bunch")] },
    { id: "paneer-cucumber-skewers", name: "Paneer & Cucumber Skewers (grilled)", diet: "veg", ingredients: [
      i("Paneer", 100), i("Cucumber", 60), i("Capsicum", 40), i("Hung curd (chakka)", 30),
      i("Mint (pudina)", 0.25, "bunch"), i("Kali mirch (black pepper)", 1, "pack"),
      i("Garam masala (red-chilli-free)", 1, "pack")] },
    { id: "besan-paneer-cheela", name: "Besan-Paneer Cheela (griddle)", diet: "veg", ingredients: [
      i("Besan", 40), i("Paneer", 50), i("Onion", 20), i("Coriander", 0.25, "bunch")] },
  ],

  // ---- Lunch / dinner parts ----

  dal: [
    { id: "toor-dal", name: "Toor Dal Tadka", diet: "veg", ingredients: [
      i("Toor dal", 60), i("Tomato", 40), i("Onion", 30), ...tadka()] },
    { id: "moong-dal", name: "Moong Dal Tadka", diet: "veg", ingredients: [
      i("Moong dal", 60), i("Tomato", 40), i("Ginger", 5), ...tadka()] },
    { id: "masoor-dal", name: "Masoor Dal", diet: "veg", ingredients: [
      i("Masoor dal", 60), i("Tomato", 40), i("Onion", 30), ...tadka()] },
    { id: "chana-dal", name: "Chana Dal Tadka", diet: "veg", ingredients: [
      i("Chana dal", 60), i("Tomato", 40), i("Onion", 30), ...tadka()] },
    { id: "sabut-moong", name: "Sabut Moong Dal", diet: "veg", ingredients: [
      i("Green moong (whole)", 60), i("Tomato", 40), i("Onion", 30), ...tadka()] },
    { id: "panchmel-dal", name: "Panchmel (Mixed) Dal", diet: "veg", ingredients: [
      i("Toor dal", 20), i("Moong dal", 15), i("Masoor dal", 15), i("Chana dal", 15),
      i("Tomato", 40), ...tadka()] },
    { id: "rajma", name: "Rajma Masala", diet: "veg", ingredients: [
      i("Rajma", 60), i("Onion", 40), i("Tomato", 60), i("Ginger", 5), i("Garlic", 5),
      i("Garam masala (red-chilli-free)", 1, "pack")] },
    { id: "chole", name: "Chole (Kabuli Chana) Masala", diet: "veg", ingredients: [
      i("Kabuli chana", 60), i("Onion", 40), i("Tomato", 60), i("Dhania-jeera powder", 1, "pack"),
      i("Garam masala (red-chilli-free)", 1, "pack"), i("Ginger", 5), i("Garlic", 5)] },
    { id: "kala-chana", name: "Kala Chana Masala", diet: "veg", ingredients: [
      i("Kala chana", 60), i("Onion", 40), i("Tomato", 60), i("Ginger", 5), i("Garlic", 5),
      i("Dhania-jeera powder", 1, "pack")] },
    { id: "lobia", name: "Lobia (Black-eyed Pea) Masala", diet: "veg", ingredients: [
      i("Lobia (black-eyed peas)", 60), i("Onion", 40), i("Tomato", 60), i("Ginger", 5), i("Garlic", 5)] },
    { id: "palak-dal", name: "Palak Dal (spinach dal)", diet: "veg", ingredients: [
      i("Toor dal", 45), i("Spinach (palak)", 100), i("Tomato", 30), i("Garlic", 5),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "methi-moong-dal", name: "Methi Moong Dal", diet: "veg", ingredients: [
      i("Moong dal", 50), i("Methi leaves", 40), i("Tomato", 30), i("Garlic", 5),
      i("Haldi (turmeric powder)", 1, "pack")] },
    { id: "lauki-moong-dal", name: "Lauki Moong Dal", diet: "veg", ingredients: [
      i("Moong dal", 45), i("Bottle gourd (lauki)", 100), i("Tomato", 30), i("Ginger", 5),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "tomato-pappu", name: "Tomato Pappu (Andhra style)", diet: "veg", ingredients: [
      i("Toor dal", 50), i("Tomato", 100), i("Garlic", 5), i("Curry leaves", 0.25, "bunch"),
      i("Haldi (turmeric powder)", 1, "pack"), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "gujarati-dal", name: "Gujarati Tuvar Dal (lemon, no sugar)", diet: "veg", ingredients: [
      i("Toor dal", 50), i("Tomato", 40), i("Ginger", 5), i("Lemon", 0.5, "pcs"),
      i("Curry leaves", 0.25, "bunch"), i("Rai (mustard seeds)", 1, "pack"),
      i("Haldi (turmeric powder)", 1, "pack")] },
    { id: "kulthi-dal", name: "Kulthi (Horse Gram) Dal", diet: "veg", ingredients: [
      i("Horse gram (kulthi)", 50), i("Onion", 30), i("Tomato", 40), i("Garlic", 5),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "bengali-moong", name: "Bengali Bhaja Moong Dal (dry-roasted)", diet: "veg", ingredients: [
      i("Moong dal", 55), i("Ginger", 10), i("Coconut (fresh)", 10), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "dhaba-dal", name: "Dhaba-style Dal (black pepper)", diet: "veg", ingredients: [
      i("Toor dal", 30), i("Masoor dal", 20), i("Garlic", 5), i("Tomato", 40),
      i("Kali mirch (black pepper)", 1, "pack"), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "cabbage-chana-dal", name: "Cabbage Chana Dal", diet: "veg", ingredients: [
      i("Chana dal", 45), i("Cabbage", 100), i("Tomato", 30), i("Ginger", 5),
      i("Haldi (turmeric powder)", 1, "pack")] },
    { id: "punjabi-kadhi", name: "Punjabi Kadhi (no pakora)", diet: "veg", ingredients: [
      i("Besan", 25), i("Dahi (curd)", 150), i("Methi seeds", 1, "pack"),
      i("Haldi (turmeric powder)", 1, "pack"), i("Ginger", 5), i("Curry leaves", 0.25, "bunch")] },
  ],

  sabzi: [
    { id: "bhindi", name: "Bhindi Masala", diet: "veg", ingredients: [
      i("Bhindi (okra)", 200), i("Onion", 40), i("Tomato", 30), i("Green chilli", 1, "pcs")] },
    { id: "gobi-matar", name: "Gobi Matar Sabzi", diet: "veg", ingredients: [
      i("Cauliflower", 120), i("Green peas", 60), i("Tomato", 40), i("Onion", 30), i("Ginger", 5)] },
    { id: "baingan-bharta", name: "Baingan Bharta", diet: "veg", ingredients: [
      i("Brinjal", 200), i("Onion", 40), i("Tomato", 60), i("Garlic", 5), i("Green chilli", 1, "pcs")] },
    { id: "lauki-chana", name: "Lauki Chana Dal Sabzi", diet: "veg", ingredients: [
      i("Bottle gourd (lauki)", 200), i("Chana dal", 20), i("Tomato", 40), i("Ginger", 5)] },
    { id: "mixed-veg", name: "Mixed Vegetable Sabzi", diet: "veg", ingredients: [
      i("Carrot", 50), i("French beans", 70), i("Cauliflower", 70), i("Green peas", 40), i("Tomato", 40)] },
    { id: "cabbage-matar", name: "Cabbage Matar Sabzi", diet: "veg", ingredients: [
      i("Cabbage", 150), i("Green peas", 60), i("Onion", 30), i("Green chilli", 1, "pcs")] },
    { id: "beans-poriyal", name: "French Beans Poriyal with Coconut", diet: "veg", ingredients: [
      i("French beans", 180), i("Coconut (fresh)", 15), i("Curry leaves", 0.25, "bunch"), i("Onion", 20)] },
    { id: "karela", name: "Karela Sabzi (bitter gourd)", diet: "veg", ingredients: [
      i("Karela (bitter gourd)", 150), i("Onion", 50), i("Besan", 10), i("Green chilli", 1, "pcs")] },
    { id: "sahjan-phali", name: "Sahjan (Drumstick) Phali Sabzi", diet: "veg", ingredients: [
      i("Drumstick pods (sahjan phali)", 150), i("Tomato", 40), i("Onion", 30), i("Coconut (fresh)", 10)] },
    { id: "kaddu", name: "Kaddu (Pumpkin) Sabzi", diet: "veg", ingredients: [
      i("Pumpkin (kaddu)", 200), i("Methi seeds", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "shakarkandi", name: "Shakarkandi (Sweet Potato) Sabzi", diet: "veg", ingredients: [
      i("Sweet potato (shakarkandi)", 150), i("Green peas", 40), i("Green chilli", 1, "pcs"),
      i("Coriander", 0.25, "bunch")] },
    { id: "chana-palak", name: "Chana Palak Sabzi (dry)", diet: "veg", ingredients: [
      i("Kabuli chana", 30), i("Spinach (palak)", 150), i("Onion", 30), i("Garlic", 5)] },
    { id: "mushroom-matar", name: "Mushroom Matar", diet: "veg", ingredients: [
      i("Mushrooms", 150), i("Green peas", 60), i("Onion", 40), i("Tomato", 40), i("Ginger", 5)] },
    { id: "matar-paneer", name: "Matar Paneer", diet: "veg", ingredients: [
      i("Paneer", 90), i("Green peas", 70), i("Tomato", 60), i("Onion", 40)] },
    { id: "paneer-capsicum", name: "Paneer Capsicum Sabzi", diet: "veg", ingredients: [
      i("Paneer", 90), i("Capsicum", 120), i("Onion", 40), i("Tomato", 40)] },
    { id: "cabbage-thoran", name: "Cabbage Thoran", diet: "veg", ingredients: [
      i("Cabbage", 150), i("Coconut (fresh)", 15), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "carrot-cabbage-thoran", name: "Carrot-Cabbage Thoran", diet: "veg", ingredients: [
      i("Cabbage", 100), i("Carrot", 60), i("Coconut (fresh)", 15), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "beans-carrot-thoran", name: "Beans-Carrot Thoran", diet: "veg", ingredients: [
      i("French beans", 100), i("Carrot", 50), i("Coconut (fresh)", 15),
      i("Curry leaves", 0.25, "bunch"), i("Rai (mustard seeds)", 1, "pack")] },
    { id: "beetroot-thoran", name: "Beetroot Thoran", diet: "veg", ingredients: [
      i("Beetroot", 150), i("Coconut (fresh)", 15), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "avial", name: "Avial (mixed veg in coconut and curd)", diet: "veg", ingredients: [
      i("Carrot", 40), i("French beans", 40), i("Ash gourd (petha)", 60),
      i("Drumstick pods (sahjan phali)", 40), i("Coconut (fresh)", 20), i("Dahi (curd)", 40),
      i("Curry leaves", 0.25, "bunch"), i("Jeera (cumin seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "parwal", name: "Parwal Sabzi", diet: "veg", ingredients: [
      i("Parwal (pointed gourd)", 150), i("Onion", 30), i("Tomato", 30),
      i("Haldi (turmeric powder)", 1, "pack"), i("Dhania-jeera powder", 1, "pack")] },
    { id: "tinda", name: "Tinda Masala", diet: "veg", ingredients: [
      i("Tinda (apple gourd)", 150), i("Onion", 40), i("Tomato", 50),
      i("Dhania-jeera powder", 1, "pack")] },
    { id: "turai", name: "Turai (Ridge Gourd) Sabzi", diet: "veg", ingredients: [
      i("Ridge gourd (turai)", 200), i("Onion", 30), i("Tomato", 40),
      i("Jeera (cumin seeds)", 1, "pack"), i("Ginger", 5)] },
    { id: "kundru", name: "Kundru (Tendli) Sabzi, dry", diet: "veg", ingredients: [
      i("Kundru (ivy gourd)", 150), i("Onion", 30), i("Jeera (cumin seeds)", 1, "pack"),
      i("Amchur (dry mango powder)", 1, "pack")] },
    { id: "arbi", name: "Arbi Masala (dry, with ajwain)", diet: "veg", ingredients: [
      i("Colocasia (arbi)", 120), i("Ajwain (carom seeds)", 1, "pack"),
      i("Dhania-jeera powder", 1, "pack"), i("Amchur (dry mango powder)", 1, "pack")] },
    { id: "lauki-sabzi", name: "Lauki Sabzi", diet: "veg", ingredients: [
      i("Bottle gourd (lauki)", 250), i("Tomato", 40), i("Jeera (cumin seeds)", 1, "pack"),
      i("Ginger", 5)] },
    { id: "aloo-gobi", name: "Aloo Gobi (dry)", diet: "veg", ingredients: [
      i("Potato", 80), i("Cauliflower", 120), i("Tomato", 30), i("Haldi (turmeric powder)", 1, "pack"),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "gajar-matar", name: "Gajar Matar", diet: "veg", ingredients: [
      i("Carrot", 100), i("Green peas", 60), i("Ginger", 5), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "phool-gobi", name: "Phool Gobi Sabzi (dry)", diet: "veg", ingredients: [
      i("Cauliflower", 200), i("Tomato", 30), i("Haldi (turmeric powder)", 1, "pack"),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "aloo-methi", name: "Aloo Methi", diet: "veg", ingredients: [
      i("Potato", 80), i("Methi leaves", 100), i("Garlic", 5)] },
    { id: "aloo-beans", name: "Aloo Beans", diet: "veg", ingredients: [
      i("Potato", 70), i("French beans", 120), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "besan-shimla", name: "Besan Shimla Mirch", diet: "veg", ingredients: [
      i("Capsicum", 150), i("Besan", 15), i("Onion", 30), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "bharwa-baingan", name: "Bharwa Baingan (roasted, peanut-coconut filling)", diet: "veg", ingredients: [
      i("Brinjal", 150), i("Peanuts", 10), i("Coconut (fresh)", 10), i("Onion", 20),
      i("Dhania-jeera powder", 1, "pack")] },
    { id: "shalgam", name: "Shalgam (Turnip) Sabzi", diet: "veg", ingredients: [
      i("Turnip", 200), i("Onion", 30), i("Tomato", 30), i("Ginger", 5)] },
    { id: "ganth-gobi", name: "Ganth Gobi (Kohlrabi) Sabzi", diet: "veg", ingredients: [
      i("Kohlrabi (gaanth gobi)", 200), i("Onion", 30), i("Tomato", 30), i("Ginger", 5),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "mushroom-pepper", name: "Mushroom Pepper Dry (stir-cooked)", diet: "veg", ingredients: [
      i("Mushrooms", 200), i("Onion", 40), i("Garlic", 5), i("Curry leaves", 0.25, "bunch"),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "lau-shukto", name: "Lau Shukto (Bengali bottle gourd, mild)", diet: "veg", ingredients: [
      i("Bottle gourd (lauki)", 150), i("Potato", 30), i("Poppy seeds (khus khus)", 5),
      i("Milk (toned)", 60, "ml"), i("Methi seeds", 1, "pack"), i("Haldi (turmeric powder)", 1, "pack")] },
    { id: "lau-ghonto", name: "Lau Ghonto (bottle gourd with panch phoron)", diet: "veg", ingredients: [
      i("Bottle gourd (lauki)", 200), i("Coconut (fresh)", 10), i("Ginger", 5),
      i("Panch phoron", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "jhinge-posto", name: "Jhinge Posto (ridge gourd, poppy seed paste)", diet: "veg", ingredients: [
      i("Ridge gourd (turai)", 200), i("Poppy seeds (khus khus)", 10),
      i("Kalonji (nigella seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "veg-stew", name: "Kerala Vegetable Stew (light)", diet: "veg", ingredients: [
      i("Carrot", 50), i("French beans", 50), i("Potato", 50), i("Green peas", 30),
      i("Coconut (fresh)", 20), i("Milk (toned)", 80, "ml"), i("Dalchini (cinnamon)", 1, "pack"),
      i("Laung (cloves)", 1, "pack"), i("Elaichi (green cardamom)", 1, "pack"),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "paneer-bhurji-sabzi", name: "Paneer Bhurji Sabzi", diet: "veg", ingredients: [
      i("Paneer", 80), i("Onion", 30), i("Tomato", 40), i("Capsicum", 40), i("Coriander", 0.25, "bunch")] },
    { id: "shimla-masala", name: "Shimla Mirch Masala", diet: "veg", ingredients: [
      i("Capsicum", 150), i("Onion", 40), i("Tomato", 40), i("Dhania-jeera powder", 1, "pack")] },
    { id: "aloo-baingan", name: "Aloo Baingan", diet: "veg", ingredients: [
      i("Brinjal", 120), i("Potato", 60), i("Onion", 30), i("Tomato", 30),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "cabbage-peanut", name: "Cabbage Sabzi with Peanuts (Maharashtrian)", diet: "veg", ingredients: [
      i("Cabbage", 150), i("Peanuts", 15), i("Coconut (fresh)", 10),
      i("Rai (mustard seeds)", 1, "pack"), i("Jeera (cumin seeds)", 1, "pack"),
      i("Green chilli", 1, "pcs")] },
  ],

  saag: [
    { id: "palak-saag", name: "Palak Saag (garlic tadka)", diet: "veg", ingredients: [
      i("Spinach (palak)", 200), i("Onion", 20), i("Tomato", 20), ...tadka()] },
    { id: "sarson-saag", name: "Sarson ka Saag", diet: "veg", ingredients: [
      i("Mustard greens (sarson)", 150), i("Spinach (palak)", 50), i("Ginger", 10),
      i("Green chilli", 2, "pcs"), i("Garlic", 5)] },
    { id: "methi-saag", name: "Methi Saag", diet: "veg", ingredients: [
      i("Methi leaves", 150), i("Onion", 30), i("Garlic", 5), i("Green chilli", 1, "pcs")] },
    { id: "methi-palak-saag", name: "Methi-Palak Saag", diet: "veg", ingredients: [
      i("Methi leaves", 80), i("Spinach (palak)", 120), i("Onion", 20), i("Garlic", 5)] },
    { id: "chaulai-saag", name: "Chaulai (Amaranth Leaves) Saag", diet: "veg", ingredients: [
      i("Amaranth leaves (chaulai)", 200), i("Onion", 30), ...tadka()] },
    { id: "sahjan-saag", name: "Sahjan Patta (Moringa Leaf) Saag", diet: "veg", ingredients: [
      i("Moringa leaves (sahjan patta)", 150), i("Onion", 20), i("Garlic", 5), i("Coconut (fresh)", 10),
      i("Green chilli", 1, "pcs")] },
    { id: "palak-paneer", name: "Palak Paneer (light)", diet: "veg", ingredients: [
      i("Spinach (palak)", 180), i("Paneer", 70), i("Onion", 30), i("Tomato", 30), i("Garlic", 5)] },
    { id: "methi-matar", name: "Methi Matar", diet: "veg", ingredients: [
      i("Methi leaves", 100), i("Green peas", 60), i("Onion", 30), i("Garlic", 5)] },
    { id: "pui-shak", name: "Pui Shak (Malabar spinach) with Pumpkin", diet: "veg", ingredients: [
      i("Malabar spinach (pui shak)", 150), i("Pumpkin (kaddu)", 50),
      i("Kalonji (nigella seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "keerai-masiyal", name: "Keerai Masiyal (spinach mash)", diet: "veg", ingredients: [
      i("Spinach (palak)", 200), i("Garlic", 5), i("Coconut (fresh)", 10),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "palak-thoran", name: "Palak Thoran", diet: "veg", ingredients: [
      i("Spinach (palak)", 200), i("Coconut (fresh)", 15), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack")] },
    { id: "methi-thoran", name: "Methi Thoran", diet: "veg", ingredients: [
      i("Methi leaves", 120), i("Coconut (fresh)", 15), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack")] },
    { id: "suva-bhaji", name: "Suva Bhaji (dill saag)", diet: "veg", ingredients: [
      i("Dill leaves (suva)", 100), i("Spinach (palak)", 60), i("Garlic", 5),
      i("Jeera (cumin seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "beet-greens", name: "Beetroot Leaf Poriyal", diet: "veg", ingredients: [
      i("Beet greens (beetroot leaves)", 200), i("Coconut (fresh)", 10), i("Onion", 20),
      i("Rai (mustard seeds)", 1, "pack"), i("Curry leaves", 0.25, "bunch")] },
    { id: "mixed-saag", name: "Mixed Saag (palak, methi, sarson)", diet: "veg", ingredients: [
      i("Spinach (palak)", 80), i("Methi leaves", 40), i("Mustard greens (sarson)", 60),
      i("Ginger", 10), i("Garlic", 5)] },
    { id: "palak-lauki", name: "Palak-Lauki Saag", diet: "veg", ingredients: [
      i("Spinach (palak)", 120), i("Bottle gourd (lauki)", 100), i("Garlic", 5),
      i("Jeera (cumin seeds)", 1, "pack")] },
  ],

  // Simple raw salads: carrot, tomato, cucumber (kheera), onion, beetroot, lettuce
  // and lemon, every time. The variants differ in how it is cut and which
  // vegetable leads, so lunch and dinner are not the same.
  salad: [
    { id: "salad-chopped", name: "Simple Salad: chopped", diet: "veg", ingredients: [
      i("Carrot", 40), i("Tomato", 50), i("Cucumber", 80), i("Onion", 25), i("Beetroot", 40),
      i("Lettuce", 40), i("Lemon", 0.5, "pcs")] },
    { id: "salad-grated", name: "Simple Salad: grated carrot & beetroot", diet: "veg", ingredients: [
      i("Carrot", 60), i("Beetroot", 60), i("Tomato", 40), i("Cucumber", 50), i("Onion", 20),
      i("Lettuce", 30), i("Lemon", 0.5, "pcs")] },
    { id: "salad-lettuce", name: "Simple Salad: lettuce & kheera crunch", diet: "veg", ingredients: [
      i("Lettuce", 70), i("Cucumber", 100), i("Tomato", 40), i("Carrot", 30), i("Onion", 20),
      i("Beetroot", 30), i("Lemon", 0.5, "pcs")] },
    { id: "salad-kachumber", name: "Simple Salad: kachumber style", diet: "veg", ingredients: [
      i("Cucumber", 80), i("Tomato", 80), i("Onion", 40), i("Carrot", 30), i("Beetroot", 30),
      i("Lettuce", 30), i("Lemon", 0.5, "pcs")] },
  ],

  dahi: [
    { id: "plain-dahi", name: "Plain Dahi", diet: "veg", ingredients: [
      i("Dahi (curd)", 150)] },
    { id: "pudina-raita", name: "Pudina Raita (thick dahi)", diet: "veg", ingredients: [
      i("Hung curd (chakka)", 100), i("Mint (pudina)", 0.25, "bunch")] },
    { id: "cucumber-raita", name: "Cucumber Raita (thick dahi)", diet: "veg", ingredients: [
      i("Hung curd (chakka)", 100), i("Cucumber", 60)] },
    { id: "lauki-raita", name: "Lauki Raita", diet: "veg", ingredients: [
      i("Dahi (curd)", 150), i("Bottle gourd (lauki)", 60)] },
    { id: "beet-raita", name: "Beetroot Raita", diet: "veg", ingredients: [
      i("Dahi (curd)", 150), i("Beetroot", 50)] },
    { id: "carrot-raita", name: "Carrot Raita (thick dahi)", diet: "veg", ingredients: [
      i("Hung curd (chakka)", 100), i("Carrot", 50)] },
    { id: "palak-raita", name: "Palak Raita (thick dahi)", diet: "veg", ingredients: [
      i("Hung curd (chakka)", 100), i("Spinach (palak)", 40)] },
    { id: "mixed-raita", name: "Mixed Veg Raita", diet: "veg", ingredients: [
      i("Dahi (curd)", 150), i("Cucumber", 40), i("Tomato", 30), i("Onion", 20), i("Carrot", 30)] },
    { id: "walnut-raita", name: "Walnut Raita (thick dahi)", diet: "veg", ingredients: [
      i("Hung curd (chakka)", 100), i("Walnuts", 10), i("Cucumber", 40)] },
    { id: "onion-pachadi", name: "Vengaya Pachadi (onion raita)", diet: "veg", ingredients: [
      i("Dahi (curd)", 150), i("Onion", 30), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack"), i("Green chilli", 1, "pcs")] },
    { id: "tomato-pachadi", name: "Thakkali Pachadi (tomato)", diet: "veg", ingredients: [
      i("Dahi (curd)", 150), i("Tomato", 50), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack")] },
    { id: "cucumber-pachadi", name: "Kerala Cucumber Pachadi", diet: "veg", ingredients: [
      i("Dahi (curd)", 120), i("Cucumber", 80), i("Coconut (fresh)", 15),
      i("Rai (mustard seeds)", 1, "pack"), i("Curry leaves", 0.25, "bunch")] },
    { id: "pineapple-pachadi", name: "Pineapple Pachadi (no sugar)", diet: "veg", ingredients: [
      i("Dahi (curd)", 120), i("Pineapple", 60), i("Coconut (fresh)", 10),
      i("Rai (mustard seeds)", 1, "pack")] },
    { id: "pomegranate-raita", name: "Pomegranate Raita", diet: "veg", ingredients: [
      i("Dahi (curd)", 150), i("Pomegranate", 50), i("Roasted jeera powder", 1, "pack")] },
    { id: "jeera-raita", name: "Jeera Raita (roasted cumin & pepper)", diet: "veg", ingredients: [
      i("Dahi (curd)", 150), i("Roasted jeera powder", 1, "pack"),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "carrot-coconut-raita", name: "Carrot-Coconut Raita (thick dahi)", diet: "veg", ingredients: [
      i("Hung curd (chakka)", 100), i("Carrot", 40), i("Coconut (fresh)", 10)] },
    { id: "burani-raita", name: "Burani Raita (garlic & mint)", diet: "veg", ingredients: [
      i("Dahi (curd)", 150), i("Garlic", 3), i("Mint (pudina)", 0.25, "bunch"),
      i("Green chilli", 1, "pcs")] },
  ],

  // Chutneys have no added salt: the flavour comes from lemon, roasted jeera,
  // ginger and chilli. Add a pinch at the table if you want it.
  chutney: [
    { id: "amla-chutney", name: "Amla Chutney (no salt)", diet: "veg", ingredients: [
      i("Amla (Indian gooseberry)", 50), i("Coriander", 0.25, "bunch"), i("Ginger", 5),
      i("Green chilli", 1, "pcs"), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "mint-chutney", name: "Mint-Coriander Chutney (lemon, no salt)", diet: "veg", ingredients: [
      i("Mint (pudina)", 0.25, "bunch"), i("Coriander", 0.5, "bunch"), i("Green chilli", 1, "pcs"),
      i("Lemon", 0.5, "pcs"), i("Ginger", 5), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "coconut-chutney", name: "Coconut-Mint Chutney (no salt)", diet: "veg", ingredients: [
      i("Coconut (fresh)", 20), i("Mint (pudina)", 0.25, "bunch"), i("Roasted chana", 8),
      i("Green chilli", 1, "pcs"), i("Lemon", 0.5, "pcs")] },
    { id: "alsi-chutney", name: "Roasted Alsi (Flaxseed) Chutney (no salt)", diet: "veg", ingredients: [
      i("Flax seeds (alsi)", 12), i("Garlic", 3), i("Green chilli", 1, "pcs"), i("Lemon", 0.5, "pcs"),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "til-chutney", name: "Roasted Til-Coriander Chutney (no salt)", diet: "veg", ingredients: [
      i("Sesame seeds (til)", 10), i("Coriander", 0.25, "bunch"), i("Green chilli", 1, "pcs"),
      i("Lemon", 0.5, "pcs")] },
    { id: "curry-leaf-chutney", name: "Curry Leaf Chutney (no salt)", diet: "veg", ingredients: [
      i("Curry leaves", 0.5, "bunch"), i("Coconut (fresh)", 10), i("Roasted chana", 8),
      i("Green chilli", 1, "pcs"), i("Lemon", 0.5, "pcs")] },
    { id: "tomato-chutney", name: "Tomato-Garlic Chutney (no salt)", diet: "veg", ingredients: [
      i("Tomato", 100), i("Garlic", 5), i("Green chilli", 1, "pcs"), i("Coriander", 0.25, "bunch")] },
    { id: "sahjan-chutney", name: "Sahjan Patta (Moringa) Chutney (no salt)", diet: "veg", ingredients: [
      i("Moringa leaves (sahjan patta)", 40), i("Coconut (fresh)", 10), i("Garlic", 3),
      i("Green chilli", 1, "pcs"), i("Lemon", 0.5, "pcs")] },
    { id: "beet-chutney", name: "Beetroot-Ginger Chutney (no salt)", diet: "veg", ingredients: [
      i("Beetroot", 60), i("Ginger", 5), i("Green chilli", 1, "pcs"), i("Lemon", 0.5, "pcs")] },
    { id: "onion-tomato-chutney", name: "Onion-Tomato Chutney (no salt)", diet: "veg", ingredients: [
      i("Onion", 40), i("Tomato", 60), i("Garlic", 3), i("Curry leaves", 0.25, "bunch"),
      i("Green chilli", 1, "pcs"), i("Rai (mustard seeds)", 1, "pack")] },
    { id: "coriander-coconut-chutney", name: "Coriander-Coconut Chutney (no salt)", diet: "veg", ingredients: [
      i("Coriander", 0.5, "bunch"), i("Coconut (fresh)", 20), i("Lemon", 0.5, "pcs"),
      i("Green chilli", 1, "pcs"), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "garlic-mint-chutney", name: "Garlic-Mint Chutney (no salt)", diet: "veg", ingredients: [
      i("Garlic", 5), i("Mint (pudina)", 0.25, "bunch"), i("Coriander", 0.25, "bunch"),
      i("Lemon", 0.5, "pcs")] },
    { id: "raw-mango-chutney", name: "Raw Mango Chutney (no sugar, no salt)", diet: "veg", ingredients: [
      i("Raw mango", 50), i("Mint (pudina)", 0.25, "bunch"), i("Coriander", 0.25, "bunch"),
      i("Green chilli", 1, "pcs"), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "coconut-curd-chutney", name: "Coconut-Curd Chutney (no salt)", diet: "veg", ingredients: [
      i("Coconut (fresh)", 20), i("Dahi (curd)", 50), i("Green chilli", 1, "pcs"),
      i("Curry leaves", 0.25, "bunch"), i("Rai (mustard seeds)", 1, "pack")] },
    { id: "peanut-chutney", name: "Roasted Peanut Chutney (no salt)", diet: "veg", ingredients: [
      i("Peanuts", 15), i("Tomato", 30), i("Garlic", 3), i("Lemon", 0.5, "pcs"),
      i("Green chilli", 1, "pcs"), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "turai-chutney", name: "Ridge Gourd (Turai) Chutney (no salt)", diet: "veg", ingredients: [
      i("Ridge gourd (turai)", 100), i("Coconut (fresh)", 10), i("Garlic", 3),
      i("Green chilli", 1, "pcs"), i("Lemon", 0.5, "pcs")] },
    { id: "adrak-chutney", name: "Ginger-Lemon Chutney (no salt)", diet: "veg", ingredients: [
      i("Ginger", 15), i("Lemon", 1, "pcs"), i("Coriander", 0.25, "bunch"), i("Green chilli", 1, "pcs")] },
    { id: "cucumber-mint-chutney", name: "Cucumber-Mint Chutney (no salt)", diet: "veg", ingredients: [
      i("Mint (pudina)", 0.25, "bunch"), i("Cucumber", 60), i("Dahi (curd)", 30),
      i("Green chilli", 1, "pcs")] },
  ],

  // Buttermilk with ground flax (alsi) at lunch, every day.
  chaas: [
    { id: "masala-chaas", name: "Masala Chaas with Ground Alsi", diet: "veg", ingredients: [
      i("Dahi (curd)", 100), i("Flax seeds (alsi)", 8), i("Roasted jeera powder", 1, "pack"),
      i("Kali mirch (black pepper)", 1, "pack"), i("Coriander", 0.25, "bunch")] },
    { id: "pudina-chaas", name: "Pudina Chaas with Ground Alsi", diet: "veg", ingredients: [
      i("Dahi (curd)", 100), i("Flax seeds (alsi)", 8), i("Mint (pudina)", 0.25, "bunch"),
      i("Roasted jeera powder", 1, "pack")] },
    { id: "ginger-chaas", name: "Ginger-Jeera Chaas with Ground Alsi", diet: "veg", ingredients: [
      i("Dahi (curd)", 100), i("Flax seeds (alsi)", 8), i("Ginger", 5), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "curry-leaf-chaas", name: "Curry Leaf-Ginger Chaas with Ground Alsi", diet: "veg", ingredients: [
      i("Dahi (curd)", 100), i("Flax seeds (alsi)", 8), i("Curry leaves", 0.25, "bunch"), i("Ginger", 5)] },
    { id: "cucumber-chaas", name: "Cucumber-Mint Chaas with Ground Alsi", diet: "veg", ingredients: [
      i("Dahi (curd)", 100), i("Flax seeds (alsi)", 8), i("Cucumber", 50), i("Mint (pudina)", 0.25, "bunch")] },
    { id: "ajwain-chaas", name: "Ajwain-Jeera Chaas with Ground Alsi", diet: "veg", ingredients: [
      i("Dahi (curd)", 100), i("Flax seeds (alsi)", 8), i("Ajwain (carom seeds)", 1, "pack"),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "coriander-chaas", name: "Coriander-Green Chilli Chaas with Ground Alsi", diet: "veg", ingredients: [
      i("Dahi (curd)", 100), i("Flax seeds (alsi)", 8), i("Coriander", 0.5, "bunch"),
      i("Green chilli", 1, "pcs")] },
    { id: "pepper-ginger-chaas", name: "Black Pepper-Ginger Chaas with Ground Alsi", diet: "veg", ingredients: [
      i("Dahi (curd)", 100), i("Flax seeds (alsi)", 8), i("Ginger", 5),
      i("Kali mirch (black pepper)", 1, "pack")] },
  ],

  // The one tea: haldi, nimbu, ginger and black pepper. Unsweetened.
  tea: [
    { id: "haldi-nimbu-tea", name: "Haldi-Nimbu-Ginger-Kali Mirch Tea", diet: "veg", ingredients: [
      i("Haldi (turmeric powder)", 1, "pack"), i("Lemon", 0.5, "pcs"), i("Ginger", 10),
      i("Kali mirch (black pepper)", 1, "pack")] },
  ],

  // Gluten-free rotis and rice. Lunch has 2 rotis; dinner has a smaller serving
  // (made below from the lunch ones).
  staple: [
    { id: "jowar-roti", name: "2 Jowar Rotis", light: "1 Jowar Roti", diet: "veg", ingredients: [i("Jowar atta", 55)] },
    { id: "bajra-roti", name: "2 Bajra Rotis", light: "1 Bajra Roti", diet: "veg", ingredients: [i("Bajra atta", 55)] },
    { id: "ragi-roti", name: "2 Ragi Rotis", light: "1 Ragi Roti", diet: "veg", ingredients: [i("Ragi atta", 55)] },
    { id: "makki-roti", name: "2 Makki Rotis", light: "1 Makki Roti", diet: "veg", ingredients: [i("Makki atta (maize flour)", 55)] },
    { id: "missi-roti", name: "2 Jowar-Besan Missi Rotis", light: "1 Jowar-Besan Missi Roti", diet: "veg", ingredients: [
      i("Jowar atta", 30), i("Besan", 30)] },
    { id: "rajgira-roti", name: "2 Rajgira-Jowar Rotis", light: "1 Rajgira-Jowar Roti", diet: "veg", ingredients: [
      i("Rajgira atta (amaranth)", 30), i("Jowar atta", 30)] },
    { id: "brown-rice", name: "Jeera Brown Rice", light: "Small Jeera Brown Rice (half portion)", diet: "veg", ingredients: [i("Brown rice", 60)] },
    { id: "akki-roti", name: "2 Akki Rotis (rice flour)", light: "1 Akki Roti", diet: "veg", ingredients: [
      i("Rice flour", 55)] },
    { id: "kuttu-roti", name: "2 Kuttu (Buckwheat) Rotis", light: "1 Kuttu Roti", diet: "veg", ingredients: [
      i("Buckwheat flour (kuttu)", 50)] },
    { id: "ragi-jowar-roti", name: "2 Ragi-Jowar Rotis", light: "1 Ragi-Jowar Roti", diet: "veg", ingredients: [
      i("Ragi atta", 30), i("Jowar atta", 30)] },
    { id: "bajra-methi-roti", name: "2 Bajra-Methi Rotis", light: "1 Bajra-Methi Roti", diet: "veg", ingredients: [
      i("Bajra atta", 45), i("Methi leaves", 30)] },
    { id: "jowar-palak-roti", name: "2 Jowar-Palak Rotis", light: "1 Jowar-Palak Roti", diet: "veg", ingredients: [
      i("Jowar atta", 50), i("Spinach (palak)", 40)] },
    { id: "lemon-millet-rice", name: "Lemon Foxtail Millet Rice", light: "Small Lemon Foxtail Millet Rice (half portion)", diet: "veg", ingredients: [
      i("Foxtail millet (kangni)", 50), i("Lemon", 0.5, "pcs"), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack"), i("Peanuts", 8)] },
    { id: "kodo-pulao", name: "Kodo Millet Veg Pulao", light: "Small Kodo Millet Veg Pulao (half portion)", diet: "veg", ingredients: [
      i("Kodo millet", 50), i("Carrot", 20), i("Green peas", 20), i("French beans", 20),
      i("Dalchini (cinnamon)", 1, "pack"), i("Laung (cloves)", 1, "pack"),
      i("Elaichi (green cardamom)", 1, "pack")] },
    { id: "barnyard-pulao", name: "Barnyard Millet (Samak) Pulao", light: "Small Barnyard Millet Pulao (half portion)", diet: "veg", ingredients: [
      i("Barnyard millet (samak)", 50), i("Carrot", 20), i("Green peas", 20),
      i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "brown-rice-pulao", name: "Brown Rice Veg Pulao", light: "Small Brown Rice Veg Pulao (half portion)", diet: "veg", ingredients: [
      i("Brown rice", 50), i("Carrot", 20), i("French beans", 20), i("Green peas", 20),
      i("Dalchini (cinnamon)", 1, "pack"), i("Laung (cloves)", 1, "pack"),
      i("Elaichi (green cardamom)", 1, "pack"), i("Jeera (cumin seeds)", 1, "pack")] },
    { id: "curd-rice", name: "Curd Rice (brown rice, tempered)", light: "Small Curd Rice (half portion)", diet: "veg", ingredients: [
      i("Brown rice", 45), i("Dahi (curd)", 100), i("Curry leaves", 0.25, "bunch"),
      i("Rai (mustard seeds)", 1, "pack"), i("Ginger", 5), i("Coriander", 0.25, "bunch")] },
    { id: "idiyappam-staple", name: "Idiyappam (steamed rice noodles)", light: "Small Idiyappam (half portion)", diet: "veg", ingredients: [
      i("Rice flour", 55)] },
    { id: "samai-rice", name: "Little Millet (Samai) Rice", light: "Small Little Millet Rice (half portion)", diet: "veg", ingredients: [
      i("Little millet (kutki)", 50), i("Jeera (cumin seeds)", 1, "pack")] },
  ],

  // Grilled chicken or fish only, never in gravy. No eggs here: eggs are at breakfast.
  side: [
    { id: "none", name: "No side", diet: "veg", ingredients: [] },
    { id: "chicken-tikka", name: "Chicken Tikka (grilled)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 30), i("Lemon", 0.5, "pcs"), ...tandoori()] },
    { id: "tandoori-chicken", name: "Tandoori Chicken (grilled)", diet: "nonveg", ingredients: [
      i("Chicken (curry cut, skinless)", 160), i("Hung curd (chakka)", 30), i("Lemon", 0.5, "pcs"), ...tandoori()] },
    { id: "chicken-seekh", name: "Chicken Seekh Kebab (grilled)", diet: "nonveg", ingredients: [
      i("Chicken mince (keema)", 120), i("Onion", 20), i("Ginger", 5), i("Mint (pudina)", 0.25, "bunch"),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "ajwaini-fish", name: "Ajwaini Fish Tikka (grilled)", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 150), i("Hung curd (chakka)", 30), i("Lemon", 0.5, "pcs"), ...tandoori()] },
    { id: "chicken-hariyali", name: "Chicken Hariyali Tikka (grilled)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 30),
      i("Mint (pudina)", 0.25, "bunch"), i("Coriander", 0.25, "bunch"), i("Green chilli", 1, "pcs"),
      i("Lemon", 0.5, "pcs"), i("Ginger", 5), i("Garlic", 3),
      i("Kali mirch (black pepper)", 1, "pack"), i("Garam masala (red-chilli-free)", 1, "pack")] },
    { id: "chicken-achari", name: "Chicken Achari Tikka (grilled, no chilli)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 30),
      i("Saunf (fennel seeds)", 1, "pack"), i("Kalonji (nigella seeds)", 1, "pack"),
      i("Methi seeds", 1, "pack"), i("Lemon", 0.5, "pcs")] },
    { id: "chicken-malai", name: "Chicken Malai Tikka (grilled, light)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 40),
      i("Elaichi (green cardamom)", 1, "pack"), i("Kali mirch (black pepper)", 1, "pack"),
      i("Ginger", 5), i("Garlic", 3)] },
    { id: "chicken-lemon-garlic", name: "Lemon-Garlic Chicken Tikka (grilled)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 30), i("Garlic", 5),
      i("Lemon", 1, "pcs"), i("Kali mirch (black pepper)", 1, "pack"), i("Coriander", 0.25, "bunch")] },
    { id: "chicken-ajwaini", name: "Ajwaini Chicken Tikka (grilled)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 30),
      i("Ajwain (carom seeds)", 1, "pack"), i("Lemon", 0.5, "pcs"),
      i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "fish-hariyali", name: "Hariyali Fish Tikka (grilled)", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 150), i("Hung curd (chakka)", 30), i("Mint (pudina)", 0.25, "bunch"),
      i("Coriander", 0.25, "bunch"), i("Green chilli", 1, "pcs"), i("Lemon", 0.5, "pcs")] },
    { id: "pepper-chicken", name: "Black Pepper Chicken Tikka (grilled)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 30), i("Garlic", 5),
      i("Lemon", 0.5, "pcs"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "chicken-curry-leaf", name: "Curry Leaf Chicken Tikka (grilled)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 30), i("Curry leaves", 0.5, "bunch"),
      i("Ginger", 5), i("Lemon", 0.5, "pcs"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "lemon-pepper-fish", name: "Lemon-Pepper Fish (grilled)", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 150), i("Lemon", 1, "pcs"), i("Kali mirch (black pepper)", 1, "pack"),
      i("Coriander", 0.25, "bunch"), i("Roasted jeera powder", 1, "pack")] },
    { id: "fish-curry-leaf", name: "Curry Leaf Fish (grilled)", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 150), i("Curry leaves", 0.5, "bunch"), i("Ginger", 5), i("Garlic", 3),
      i("Lemon", 1, "pcs"), i("Kali mirch (black pepper)", 1, "pack")] },
    { id: "patra-ni-machhi", name: "Patra ni Machhi (banana-leaf parcel, grilled)", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 150), i("Coriander", 0.5, "bunch"), i("Mint (pudina)", 0.25, "bunch"),
      i("Coconut (fresh)", 15), i("Green chilli", 1, "pcs"), i("Lemon", 0.5, "pcs"), i("Jeera (cumin seeds)", 1, "pack")] },
  ],
};

// Dinner roti / rice: half the lunch serving, to keep dinner light.
RECIPES.stapleLight = RECIPES.staple.map((r) => ({
  id: r.id + "-1", name: r.light, diet: "veg",
  ingredients: r.ingredients.map((ing) => Object.assign({}, ing, { qty: ing.qty / 2 })),
}));

// Dishes that are rich, gravy-heavy or slow to digest. The planner keeps them
// away from dinner.
const HEAVY_AT_NIGHT = ["rajma", "chole", "kala-chana", "lobia", "matar-paneer", "paneer-capsicum",
  "palak-paneer", "tandoori-chicken", "bajra-roti-1", "makki-roti-1"];
Object.values(RECIPES).flat().forEach((r) => { r.heavy = HEAVY_AT_NIGHT.includes(r.id); });

// Dals, beans, chickpeas and their flours and sprouts. None of these are served
// at dinner. Green peas and peanuts are treated as vegetables and nuts.
const LEGUMES = ["Moong dal", "Green moong (whole)", "Toor dal", "Masoor dal", "Chana dal", "Rajma",
  "Kabuli chana", "Kala chana", "Lobia (black-eyed peas)", "Roasted chana", "Sattu (chana)", "Besan",
  "Moong sprouts", "Horse gram (kulthi)"];
Object.values(RECIPES).flat().forEach((r) => {
  r.legume = r.ingredients.some((ing) => LEGUMES.includes(ing.name));
});

// The day's slots, in serving order. "pool" says which list a slot picks
// from; "group" is the meal it belongs to; "part" is its role in a thali.
const MEAL_GROUPS = [
  { key: "morning",   label: "On waking",      emoji: "🌅" },
  { key: "breakfast", label: "Breakfast",      emoji: "🍳" },
  { key: "lunch",     label: "Lunch",          emoji: "🍛" },
  { key: "snack",     label: "Evening snack",  emoji: "🥤" },
  { key: "dinner",    label: "Dinner (light)", emoji: "🍲" },
];

const SLOTS = [
  { key: "wakeDrink",      group: "morning",   part: "drink",   label: "Drink",                 pool: "wake" },
  { key: "wakeNuts",       group: "morning",   part: "nuts",    label: "Nuts & dry fruit",    pool: "nuts" },
  { key: "breakfastEgg",   group: "breakfast", part: "egg",     label: "Eggs",                  pool: "eggs" },
  { key: "breakfastSide",  group: "breakfast", part: "bside",   label: "Gluten-free side",      pool: "bside" },
  { key: "breakfastCollagen", group: "breakfast", part: "collagen", label: "Protein with collagen", pool: "collagen" },
  { key: "breakfastFruit", group: "breakfast", part: "fruit",   label: "Fruit",                 pool: "fruit" },
  { key: "lunchDal",       group: "lunch",     part: "dal",     label: "Dal",                   pool: "dal" },
  { key: "lunchSabzi",     group: "lunch",     part: "sabzi",   label: "Sabzi",                 pool: "sabzi" },
  { key: "lunchSaag",      group: "lunch",     part: "saag",    label: "Saag / greens",         pool: "saag" },
  { key: "lunchSalad",     group: "lunch",     part: "salad",   label: "Salad",                 pool: "salad" },
  { key: "lunchDahi",      group: "lunch",     part: "dahi",    label: "Dahi / raita",          pool: "dahi" },
  { key: "lunchChutney",   group: "lunch",     part: "chutney", label: "Chutney",               pool: "chutney" },
  { key: "lunchStaple",    group: "lunch",     part: "staple",  label: "Roti / rice",           pool: "staple" },
  { key: "lunchSide",      group: "lunch",     part: "side",    label: "Grilled chicken / fish", pool: "side" },
  { key: "lunchChaas",     group: "lunch",     part: "chaas",   label: "Buttermilk (chaas) with flax", pool: "chaas" },
  { key: "lunchTea",       group: "lunch",     part: "tea",     label: "Tea",                   pool: "tea" },
  { key: "snack",          group: "snack",     part: "main",    label: "Snack",                 pool: "snack" },
  { key: "snackFruit",     group: "snack",     part: "fruit",   label: "Fruit",                 pool: "fruit" },
  { key: "dinnerSabzi",    group: "dinner", noLegumes: true,    part: "sabzi",   label: "Sabzi",                 pool: "sabzi" },
  { key: "dinnerSaag",     group: "dinner", noLegumes: true,    part: "saag",    label: "Saag / greens",         pool: "saag" },
  { key: "dinnerSalad",    group: "dinner", noLegumes: true,    part: "salad",   label: "Salad",                 pool: "salad" },
  { key: "dinnerDahi",     group: "dinner", noLegumes: true,    part: "dahi",    label: "Dahi / raita",          pool: "dahi" },
  { key: "dinnerChutney",  group: "dinner", noLegumes: true,    part: "chutney", label: "Chutney",               pool: "chutney" },
  { key: "dinnerStaple",   group: "dinner", noLegumes: true,    part: "staple",  label: "Roti / rice (smaller)", pool: "stapleLight" },
  { key: "dinnerSide",     group: "dinner", noLegumes: true,    part: "side",    label: "Grilled chicken / fish", pool: "side" },
  { key: "dinnerTea",      group: "dinner", noLegumes: true,    part: "tea",     label: "Tea",                   pool: "tea" },
];

// Used to stop one protein from showing up too often in a day.
const PROTEIN_GROUP = {
  "Paneer": "Paneer", "Eggs": "Eggs", "Egg whites": "Eggs", "Egg yolk": "Eggs",
  "Chicken breast (boneless)": "Chicken", "Chicken (curry cut, skinless)": "Chicken",
  "Chicken mince (keema)": "Chicken", "Fish (rohu / basa)": "Fish",
};

// Work out nutrition per serving for every dish once.
Object.values(RECIPES).flat().forEach((r) => {
  const n = { protein: 0, fibre: 0, fat: 0, goodFat: 0, kcal: 0 };
  r.ingredients.forEach((ing) => {
    const [, p, fi, fat, kcal, good, pieceG] = NUTRITION[ing.name];
    let grams = 0;
    if (ing.unit === "g" || ing.unit === "ml") grams = ing.qty;
    else if (ing.unit === "pcs" || ing.unit === "scoop") grams = ing.qty * (pieceG || 0);
    const f = grams / 100;
    n.protein += p * f;
    n.fibre += fi * f;
    n.fat += fat * f;
    n.kcal += kcal * f;
    if (good) n.goodFat += fat * f;
  });
  r.nutrition = n;
  r.goodFatSources = r.ingredients.filter((ing) => NUTRITION[ing.name][5]).map((ing) => ing.name);
  r.proteinGroups = Array.from(new Set(
    r.ingredients.map((ing) => PROTEIN_GROUP[ing.name]).filter(Boolean)));
});

// Rich sabzis, saags and sides (over 230 kcal) stay away from dinner too.
["sabzi", "saag", "side"].forEach((pool) => RECIPES[pool].forEach((r) => {
  if (r.nutrition.kcal > 230) r.heavy = true;
}));

// Months (1-12) when a fresh, seasonal food is at its best in India. A dish with
// one of these ingredients is only suggested in those months.
const SEASON = {
  "Raw mango": [3, 4, 5, 6, 7],
  "Jamun": [6, 7, 8],
  "Watermelon": [3, 4, 5, 6],
  "Muskmelon": [3, 4, 5, 6],
  "Plum (aloo bukhara)": [5, 6, 7, 8],
  "Peach": [5, 6, 7],
  "Amla (Indian gooseberry)": [10, 11, 12, 1, 2],
  "Mustard greens (sarson)": [11, 12, 1, 2, 3],
};
Object.values(RECIPES).flat().forEach((r) => {
  const lists = r.ingredients.map((ing) => SEASON[ing.name]).filter(Boolean);
  r.months = lists.length ? lists.reduce((a, b) => a.filter((m) => b.includes(m))) : null;
});
