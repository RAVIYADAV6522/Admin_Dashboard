# Known Issues

A comprehensive list of all bugs, typos, and problems identified in the codebase, organized by severity and location.

---

## Critical — Backend Logic Errors

These bugs cause incorrect data to be returned from the API.

### 1. Sort comparison uses assignment instead of equality
**File:** `server/controllers/client.js` — line 46
```js
// BUG: = is assignment, not comparison. Always assigns "asc" and evaluates to 1.
const sortFormatted = {
  [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
};
```
**Impact:** Descending sorting never works. Every sort request results in ascending order regardless of what the user selects.
**Fix:** Change `=` to `===`:
```js
[sortParsed.field]: (sortParsed.sort === "asc" ? 1 : -1),
```

---

### 2. `.limit()` called with an object instead of a number
**File:** `server/controllers/general.js` — line 28
```js
// BUG: .limit() expects a number, not an object
const overallStat = await OverallStat.find().limit({ year: currentYear });
```
**Impact:** The query doesn't filter by year at all. Mongoose may throw an error or return unexpected results depending on the version.
**Fix:** Use `.find({ year: currentYear })` instead:
```js
const overallStat = await OverallStat.find({ year: currentYear });
```

---

### 3. Assignment instead of comparison in daily stats lookup
**File:** `server/controllers/general.js` — line 42
```js
// BUG: = assigns currentDay to date instead of comparing
const todayStats = overallStat[0].dailyData.find(({ date }) => {
  return date = currentDay;
});
```
**Impact:** Always returns the first element in `dailyData` (since the assignment evaluates to a truthy string), so "today's stats" are always wrong.
**Fix:** Change `=` to `===`:
```js
return date === currentDay;
```

---

### 4. Sorting by wrong field name
**File:** `server/controllers/general.js` — line 25
```js
// BUG: schema uses "createdAt" (from timestamps: true), not "createdOn"
const transactions = await Transaction.find().limit(50).sort({ createdOn: -1 });
```
**Impact:** Transactions are not sorted by date — MongoDB ignores sort on non-existent fields, returning them in natural insertion order.
**Fix:** Change to `createdAt`:
```js
const transactions = await Transaction.find().limit(50).sort({ createdAt: -1 });
```

---

### 5. Inconsistent search filter vs count query
**File:** `server/controllers/client.js` — lines 53–65
```js
// Search uses $or on cost AND userId
const transactions = await Transaction.find({
  $or: [
    { cost: { $regex: new RegExp(search, "i") } },
    { userId: { $regex: new RegExp(search, "i") } },
  ],
})

// But count only filters on userId
const total = await Transaction.countDocuments({
  userId: { $regex: search, $options: "i" },
});
```
**Impact:** The `total` count doesn't match the actual filtered results. Pagination math is wrong — users may see incorrect page counts or missing records.
**Fix:** Use the same filter for both queries. Extract the filter into a variable and reuse it.

---

### 6. Transaction schema has invalid type definition
**File:** `server/models/Transaction.js` — line 9
```js
products: {
  type: [mongoose.Types.objectId],  // lowercase 'o' — should be ObjectId
  of: Number,                        // 'of' is for Map type, not arrays
},
```
**Impact:** The `products` field type is effectively broken. Mongoose may store the data but the schema validation is meaningless. The `of: Number` property is ignored for array types.
**Fix:**
```js
products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
```

---

## High — Frontend Rendering Bugs

These bugs cause UI elements to not render correctly or at all.

### 7. `renderCell` typo in Customers page
**File:** `client/src/scenes/customers/index.jsx` — line 31
```js
// BUG: "rederCell" is not a valid DataGrid column property
rederCell: (params) => {
  return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
},
```
**Impact:** Phone numbers display as raw unformatted strings (e.g., `1234567890` instead of `(123)456-7890`). MUI DataGrid silently ignores the misspelled property.
**Fix:** Change `rederCell` to `renderCell`.

---

### 8. Same `renderCell` typo in Admin page
**File:** `client/src/scenes/admin/index.jsx` — line 32
```js
rederCell: (params) => {
  return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
},
```
**Impact:** Same as above — admin phone numbers are never formatted.
**Fix:** Change `rederCell` to `renderCell`.

---

### 9. Performance route casing mismatch
**File:** `client/src/App.js` — line 41
```jsx
<Route path="/Performance" element={<Performance />} />
```
**File:** `client/src/components/Sidebar.jsx` — line 159
```js
navigate(`/${lcText}`);  // lcText = "performance" (lowercase)
```
**Impact:** Clicking "Performance" in the sidebar navigates to `/performance` but the route is defined as `/Performance`. The page shows a blank screen (no route match).
**Fix:** Change the route path to lowercase:
```jsx
<Route path="/performance" element={<Performance />} />
```

---

### 10. Invalid MUI Button variant
**File:** `client/src/scenes/products/index.jsx` — line 57
```jsx
<Button variant="primary" size="small" onClick={() => setIsExpanded(!isExpanded)}>
```
**Impact:** MUI only supports `"text"`, `"contained"`, and `"outlined"` variants. `"primary"` is silently ignored — the button renders with default (text) styling, looking like a plain text link.
**Fix:** Change to a valid variant:
```jsx
<Button variant="contained" size="small" ...>
```

---

### 11. Invalid palette indexing on `text.secondary`
**File:** `client/src/scenes/customers/index.jsx` — lines 67, 75
**File:** `client/src/scenes/admin/index.jsx` — lines 70, 78
**File:** `client/src/scenes/performance/index.jsx` — lines 58, 66
```js
color: theme.palette.text.secondary[100],
```
**Impact:** In MUI, `theme.palette.text.secondary` is a CSS color string (e.g., `"rgba(255,255,255,0.7)"`). Indexing a string with `[100]` returns `undefined`. The header and footer text colors are effectively invisible/unstyled.
**Fix:** Use the string directly or use a custom palette path:
```js
color: theme.palette.secondary[100],
```

---

### 12. Invalid CSS in StatBox border radius
**File:** `client/src/components/StatBox.jsx` — line 17
```jsx
borderRadius="0.55 rem"
```
**Impact:** The space between `0.55` and `rem` makes this an invalid CSS value. The border radius is ignored — stat boxes render with sharp corners.
**Fix:** Remove the space:
```jsx
borderRadius="0.55rem"
```

---

### 13. Non-existent palette path in StatBox
**File:** `client/src/components/StatBox.jsx` — line 36
```jsx
sx={{ color: theme.palette.light }}
```
**Impact:** `theme.palette.light` doesn't exist in MUI's palette. The "increase" percentage text has no color applied — it may be invisible depending on the theme.
**Fix:** Use a valid path:
```jsx
sx={{ color: theme.palette.secondary.light }}
```

---

### 14. Inverted loading condition in Products
**File:** `client/src/scenes/products/index.jsx` — line 95
```jsx
{data || !isLoading ? (
  <Box>
    {data.map(...)}
  </Box>
) : (
  <>Loading...</>
)}
```
**Impact:** When `data` is `undefined` and `isLoading` is `false` (e.g., after an error), the condition is `true` and `data.map()` throws a runtime error: `Cannot read properties of undefined (reading 'map')`.
**Fix:** Check `data` properly:
```jsx
{data && !isLoading ? (
```

---

## Medium — Schema & Data Typos

### 15. Product model field typo: `catagory`
**File:** `server/models/Product.js` — line 9
```js
catagory: String,
```
**Impact:** The frontend references `category` (correct spelling) when displaying product cards. If the seed data uses `catagory` in the database, the frontend field maps correctly only because the data was seeded with the same typo. Any new data using `category` would not match the schema field.
**Fix:** Rename to `category` in the schema. Run a migration script to update existing documents.

---

### 16. Deprecated `components` prop on DataGrid
**File:** `client/src/scenes/admin/index.jsx` — line 91
**File:** `client/src/scenes/performance/index.jsx` — line 79
```jsx
<DataGrid
  components={{
    ColumnMenu: CustomColumnMenu,
  }}
/>
```
**Impact:** The `components` prop is deprecated in MUI X DataGrid v7. It currently works but will be removed in a future version, causing a breaking change on upgrade.
**Fix:** Use the `slots` API:
```jsx
<DataGrid
  slots={{
    columnMenu: CustomColumnMenu,
  }}
/>
```

---

### 17. `GridFilterAltIcon` misused as a menu item
**File:** `client/src/components/DataGridCustomColumnMenu.jsx` — line 15
```jsx
<GridFilterAltIcon onClick={hideMenu} column={currentColumn} />
```
**Impact:** `GridFilterAltIcon` is an SVG icon component, not a menu item. It renders as a plain icon without menu item behavior (no hover state, no label, no proper click handling). The filter functionality in the custom column menu is broken.
**Fix:** Use the proper component:
```jsx
<GridColumnMenuFilterItem onClick={hideMenu} column={currentColumn} />
```

---

## Low — Cosmetic & Code Quality Issues

### 18. Debug `console.log` left in Dashboard
**File:** `client/src/scenes/dashboard/index.jsx` — line 28
```js
console.log("🚀 ~ Dashboard ~ data:", data);
```
**Impact:** Logs data to the browser console on every render. No functional impact but unprofessional in production and a minor performance hit.
**Fix:** Delete the line.

---

### 19. Typo "genreal" in Overview subtitle
**File:** `client/src/scenes/overview/index.jsx` — line 12
```jsx
subtitle="Overview of genreal revenue and profit"
```
**Fix:** Change to `"Overview of general revenue and profit"`.

---

### 20. Typo "Breadown" in Breakdown subtitle
**File:** `client/src/scenes/breakdown/index.jsx` — line 9
```jsx
subtitle="Breadown of Sales By Category"
```
**Fix:** Change to `"Breakdown of Sales By Category"`.

---

### 21. Typo "Yealy" in Dashboard stat title
**File:** `client/src/scenes/dashboard/index.jsx` — line 124
```jsx
title="Yealy Sales"
```
**Fix:** Change to `"Yearly Sales"`.

---

### 22. `boxSixing` typo in Sidebar drawer styles
**File:** `client/src/components/Sidebar.jsx` — line 123
```jsx
boxSixing: "border-box",
```
**Impact:** `box-sizing: border-box` is never applied to the drawer. The drawer width calculation may be slightly off (padding/border added to the specified width).
**Fix:** Change to `boxSizing`.

---

### 23. CommonJS `require()` in ESM codebase
**File:** `client/src/components/FlexBetween.jsx` — lines 1–2
```js
const { Box } = require("@mui/material");
const { styled } = require("@mui/system");
```
**Impact:** Works in CRA but is inconsistent with every other file that uses `import`. Will break if migrating to Vite or any strict ESM environment.
**Fix:** Convert to ESM:
```js
import { Box } from "@mui/material";
import { styled } from "@mui/system";
```

---

### 24. Missing `assets/profile.png`
**File:** `client/src/components/Navbar.jsx` — line 13
**File:** `client/src/components/Sidebar.jsx` — line 34
```js
import profileImage from "assets/profile.png";
```
**Impact:** The file `client/src/assets/profile.png` is imported in two components but does not exist in the repository. CRA will throw a build error. If the build somehow succeeds, both the navbar and sidebar profile images will be broken.
**Fix:** Add an actual `profile.png` image to `client/src/assets/`, or replace with an MUI `Avatar` component that shows initials as a fallback.

---

### 25. Hardcoded dates in Dashboard stats
**File:** `server/controllers/general.js` — lines 20–22
```js
const currentMonth = "November";
const currentYear = 2021;
const currentDay = "2021-11-15";
```
**Impact:** Dashboard always shows stats for November 2021 regardless of the actual date. Not a bug per se (the seed data is from 2021), but makes the dashboard meaningless for real-world use.
**Fix:** Derive from `new Date()` or make them query parameters:
```js
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.toLocaleString("default", { month: "long" });
const currentDay = now.toISOString().split("T")[0];
```

---

### 26. Password exposed in `getUser` response
**File:** `server/controllers/general.js` — line 8
```js
const user = await User.findById(id);
res.status(200).json(user);  // includes password field
```
**Impact:** The password hash is sent to the client in the API response. While it's hashed, exposing it is a security risk (offline brute-force attacks) and violates security best practices.
**Fix:** Exclude the password:
```js
const user = await User.findById(id).select("-password");
```

---

### 27. User role defaults to `"admin"`
**File:** `server/models/User.js` — line 32
```js
role: {
  type: String,
  enum: ["user", "admin", "superadmin"],
  default: "admin"
},
```
**Impact:** Any new user created without specifying a role gets `"admin"` privileges by default. This is a privilege escalation risk.
**Fix:** Change the default to `"user"`:
```js
default: "user"
```

---

### 28. `nodemon` in production dependencies
**File:** `server/package.json` — line 24
```json
"dependencies": {
  "nodemon": "^3.1.4"
}
```
**Impact:** `nodemon` is a development tool that auto-restarts the server on file changes. It should not be installed in production — it adds unnecessary weight to the deployment.
**Fix:** Move to `devDependencies`:
```json
"devDependencies": {
  "nodemon": "^3.1.4"
}
```

---

### 29. Generic `404` status for all errors
**File:** All controllers
```js
catch (error) {
  res.status(404).json({ message: error.message });
}
```
**Impact:** Every error — database failures (500), validation errors (400), missing resources (404) — returns a `404 Not Found` status. Clients cannot distinguish between different error types. Monitoring tools will misclassify server errors.
**Fix:** Use appropriate status codes and add centralized error handling middleware.

---

## Summary

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 6 | Backend logic errors causing wrong data |
| **High** | 8 | Frontend rendering bugs and security issues |
| **Medium** | 3 | Schema typos and deprecated API usage |
| **Low** | 12 | Cosmetic typos, code quality, and config issues |
| **Total** | **29** | |
