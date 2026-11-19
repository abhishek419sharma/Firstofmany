# Daily Meal Planner

A small web app that suggests a full day of Indian meals, builds the list of items to order, and lets you send the menu and the order list on WhatsApp.

All dishes are Indian home-style food with no maida: rotis and parathas use whole-wheat, multigrain, jowar, bajra or besan flour.

## Use it
Open `index.html` in any browser (phone or desktop). No install or server needed.

- **The day**: soaked nuts and seeds with a digestive drink on waking, breakfast with a fruit, lunch, an evening snack with a fruit, and dinner.
- **Lunch and dinner are full thalis**: one dal, one sabzi, one saag or greens, a salad, dahi or raita, a salt-free chutney (amla, mint-coriander, alsi, til, moringa and more), roti or rice, and an unsweetened digestive tea (jeera-ajwain-saunf, ginger-mint, tulsi kadha and more).
- **Chicken and fish only as a dry side** (tikka, tandoori, seekh kebab, tawa fish), never in gravy or as the main dish. Egg curry, bhurji and omelette are also offered as sides. Choose the diet to match: Vegetarian (no side), Veg + Egg, or Non-veg.
- **Superfoods**: each day shows which superfoods are in the menu and why, marked as a nutrition fact or a traditional use. The planner rewards a wide range of them and avoids repeating yesterday's. The reasons come from food-table values and a short literature check, and the page says where the evidence is thin.
- **Nutrition targets**: the planner picks the combination that gives each person at least **150 g protein**, **30 g fibre** and **20 g good fats** (nuts, seeds, fish), and stays under a calorie limit (2,800 kcal by default). You can change all of these.
- **Menu**: each day gets its own plan and avoids yesterday's dishes. **Shuffle** swaps one dish for another that keeps the day on target. **New plan** redoes the whole day. You can also pick any dish from its dropdown, or set a side to "No side".
- **Items to order**: ingredients from every dish, combined and grouped by category. Tick the ones you already have, or add extra items.
- **WhatsApp**: send the menu, the order list or both. Leave the number empty to pick a contact, or save a number with the country code (for example `919876543210`).

Your choices are saved in the browser.

## Add your own dishes
Edit `recipes.js` for dishes and `superfoods.js` for the superfood notes. Each dish lists its ingredients for one person. Nutrition is calculated from the ingredient table at the top of the file, which holds values per 100 g from standard food tables. These are estimates. Cooking oil and ghee are not counted.
