// Dish database for the meal planner. All dishes are Indian home-style food.
// No maida anywhere: rotis and parathas use whole-wheat / multigrain atta,
// besan, jowar or sattu.
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
  "Pulses & Soya",
  "Grains & Flour",
  "Nuts & Seeds",
  "Spices & Masala",
  "Other",
];

// name: [category, protein g, fibre g, fat g, kcal, goodFat?, grams per piece]
// All per 100 g. "goodFat" marks sources of mostly unsaturated fat
// (nuts, seeds, fish).
const NUTRITION = {
  // Pulses & soya
  "Moong dal":          ["Pulses & Soya", 24.5, 8.2, 1.2, 348],
  "Toor dal":           ["Pulses & Soya", 22.3, 15, 1.7, 343],
  "Masoor dal":         ["Pulses & Soya", 24.6, 10.8, 1.1, 352],
  "Chana dal":          ["Pulses & Soya", 21, 10, 5, 370],
  "Rajma":              ["Pulses & Soya", 22.5, 15.2, 1.1, 333],
  "Kabuli chana":       ["Pulses & Soya", 20.5, 12.2, 6, 378],
  "Kala chana":         ["Pulses & Soya", 20, 17, 5, 360],
  "Roasted chana":      ["Pulses & Soya", 22, 15, 5, 370],
  "Sattu":              ["Pulses & Soya", 22, 15, 5.5, 380],
  "Soya chunks":        ["Pulses & Soya", 52, 13, 0.5, 345],
  "Besan":              ["Grains & Flour", 22, 10.8, 6.7, 387],
  // Dairy
  "Paneer":             ["Dairy", 18, 0, 20, 265],
  "Dahi (curd)":        ["Dairy", 3.5, 0, 4, 61],
  "Hung curd (chakka)": ["Dairy", 10, 0, 4, 100],
  "Milk (toned)":       ["Dairy", 3.3, 0, 3, 58],
  // Meat, fish & eggs
  "Eggs":               ["Meat, Fish & Eggs", 12.6, 0, 9.5, 143, false, 50],
  "Chicken breast (boneless)": ["Meat, Fish & Eggs", 23, 0, 2.6, 120],
  "Chicken (curry cut, skinless)": ["Meat, Fish & Eggs", 20, 0, 5, 140],
  "Chicken mince (keema)": ["Meat, Fish & Eggs", 20, 0, 6, 143],
  "Fish (rohu / basa)": ["Meat, Fish & Eggs", 19, 0, 3, 110, true],
  // Grains
  "Multigrain atta":    ["Grains & Flour", 12, 10, 2, 340],
  "Jowar atta":         ["Grains & Flour", 10.4, 9.7, 1.9, 349],
  "Brown rice":         ["Grains & Flour", 7.5, 3.5, 2.7, 362],
  "Daliya (broken wheat)": ["Grains & Flour", 11.5, 12.5, 1.5, 342],
  "Poha":               ["Grains & Flour", 6.6, 2, 1.2, 346],
  // Vegetables
  "Onion":              ["Vegetables", 1.1, 1.7, 0.1, 40],
  "Tomato":             ["Vegetables", 0.9, 1.2, 0.2, 18],
  "Cucumber":           ["Vegetables", 0.7, 0.5, 0.1, 15],
  "Carrot":             ["Vegetables", 0.9, 2.8, 0.2, 41],
  "Spinach (palak)":    ["Vegetables", 2.9, 2.2, 0.4, 23],
  "Methi leaves":       ["Vegetables", 4.4, 4.9, 0.9, 49],
  "Capsicum":           ["Vegetables", 1, 2.1, 0.3, 26],
  "Cabbage":            ["Vegetables", 1.3, 2.5, 0.1, 25],
  "Bottle gourd (lauki)": ["Vegetables", 0.6, 0.5, 0.1, 14],
  "Cauliflower":        ["Vegetables", 1.9, 2, 0.3, 25],
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
  // Fruits
  "Guava":              ["Fruits", 2.6, 5.4, 1, 68],
  "Pomegranate":        ["Fruits", 1.7, 4, 1.2, 83],
  // Nuts & seeds (good fats)
  "Almonds":            ["Nuts & Seeds", 21, 12.5, 50, 579, true],
  "Walnuts":            ["Nuts & Seeds", 15, 6.7, 65, 654, true],
  "Peanuts":            ["Nuts & Seeds", 26, 8.5, 49, 567, true],
  "Flax seeds (alsi)":  ["Nuts & Seeds", 18, 27, 42, 534, true],
  "Pumpkin seeds":      ["Nuts & Seeds", 30, 6, 49, 559, true],
  "Sesame seeds (til)": ["Nuts & Seeds", 18, 11.8, 50, 573, true],
  // Masalas (bought as packs, nutrition negligible)
  "Chole masala":       ["Spices & Masala", 0, 0, 0, 0],
  "Chicken masala":     ["Spices & Masala", 0, 0, 0, 0],
  "Biryani masala":     ["Spices & Masala", 0, 0, 0, 0],
  "Chaat masala":       ["Spices & Masala", 0, 0, 0, 0],
  "Tandoori masala":    ["Spices & Masala", 0, 0, 0, 0],
  "Sambar masala":      ["Spices & Masala", 0, 0, 0, 0],
};

// i(name, qty, unit) — unit: g, ml, pcs, bunch, pack
function i(name, qty, unit = "g") {
  if (!NUTRITION[name]) throw new Error("Missing nutrition data for " + name);
  return { name, qty, unit };
}

// Common bits
const herbs = () => [i("Coriander", 0.25, "bunch"), i("Green chilli", 1, "pcs")];

const RECIPES = {
  breakfast: [
    { id: "moong-chilla", name: "Moong Dal Chilla stuffed with Paneer, Pudina Chutney", diet: "veg", ingredients: [
      i("Moong dal", 70), i("Paneer", 60), i("Onion", 30), i("Tomato", 30), i("Spinach (palak)", 30),
      i("Ginger", 5), i("Mint (pudina)", 0.25, "bunch"), ...herbs()] },
    { id: "besan-chilla", name: "Besan Chilla with Palak, Alsi & Hung Curd", diet: "veg", ingredients: [
      i("Besan", 70), i("Hung curd (chakka)", 100), i("Spinach (palak)", 40), i("Onion", 30),
      i("Tomato", 40), i("Flax seeds (alsi)", 10), ...herbs()] },
    { id: "sattu-paratha", name: "Sattu Paratha with Hung Curd", diet: "veg", ingredients: [
      i("Sattu", 50), i("Multigrain atta", 60), i("Hung curd (chakka)", 150), i("Onion", 30),
      i("Lemon", 0.5, "pcs"), ...herbs()] },
    { id: "paneer-bhurji", name: "Paneer Bhurji with Multigrain Roti & Almonds", diet: "veg", ingredients: [
      i("Paneer", 100), i("Multigrain atta", 60), i("Almonds", 10), i("Onion", 40), i("Tomato", 50),
      i("Capsicum", 50), ...herbs()] },
    { id: "soya-poha", name: "Soya Poha with Peanuts & Hung Curd", diet: "veg", ingredients: [
      i("Poha", 50), i("Soya chunks", 30), i("Peanuts", 15), i("Onion", 40), i("Green peas", 30),
      i("Hung curd (chakka)", 100), i("Lemon", 0.5, "pcs"), i("Curry leaves", 0.25, "bunch")] },
    { id: "daliya-upma", name: "Vegetable Daliya Upma with Soya, Peanuts & Hung Curd", diet: "veg", ingredients: [
      i("Daliya (broken wheat)", 60), i("Soya chunks", 20), i("Moong dal", 20), i("Peanuts", 10),
      i("Carrot", 40), i("Green peas", 40), i("Onion", 30), i("Hung curd (chakka)", 100),
      i("Curry leaves", 0.25, "bunch"), i("Green chilli", 1, "pcs")] },
    { id: "moong-dosa", name: "Moong Dal Dosa with Sambar & Coconut-Chana Chutney", diet: "veg", ingredients: [
      i("Moong dal", 80), i("Toor dal", 40), i("Roasted chana", 15), i("Coconut (fresh)", 15),
      i("Carrot", 40), i("Tomato", 40), i("Onion", 30), i("Sambar masala", 1, "pack"),
      i("Curry leaves", 0.25, "bunch")] },
    { id: "masala-omelette", name: "Masala Omelette with Methi Paratha", diet: "egg", ingredients: [
      i("Eggs", 4, "pcs"), i("Multigrain atta", 60), i("Methi leaves", 30), i("Onion", 30),
      i("Tomato", 30), ...herbs()] },
    { id: "anda-bhurji", name: "Anda Bhurji with Multigrain Roti", diet: "egg", ingredients: [
      i("Eggs", 4, "pcs"), i("Multigrain atta", 60), i("Onion", 40), i("Tomato", 50),
      i("Capsicum", 30), ...herbs()] },
    { id: "keema-paratha", name: "Chicken Keema Paratha with Dahi", diet: "nonveg", ingredients: [
      i("Chicken mince (keema)", 120), i("Multigrain atta", 70), i("Dahi (curd)", 100), i("Onion", 30),
      ...herbs()] },
  ],

  lunch: [
    { id: "rajma-rice", name: "Rajma Chawal (Brown Rice)", diet: "veg", ingredients: [
      i("Rajma", 100), i("Brown rice", 60), i("Onion", 50), i("Tomato", 80), i("Ginger", 5), i("Garlic", 5)] },
    { id: "chole-roti", name: "Chole with Multigrain Roti", diet: "veg", ingredients: [
      i("Kabuli chana", 100), i("Multigrain atta", 60), i("Onion", 50), i("Tomato", 80),
      i("Chole masala", 1, "pack"), i("Ginger", 5), i("Garlic", 5)] },
    { id: "palak-paneer", name: "Palak Paneer with Multigrain Roti", diet: "veg", ingredients: [
      i("Paneer", 125), i("Spinach (palak)", 150), i("Multigrain atta", 60), i("Onion", 40),
      i("Tomato", 50), i("Garlic", 5)] },
    { id: "soya-keema", name: "Soya Keema Matar with Multigrain Roti", diet: "veg", ingredients: [
      i("Soya chunks", 50), i("Green peas", 60), i("Multigrain atta", 60), i("Onion", 50),
      i("Tomato", 80), i("Ginger", 5), i("Garlic", 5)] },
    { id: "dal-paneer-tikka", name: "Dal Tadka, Paneer Tikka & Brown Rice", diet: "veg", ingredients: [
      i("Toor dal", 50), i("Paneer", 80), i("Brown rice", 50), i("Hung curd (chakka)", 30),
      i("Capsicum", 50), i("Onion", 50), i("Tomato", 50), i("Tandoori masala", 1, "pack")] },
    { id: "kala-chana-jowar", name: "Kala Chana Curry with Jowar Roti", diet: "veg", ingredients: [
      i("Kala chana", 100), i("Jowar atta", 60), i("Onion", 50), i("Tomato", 80), i("Ginger", 5),
      i("Garlic", 5)] },
    { id: "dal-palak-soya", name: "Dal Palak & Soya Chunk Sabzi with Roti", diet: "veg", ingredients: [
      i("Toor dal", 40), i("Soya chunks", 40), i("Spinach (palak)", 100), i("Multigrain atta", 50),
      i("Onion", 40), i("Tomato", 50), i("Garlic", 5)] },
    { id: "egg-curry", name: "Egg Curry with Multigrain Roti", diet: "egg", ingredients: [
      i("Eggs", 4, "pcs"), i("Multigrain atta", 60), i("Onion", 60), i("Tomato", 80), i("Ginger", 5),
      i("Garlic", 5)] },
    { id: "chicken-curry", name: "Chicken Curry with Brown Rice", diet: "nonveg", ingredients: [
      i("Chicken (curry cut, skinless)", 200), i("Brown rice", 60), i("Onion", 60), i("Tomato", 80),
      i("Ginger", 5), i("Garlic", 5), i("Chicken masala", 1, "pack")] },
    { id: "fish-curry", name: "Fish Curry (Coconut) with Brown Rice", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 200), i("Brown rice", 60), i("Coconut (fresh)", 20), i("Tomato", 80),
      i("Onion", 50), i("Curry leaves", 0.25, "bunch")] },
    { id: "chicken-biryani", name: "Chicken Brown-Rice Biryani", diet: "nonveg", ingredients: [
      i("Chicken (curry cut, skinless)", 200), i("Brown rice", 70), i("Onion", 60),
      i("Mint (pudina)", 0.25, "bunch"), i("Biryani masala", 1, "pack")] },
  ],

  snack: [
    { id: "chana-lassi", name: "Roasted Chana, Almonds & Thick Salted Lassi", diet: "veg", ingredients: [
      i("Roasted chana", 40), i("Almonds", 10), i("Hung curd (chakka)", 150)] },
    { id: "sattu-sharbat", name: "Sattu Sharbat with Milk & Peanuts", diet: "veg", ingredients: [
      i("Sattu", 40), i("Milk (toned)", 250, "ml"), i("Peanuts", 15)] },
    { id: "soya-tikka", name: "Soya Chunk Tikka", diet: "veg", ingredients: [
      i("Soya chunks", 40), i("Hung curd (chakka)", 50), i("Capsicum", 50), i("Onion", 30),
      i("Tandoori masala", 1, "pack")] },
    { id: "paneer-tikka", name: "Paneer Tikka with Pudina Chutney", diet: "veg", ingredients: [
      i("Paneer", 120), i("Hung curd (chakka)", 40), i("Capsicum", 60), i("Onion", 30),
      i("Mint (pudina)", 0.25, "bunch"), i("Tandoori masala", 1, "pack")] },
    { id: "sprouts-paneer-chaat", name: "Sprouts, Kala Chana & Paneer Chaat with Peanuts", diet: "veg", ingredients: [
      i("Moong sprouts", 100), i("Kala chana", 30), i("Paneer", 60), i("Peanuts", 15), i("Onion", 30),
      i("Tomato", 40), i("Lemon", 0.5, "pcs"), i("Chaat masala", 1, "pack")] },
    { id: "egg-chaat", name: "Boiled Egg Chaat & Guava", diet: "egg", ingredients: [
      i("Eggs", 3, "pcs"), i("Guava", 150), i("Onion", 20), i("Chaat masala", 1, "pack")] },
    { id: "chicken-tikka", name: "Chicken Tikka with Pudina Chutney", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 150), i("Hung curd (chakka)", 50), i("Lemon", 0.5, "pcs"),
      i("Mint (pudina)", 0.25, "bunch"), i("Tandoori masala", 1, "pack")] },
  ],

  dinner: [
    { id: "paneer-tikka-dal", name: "Paneer Tikka with Moong Dal Tadka", diet: "veg", ingredients: [
      i("Paneer", 125), i("Moong dal", 50), i("Hung curd (chakka)", 50), i("Capsicum", 50), i("Onion", 50),
      i("Tomato", 50), i("Tandoori masala", 1, "pack")] },
    { id: "moong-khichdi", name: "Moong Dal Khichdi with Soya & Vegetables", diet: "veg", ingredients: [
      i("Moong dal", 50), i("Brown rice", 40), i("Soya chunks", 25), i("Green peas", 40),
      i("Carrot", 40), i("Tomato", 40)] },
    { id: "matar-paneer", name: "Matar Paneer with Multigrain Roti", diet: "veg", ingredients: [
      i("Paneer", 100), i("Green peas", 80), i("Multigrain atta", 60), i("Onion", 50), i("Tomato", 80)] },
    { id: "soya-pulao", name: "Soya Veg Pulao (Brown Rice)", diet: "veg", ingredients: [
      i("Soya chunks", 40), i("Brown rice", 50), i("Carrot", 50), i("French beans", 50),
      i("Green peas", 40)] },
    { id: "egg-dal", name: "Egg Bhurji, Masoor Dal & Roti", diet: "egg", ingredients: [
      i("Eggs", 3, "pcs"), i("Masoor dal", 40), i("Multigrain atta", 50), i("Onion", 50), i("Tomato", 60)] },
    { id: "tandoori-chicken", name: "Tandoori Chicken, Roti & Mixed Veg Sabzi", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 200), i("Hung curd (chakka)", 40), i("Multigrain atta", 40),
      i("French beans", 80), i("Cauliflower", 60), i("Capsicum", 50), i("Tandoori masala", 1, "pack")] },
    { id: "fish-tikka", name: "Fish Tikka, Masoor Dal & Roti", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 200), i("Masoor dal", 30), i("Hung curd (chakka)", 40),
      i("Multigrain atta", 40), i("Lemon", 1, "pcs"), i("Tandoori masala", 1, "pack")] },
    { id: "chicken-keema", name: "Chicken Keema Matar with Roti", diet: "nonveg", ingredients: [
      i("Chicken mince (keema)", 180), i("Green peas", 60), i("Multigrain atta", 50), i("Onion", 50),
      i("Tomato", 80), i("Ginger", 5), i("Garlic", 5)] },
  ],

  // Salad and curd served with lunch and dinner (kachumber, koshimbir, raita).
  side: [
    { id: "kachumber-dahi", name: "Cucumber-Tomato Kachumber with Dahi", diet: "veg", ingredients: [
      i("Cucumber", 120), i("Tomato", 80), i("Onion", 40), i("Carrot", 60), i("Dahi (curd)", 150),
      i("Coriander", 0.25, "bunch"), i("Lemon", 0.5, "pcs")] },
    { id: "beet-peanut", name: "Beetroot Raita & Peanut-Carrot Koshimbir", diet: "veg", ingredients: [
      i("Beetroot", 80), i("Carrot", 50), i("Peanuts", 15), i("Dahi (curd)", 150), i("Lemon", 0.5, "pcs")] },
    { id: "sprouts-kachumber", name: "Sprouts Kachumber with Alsi & Dahi", diet: "veg", ingredients: [
      i("Moong sprouts", 100), i("Cucumber", 60), i("Tomato", 60), i("Onion", 30),
      i("Flax seeds (alsi)", 10), i("Dahi (curd)", 150), i("Lemon", 0.5, "pcs")] },
    { id: "kala-chana-salad", name: "Kala Chana & Pomegranate Salad with Dahi", diet: "veg", ingredients: [
      i("Kala chana", 30), i("Cucumber", 80), i("Tomato", 60), i("Onion", 30), i("Pomegranate", 40),
      i("Dahi (curd)", 100), i("Chaat masala", 1, "pack")] },
    { id: "lauki-raita", name: "Lauki Raita with Onion-Cucumber Salad", diet: "veg", ingredients: [
      i("Bottle gourd (lauki)", 100), i("Cucumber", 80), i("Onion", 40), i("Carrot", 50),
      i("Dahi (curd)", 150), i("Sesame seeds (til)", 8)] },
    { id: "pudina-raita", name: "Pudina Raita with Carrot-Cucumber Salad", diet: "veg", ingredients: [
      i("Mint (pudina)", 0.25, "bunch"), i("Carrot", 70), i("Cucumber", 80), i("Dahi (curd)", 150),
      i("Pumpkin seeds", 10)] },
    { id: "palak-raita", name: "Palak Raita with Kachumber", diet: "veg", ingredients: [
      i("Spinach (palak)", 60), i("Cucumber", 80), i("Tomato", 60), i("Onion", 30), i("Dahi (curd)", 150),
      i("Walnuts", 10)] },
    { id: "cabbage-koshimbir", name: "Cabbage-Carrot Koshimbir with Peanuts & Dahi", diet: "veg", ingredients: [
      i("Cabbage", 80), i("Carrot", 50), i("Peanuts", 20), i("Dahi (curd)", 100), i("Lemon", 0.5, "pcs")] },
    { id: "coconut-til", name: "Coconut-Til Chutney, Kachumber & Dahi", diet: "veg", ingredients: [
      i("Coconut (fresh)", 20), i("Sesame seeds (til)", 10), i("Roasted chana", 10), i("Cucumber", 80),
      i("Tomato", 60), i("Dahi (curd)", 100), i("Green chilli", 1, "pcs")] },
    { id: "beet-walnut", name: "Beetroot-Walnut Raita with Onion Salad", diet: "veg", ingredients: [
      i("Beetroot", 80), i("Walnuts", 15), i("Onion", 40), i("Cucumber", 60), i("Dahi (curd)", 150)] },
    { id: "cucumber-pumpkin", name: "Cucumber Raita with Roasted Pumpkin Seeds & Tomato Salad", diet: "veg", ingredients: [
      i("Cucumber", 100), i("Pumpkin seeds", 15), i("Tomato", 60), i("Onion", 30), i("Dahi (curd)", 150)] },
  ],
};

// The day's slots, in serving order. "pool" says which list a slot picks from.
const SLOTS = [
  { key: "breakfast",   label: "Breakfast",                 pool: "breakfast", emoji: "🍳" },
  { key: "lunch",       label: "Lunch",                     pool: "lunch",     emoji: "🍛" },
  { key: "lunchSalad",  label: "Salad & curd with lunch",   pool: "side",      emoji: "🥗" },
  { key: "snack",       label: "Evening snack",             pool: "snack",     emoji: "🥤" },
  { key: "dinner",      label: "Dinner",                    pool: "dinner",    emoji: "🍲" },
  { key: "dinnerSalad", label: "Salad & curd with dinner",  pool: "side",      emoji: "🥗" },
];

// Ingredients that make a dish's main protein; the planner avoids having
// the same one at lunch and dinner.
const MAIN_PROTEINS = ["Paneer", "Soya chunks", "Eggs", "Chicken breast (boneless)",
  "Chicken (curry cut, skinless)", "Chicken mince (keema)", "Fish (rohu / basa)"];

// Work out nutrition per serving for every dish once.
Object.values(RECIPES).flat().forEach((r) => {
  const n = { protein: 0, fibre: 0, fat: 0, goodFat: 0, kcal: 0 };
  r.ingredients.forEach((ing) => {
    const [, p, fi, fat, kcal, good, pieceG] = NUTRITION[ing.name];
    let grams = 0;
    if (ing.unit === "g" || ing.unit === "ml") grams = ing.qty;
    else if (ing.unit === "pcs") grams = ing.qty * (pieceG || 0);
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
});
