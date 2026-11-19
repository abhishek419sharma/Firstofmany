# Daily Meal Planner

A small web app that suggests a breakfast, lunch and dinner menu for each day, builds the list of items to order, and lets you send the menu and the order list on WhatsApp.

## Use it
Open `index.html` in any browser (phone or desktop). No install or server needed.

- **Nutrition targets**: each day has breakfast, lunch, an evening snack and dinner, with a fibre-rich salad alongside lunch and dinner. The planner chooses the combination that gives each person at least **150 g protein**, **30 g fibre** and **20 g good fats** (nuts, seeds, olive oil, avocado, fish), and stays under a calorie limit (2,400 kcal by default). You can change these targets.
- **Menu**: each day gets its own plan and avoids yesterday's dishes. **Shuffle** swaps one dish for another that keeps the day on target. **New plan** redoes the whole day. You can also pick a dish from the dropdown.
- **People and diet**: quantities scale to the number of people. You can choose Veg, Veg + Egg or Non-veg.
- **Items to order**: ingredients from all three meals, combined and grouped by category. Tick the ones you already have, or add extra items.
- **WhatsApp**: send the menu, the order list or both. Leave the number empty to pick a contact, or save a number with the country code (for example `919876543210`).

Your choices are saved in the browser.

## Add your own dishes
Edit `recipes.js`. Each dish lists its ingredients for one person. Nutrition is calculated from the ingredient table at the top of the file, which holds values per 100 g from standard food tables. These are estimates. Cooking oil is not counted.
