# Daily Meal Planner

A small web app that suggests a full day of Indian meals, builds the list of items to order, and lets you send the menu and the order list on WhatsApp.

## House rules built into every dish
- **Gluten-free**: no wheat, maida, daliya or sooji. Rotis use jowar, bajra, ragi, makki, besan or rajgira.
- **No fried food**: dishes are roasted, steamed, grilled, pressure-cooked or given a light tadka.
- **No added sugar, honey or jaggery**: sweetness comes only from whole fruit and a little soaked anjeer.
- **No red chilli**: masalas use black pepper, ajwain, garam masala and dhania-jeera. Fresh green chilli is small and optional.
- **No soya** anywhere in the menu.
- **Buttermilk and flax every day**: lunch always includes chaas with ground flax (alsi).
- **In season**: raw mango, jamun, melons, plums and peaches appear only in summer, and fresh amla and sarson only in winter.
- **Breakfast always has** 4 egg whites + 1 yolk and a collagen protein shake.
- **Chicken and fish only grilled, as a side** at lunch and dinner (tikka, seekh kebab, grilled fish), never in gravy or as the main dish. There are no eggs in the side, because eggs are at breakfast. Choose the diet to match: vegetarian lunch and dinner with egg at breakfast, or grilled chicken or fish at lunch and dinner.
- **Light dinner**: no dal or legumes (dals, rajma, chana, sprouts, besan), a smaller roti, rich or heavy dishes kept to lunch, and a dinner calorie limit (650 kcal by default).
- **Bowel-friendly**: the planner favours fibre-rich fruit, flax and chia, soaked anjeer, greens and dahi.

## What is on the menu
Over 250 dishes across the day, from Kerala thorans and avial, Bengali lau ghonto and shukto, Gujarati and Maharashtrian dals and chutneys, to steamed patra ni machhi, millet pulaos and upmas, regional raitas and pachadis. Every dish follows the house rules above.

## Use it
Open `index.html` in any browser (phone or desktop). No install or server needed.

- **The day**: soaked almonds, walnuts and anjeer (the same every morning) with a digestive drink on waking; breakfast (eggs, a gluten-free side, collagen shake, fruit); lunch; an evening snack with fruit; and a light dinner.
- **Lunch is a full thali and dinner is a light version of it**: lunch has one dal, one sabzi, one saag or greens, a simple raw salad (carrot, tomato, kheera, onion, beetroot, lettuce and lemon), dahi or raita, a salt-free chutney, roti or rice, a grilled chicken or fish side (non-veg diet), buttermilk (chaas) with ground flax, and a haldi-nimbu-ginger-kali mirch tea.
- **Superfoods**: each day shows which superfoods are in the menu and why, marked as a nutrition fact or a traditional use. The planner rewards a wide range of them.
- **Nutrition targets**: the planner picks the combination that gives each person at least **150 g protein**, **30 g fibre** and **20 g good fats** (nuts, seeds, fish), and stays under a calorie limit (2,800 kcal by default). You can change these.
- **Menu**: each day gets its own plan and avoids yesterday's dishes. **Shuffle** swaps one dish for another that keeps the day on target. **New plan** redoes the whole day. You can also pick any dish from its dropdown.
- **Items to order**: ingredients from every dish, combined and grouped by category. Tick the ones you already have, or add extra items.
- **WhatsApp**: every meal card has its own **Send** button, and the top of the page has **Send day's menu** and **Send order list**. Tap **Change** on a meal to open its dropdowns; the card otherwise shows a short summary.
- **Sending to a group**: in *Targets and WhatsApp settings*, choose where the buttons go.
  - *Any chat or group*: WhatsApp opens its chat list with the message ready, so you can pick a person or a group.
  - *A saved number*: the message goes straight to that chat. Use the country code, for example `919876543210`.
  - *A saved WhatsApp group*: paste the group's invite link (group info, then Invite to group via link). WhatsApp cannot pre-fill a message into a group from a link, so the app copies the message and opens the group; paste it and send.
  - Optionally add ingredient quantities to each meal's message.
- **Spice packs** you tick as at home stay ticked on every day.

Your choices are saved in the browser.

## Install it as an app
The planner is an installable web app (a PWA): it has an icon, opens full screen and works offline.

1. Put it on a website. The simplest way is GitHub Pages: in the repository, go to **Settings, Pages**, set **Source** to *Deploy from a branch*, pick the branch (and the `/ (root)` folder), and save. After a minute the site is at `https://<your-user>.github.io/Firstofmany/`. Pages is free for public repositories.
2. Open that address on your phone.
3. **Android (Chrome):** tap **Install app** on the page, or the browser menu, then **Install app**.
4. **iPhone (Safari):** tap **Share**, then **Add to Home Screen**.

Your settings and ticked items are stored on that phone, in the browser or app you used. When you change the code, bump `VERSION` in `sw.js` so installed copies pick up the new files.

## Add your own dishes
Edit `recipes.js` for dishes and `superfoods.js` for the superfood notes. Each dish lists its ingredients for one person. Nutrition is calculated from the ingredient table at the top of the file, which holds values per 100 g from standard food tables. These are estimates. Cooking oil and ghee are not counted.
