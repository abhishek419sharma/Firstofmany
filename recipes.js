// Dish database for the meal planner.
//
// Quantities are PER PERSON and get multiplied by the number of people.
// Nutrition is calculated from the ingredients using NUTRITION below
// (values per 100 g of raw / dry weight, from standard food tables —
// estimates, not lab values). Cooking oil, salt and dry spices are not counted.
//
// diet: "veg" | "egg" | "nonveg"

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat, Fish & Eggs",
  "Pulses & Soya",
  "Grains & Flour",
  "Nuts & Seeds",
  "Bakery",
  "Spices & Masala",
  "Other",
];

// name: [category, protein g, fibre g, fat g, kcal, goodFat?, grams per piece]
// All per 100 g. "goodFat" marks sources of mostly unsaturated fat.
const NUTRITION = {
  // Pulses & soya
  "Moong dal":          ["Pulses & Soya", 24.5, 8.2, 1.2, 348],
  "Toor dal":           ["Pulses & Soya", 22.3, 15, 1.7, 343],
  "Masoor dal":         ["Pulses & Soya", 24.6, 10.8, 1.1, 352],
  "Rajma":              ["Pulses & Soya", 22.5, 15.2, 1.1, 333],
  "Kabuli chana":       ["Pulses & Soya", 20.5, 12.2, 6, 378],
  "Kala chana":         ["Pulses & Soya", 20, 17, 5, 360],
  "Roasted chana":      ["Pulses & Soya", 22, 15, 5, 370],
  "Sattu":              ["Pulses & Soya", 22, 15, 5.5, 380],
  "Soya chunks":        ["Pulses & Soya", 52, 13, 0.5, 345],
  "Tofu (firm)":        ["Pulses & Soya", 17.3, 2.3, 8.7, 144],
  "Besan":              ["Grains & Flour", 22, 10.8, 6.7, 387],
  // Dairy
  "Paneer":             ["Dairy", 18, 0, 20, 265],
  "Hung curd / Greek yogurt": ["Dairy", 10, 0, 4, 100],
  "Milk (toned)":       ["Dairy", 3.3, 0, 3, 58],
  // Meat, fish & eggs
  "Eggs":               ["Meat, Fish & Eggs", 12.6, 0, 9.5, 143, false, 50],
  "Chicken breast (boneless)": ["Meat, Fish & Eggs", 23, 0, 2.6, 120],
  "Chicken (curry cut, skinless)": ["Meat, Fish & Eggs", 20, 0, 5, 140],
  "Chicken mince":      ["Meat, Fish & Eggs", 20, 0, 6, 143],
  "Fish (rohu / basa)": ["Meat, Fish & Eggs", 19, 0, 3, 110, true],
  // Grains & bakery
  "Multigrain atta":    ["Grains & Flour", 12, 10, 2, 340],
  "Brown rice":         ["Grains & Flour", 7.5, 3.5, 2.7, 362],
  "Quinoa":             ["Grains & Flour", 14, 7, 6, 368],
  "Oats":               ["Grains & Flour", 13.2, 10, 6.5, 379],
  "Poha":               ["Grains & Flour", 6.6, 2, 1.2, 346],
  "Multigrain bread":   ["Bakery", 13, 7, 4, 265, false, 30],
  // Vegetables
  "Onion":              ["Vegetables", 1.1, 1.7, 0.1, 40],
  "Tomato":             ["Vegetables", 0.9, 1.2, 0.2, 18],
  "Cucumber":           ["Vegetables", 0.7, 0.5, 0.1, 15],
  "Carrot":             ["Vegetables", 0.9, 2.8, 0.2, 41],
  "Spinach (palak)":    ["Vegetables", 2.9, 2.2, 0.4, 23],
  "Capsicum":           ["Vegetables", 1, 2.1, 0.3, 26],
  "Broccoli":           ["Vegetables", 2.8, 2.6, 0.4, 34],
  "Mushrooms":          ["Vegetables", 3.1, 1, 0.3, 22],
  "Green peas":         ["Vegetables", 5.4, 5.7, 0.4, 81],
  "Beetroot":           ["Vegetables", 1.6, 2.8, 0.2, 43],
  "Lettuce":            ["Vegetables", 1.4, 1.3, 0.2, 15],
  "French beans":       ["Vegetables", 1.8, 2.7, 0.2, 31],
  "Moong sprouts":      ["Vegetables", 3, 1.8, 0.2, 30],
  "Coconut (fresh)":    ["Vegetables", 3.3, 9, 33, 354],
  "Ginger":             ["Vegetables", 0, 0, 0, 0],
  "Garlic":             ["Vegetables", 0, 0, 0, 0],
  "Green chilli":       ["Vegetables", 0, 0, 0, 0, false, 5],
  "Lemon":              ["Vegetables", 0, 0, 0, 0, false, 60],
  "Coriander":          ["Vegetables", 0, 0, 0, 0],
  "Mint":               ["Vegetables", 0, 0, 0, 0],
  "Curry leaves":       ["Vegetables", 0, 0, 0, 0],
  // Fruits
  "Apple":              ["Fruits", 0.3, 2.4, 0.2, 52],
  "Guava":              ["Fruits", 2.6, 5.4, 1, 68],
  "Pomegranate":        ["Fruits", 1.7, 4, 1.2, 83],
  "Avocado":            ["Fruits", 2, 6.7, 14.7, 160, true],
  // Nuts, seeds & oils (good fats)
  "Almonds":            ["Nuts & Seeds", 21, 12.5, 50, 579, true],
  "Walnuts":            ["Nuts & Seeds", 15, 6.7, 65, 654, true],
  "Peanuts":            ["Nuts & Seeds", 26, 8.5, 49, 567, true],
  "Chia seeds":         ["Nuts & Seeds", 17, 34, 31, 486, true],
  "Flax seeds":         ["Nuts & Seeds", 18, 27, 42, 534, true],
  "Pumpkin seeds":      ["Nuts & Seeds", 30, 6, 49, 559, true],
  "Peanut butter (unsweetened)": ["Nuts & Seeds", 25, 6, 50, 588, true],
  "Olive oil":          ["Other", 0, 0, 100, 884, true],
  "Whey protein":       ["Other", 80, 0, 5, 400],
  // Masalas & sauces (bought as packs, nutrition negligible)
  "Chole masala":       ["Spices & Masala", 0, 0, 0, 0],
  "Chicken masala":     ["Spices & Masala", 0, 0, 0, 0],
  "Biryani masala":     ["Spices & Masala", 0, 0, 0, 0],
  "Chaat masala":       ["Spices & Masala", 0, 0, 0, 0],
  "Tandoori masala":    ["Spices & Masala", 0, 0, 0, 0],
  "Soy sauce":          ["Spices & Masala", 0, 0, 0, 0],
};

// i(name, qty, unit) — unit: g, ml, pcs, slice, bunch, pack
function i(name, qty, unit = "g") {
  if (!NUTRITION[name]) throw new Error("Missing nutrition data for " + name);
  return { name, qty, unit };
}

// Common bits
const herbs = () => [i("Coriander", 0.25, "bunch"), i("Green chilli", 1, "pcs")];

const RECIPES = {
  breakfast: [
    { id: "oats-whey", name: "Overnight Oats with Whey, Chia & Almonds", diet: "veg", ingredients: [
      i("Oats", 50), i("Milk (toned)", 200, "ml"), i("Whey protein", 30), i("Chia seeds", 10),
      i("Almonds", 10), i("Apple", 100)] },
    { id: "moong-chilla", name: "Moong Dal Chilla with Paneer & Hung Curd", diet: "veg", ingredients: [
      i("Moong dal", 70), i("Paneer", 60), i("Hung curd / Greek yogurt", 100), i("Onion", 30),
      i("Tomato", 30), i("Spinach (palak)", 30), i("Ginger", 5), ...herbs()] },
    { id: "besan-chilla", name: "Besan Chilla with Flax & Greek Yogurt", diet: "veg", ingredients: [
      i("Besan", 70), i("Hung curd / Greek yogurt", 150), i("Onion", 30), i("Tomato", 40),
      i("Spinach (palak)", 30), i("Flax seeds", 10), ...herbs()] },
    { id: "sattu-paratha", name: "Sattu Paratha with Hung Curd", diet: "veg", ingredients: [
      i("Sattu", 50), i("Multigrain atta", 60), i("Hung curd / Greek yogurt", 150), i("Onion", 30),
      i("Lemon", 0.5, "pcs"), ...herbs()] },
    { id: "paneer-bhurji", name: "Paneer Bhurji & Multigrain Toast", diet: "veg", ingredients: [
      i("Paneer", 100), i("Multigrain bread", 2, "slice"), i("Onion", 40), i("Tomato", 50),
      i("Capsicum", 50), i("Pumpkin seeds", 10), ...herbs()] },
    { id: "soya-poha", name: "Soya Poha with Peanuts & Curd", diet: "veg", ingredients: [
      i("Poha", 50), i("Soya chunks", 30), i("Peanuts", 15), i("Onion", 40), i("Green peas", 30),
      i("Hung curd / Greek yogurt", 100), i("Lemon", 0.5, "pcs"), i("Curry leaves", 0.25, "bunch")] },
    { id: "tofu-toast", name: "Tofu Bhurji & Multigrain Toast", diet: "veg", ingredients: [
      i("Tofu (firm)", 150), i("Multigrain bread", 2, "slice"), i("Capsicum", 50), i("Onion", 30),
      i("Tomato", 30), ...herbs()] },
    { id: "omelette-avocado", name: "Masala Omelette, Toast & Avocado", diet: "egg", ingredients: [
      i("Eggs", 4, "pcs"), i("Multigrain bread", 2, "slice"), i("Avocado", 50), i("Onion", 30),
      i("Tomato", 30), ...herbs()] },
    { id: "egg-sprouts", name: "Egg Bhurji with Sprouts & Toast", diet: "egg", ingredients: [
      i("Eggs", 4, "pcs"), i("Moong sprouts", 100), i("Multigrain bread", 2, "slice"), i("Onion", 30),
      i("Tomato", 30)] },
    { id: "chicken-wrap", name: "Chicken & Egg Wrap", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 100), i("Eggs", 2, "pcs"), i("Multigrain atta", 50),
      i("Lettuce", 30), i("Onion", 30), i("Hung curd / Greek yogurt", 50)] },
  ],

  lunch: [
    { id: "rajma", name: "Rajma, Brown Rice & Hung Curd", diet: "veg", ingredients: [
      i("Rajma", 70), i("Brown rice", 60), i("Hung curd / Greek yogurt", 150), i("Onion", 50),
      i("Tomato", 80), i("Ginger", 5), i("Garlic", 5)] },
    { id: "chole", name: "Chole, Multigrain Roti & Raita", diet: "veg", ingredients: [
      i("Kabuli chana", 70), i("Multigrain atta", 70), i("Hung curd / Greek yogurt", 150),
      i("Onion", 50), i("Tomato", 80), i("Cucumber", 50), i("Chole masala", 1, "pack")] },
    { id: "palak-paneer", name: "Palak Paneer & Multigrain Roti", diet: "veg", ingredients: [
      i("Paneer", 125), i("Spinach (palak)", 150), i("Multigrain atta", 70), i("Onion", 40),
      i("Tomato", 50), i("Garlic", 5)] },
    { id: "soya-keema", name: "Soya Keema Matar & Multigrain Roti", diet: "veg", ingredients: [
      i("Soya chunks", 50), i("Green peas", 60), i("Multigrain atta", 70), i("Onion", 50),
      i("Tomato", 80), i("Ginger", 5), i("Garlic", 5)] },
    { id: "dal-paneer-tikka", name: "Dal Tadka, Paneer Tikka & Brown Rice", diet: "veg", ingredients: [
      i("Toor dal", 50), i("Paneer", 80), i("Brown rice", 50), i("Capsicum", 50), i("Onion", 50),
      i("Tomato", 50), i("Hung curd / Greek yogurt", 30), i("Tandoori masala", 1, "pack")] },
    { id: "tofu-quinoa", name: "Tofu Veg Stir-fry & Quinoa", diet: "veg", ingredients: [
      i("Tofu (firm)", 180), i("Quinoa", 60), i("Broccoli", 100), i("Capsicum", 50), i("Carrot", 50),
      i("Garlic", 5), i("Soy sauce", 1, "pack")] },
    { id: "egg-curry", name: "Egg Curry & Multigrain Roti", diet: "egg", ingredients: [
      i("Eggs", 4, "pcs"), i("Multigrain atta", 70), i("Onion", 60), i("Tomato", 80),
      i("Hung curd / Greek yogurt", 50), i("Ginger", 5), i("Garlic", 5)] },
    { id: "chicken-curry", name: "Chicken Curry & Brown Rice", diet: "nonveg", ingredients: [
      i("Chicken (curry cut, skinless)", 200), i("Brown rice", 60), i("Onion", 60), i("Tomato", 80),
      i("Hung curd / Greek yogurt", 50), i("Ginger", 5), i("Garlic", 5), i("Chicken masala", 1, "pack")] },
    { id: "fish-curry", name: "Fish Curry & Brown Rice", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 200), i("Brown rice", 60), i("Coconut (fresh)", 20), i("Tomato", 80),
      i("Onion", 50), i("Curry leaves", 0.25, "bunch")] },
    { id: "chicken-biryani", name: "Chicken Brown-Rice Biryani & Raita", diet: "nonveg", ingredients: [
      i("Chicken (curry cut, skinless)", 200), i("Brown rice", 70), i("Onion", 60),
      i("Hung curd / Greek yogurt", 150), i("Cucumber", 50), i("Mint", 0.25, "bunch"),
      i("Biryani masala", 1, "pack")] },
  ],

  snack: [
    { id: "whey-apple", name: "Whey Shake & Apple", diet: "veg", ingredients: [
      i("Whey protein", 30), i("Milk (toned)", 250, "ml"), i("Apple", 150)] },
    { id: "chana-curd", name: "Roasted Chana, Almonds & Hung Curd", diet: "veg", ingredients: [
      i("Roasted chana", 40), i("Almonds", 10), i("Hung curd / Greek yogurt", 150)] },
    { id: "yogurt-guava", name: "Greek Yogurt with Guava, Chia & Walnuts", diet: "veg", ingredients: [
      i("Hung curd / Greek yogurt", 200), i("Guava", 150), i("Chia seeds", 10), i("Walnuts", 10)] },
    { id: "sattu-shake", name: "Sattu Shake & Peanuts", diet: "veg", ingredients: [
      i("Sattu", 40), i("Milk (toned)", 250, "ml"), i("Peanuts", 15)] },
    { id: "soya-tikka", name: "Soya Chunk Tikka", diet: "veg", ingredients: [
      i("Soya chunks", 40), i("Hung curd / Greek yogurt", 50), i("Capsicum", 50), i("Onion", 30),
      i("Tandoori masala", 1, "pack")] },
    { id: "pb-toast", name: "Peanut Butter Toast & Milk", diet: "veg", ingredients: [
      i("Multigrain bread", 2, "slice"), i("Peanut butter (unsweetened)", 20), i("Milk (toned)", 250, "ml")] },
    { id: "eggs-guava", name: "Boiled Eggs & Guava", diet: "egg", ingredients: [
      i("Eggs", 3, "pcs"), i("Guava", 150)] },
    { id: "chicken-tikka", name: "Chicken Tikka Bites", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 150), i("Hung curd / Greek yogurt", 50), i("Lemon", 0.5, "pcs"),
      i("Mint", 0.25, "bunch"), i("Tandoori masala", 1, "pack")] },
  ],

  dinner: [
    { id: "grilled-chicken", name: "Grilled Chicken & Sautéed Veggies", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 200), i("Broccoli", 100), i("Mushrooms", 100), i("Capsicum", 50),
      i("Olive oil", 10), i("Garlic", 5)] },
    { id: "paneer-tikka-soup", name: "Paneer Tikka & Moong Dal Soup", diet: "veg", ingredients: [
      i("Paneer", 125), i("Moong dal", 40), i("Hung curd / Greek yogurt", 50), i("Capsicum", 50),
      i("Onion", 50), i("Tomato", 50), i("Tandoori masala", 1, "pack")] },
    { id: "tofu-palak", name: "Tofu Palak & Multigrain Roti", diet: "veg", ingredients: [
      i("Tofu (firm)", 180), i("Spinach (palak)", 150), i("Multigrain atta", 50), i("Onion", 40),
      i("Garlic", 5)] },
    { id: "soya-khichdi", name: "Moong Khichdi with Soya & Curd", diet: "veg", ingredients: [
      i("Moong dal", 50), i("Brown rice", 40), i("Soya chunks", 25), i("Green peas", 40),
      i("Hung curd / Greek yogurt", 150), i("Tomato", 40)] },
    { id: "matar-paneer", name: "Matar Paneer, Roti & Raita", diet: "veg", ingredients: [
      i("Paneer", 100), i("Green peas", 80), i("Multigrain atta", 60), i("Onion", 50), i("Tomato", 80),
      i("Hung curd / Greek yogurt", 100)] },
    { id: "soya-pulao", name: "Soya Veg Pulao & Raita", diet: "veg", ingredients: [
      i("Soya chunks", 40), i("Brown rice", 50), i("Carrot", 50), i("French beans", 50),
      i("Green peas", 40), i("Hung curd / Greek yogurt", 150)] },
    { id: "egg-dal", name: "Egg Bhurji, Masoor Dal & Roti", diet: "egg", ingredients: [
      i("Eggs", 3, "pcs"), i("Masoor dal", 40), i("Multigrain atta", 50), i("Onion", 50), i("Tomato", 60)] },
    { id: "fish-tikka", name: "Fish Tikka & Quinoa", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 200), i("Quinoa", 50), i("Hung curd / Greek yogurt", 50),
      i("Lemon", 1, "pcs"), i("Onion", 30), i("Tandoori masala", 1, "pack")] },
    { id: "chicken-keema", name: "Chicken Keema Matar & Roti", diet: "nonveg", ingredients: [
      i("Chicken mince", 180), i("Green peas", 60), i("Multigrain atta", 50), i("Onion", 50),
      i("Tomato", 80), i("Ginger", 5), i("Garlic", 5)] },
  ],

  salad: [
    { id: "sprouts-chaat", name: "Sprouts & Kala Chana Chaat", diet: "veg", ingredients: [
      i("Moong sprouts", 100), i("Kala chana", 30), i("Cucumber", 80), i("Tomato", 60), i("Onion", 30),
      i("Pomegranate", 40), i("Flax seeds", 10), i("Lemon", 0.5, "pcs"), i("Chaat masala", 1, "pack")] },
    { id: "chickpea-paneer", name: "Chickpea, Cucumber & Paneer Salad", diet: "veg", ingredients: [
      i("Kabuli chana", 35), i("Paneer", 40), i("Cucumber", 100), i("Tomato", 60), i("Onion", 30),
      i("Lettuce", 40), i("Olive oil", 5), i("Lemon", 0.5, "pcs")] },
    { id: "quinoa-salad", name: "Quinoa, Veg & Pumpkin Seed Salad", diet: "veg", ingredients: [
      i("Quinoa", 35), i("Cucumber", 80), i("Capsicum", 50), i("Carrot", 50), i("Pumpkin seeds", 15),
      i("Olive oil", 5), i("Lemon", 0.5, "pcs")] },
    { id: "peanut-kachumber", name: "Peanut Kachumber with Sprouts", diet: "veg", ingredients: [
      i("Cucumber", 100), i("Tomato", 80), i("Onion", 40), i("Carrot", 50), i("Peanuts", 20),
      i("Moong sprouts", 80), i("Lemon", 0.5, "pcs")] },
    { id: "beet-paneer", name: "Beetroot, Paneer & Walnut Salad", diet: "veg", ingredients: [
      i("Beetroot", 100), i("Paneer", 50), i("Lettuce", 40), i("Walnuts", 15), i("Lemon", 0.5, "pcs")] },
    { id: "broccoli-chana", name: "Broccoli, Chana & Almond Salad", diet: "veg", ingredients: [
      i("Broccoli", 100), i("Kabuli chana", 30), i("Almonds", 10), i("Onion", 30), i("Olive oil", 5),
      i("Lemon", 0.5, "pcs")] },
    { id: "egg-avocado", name: "Egg & Avocado Salad", diet: "egg", ingredients: [
      i("Eggs", 2, "pcs"), i("Avocado", 50), i("Lettuce", 60), i("Cucumber", 60), i("Tomato", 60)] },
    { id: "chicken-avocado", name: "Grilled Chicken & Avocado Salad", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 100), i("Avocado", 50), i("Lettuce", 60), i("Cucumber", 60),
      i("Tomato", 60), i("Olive oil", 5)] },
  ],
};

// The day's slots, in serving order. "pool" says which list a slot picks from.
const SLOTS = [
  { key: "breakfast",   label: "Breakfast",         pool: "breakfast", emoji: "🍳" },
  { key: "lunch",       label: "Lunch",             pool: "lunch",     emoji: "🍛" },
  { key: "lunchSalad",  label: "Salad with lunch",  pool: "salad",     emoji: "🥗" },
  { key: "snack",       label: "Evening snack",     pool: "snack",     emoji: "🥤" },
  { key: "dinner",      label: "Dinner",            pool: "dinner",    emoji: "🍲" },
  { key: "dinnerSalad", label: "Salad with dinner", pool: "salad",     emoji: "🥗" },
];

// Ingredients that make a dish's main protein; the planner avoids having
// the same one at lunch and dinner.
const MAIN_PROTEINS = ["Paneer", "Soya chunks", "Tofu (firm)", "Eggs", "Chicken breast (boneless)",
  "Chicken (curry cut, skinless)", "Chicken mince", "Fish (rohu / basa)", "Whey protein"];

// Work out nutrition per serving for every dish once.
Object.values(RECIPES).flat().forEach((r) => {
  const n = { protein: 0, fibre: 0, fat: 0, goodFat: 0, kcal: 0 };
  r.ingredients.forEach((ing) => {
    const [, p, fi, fat, kcal, good, pieceG] = NUTRITION[ing.name];
    let grams = 0;
    if (ing.unit === "g" || ing.unit === "ml") grams = ing.qty;
    else if (ing.unit === "pcs" || ing.unit === "slice") grams = ing.qty * (pieceG || 0);
    const f = grams / 100;
    n.protein += p * f;
    n.fibre += fi * f;
    n.fat += fat * f;
    n.kcal += kcal * f;
    if (good) n.goodFat += fat * f;
  });
  r.nutrition = n;
  r.goodFatSources = r.ingredients.filter((ing) => NUTRITION[ing.name][5]).map((ing) => ing.name);
  r.mainProteins = r.ingredients.filter((ing) => MAIN_PROTEINS.includes(ing.name)).map((ing) => ing.name);
  r.usesWhey = r.ingredients.some((ing) => ing.name === "Whey protein");
});
