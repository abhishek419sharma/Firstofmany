// Dish database for the meal planner. All dishes are Indian home-style food.
// No maida anywhere: rotis and parathas use whole-wheat / multigrain atta,
// besan, jowar, bajra or sattu.
//
// A day is built like this:
//   Breakfast
//   Lunch  = dal + sabzi + saag + salad + dahi + roti/rice (+ optional side)
//   Evening snack
//   Dinner = dal + sabzi + saag + salad + dahi + roti/rice (+ optional side)
// Chicken and fish only ever appear as a dry SIDE (tikka, tandoori, seekh,
// tawa fish), never in gravy or as the main course. Egg curry is allowed.
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
  "Green moong (whole)": ["Pulses & Soya", 22.5, 16.3, 1.2, 334],
  "Toor dal":           ["Pulses & Soya", 22.3, 15, 1.7, 343],
  "Masoor dal":         ["Pulses & Soya", 24.6, 10.8, 1.1, 352],
  "Chana dal":          ["Pulses & Soya", 21, 10, 5, 370],
  "Rajma":              ["Pulses & Soya", 22.5, 15.2, 1.1, 333],
  "Kabuli chana":       ["Pulses & Soya", 20.5, 12.2, 6, 378],
  "Kala chana":         ["Pulses & Soya", 20, 17, 5, 360],
  "Lobia (black-eyed peas)": ["Pulses & Soya", 24, 11, 1.4, 336],
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
  "Bajra atta":         ["Grains & Flour", 11.6, 11.3, 5, 361],
  "Brown rice":         ["Grains & Flour", 7.5, 3.5, 2.7, 362],
  "Daliya (broken wheat)": ["Grains & Flour", 11.5, 12.5, 1.5, 342],
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
  "Capsicum":           ["Vegetables", 1, 2.1, 0.3, 26],
  "Cabbage":            ["Vegetables", 1.3, 2.5, 0.1, 25],
  "Bottle gourd (lauki)": ["Vegetables", 0.6, 0.5, 0.1, 14],
  "Cauliflower":        ["Vegetables", 1.9, 2, 0.3, 25],
  "Bhindi (okra)":      ["Vegetables", 1.9, 3.2, 0.2, 33],
  "Brinjal":            ["Vegetables", 1.4, 3, 0.2, 24],
  "Mushrooms":          ["Vegetables", 3.1, 1, 0.3, 22],
  "Radish (mooli)":     ["Vegetables", 0.7, 1.6, 0.1, 16],
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
const tadka = () => [i("Garlic", 5), i("Coriander", 0.25, "bunch")];

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
    { id: "methi-thepla", name: "Methi Thepla (Multigrain & Besan) with Hung Curd", diet: "veg", ingredients: [
      i("Multigrain atta", 70), i("Besan", 20), i("Methi leaves", 40), i("Flax seeds (alsi)", 10),
      i("Hung curd (chakka)", 150), i("Green chilli", 1, "pcs")] },
    { id: "masala-omelette", name: "Masala Omelette with Methi Paratha", diet: "egg", ingredients: [
      i("Eggs", 4, "pcs"), i("Multigrain atta", 60), i("Methi leaves", 30), i("Onion", 30),
      i("Tomato", 30), ...herbs()] },
    { id: "anda-bhurji", name: "Anda Bhurji with Multigrain Roti", diet: "egg", ingredients: [
      i("Eggs", 4, "pcs"), i("Multigrain atta", 60), i("Onion", 40), i("Tomato", 50),
      i("Capsicum", 30), ...herbs()] },
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
      i("Rajma", 60), i("Onion", 40), i("Tomato", 60), i("Ginger", 5), i("Garlic", 5)] },
    { id: "chole", name: "Chole (Kabuli Chana) Masala", diet: "veg", ingredients: [
      i("Kabuli chana", 60), i("Onion", 40), i("Tomato", 60), i("Chole masala", 1, "pack"),
      i("Ginger", 5), i("Garlic", 5)] },
    { id: "kala-chana", name: "Kala Chana Masala", diet: "veg", ingredients: [
      i("Kala chana", 60), i("Onion", 40), i("Tomato", 60), i("Ginger", 5), i("Garlic", 5)] },
    { id: "lobia", name: "Lobia (Black-eyed Pea) Masala", diet: "veg", ingredients: [
      i("Lobia (black-eyed peas)", 60), i("Onion", 40), i("Tomato", 60), i("Ginger", 5), i("Garlic", 5)] },
    { id: "sambar", name: "Sambar", diet: "veg", ingredients: [
      i("Toor dal", 50), i("Carrot", 30), i("Bottle gourd (lauki)", 50), i("Tomato", 30), i("Onion", 30),
      i("Sambar masala", 1, "pack"), i("Curry leaves", 0.25, "bunch")] },
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
    { id: "mushroom-matar", name: "Mushroom Matar", diet: "veg", ingredients: [
      i("Mushrooms", 150), i("Green peas", 60), i("Onion", 40), i("Tomato", 40), i("Ginger", 5)] },
    { id: "matar-paneer", name: "Matar Paneer", diet: "veg", ingredients: [
      i("Paneer", 90), i("Green peas", 70), i("Tomato", 60), i("Onion", 40)] },
    { id: "paneer-capsicum", name: "Paneer Capsicum Sabzi", diet: "veg", ingredients: [
      i("Paneer", 90), i("Capsicum", 120), i("Onion", 40), i("Tomato", 40)] },
    { id: "soya-keema", name: "Soya Keema Matar", diet: "veg", ingredients: [
      i("Soya chunks", 35), i("Green peas", 60), i("Onion", 40), i("Tomato", 60), i("Ginger", 5)] },
    { id: "soya-masala", name: "Soya Chunk Masala (dry)", diet: "veg", ingredients: [
      i("Soya chunks", 35), i("Capsicum", 80), i("Onion", 50), i("Tomato", 50), i("Garlic", 5)] },
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
    { id: "palak-paneer", name: "Palak Paneer (light)", diet: "veg", ingredients: [
      i("Spinach (palak)", 180), i("Paneer", 70), i("Onion", 30), i("Tomato", 30), i("Garlic", 5)] },
    { id: "methi-matar", name: "Methi Matar", diet: "veg", ingredients: [
      i("Methi leaves", 100), i("Green peas", 60), i("Onion", 30), i("Garlic", 5)] },
  ],

  salad: [
    { id: "kachumber", name: "Cucumber-Tomato-Onion Kachumber", diet: "veg", ingredients: [
      i("Cucumber", 100), i("Tomato", 80), i("Onion", 40), i("Lemon", 0.5, "pcs"),
      i("Coriander", 0.25, "bunch")] },
    { id: "sprouts-salad", name: "Moong Sprouts Salad", diet: "veg", ingredients: [
      i("Moong sprouts", 100), i("Cucumber", 60), i("Tomato", 60), i("Onion", 30), i("Lemon", 0.5, "pcs")] },
    { id: "kala-chana-salad", name: "Kala Chana & Pomegranate Salad", diet: "veg", ingredients: [
      i("Kala chana", 30), i("Cucumber", 80), i("Onion", 30), i("Pomegranate", 40),
      i("Chaat masala", 1, "pack")] },
    { id: "cabbage-koshimbir", name: "Cabbage-Carrot Koshimbir with Peanuts", diet: "veg", ingredients: [
      i("Cabbage", 80), i("Carrot", 50), i("Peanuts", 20), i("Lemon", 0.5, "pcs")] },
    { id: "beet-carrot-salad", name: "Beetroot-Carrot Salad with Til", diet: "veg", ingredients: [
      i("Beetroot", 80), i("Carrot", 60), i("Sesame seeds (til)", 8), i("Lemon", 0.5, "pcs")] },
    { id: "mooli-gajar-salad", name: "Mooli-Gajar Salad with Walnuts", diet: "veg", ingredients: [
      i("Radish (mooli)", 80), i("Carrot", 60), i("Walnuts", 10), i("Lemon", 0.5, "pcs")] },
    { id: "cucumber-seeds-salad", name: "Cucumber-Tomato Salad with Pumpkin Seeds", diet: "veg", ingredients: [
      i("Cucumber", 100), i("Tomato", 60), i("Onion", 30), i("Pumpkin seeds", 15)] },
    { id: "sprouts-carrot-alsi", name: "Sprouts-Carrot Salad with Alsi", diet: "veg", ingredients: [
      i("Moong sprouts", 80), i("Carrot", 60), i("Cucumber", 60), i("Flax seeds (alsi)", 10),
      i("Lemon", 0.5, "pcs")] },
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
  ],

  staple: [
    { id: "multigrain-roti", name: "2 Multigrain Rotis", diet: "veg", ingredients: [i("Multigrain atta", 55)] },
    { id: "missi-roti", name: "2 Missi Rotis (atta + besan)", diet: "veg", ingredients: [
      i("Multigrain atta", 30), i("Besan", 30)] },
    { id: "jowar-roti", name: "2 Jowar Rotis", diet: "veg", ingredients: [i("Jowar atta", 55)] },
    { id: "bajra-roti", name: "2 Bajra Rotis", diet: "veg", ingredients: [i("Bajra atta", 55)] },
    { id: "brown-rice", name: "Jeera Brown Rice", diet: "veg", ingredients: [i("Brown rice", 60)] },
  ],

  // Chicken and fish only as a dry side, never in gravy. Egg curry is fine.
  side: [
    { id: "none", name: "No side", diet: "veg", ingredients: [] },
    { id: "chicken-tikka", name: "Chicken Tikka (dry)", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Hung curd (chakka)", 30), i("Lemon", 0.5, "pcs"),
      i("Tandoori masala", 1, "pack")] },
    { id: "tandoori-chicken", name: "Tandoori Chicken (dry)", diet: "nonveg", ingredients: [
      i("Chicken (curry cut, skinless)", 160), i("Hung curd (chakka)", 30), i("Lemon", 0.5, "pcs"),
      i("Tandoori masala", 1, "pack")] },
    { id: "chicken-seekh", name: "Chicken Seekh Kebab", diet: "nonveg", ingredients: [
      i("Chicken mince (keema)", 120), i("Onion", 20), i("Ginger", 5), i("Mint (pudina)", 0.25, "bunch"),
      i("Green chilli", 1, "pcs")] },
    { id: "pepper-chicken", name: "Dry Pepper Chicken", diet: "nonveg", ingredients: [
      i("Chicken breast (boneless)", 125), i("Onion", 40), i("Garlic", 5),
      i("Curry leaves", 0.25, "bunch"), i("Green chilli", 1, "pcs")] },
    { id: "ajwaini-fish", name: "Ajwaini Fish Tikka", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 150), i("Hung curd (chakka)", 30), i("Lemon", 0.5, "pcs"),
      i("Tandoori masala", 1, "pack")] },
    { id: "tawa-fish", name: "Masala Tawa Fish (shallow fried)", diet: "nonveg", ingredients: [
      i("Fish (rohu / basa)", 150), i("Lemon", 1, "pcs"), i("Green chilli", 1, "pcs"),
      i("Coriander", 0.25, "bunch"), i("Chaat masala", 1, "pack")] },
    { id: "egg-curry", name: "Egg Curry (2 eggs)", diet: "egg", ingredients: [
      i("Eggs", 2, "pcs"), i("Onion", 50), i("Tomato", 70), i("Ginger", 5), i("Garlic", 5)] },
    { id: "bhurji-side", name: "Anda Bhurji (2 eggs)", diet: "egg", ingredients: [
      i("Eggs", 2, "pcs"), i("Onion", 40), i("Tomato", 40), i("Capsicum", 30), ...herbs()] },
    { id: "boiled-eggs", name: "Masala Boiled Eggs (2)", diet: "egg", ingredients: [
      i("Eggs", 2, "pcs"), i("Onion", 20), i("Lemon", 0.5, "pcs"), i("Chaat masala", 1, "pack")] },
    { id: "omelette-side", name: "Masala Omelette (2 eggs)", diet: "egg", ingredients: [
      i("Eggs", 2, "pcs"), i("Onion", 30), i("Tomato", 30), ...herbs()] },
  ],
};

// The day's slots, in serving order. "pool" says which list a slot picks
// from; "group" is the meal it belongs to; "part" is its role in a thali.
const MEAL_GROUPS = [
  { key: "breakfast", label: "Breakfast",      emoji: "🍳" },
  { key: "lunch",     label: "Lunch",          emoji: "🍛" },
  { key: "snack",     label: "Evening snack",  emoji: "🥤" },
  { key: "dinner",    label: "Dinner",         emoji: "🍲" },
];

const SLOTS = [
  { key: "breakfast",   group: "breakfast", part: "main",   label: "Breakfast",          pool: "breakfast" },
  { key: "lunchDal",    group: "lunch",     part: "dal",    label: "Dal",                pool: "dal" },
  { key: "lunchSabzi",  group: "lunch",     part: "sabzi",  label: "Sabzi",              pool: "sabzi" },
  { key: "lunchSaag",   group: "lunch",     part: "saag",   label: "Saag / greens",      pool: "saag" },
  { key: "lunchSalad",  group: "lunch",     part: "salad",  label: "Salad",              pool: "salad" },
  { key: "lunchDahi",   group: "lunch",     part: "dahi",   label: "Dahi / raita",       pool: "dahi" },
  { key: "lunchStaple", group: "lunch",     part: "staple", label: "Roti / rice",        pool: "staple" },
  { key: "lunchSide",   group: "lunch",     part: "side",   label: "Chicken / fish / egg side", pool: "side" },
  { key: "snack",       group: "snack",     part: "main",   label: "Evening snack",      pool: "snack" },
  { key: "dinnerDal",    group: "dinner",   part: "dal",    label: "Dal",                pool: "dal" },
  { key: "dinnerSabzi",  group: "dinner",   part: "sabzi",  label: "Sabzi",              pool: "sabzi" },
  { key: "dinnerSaag",   group: "dinner",   part: "saag",   label: "Saag / greens",      pool: "saag" },
  { key: "dinnerSalad",  group: "dinner",   part: "salad",  label: "Salad",              pool: "salad" },
  { key: "dinnerDahi",   group: "dinner",   part: "dahi",   label: "Dahi / raita",       pool: "dahi" },
  { key: "dinnerStaple", group: "dinner",   part: "staple", label: "Roti / rice",        pool: "staple" },
  { key: "dinnerSide",   group: "dinner",   part: "side",   label: "Chicken / fish / egg side", pool: "side" },
];

// Used to stop one protein from showing up too often in a day.
const PROTEIN_GROUP = {
  "Paneer": "Paneer", "Soya chunks": "Soya", "Eggs": "Eggs",
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
  r.proteinGroups = Array.from(new Set(
    r.ingredients.map((ing) => PROTEIN_GROUP[ing.name]).filter(Boolean)));
});
