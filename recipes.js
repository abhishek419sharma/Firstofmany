// Dish database. Quantities are for BASE_SERVINGS people and get scaled
// to the number of people chosen in the app.
// diet: "veg" | "egg" | "nonveg"
// Basic staples (salt, oil, turmeric, chilli powder, jeera, mustard seeds)
// are assumed to be at home and are not listed.

const BASE_SERVINGS = 4;

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat, Fish & Eggs",
  "Grains & Flour",
  "Pulses",
  "Bakery",
  "Spices & Masala",
  "Other",
];

// i(name, qty, unit, category)
function i(name, qty, unit, category) {
  return { name, qty, unit, category };
}

const V = "Vegetables", F = "Fruits", D = "Dairy", M = "Meat, Fish & Eggs",
  G = "Grains & Flour", P = "Pulses", B = "Bakery", S = "Spices & Masala", O = "Other";

const RECIPES = {
  breakfast: [
    { id: "poha", name: "Kanda Poha", diet: "veg", ingredients: [
      i("Poha", 300, "g", G), i("Onion", 2, "pcs", V), i("Potato", 1, "pcs", V),
      i("Green chilli", 3, "pcs", V), i("Peanuts", 50, "g", O), i("Curry leaves", 1, "bunch", V),
      i("Lemon", 1, "pcs", V), i("Coriander", 1, "bunch", V)] },
    { id: "upma", name: "Vegetable Upma", diet: "veg", ingredients: [
      i("Sooji (rava)", 250, "g", G), i("Onion", 1, "pcs", V), i("Carrot", 1, "pcs", V),
      i("Green peas", 100, "g", V), i("Green chilli", 2, "pcs", V), i("Curry leaves", 1, "bunch", V),
      i("Ghee", 30, "g", D)] },
    { id: "aloo-paratha", name: "Aloo Paratha with Curd", diet: "veg", ingredients: [
      i("Wheat flour (atta)", 500, "g", G), i("Potato", 4, "pcs", V), i("Green chilli", 2, "pcs", V),
      i("Coriander", 1, "bunch", V), i("Curd", 400, "g", D), i("Butter", 100, "g", D)] },
    { id: "idli", name: "Idli Sambar & Chutney", diet: "veg", ingredients: [
      i("Idli/Dosa batter", 1000, "g", O), i("Toor dal", 150, "g", P), i("Drumstick", 2, "pcs", V),
      i("Tomato", 2, "pcs", V), i("Onion", 1, "pcs", V), i("Sambar powder", 1, "pack", S),
      i("Tamarind", 30, "g", S), i("Coconut", 1, "pcs", V)] },
    { id: "masala-dosa", name: "Masala Dosa", diet: "veg", ingredients: [
      i("Idli/Dosa batter", 1000, "g", O), i("Potato", 5, "pcs", V), i("Onion", 2, "pcs", V),
      i("Green chilli", 3, "pcs", V), i("Curry leaves", 1, "bunch", V), i("Coconut", 1, "pcs", V)] },
    { id: "besan-chilla", name: "Besan Chilla with Curd", diet: "veg", ingredients: [
      i("Besan", 300, "g", G), i("Onion", 1, "pcs", V), i("Tomato", 2, "pcs", V),
      i("Green chilli", 2, "pcs", V), i("Coriander", 1, "bunch", V), i("Curd", 400, "g", D)] },
    { id: "moong-chilla", name: "Moong Dal Chilla with Paneer", diet: "veg", ingredients: [
      i("Moong dal", 300, "g", P), i("Ginger", 50, "g", V), i("Paneer", 200, "g", D),
      i("Green chilli", 2, "pcs", V), i("Coriander", 1, "bunch", V)] },
    { id: "omelette", name: "Masala Omelette & Toast", diet: "egg", ingredients: [
      i("Eggs", 8, "pcs", M), i("Bread", 1, "pack", B), i("Onion", 1, "pcs", V),
      i("Tomato", 1, "pcs", V), i("Green chilli", 2, "pcs", V), i("Butter", 50, "g", D)] },
    { id: "egg-bhurji", name: "Egg Bhurji Pav", diet: "egg", ingredients: [
      i("Eggs", 8, "pcs", M), i("Pav", 8, "pcs", B), i("Onion", 2, "pcs", V),
      i("Tomato", 2, "pcs", V), i("Coriander", 1, "bunch", V), i("Butter", 50, "g", D)] },
    { id: "oats", name: "Oats Porridge with Fruits", diet: "veg", ingredients: [
      i("Oats", 250, "g", G), i("Milk", 1000, "ml", D), i("Banana", 4, "pcs", F),
      i("Honey", 1, "pack", O), i("Almonds", 50, "g", O)] },
    { id: "sandwich", name: "Veg Grilled Sandwich", diet: "veg", ingredients: [
      i("Bread", 1, "pack", B), i("Cucumber", 2, "pcs", V), i("Tomato", 2, "pcs", V),
      i("Potato", 2, "pcs", V), i("Mint", 1, "bunch", V), i("Butter", 100, "g", D),
      i("Cheese slices", 1, "pack", D)] },
    { id: "sabudana", name: "Sabudana Khichdi", diet: "veg", ingredients: [
      i("Sabudana", 300, "g", G), i("Potato", 2, "pcs", V), i("Peanuts", 100, "g", O),
      i("Green chilli", 3, "pcs", V), i("Lemon", 1, "pcs", V), i("Coriander", 1, "bunch", V)] },
    { id: "poori-aloo", name: "Poori Aloo", diet: "veg", ingredients: [
      i("Wheat flour (atta)", 400, "g", G), i("Potato", 5, "pcs", V), i("Tomato", 2, "pcs", V),
      i("Green chilli", 2, "pcs", V), i("Coriander", 1, "bunch", V)] },
  ],

  lunch: [
    { id: "dal-rice", name: "Dal Tadka, Jeera Rice & Salad", diet: "veg", ingredients: [
      i("Toor dal", 250, "g", P), i("Rice", 400, "g", G), i("Tomato", 2, "pcs", V),
      i("Onion", 2, "pcs", V), i("Cucumber", 2, "pcs", V), i("Garlic", 1, "pcs", V),
      i("Ghee", 30, "g", D)] },
    { id: "rajma", name: "Rajma Chawal", diet: "veg", ingredients: [
      i("Rajma", 250, "g", P), i("Rice", 400, "g", G), i("Onion", 3, "pcs", V),
      i("Tomato", 4, "pcs", V), i("Ginger", 50, "g", V), i("Garlic", 1, "pcs", V)] },
    { id: "chole", name: "Chole & Roti", diet: "veg", ingredients: [
      i("Kabuli chana", 250, "g", P), i("Wheat flour (atta)", 400, "g", G), i("Onion", 3, "pcs", V),
      i("Tomato", 3, "pcs", V), i("Chole masala", 1, "pack", S), i("Ginger", 50, "g", V),
      i("Garlic", 1, "pcs", V)] },
    { id: "kadhi", name: "Kadhi Chawal", diet: "veg", ingredients: [
      i("Besan", 100, "g", G), i("Curd", 750, "g", D), i("Rice", 400, "g", G),
      i("Onion", 2, "pcs", V), i("Curry leaves", 1, "bunch", V)] },
    { id: "palak-paneer", name: "Palak Paneer & Roti", diet: "veg", ingredients: [
      i("Spinach (palak)", 2, "bunch", V), i("Paneer", 250, "g", D), i("Wheat flour (atta)", 400, "g", G),
      i("Onion", 2, "pcs", V), i("Tomato", 2, "pcs", V), i("Fresh cream", 100, "ml", D),
      i("Garlic", 1, "pcs", V)] },
    { id: "mix-veg", name: "Mix Veg, Moong Dal & Roti", diet: "veg", ingredients: [
      i("Cauliflower", 1, "pcs", V), i("Carrot", 2, "pcs", V), i("French beans", 200, "g", V),
      i("Green peas", 150, "g", V), i("Moong dal", 200, "g", P), i("Wheat flour (atta)", 400, "g", G),
      i("Tomato", 2, "pcs", V)] },
    { id: "sambar-rice", name: "Sambar Rice & Cabbage Poriyal", diet: "veg", ingredients: [
      i("Toor dal", 200, "g", P), i("Rice", 400, "g", G), i("Drumstick", 2, "pcs", V),
      i("Brinjal", 2, "pcs", V), i("Cabbage", 1, "pcs", V), i("Coconut", 1, "pcs", V),
      i("Sambar powder", 1, "pack", S), i("Tamarind", 50, "g", S)] },
    { id: "chicken-curry", name: "Chicken Curry & Rice", diet: "nonveg", ingredients: [
      i("Chicken", 1000, "g", M), i("Rice", 400, "g", G), i("Onion", 4, "pcs", V),
      i("Tomato", 3, "pcs", V), i("Curd", 200, "g", D), i("Ginger", 50, "g", V),
      i("Garlic", 1, "pcs", V), i("Chicken masala", 1, "pack", S)] },
    { id: "egg-curry", name: "Egg Curry & Roti", diet: "egg", ingredients: [
      i("Eggs", 8, "pcs", M), i("Onion", 3, "pcs", V), i("Tomato", 3, "pcs", V),
      i("Wheat flour (atta)", 400, "g", G), i("Ginger", 50, "g", V), i("Garlic", 1, "pcs", V)] },
    { id: "veg-pulao", name: "Veg Pulao & Raita", diet: "veg", ingredients: [
      i("Basmati rice", 400, "g", G), i("Carrot", 2, "pcs", V), i("French beans", 150, "g", V),
      i("Green peas", 150, "g", V), i("Curd", 500, "g", D), i("Cucumber", 1, "pcs", V),
      i("Garam masala (whole)", 1, "pack", S)] },
    { id: "aloo-gobi", name: "Aloo Gobi, Masoor Dal & Roti", diet: "veg", ingredients: [
      i("Potato", 3, "pcs", V), i("Cauliflower", 1, "pcs", V), i("Masoor dal", 200, "g", P),
      i("Wheat flour (atta)", 400, "g", G), i("Tomato", 2, "pcs", V), i("Coriander", 1, "bunch", V)] },
    { id: "fish-curry", name: "Fish Curry & Rice", diet: "nonveg", ingredients: [
      i("Fish", 750, "g", M), i("Rice", 400, "g", G), i("Coconut", 1, "pcs", V),
      i("Tamarind", 30, "g", S), i("Onion", 2, "pcs", V), i("Tomato", 2, "pcs", V),
      i("Curry leaves", 1, "bunch", V)] },
    { id: "bhindi", name: "Bhindi Masala, Dal & Roti", diet: "veg", ingredients: [
      i("Bhindi (okra)", 500, "g", V), i("Moong dal", 200, "g", P), i("Wheat flour (atta)", 400, "g", G),
      i("Onion", 2, "pcs", V), i("Tomato", 2, "pcs", V)] },
    { id: "chicken-biryani", name: "Chicken Biryani & Raita", diet: "nonveg", ingredients: [
      i("Chicken", 1000, "g", M), i("Basmati rice", 600, "g", G), i("Onion", 4, "pcs", V),
      i("Curd", 500, "g", D), i("Mint", 1, "bunch", V), i("Biryani masala", 1, "pack", S),
      i("Ghee", 50, "g", D), i("Cucumber", 1, "pcs", V)] },
  ],

  dinner: [
    { id: "khichdi", name: "Moong Dal Khichdi, Papad & Curd", diet: "veg", ingredients: [
      i("Rice", 250, "g", G), i("Moong dal", 200, "g", P), i("Ghee", 50, "g", D),
      i("Papad", 1, "pack", O), i("Curd", 500, "g", D), i("Tomato", 1, "pcs", V)] },
    { id: "paneer-butter", name: "Paneer Butter Masala & Roti", diet: "veg", ingredients: [
      i("Paneer", 400, "g", D), i("Tomato", 5, "pcs", V), i("Cashews", 50, "g", O),
      i("Butter", 100, "g", D), i("Fresh cream", 100, "ml", D), i("Wheat flour (atta)", 400, "g", G),
      i("Kasuri methi", 1, "pack", S)] },
    { id: "baingan-bharta", name: "Baingan Bharta & Roti", diet: "veg", ingredients: [
      i("Brinjal (bharta, large)", 2, "pcs", V), i("Onion", 2, "pcs", V), i("Tomato", 3, "pcs", V),
      i("Garlic", 1, "pcs", V), i("Wheat flour (atta)", 400, "g", G), i("Coriander", 1, "bunch", V)] },
    { id: "matar-paneer", name: "Matar Paneer & Roti", diet: "veg", ingredients: [
      i("Paneer", 250, "g", D), i("Green peas", 250, "g", V), i("Onion", 2, "pcs", V),
      i("Tomato", 3, "pcs", V), i("Wheat flour (atta)", 400, "g", G), i("Ginger", 50, "g", V)] },
    { id: "hakka-noodles", name: "Veg Hakka Noodles", diet: "veg", ingredients: [
      i("Hakka noodles", 400, "g", G), i("Cabbage", 1, "pcs", V), i("Capsicum", 2, "pcs", V),
      i("Carrot", 2, "pcs", V), i("Spring onion", 1, "bunch", V), i("Soy sauce", 1, "pack", S),
      i("Garlic", 1, "pcs", V)] },
    { id: "dal-makhani", name: "Dal Makhani & Jeera Rice", diet: "veg", ingredients: [
      i("Urad dal (whole)", 200, "g", P), i("Rajma", 50, "g", P), i("Rice", 400, "g", G),
      i("Butter", 100, "g", D), i("Fresh cream", 100, "ml", D), i("Tomato", 3, "pcs", V),
      i("Ginger", 50, "g", V), i("Garlic", 1, "pcs", V)] },
    { id: "butter-chicken", name: "Butter Chicken & Roti", diet: "nonveg", ingredients: [
      i("Chicken (boneless)", 750, "g", M), i("Tomato", 5, "pcs", V), i("Butter", 100, "g", D),
      i("Fresh cream", 150, "ml", D), i("Curd", 200, "g", D), i("Cashews", 50, "g", O),
      i("Wheat flour (atta)", 400, "g", G), i("Kasuri methi", 1, "pack", S)] },
    { id: "egg-fried-rice", name: "Egg Fried Rice", diet: "egg", ingredients: [
      i("Rice", 400, "g", G), i("Eggs", 6, "pcs", M), i("Spring onion", 1, "bunch", V),
      i("Carrot", 2, "pcs", V), i("French beans", 150, "g", V), i("Soy sauce", 1, "pack", S)] },
    { id: "lauki-chana", name: "Lauki Chana Dal & Roti", diet: "veg", ingredients: [
      i("Bottle gourd (lauki)", 1, "pcs", V), i("Chana dal", 200, "g", P), i("Tomato", 2, "pcs", V),
      i("Wheat flour (atta)", 400, "g", G), i("Ginger", 50, "g", V)] },
    { id: "soup-bread", name: "Vegetable Soup & Garlic Bread", diet: "veg", ingredients: [
      i("Carrot", 2, "pcs", V), i("French beans", 150, "g", V), i("Sweet corn", 200, "g", V),
      i("Cabbage", 1, "pcs", V), i("Garlic bread / baguette", 1, "pack", B), i("Butter", 100, "g", D),
      i("Garlic", 1, "pcs", V)] },
    { id: "jeera-aloo", name: "Jeera Aloo, Masoor Dal & Roti", diet: "veg", ingredients: [
      i("Potato", 5, "pcs", V), i("Masoor dal", 200, "g", P), i("Wheat flour (atta)", 400, "g", G),
      i("Tomato", 2, "pcs", V), i("Coriander", 1, "bunch", V)] },
    { id: "mutton-curry", name: "Mutton Curry & Rice", diet: "nonveg", ingredients: [
      i("Mutton", 1000, "g", M), i("Rice", 400, "g", G), i("Onion", 4, "pcs", V),
      i("Tomato", 3, "pcs", V), i("Curd", 200, "g", D), i("Ginger", 50, "g", V),
      i("Garlic", 1, "pcs", V), i("Meat masala", 1, "pack", S)] },
    { id: "pav-bhaji", name: "Pav Bhaji", diet: "veg", ingredients: [
      i("Pav", 12, "pcs", B), i("Potato", 4, "pcs", V), i("Cauliflower", 1, "pcs", V),
      i("Green peas", 150, "g", V), i("Capsicum", 2, "pcs", V), i("Onion", 2, "pcs", V),
      i("Tomato", 4, "pcs", V), i("Butter", 150, "g", D), i("Pav bhaji masala", 1, "pack", S),
      i("Lemon", 2, "pcs", V)] },
    { id: "thepla", name: "Methi Thepla & Aloo Sabzi", diet: "veg", ingredients: [
      i("Methi (fenugreek)", 2, "bunch", V), i("Wheat flour (atta)", 400, "g", G), i("Curd", 400, "g", D),
      i("Potato", 4, "pcs", V), i("Green chilli", 2, "pcs", V)] },
  ],
};
