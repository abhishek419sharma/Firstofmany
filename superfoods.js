// Superfoods and why they are in the menu. Loaded after recipes.js.
//
// "Superfood" is a marketing word, so each entry says what kind of reason it
// is: "fact" = a nutrient fact from food tables, "traditional" = long use in
// Indian kitchens or Ayurveda, where clinical evidence is limited or mixed.
// Numbers are rounded; published values vary by source and variety.

const SUPERFOODS = {
  // Fruits
  "Amla (Indian gooseberry)": { group: "Fruits", kind: "fact",
    why: "Very rich in vitamin C (reported at roughly 250–600 mg per 100 g, depending on variety) with some fibre. In season from October to February." },
  "Guava": { group: "Fruits", kind: "fact",
    why: "About 5 g fibre per 100 g and far more vitamin C than an orange." },
  "Papaya": { group: "Fruits", kind: "fact",
    why: "Vitamin C, folate and the digestive enzyme papain." },
  "Pomegranate": { group: "Fruits", kind: "fact",
    why: "Vitamin C and polyphenol antioxidants, plus fibre from the seeds." },
  "Kiwi": { group: "Fruits", kind: "fact", why: "Vitamin C and fibre." },
  "Orange / mosambi": { group: "Fruits", kind: "fact", why: "Vitamin C and fibre." },
  "Dates (khajoor)": { group: "Fruits", kind: "fact",
    why: "Fibre-rich (about 8 g per 100 g) but high in natural sugar, so portions are small." },
  "Anjeer (dried fig)": { group: "Fruits", kind: "fact",
    why: "Fibre-rich (about 10 g per 100 g) with calcium; high in natural sugar, so portions are small." },

  // Nuts and seeds
  "Flax seeds (alsi)": { group: "Nuts & seeds", kind: "fact",
    why: "Plant omega-3 (ALA) and a lot of fibre. Ground flax is absorbed better than whole seeds." },
  "Chia seeds": { group: "Nuts & seeds", kind: "fact",
    why: "About a third fibre by weight, plus omega-3. Soak before eating." },
  "Sesame seeds (til)": { group: "Nuts & seeds", kind: "fact",
    why: "Calcium (about 88 mg per tablespoon), magnesium and lignans." },
  "Pumpkin seeds": { group: "Nuts & seeds", kind: "fact",
    why: "Protein, magnesium, zinc and iron." },
  "Sunflower seeds": { group: "Nuts & seeds", kind: "fact",
    why: "Vitamin E, magnesium and unsaturated fats." },
  "Almonds": { group: "Nuts & seeds", kind: "fact",
    why: "Vitamin E, fibre and unsaturated fats. Traditionally eaten soaked overnight." },
  "Walnuts": { group: "Nuts & seeds", kind: "fact",
    why: "The nut richest in plant omega-3 (ALA)." },
  "Pistachios": { group: "Nuts & seeds", kind: "fact",
    why: "Protein and fibre with unsaturated fats." },
  "Cashews": { group: "Nuts & seeds", kind: "fact",
    why: "Unsaturated fats, magnesium and zinc." },
  "Peanuts": { group: "Nuts & seeds", kind: "fact",
    why: "Protein and unsaturated fats at a low price." },
  "Makhana (fox nuts)": { group: "Nuts & seeds", kind: "fact",
    why: "About 10 g protein and 14 g fibre per 100 g with almost no fat." },

  // Greens and vegetables
  "Moringa leaves (sahjan patta)": { group: "Greens & vegetables", kind: "fact",
    why: "Leafy green with roughly 7 g protein and 300 mg calcium per 100 g fresh, plus iron and vitamin C (values vary by source)." },
  "Drumstick pods (sahjan phali)": { group: "Greens & vegetables", kind: "traditional",
    why: "A fibre-rich pod from the moringa tree, eaten in sambar and sabzi across India." },
  "Spinach (palak)": { group: "Greens & vegetables", kind: "fact",
    why: "Folate, iron and vitamin K." },
  "Methi leaves": { group: "Greens & vegetables", kind: "fact",
    why: "Fibre- and iron-rich leaves with more protein than most greens." },
  "Mustard greens (sarson)": { group: "Greens & vegetables", kind: "fact",
    why: "Vitamin K, vitamin C and fibre." },
  "Amaranth leaves (chaulai)": { group: "Greens & vegetables", kind: "fact",
    why: "Iron, calcium and vitamin A." },
  "Beetroot": { group: "Greens & vegetables", kind: "fact",
    why: "Folate and dietary nitrates, plus fibre." },
  "Sweet potato (shakarkandi)": { group: "Greens & vegetables", kind: "fact",
    why: "Beta-carotene and fibre." },
  "Karela (bitter gourd)": { group: "Greens & vegetables", kind: "traditional",
    why: "A traditional bitter vegetable. Research on blood sugar is mixed, so enjoy it as a vegetable, not a remedy." },
  "Moong sprouts": { group: "Greens & vegetables", kind: "fact",
    why: "Sprouting adds vitamin C; low in calories with protein and fibre." },

  // Grains, millets and pulses
  "Ragi atta": { group: "Grains, millets & pulses", kind: "fact",
    why: "One of the richest grains in calcium; gluten-free." },
  "Rajgira atta (amaranth)": { group: "Grains, millets & pulses", kind: "fact",
    why: "More protein, iron and calcium than most grains. Traditionally a fasting food, good all year." },
  "Bajra atta": { group: "Grains, millets & pulses", kind: "fact",
    why: "Millet with fibre, iron and magnesium." },
  "Jowar atta": { group: "Grains, millets & pulses", kind: "fact",
    why: "Millet with fibre, iron and magnesium; gluten-free." },
  "Kala chana": { group: "Grains, millets & pulses", kind: "fact",
    why: "Among the highest-fibre pulses (about 17 g per 100 g) with good protein." },
  "Soya chunks": { group: "Grains, millets & pulses", kind: "fact",
    why: "The highest-protein vegetarian food (about 52 g per 100 g dry)." },
  "Sattu": { group: "Grains, millets & pulses", kind: "fact",
    why: "Roasted chana flour: protein and fibre in a cooling drink or paratha." },

  // Herbs and spices
  "Ginger": { group: "Herbs & spices", kind: "traditional",
    why: "The best-studied digestive herb, mostly for nausea and slow digestion." },
  "Mint (pudina)": { group: "Herbs & spices", kind: "traditional",
    why: "Traditionally cooling and used for digestion; peppermint is studied for IBS cramps." },
  "Saunf (fennel seeds)": { group: "Herbs & spices", kind: "traditional",
    why: "A small trial in IBS found less cramping. The after-meal saunf habit is traditional." },
  "Jeera (cumin seeds)": { group: "Herbs & spices", kind: "traditional",
    why: "Human evidence is for concentrated cumin, not tea, so this is mainly traditional use." },
  "Ajwain (carom seeds)": { group: "Herbs & spices", kind: "traditional",
    why: "Traditional for gas and bloating; human trials are scarce. Avoid large amounts in pregnancy." },
  "Tulsi leaves": { group: "Herbs & spices", kind: "traditional",
    why: "Holy basil, a traditional herb for kadha and tea." },
  "Haldi (turmeric powder)": { group: "Herbs & spices", kind: "traditional",
    why: "Curcumin is studied for inflammation. Black pepper helps it absorb." },
  "Methi seeds": { group: "Herbs & spices", kind: "traditional",
    why: "Fibre-rich seeds, traditionally soaked overnight." },
  "Curry leaves": { group: "Herbs & spices", kind: "traditional",
    why: "Aromatic leaves used daily in South Indian cooking." },

  // Dairy
  "Dahi (curd)": { group: "Dairy", kind: "fact",
    why: "Protein and calcium, plus live cultures (probiotics) when fresh and not heat-treated." },
  "Hung curd (chakka)": { group: "Dairy", kind: "fact",
    why: "Thick dahi with about three times the protein of plain curd." },
};

const SUPERFOOD_GROUPS = ["Fruits", "Nuts & seeds", "Greens & vegetables",
  "Grains, millets & pulses", "Herbs & spices", "Dairy"];

const SUPERFOOD_NOTES = [
  "“Superfood” is a marketing word. The reasons here are nutrient facts unless marked Traditional use, where research is limited or mixed.",
  "Digestive teas are a traditional after-meal habit. Ginger, fennel and mint have the most support, but much of the research uses concentrated extracts, not tea.",
  "Chutneys have no added salt. Most published amla and flaxseed chutney recipes include salt, so these rely on lemon, roasted jeera, ginger and chilli. Taste and adjust.",
  "Plant variety: in one large observational study, people eating 30 or more different plant foods a week had more diverse gut bacteria than people eating 10 or fewer. That shows a link, not proof, so treat 30 as a guide.",
];

// Check every name exists, and tag each dish with the superfoods it contains.
Object.keys(SUPERFOODS).forEach((name) => {
  if (!NUTRITION[name]) throw new Error("Superfood missing from NUTRITION: " + name);
});
Object.values(RECIPES).flat().forEach((r) => {
  r.superfoods = Array.from(new Set(
    r.ingredients.map((ing) => ing.name).filter((n) => SUPERFOODS[n])));
});

// Plant foods count towards the variety guide; dairy, meat, fish and eggs do not.
function isPlantFood(name) {
  const cat = NUTRITION[name][0];
  return cat !== "Dairy" && cat !== "Meat, Fish & Eggs";
}
