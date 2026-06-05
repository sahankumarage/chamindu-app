# C Printing

A modern marketing website for **C Printing** — a full-service studio for **printing, design, advertising** and a **creative supplies store**.

Built with [Next.js 16](https://nextjs.org) (App Router), React 19 and TypeScript. Styled with a custom CMYK-inspired design system (no UI framework — plain CSS + CSS Modules). Includes a **client portal** and **admin panel** backed by a zero-setup SQLite database.

## Public pages

| Route | Description |
| --- | --- |
| `/` | Home — hero, services overview, why-us, testimonials, CTA |
| `/services/printing` | Printing service details |
| `/services/designing` | Design service details |
| `/services/advertising` | Advertising service details |
| `/store` | Creative supplies store — add to cart & buy |
| `/cart` | Shopping cart + checkout |
| `/about` | About us — story, mission/vision, values, team |
| `/contact` | Contact form + studio info |
| `/login`, `/signup` | Client authentication |

## Client portal (`/portal`) — signed-in clients

- **Dashboard** — order stats and recent activity
- **My Orders** — every print/store order with status, items and file links
- **New Print Order** — create an order and upload a print-ready PDF
- **Billing** — invoices, outstanding balance and payment history

## Admin panel (`/admin`) — admins only

- **Overview** — orders, revenue, pending jobs, client count
- **Orders** — update status, view client details, download uploaded PDFs
- **Billing** — set quotes/amounts and mark invoices paid/unpaid
- **Clients** — client list with order counts and totals

### Accounts

A default admin is seeded on first run:

**Client**
```
Email:    client@cprinting.com
Password: client123
```
**Admin**
```
Email:    admin@cprinting.com
Password: admin123
```

New clients can also self-register at `/signup` (see the demo-mode note below).

## Demo mode (no database)

The app currently runs **without any database** — accounts and demo data are hardcoded in [`src/lib/store.ts`](src/lib/store.ts) and held in memory. This means:

- ✅ No setup, no env vars — deploys to Vercel and works immediately.
- ⚠️ New signups, orders and status changes live in server memory only. They persist while the instance is warm but **reset on restart and aren't shared between serverless instances**. Uploaded PDFs are kept in memory for the same session.

To make data permanent later, replace `src/lib/store.ts` with a real database (e.g. Turso + Vercel Blob) — the rest of the app calls it through a small set of functions (`findUserByEmail`, `listOrdersByUser`, `createOrder`, …) so only that one file needs to change.

## How it works

- **Auth** — JWT sessions in an httpOnly cookie (`jose`); credentials checked against the in-memory store. Route protection via `src/middleware.ts`.
- **Data** — in-memory store in `src/lib/store.ts` (hardcoded users + seeded demo orders).
- **Checkout** — mock invoicing: store orders are placed as "unpaid" and the admin sets amounts / records payment.

## Environment variables

None required. Optionally set `JWT_SECRET` (a long random string) to sign session tokens — see [`.env.example`](.env.example).

## Getting started

```bash
npm install
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Project structure

```
src/
  app/
    layout.tsx          # root layout (Navbar + Footer + CartProvider + session)
    globals.css         # design tokens + utility classes
    page.tsx            # home page
    services/{printing,designing,advertising}/page.tsx
    store/page.tsx      # catalog with add-to-cart
    cart/page.tsx       # cart + checkout
    about/, contact/
    login/, signup/     # auth pages (server actions)
    portal/             # client portal (layout + dashboard/orders/billing)
    admin/              # admin panel (layout + overview/orders/billing/clients)
    api/uploads/[id]/   # protected PDF file serving
  components/
    Navbar.tsx, Footer.tsx, Logo.tsx, Reveal.tsx
    ServicePage.tsx     # shared layout for the three service pages
    CartContext.tsx     # cart state (localStorage)
    DashboardShell.tsx  # sidebar shell shared by portal + admin
    StatusBadge.tsx     # order/payment status badges
  lib/
    store.ts            # in-memory data store (hardcoded users + demo orders)
    auth.ts             # JWT sessions
    actions.ts          # server actions (auth, orders, billing)
    format.ts           # money/date/status helpers
  middleware.ts         # protects /portal and /admin
```

## Design system

The brand palette is inspired by **CMYK** printing — Cyan, Magenta, Yellow, Key (black).
Design tokens (colors, gradients, shadows, radii) and reusable utility classes
(`.btn`, `.card`, `.section`, `.eyebrow`, `.grid`, etc.) live in `src/app/globals.css`.
