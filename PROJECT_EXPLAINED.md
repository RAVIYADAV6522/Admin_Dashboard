# Project File-by-File Explanation

A complete MERN (MongoDB, Express, React, Node.js) Admin Dashboard for visualizing sales, products, customers, geography, and performance data with dark/light theme support.

---

## Project Structure

```
Admin_Dashboard/
├── client/                          # React frontend (Create React App)
│   ├── public/                      # Static HTML shell & PWA config
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── scenes/                  # Page-level components (routes)
│   │   └── state/                   # Redux store, RTK Query API, static data
│   ├── package.json
│   └── jsconfig.json
├── server/                          # Express + Mongoose backend
│   ├── controllers/                 # Route handler logic
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # Express route definitions
│   ├── data/                        # Seed data for initial DB population
│   ├── index.js                     # Server entry point
│   └── package.json
└── README.md
```

---

## Client — Configuration Files

### `client/package.json`

Defines the frontend app dependencies and scripts. Key libraries:
- **React 18** — UI library
- **MUI 5** (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid` v7) — component library for layout, icons, and data tables
- **Nivo** (`@nivo/bar`, `@nivo/core`, `@nivo/geo`, `@nivo/line`, `@nivo/pie`) — data visualization charts
- **Redux Toolkit + RTK Query** — state management and API data fetching/caching
- **React Router v6** — client-side routing
- **react-datepicker** — date range selection for the Daily sales page
- **react-scripts 5** — CRA build toolchain

Scripts: `start` (dev server), `build` (production bundle), `test`, `eject`.

### `client/jsconfig.json`

Sets `baseUrl` to `"src"` so imports can use short paths like `"components/Header"` instead of `"../../components/Header"`. This is a CRA convenience feature — no TypeScript is used.

---

## Client — Entry & App Shell

### `client/public/index.html`

Standard CRA HTML shell. Contains the `<div id="root">` mount point for React. References `%PUBLIC_URL%` for asset paths. Title is the default "React App".

### `client/public/manifest.json`

PWA manifest for the app name, icons, theme color, and display mode. Icon files (`favicon.ico`, `logo192.png`, `logo512.png`) are referenced but may not all be present in the repo.

### `client/public/robots.txt`

Allows all web crawlers to index the site. A single-line `User-agent: * Allow: /`.

### `client/src/index.js`

**The application entry point.** It:
1. Creates the Redux store with two reducers: the `global` slice (theme mode + userId) and the RTK Query `api` reducer
2. Attaches RTK Query middleware for caching and invalidation
3. Calls `setupListeners` to enable `refetchOnFocus` / `refetchOnReconnect`
4. Renders `<App />` inside `<Provider>` and `<React.StrictMode>`

### `client/src/index.css`

Global styles:
- Imports the **Inter** font from Google Fonts
- Sets `height: 100%` and `width: 100%` on `html`, `body`, `#root`, and `.app` for full-viewport layout
- Custom scrollbar styling (WebKit): dark blue thumb on grey track

### `client/src/App.js`

**The root component.** It:
1. Reads the current `mode` (dark/light) from Redux
2. Creates an MUI theme using `themeSettings(mode)` (memoized with `useMemo`)
3. Wraps everything in `<BrowserRouter>` → `<ThemeProvider>` → `<CssBaseline>`
4. Defines all routes under a shared `<Layout>` element:
   - `/` → redirects to `/dashboard`
   - `/dashboard`, `/products`, `/customers`, `/transactions`, `/geography` — client-facing pages
   - `/overview`, `/daily`, `/monthly`, `/breakdown` — sales analytics pages
   - `/admin`, `/Performance` — management pages

**Known bug:** The Performance route uses `/Performance` (capital P) but the sidebar navigates to `/performance` (lowercase), so the link is broken.

### `client/src/theme.js`

Defines the complete color system and MUI theme configuration:
- `tokensDark` — dark mode color palette with `grey`, `primary` (blue shades), and `secondary` (yellow shades), each with numbered scales (0–1000 or 50–900)
- `reverseTokens()` — inverts the palette scale to generate `tokensLight`
- `themeSettings(mode)` — returns a full MUI theme object with:
  - Dark/light palette variants (primary, secondary, neutral, background colors)
  - Typography settings: Inter font at sizes 12px (base), 14–40px (h6–h1)

---

## Client — State Management

### `client/src/state/index.js`

A Redux Toolkit slice named `"global"` with:
- **`mode`**: `"dark"` (default) — controls the theme. Toggled by the `setMode` action which flips between `"dark"` and `"light"`
- **`userId`**: `"63701cc1f03239b7f700000e"` — a hardcoded MongoDB ObjectId used everywhere to fetch user data. There is no authentication; this is the only "logged-in" user

### `client/src/state/api.js`

The RTK Query API definition. All server communication goes through this single file:
- **Base URL**: `process.env.REACT_APP_BASE_URL` (must be set in a `.env` file)
- **Reducer path**: `"adminApi"`
- **Cache tags**: `User`, `Products`, `Customers`, `Transactions`, `Geography`, `Sales`, `Admins`, `Performance`, `Dashboard`
- **Endpoints**:

| Hook | HTTP Request | Purpose |
|------|-------------|---------|
| `useGetUserQuery(id)` | `GET /general/user/:id` | Fetch a single user by ID |
| `useGetProductsQuery()` | `GET /client/products` | Fetch all products with their stats |
| `useGetCustomersQuery()` | `GET /client/customers` | Fetch all users with role "user" |
| `useGetTransactionsQuery({page, pageSize, sort, search})` | `GET /client/transactions` | Paginated, sortable, searchable transactions |
| `useGetGeographyQuery()` | `GET /client/geography` | User count by country (ISO3 format) |
| `useGetSalesQuery()` | `GET /sales/sales` | Overall yearly sales stats |
| `useGetAdminsQuery()` | `GET /management/admins` | Fetch all users with role "admin" |
| `useGetUserPerformanceQuery(id)` | `GET /management/performance/:id` | Aggregate affiliate sales for a user |
| `useGetDashboardQuery()` | `GET /general/dashboard` | Aggregated dashboard stats |

### `client/src/state/geoData.js`

A massive file (~45,000+ lines) containing a GeoJSON `FeatureCollection` of world country polygons. Used by the Geography page to render the choropleth map with Nivo. Each feature has `properties.name` (country name) and a unique `id` (ISO3 code). This is static data bundled directly into the JavaScript bundle.

---

## Client — Reusable Components

### `client/src/components/FlexBetween.jsx`

A tiny styled MUI `Box` component:
```js
styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
})
```
Used extensively throughout the app as a flex row layout helper. **Note:** Uses CommonJS `require()` syntax instead of ESM `import`, which is inconsistent with the rest of the codebase.

### `client/src/components/Header.jsx`

Renders a page title (h2, bold, secondary color) and subtitle (h5, lighter) at the top of each page. Receives `title` and `subtitle` as props. Used by every scene/page.

### `client/src/components/Navbar.jsx`

The top app bar visible on every page. Contains:
- **Left side**: Sidebar toggle button (hamburger icon) + search bar (styled `InputBase` with a search icon)
- **Right side**: Theme toggle (dark/light icon that dispatches `setMode`), settings icon, profile dropdown (user's name, occupation, profile image, and a "Log Out" menu item)
- Receives `user`, `isSidebarOpen`, `setIsSidebarOpen` as props from Layout

**Note:** Imports `assets/profile.png` which is not present in the repository — this will cause a build/runtime error.

### `client/src/components/Sidebar.jsx`

Persistent navigation drawer on the left side. Contains:
- **Brand header**: "Parker AI" text with a close chevron on mobile
- **Navigation list**: 14 items organized into 3 groups (Client Facing, Sales, Management). Items without icons are rendered as section headers
- **Profile section**: User's photo, name, occupation, and settings icon at the bottom
- Uses `useLocation` to highlight the active route and `useNavigate` to handle navigation
- Sidebar navigates to `/${text.toLowerCase()}` for each item

**Note:** Also imports the missing `assets/profile.png`. Has a typo `boxSixing` instead of `boxSizing` in drawer styles.

### `client/src/components/StatBox.jsx`

A dashboard metric card displaying:
- Title and icon on the first row (flex between)
- Value as a large number (h3)
- Increase percentage and description on the bottom row

Used on the Dashboard page for Total Customers, Sales Today, Monthly Sales, and Yearly Sales.

**Known bugs:**
- `borderRadius: "0.55 rem"` — the space before `rem` makes this invalid CSS
- `theme.palette.light` — should be `theme.palette.secondary.light` or similar; `palette.light` doesn't exist

### `client/src/components/OverviewChart.jsx`

Renders a Nivo `ResponsiveLine` chart for cumulative monthly sales or units:
1. Fetches data via `useGetSalesQuery()`
2. Uses `useMemo` to iterate over `monthlyData` with `reduce`, accumulating running totals for sales and units into two line datasets
3. Accepts a `view` prop (`"sales"` or `"units"`) to select which line to display
4. Accepts `isDashboard` prop to toggle between compact (no grid, abbreviated months) and full-page display
5. Nivo theme colors are derived from the MUI theme

### `client/src/components/BreakdownChart.jsx`

Renders a Nivo `ResponsivePie` (donut) chart for sales by category:
1. Fetches data via `useGetSalesQuery()`
2. Maps `data.salesByCategory` entries into Nivo's `{id, label, value, color}` format
3. Shows total yearly sales in the center of the donut
4. Accepts `isDashboard` prop to adjust margins, sizing, and label visibility
5. Uses 4 hardcoded theme colors for the slices

### `client/src/components/DataGridCustomColumnMenu.jsx`

A custom MUI DataGrid column menu with filter and hide column options. Used in the Admin and Performance pages.

**Known issue:** `GridFilterAltIcon` is rendered as a menu item with `onClick` and `column` props, but it's actually an icon component, not a menu item. Should use `GridColumnMenuFilterItem` instead.

### `client/src/components/DataGridCustomToolbar.jsx`

A custom MUI DataGrid toolbar with:
- Column visibility toggle, density selector, export button on the left
- Search text field with a search icon on the right
- On search icon click: sets the search value and clears the input

Used in the Transactions page for server-side search.

---

## Client — Pages (Scenes)

### `client/src/scenes/layout/index.jsx`

The shared layout wrapper for all pages:
1. Reads `userId` from Redux and fetches user data with `useGetUserQuery`
2. Manages sidebar open/close state
3. Uses `useMediaQuery("(min-width: 600px)")` for responsive layout (flex on desktop, block on mobile)
4. Renders `<Sidebar>` + `<Box>` containing `<Navbar>` + `<Outlet>` (child routes)
5. Passes user data and sidebar state to both Sidebar and Navbar

### `client/src/scenes/dashboard/index.jsx`

The main dashboard page. Displays:
- **Row 1**: 4 `StatBox` cards (Total Customers, Sales Today, Monthly Sales, Yearly Sales) + an `OverviewChart` spanning 8 columns and 2 rows
- **Row 2**: A `DataGrid` of the 50 most recent transactions (8 columns, 3 rows) + a `BreakdownChart` pie chart (4 columns, 3 rows)
- A "Download Reports" button in the header (non-functional)
- Uses a 12-column CSS Grid with responsive fallback to full-width on smaller screens

**Known issues:**
- `console.log("🚀 ~ Dashboard ~ data:", data)` left in production code
- Typo "Yealy Sales" should be "Yearly Sales"

### `client/src/scenes/products/index.jsx`

Displays all products as expandable cards in a 4-column grid:
- Each `Product` card shows: category, name, formatted price, star rating, and description
- Click "See More" to expand and reveal: product ID, supply left, yearly sales total, yearly units sold
- Responsive: single column on screens < 1000px

**Known bugs:**
- `Button variant="primary"` — MUI doesn't have a "primary" variant (should be `"contained"` or `"outlined"`)
- Loading condition `data || !isLoading` is inverted logic — shows the grid even when `data` is undefined if `isLoading` is `false`, which can cause `data.map()` to crash

### `client/src/scenes/customers/index.jsx`

Full-page MUI DataGrid showing all customers (users with role "user"):
- Columns: ID, Name, Email, Phone Number, Country, Occupation, Role
- Phone number column has a custom cell renderer to format as `(XXX)XXX-XXXX`

**Known bugs:**
- `rederCell` typo — should be `renderCell`. The phone formatting function never executes.
- `theme.palette.text.secondary[100]` — `text.secondary` is a color string in MUI, not an object. Indexing with `[100]` returns `undefined`.

### `client/src/scenes/transactions/index.jsx`

Server-side paginated DataGrid for transactions:
- Supports pagination (25/50/100 per page), server-side sorting, and search
- Uses `DataGridCustomToolbar` for the search input
- Sends `page`, `pageSize`, `sort` (JSON stringified), and `search` as query params to the backend
- Displays: ID, User ID, Created At, # of Products, Cost

This is the only page that implements proper server-side pagination.

### `client/src/scenes/geography/index.jsx`

Renders a Nivo `ResponsiveChoropleth` world map:
- Fetches country-wise user counts from `useGetGeographyQuery()`
- Overlays the API data onto the `geoData.features` polygons
- Color scale domain: 0–60 users
- Includes a legend on the right side
- Map is wrapped in a bordered container at 75vh height

### `client/src/scenes/overview/index.jsx`

A select dropdown (Sales / Units) + the `OverviewChart` component:
- User toggles between viewing total revenue or total units sold
- Renders the chart at 75vh height

**Known typo:** Subtitle says "genreal" instead of "general".

### `client/src/scenes/daily/index.jsx`

Daily sales chart with date-range filtering:
1. Two `DatePicker` components for start and end dates (defaults: Feb 1 – Mar 1, 2021)
2. Filters `dailyData` from `useGetSalesQuery()` to only include dates within the range
3. Renders a Nivo `ResponsiveLine` with two lines: Total Sales and Total Units
4. X-axis labels show `MM-DD` format (year prefix stripped)

### `client/src/scenes/monthly/index.jsx`

Monthly sales chart (similar to Daily but without date filtering):
1. Maps `monthlyData` into two Nivo line datasets (Total Sales, Total Units)
2. Renders both lines on a single `ResponsiveLine` chart
3. X-axis shows full month names

### `client/src/scenes/breakdown/index.jsx`

Full-page view of the `BreakdownChart` (pie/donut) component at 75vh height.

**Known typo:** Subtitle says "Breadown" instead of "Breakdown".

### `client/src/scenes/admin/index.jsx`

Admin users DataGrid — same structure as Customers but filters for `role: "admin"`:
- Uses `CustomColumnMenu` for column filter/hide functionality
- Same columns: ID, Name, Email, Phone Number, Country, Occupation, Role

**Known bugs:**
- Same `rederCell` typo as Customers — phone formatting never runs
- Same `theme.palette.text.secondary[100]` issue — returns `undefined`
- Uses deprecated `components` prop instead of MUI X v7's `slots` API

### `client/src/scenes/performance/index.jsx`

Shows the current user's affiliate sales transactions in a DataGrid:
1. Reads `userId` from Redux state
2. Fetches performance data with `useGetUserPerformanceQuery(userId)`
3. Displays transaction columns: ID, User ID, Created At, # of Products, Cost
4. Uses `CustomColumnMenu`

**Known issues:**
- Same deprecated `components` prop
- Same `theme.palette.text.secondary[100]` styling issue

---

## Server — Entry Point

### `server/index.js`

The Express server entry point:
1. Loads environment variables with `dotenv.config()`
2. Configures middleware: `express.json()`, `helmet` (security headers), `morgan` (HTTP logging), `body-parser`, `cors` (cross-origin)
3. Mounts route groups:
   - `/client` → products, customers, transactions, geography
   - `/general` → user profile, dashboard stats
   - `/management` → admins, performance
   - `/sales` → overall sales data
4. Connects to MongoDB via `process.env.MONGO_URL` and starts listening on `process.env.PORT` (fallback: 9000)
5. Contains commented-out `insertMany()` calls for one-time seed data population

---

## Server — Models (Mongoose Schemas)

### `server/models/User.js`

User schema with fields:
- `name` (required, 2–100 chars), `email` (required, unique, max 50 chars), `password` (required, min 5 chars)
- `city`, `state`, `country`, `occupation`, `phoneNumber` — all optional strings
- `transactions` — Array type (untyped)
- `role` — enum of `"user"`, `"admin"`, `"superadmin"` with **default `"admin"`** (unusual — most apps default to `"user"`)
- Includes `timestamps: true` for auto `createdAt`/`updatedAt`

### `server/models/Product.js`

Product schema: `name`, `price`, `description`, `catagory` (typo — should be `category`), `rating`, `supply`. All fields are optional with basic types. Timestamps enabled.

### `server/models/ProductStat.js`

Per-product statistics: `productId` (string reference), `yearlySalesTotal`, `yearlyTotalSoldUnits`, `year`, plus embedded arrays of `monthlyData` (month + totals) and `dailyData` (date + totals).

### `server/models/Transaction.js`

Transaction schema: `userId` (string), `cost` (string — stored as text, not number), `products` (defined as `[mongoose.Types.objectId]` with `of: Number`).

**Known issues:**
- `mongoose.Types.objectId` uses lowercase `o` — should be `ObjectId` (capital O)
- The `of: Number` mixed with an ObjectId array type definition is invalid/nonsensical
- `cost` is a String but the frontend formats it as a number with `.toFixed(2)`

### `server/models/OverallStat.js`

Aggregated yearly statistics:
- `totalCustomers`, `yearlySalesTotal`, `yearlyTotalSoldUnits`, `year`
- `monthlyData` array: `{month, totalSales, totalUnits}`
- `dailyData` array: `{date, totalSales, totalUnits}`
- `salesByCategory`: a `Map` of `String → Number`

The model name is lowercase `"overallStat"` (collection becomes `overallstats`).

### `server/models/AffiliateStat.js`

Affiliate statistics: `userId` (ObjectId ref to User) and `affiliateSales` (array of ObjectIds referencing Transactions). Used by the Performance page to show which transactions a user generated through affiliate links.

---

## Server — Routes

### `server/routes/general.js`

| Method | Path | Controller |
|--------|------|-----------|
| GET | `/general/user/:id` | `getUser` |
| GET | `/general/dashboard` | `getDashboardStats` |

### `server/routes/client.js`

| Method | Path | Controller |
|--------|------|-----------|
| GET | `/client/products` | `getProducts` |
| GET | `/client/customers` | `getCustomers` |
| GET | `/client/transactions` | `getTransactions` |
| GET | `/client/geography` | `getGeography` |

### `server/routes/management.js`

| Method | Path | Controller |
|--------|------|-----------|
| GET | `/management/admins` | `getAdmins` |
| GET | `/management/performance/:id` | `getUserPerformance` |

### `server/routes/sales.js`

| Method | Path | Controller |
|--------|------|-----------|
| GET | `/sales/sales` | `getSales` |

---

## Server — Controllers

### `server/controllers/general.js`

**`getUser(req, res)`** — Finds a user by `req.params.id` using `User.findById()`. Returns the full user document (including password — a security concern).

**`getDashboardStats(req, res)`** — Aggregates dashboard data with hardcoded date values:
- Fetches 50 most recent transactions (sorted by `createdOn` — but schema uses `createdAt`)
- Fetches overall stats with `.limit({ year: currentYear })` — **bug:** `.limit()` takes a number, not an object
- Finds the current month's stats from `monthlyData` array
- Finds today's stats from `dailyData` — **bug:** uses assignment `=` instead of comparison `===` in the `.find()` callback
- Returns: totalCustomers, yearlyTotalSoldUnits, yearlySalesTotal, monthlyData, salesByCategory, thisMonthStat, todayStats, transactions

### `server/controllers/client.js`

**`getProducts(req, res)`** — Fetches all products, then for each product fetches its `ProductStat` documents using `Promise.all`. Merges product + stat into a single object. This is an N+1 query pattern (1 query for products + N queries for stats).

**`getCustomers(req, res)`** — Fetches all users with `role: "user"`, excluding the password field with `.select("-password")`.

**`getTransactions(req, res)`** — Server-side paginated transactions:
- Accepts `page`, `pageSize`, `sort` (JSON), and `search` from query params
- Parses the sort JSON and constructs a MongoDB sort object
- Searches across `cost` and `userId` fields using `$or` + `$regex`
- Uses `.skip(page * pageSize).limit(pageSize)` for pagination
- Also fetches `total` count with a separate `countDocuments` query

**Known bug:** `sortParsed.sort = "asc" ? 1 : -1` uses assignment `=` instead of comparison `===`. This always assigns `"asc"` to `sort` and evaluates to `1`, so descending sort never works.

**`getGeography(req, res)`** — Fetches all users, groups them by country, converts ISO2 to ISO3 country codes using `country-iso-2-to-3`, and returns `{id, value}` pairs for the choropleth map.

### `server/controllers/management.js`

**`getAdmins(req, res)`** — Fetches all users with `role: "admin"`, excluding passwords.

**`getUserPerformance(req, res)`** — Uses a MongoDB aggregation pipeline:
1. `$match` the user by ID
2. `$lookup` to join `affiliatestats` collection
3. `$unwind` the affiliate stats
4. For each affiliate sale ID, fetches the full `Transaction` document using `Promise.all` + `Transaction.findById`
5. Filters out null transactions and returns user + sales data

### `server/controllers/sales.js`

**`getSales(req, res)`** — Simply fetches all `OverallStat` documents and returns the first one (`overallStats[0]`). This endpoint provides all sales data (yearly, monthly, daily, by category).

---

## Server — Seed Data

### `server/data/index.js`

Contains large exported arrays for one-time database population:
- `dataUser` — sample user records
- `dataProduct` — sample products
- `dataProductStat` — product statistics
- `dataTransaction` — sample transactions
- `dataOverallStat` — aggregate yearly statistics
- `dataAffiliateStat` — affiliate sales data

These are imported in `server/index.js` and used with `Model.insertMany()` (currently commented out). Should only be run once to seed the database.

---

## Summary of Known Bugs

| # | File | Bug |
|---|------|-----|
| 1 | `App.js:41` | Route `/Performance` (capital P) doesn't match sidebar's `/performance` |
| 2 | `StatBox.jsx:17` | `borderRadius: "0.55 rem"` — space before `rem` is invalid CSS |
| 3 | `StatBox.jsx:36` | `theme.palette.light` doesn't exist — should specify a color path |
| 4 | `customers/index.jsx:31` | `rederCell` typo — should be `renderCell` |
| 5 | `admin/index.jsx:32` | Same `rederCell` typo |
| 6 | `customers/index.jsx:67` | `theme.palette.text.secondary[100]` — `text.secondary` is a string, not indexable |
| 7 | `products/index.jsx:57` | `Button variant="primary"` — invalid MUI variant |
| 8 | `dashboard/index.jsx:28` | `console.log` left in production code |
| 9 | `overview/index.jsx:12` | Typo "genreal" should be "general" |
| 10 | `breakdown/index.jsx:9` | Typo "Breadown" should be "Breakdown" |
| 11 | `controllers/client.js:46` | `sortParsed.sort = "asc"` uses `=` instead of `===` |
| 12 | `controllers/general.js:25` | `.sort({ createdOn: -1 })` but schema field is `createdAt` |
| 13 | `controllers/general.js:28` | `.limit({ year: currentYear })` — `.limit()` takes a number |
| 14 | `controllers/general.js:42` | `return date = currentDay` uses assignment instead of `===` |
| 15 | `models/Product.js:9` | `catagory` typo — should be `category` |
| 16 | `models/Transaction.js:9` | `mongoose.Types.objectId` lowercase — should be `ObjectId` |
| 17 | `Sidebar.jsx:123` | `boxSixing` typo — should be `boxSizing` |
| 18 | `FlexBetween.jsx` | Uses CommonJS `require()` in an otherwise ESM codebase |
| 19 | `Navbar.jsx:13` / `Sidebar.jsx:34` | Imports `assets/profile.png` which doesn't exist in the repo |
