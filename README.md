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

```
Email:    admin@cprinting.com
Password: admin123
```

Clients self-register at `/signup`. **Change the admin password and set `JWT_SECRET` before any real deployment.**

## How it works

- **Auth** — bcrypt-hashed passwords + JWT sessions in an httpOnly cookie (`jose`). Route protection via `src/middleware.ts`.
- **Database** — [Turso](https://turso.tech) (libSQL / cloud SQLite) via `@libsql/client`. Locally it falls back to a `file:./data/app.db` SQLite file when no Turso env vars are set, so you can develop with zero setup.
- **Uploads** — PDFs go to [Vercel Blob](https://vercel.com/storage/blob) in production (local `data/uploads/` in dev). Files are served only to the owner or an admin via `/api/uploads/[id]`.
- **Checkout** — mock invoicing: store orders are placed as "unpaid" and the admin sets amounts / records payment.

## Environment variables

See [`.env.example`](.env.example). For local dev you can leave the Turso/Blob vars empty (it uses a local file + local uploads).

| Var | Purpose | Required in prod? |
| --- | --- | --- |
| `JWT_SECRET` | Signs session tokens | ✅ yes |
| `TURSO_DATABASE_URL` | libSQL database URL | ✅ yes |
| `TURSO_AUTH_TOKEN` | libSQL auth token | ✅ yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (PDF storage) | ✅ for uploads (auto-set by Vercel) |

## Deploying to Vercel

The portal/admin need a cloud database and file storage because Vercel's filesystem is read-only. One-time setup:

1. **Create a Turso database** (free):
   ```bash
   # install CLI: https://docs.turso.tech/cli/installation
   turso db create c-printing
   turso db show c-printing --url        # -> TURSO_DATABASE_URL
   turso db tokens create c-printing     # -> TURSO_AUTH_TOKEN
   ```
2. **Add Vercel Blob storage:** Vercel dashboard → your project → **Storage** → **Create** → **Blob** → connect it. This auto-adds `BLOB_READ_WRITE_TOKEN`.
3. **Set env vars** in Vercel → Settings → Environment Variables:
   `JWT_SECRET`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (Blob token is added for you).
4. **Redeploy.** Tables and the default accounts are created automatically on first run.

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
    db.ts               # libSQL (Turso) connection, schema, seeds, query helpers
    storage.ts          # PDF storage (Vercel Blob in prod, local fs in dev)
    auth.ts             # password hashing + JWT sessions
    actions.ts          # server actions (auth, orders, billing)
    format.ts           # money/date/status helpers
  middleware.ts         # protects /portal and /admin
```

## Design system

The brand palette is inspired by **CMYK** printing — Cyan, Magenta, Yellow, Key (black).
Design tokens (colors, gradients, shadows, radii) and reusable utility classes
(`.btn`, `.card`, `.section`, `.eyebrow`, `.grid`, etc.) live in `src/app/globals.css`.
