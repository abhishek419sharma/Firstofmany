# Daily Meal Planner

A small web app that suggests a full day of Indian meals, builds the list of items to order, and lets you send the menu and the order list on WhatsApp.

## House rules built into every dish
- **Gluten-free**: no wheat, maida, daliya or sooji. Rotis use jowar, bajra, ragi, makki, besan or rajgira.
- **No fried food**: dishes are roasted, steamed, grilled, pressure-cooked or given a light tadka.
- **No added sugar, honey or jaggery**: sweetness comes only from whole fruit and a little soaked anjeer.
- **No red chilli**: masalas use black pepper, ajwain, garam masala and dhania-jeera. Fresh green chilli is small and optional.
- **No soya** anywhere in the menu.
- **Buttermilk and flax every day**: lunch always includes chaas with ground flax (alsi).
- **Breakfast always has** 4 egg whites + 1 yolk and a collagen protein shake.
- **Chicken and fish only as a dry side** (tikka, seekh kebab, lemon-pepper fish), never in gravy or as the main dish. Egg curry is allowed.
- **Light dinner**: a smaller roti, rich or heavy dishes kept to lunch, and a dinner calorie limit (750 kcal by default).
- **Bowel-friendly**: the planner favours fibre-rich fruit, flax and chia, soaked anjeer, greens and dahi.

## Use it
Open `index.html` in any browser (phone or desktop). No install or server needed.

- **The day**: soaked nuts and seeds with a digestive drink on waking; breakfast (eggs, a gluten-free side, collagen shake, fruit); lunch; an evening snack with fruit; and a light dinner.
- **Lunch and dinner are full thalis**: one dal, one sabzi, one saag or greens, a salad, dahi or raita, a salt-free chutney, roti or rice, an optional chicken, fish or egg side, buttermilk (chaas) with ground flax, and a haldi-nimbu-ginger-kali mirch tea.
- **Superfoods**: each day shows which superfoods are in the menu and why, marked as a nutrition fact or a traditional use. The planner rewards a wide range of them.
- **Nutrition targets**: the planner picks the combination that gives each person at least **150 g protein**, **30 g fibre** and **20 g good fats** (nuts, seeds, fish), and stays under a calorie limit (2,800 kcal by default). You can change these.
- **Menu**: each day gets its own plan and avoids yesterday's dishes. **Shuffle** swaps one dish for another that keeps the day on target. **New plan** redoes the whole day. You can also pick any dish from its dropdown.
- **Items to order**: ingredients from every dish, combined and grouped by category. Tick the ones you already have, or add extra items.
- **WhatsApp**: send the menu, the order list or both. Leave the number empty to pick a contact, or save a number with the country code (for example `919876543210`).

Your choices are saved in the browser.

## Add your own dishes
Edit `recipes.js` for dishes and `superfoods.js` for the superfood notes. Each dish lists its ingredients for one person. Nutrition is calculated from the ingredient table at the top of the file, which holds values per 100 g from standard food tables. These are estimates. Cooking oil and ghee are not counted.
