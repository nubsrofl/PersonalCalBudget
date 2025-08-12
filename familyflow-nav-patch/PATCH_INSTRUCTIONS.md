# FamilyFlow Navigation Patch

This patch adds a two-tab main menu so users can switch between:
- **Dashboard** (graphs & info), and
- **Calendar** (day/week/month views).

## Files included
- `src/components/NavTabs.tsx` (top tabs)
- `src/components/BottomNav.tsx` (mobile bottom bar)
- `src/app/calendar/page.tsx` (calendar page with Day/Week/Month switch)

## One manual edit
Open `src/app/layout.tsx` and:
1. Add the imports at the top:
```ts
import NavTabs from '@/components/NavTabs';
import BottomNav from '@/components/BottomNav';
```
2. In the `<header ...>` element, add `<NavTabs />` inside the header (e.g., to the right).
3. Just before the closing `</div>` that wraps your page, add `<BottomNav />` so the mobile bar appears.

Example minimal layout after patch:
```tsx
<header className="flex items-center justify-between py-4 gap-4">
  <h1 className="text-2xl font-semibold">FamilyFlow</h1>
  <NavTabs />
</header>
{children}
<BottomNav />
```

## Deploy
- Drop these files into your repo paths.
- Rebuild & restart: `docker compose up --build -d`
- Visit `/calendar` and use the view switch to toggle Day/Week/Month.
```

