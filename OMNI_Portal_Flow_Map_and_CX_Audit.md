# OMNI Customer Portal — Flow Map & CX/Retention Audit

Author: CX Retention audit (sourced 1:1 from the React code in `src/`)
Scope: every file in `OMNI Portal Experience/src`, every route, every modal, every CTA, every cancel branch.
This is a map + diagnosis. No code rewrites. File names and component names are called out so the team can act.

---

## 1. File-by-file map of what each piece does

### Entry & shell
- **`index.html`** — Mounts a single `<div id="root">`. Loads `/src/main.jsx`. No login gate, no SSR. The portal is a pure client app.
- **`src/main.jsx`** — React 18 strict-mode render of `<App />`. Nothing else.
- **`src/App.jsx`** — Top-level router-by-state. There is **no real login**; the app boots straight into the "home" view. It owns two pieces of state: `view` (home | manage | orders | refer | account) and `modal` (string title used by `ActionModal`). It conditionally wraps `orders / refer / account` in a `portal-shell-dashboard` layout with `SubscriptionListPage.Nav` (the left rail). Home and Manage render their own shell. This is where the **"Log out" and "Add new subscription" modals are essentially placeholder text** — they only show a sentence and a Continue button that closes itself (lines 46–51 of `App.jsx`).

### Layout
- **`components/Header.jsx`** — Black bar with `SHOP NOW` text-link (left), OMNI logo (center), and two icon buttons (Account, Cart). **Both icon buttons are `<button>` with no `onClick`** — they look interactive, do nothing. The "SHOP NOW" link is `href="#"`.
- **`components/Footer.jsx`** — Newsletter signup (hidden inside the portal, `hideNewsletter={true}`), Shop / Connect column, social links, terms/privacy/refunds, and FDA disclaimer. **Every `<a>` is `href="#"`.** The newsletter `<input>` has no submit button or handler.
- **`components/PortalNav.jsx`** — Left side rail used on every dashboard view. Links: Home / Order History / Refer a Friend / Manage Subscriptions / Account / Log out. Auto-scrolls active item into view (mobile horizontal scroll). Calls `onNavigate(id)` and `onLogout()`.
- **`components/Button.jsx`** — Shared button primitive. Variants `primary` (filled) and `outline`. `btn-sm` size and `btn-block` are supported in code but `btn-sm` is unused in CSS.
- **`components/Icons.jsx`** — RefreshIcon, ChevronLeft, TagIcon. Only `ChevronLeft` is actually used (on the Back button in `SubscriptionDetailPage`). **RefreshIcon and TagIcon are unused.**
- **`components/ActionModal.jsx`** — The generic modal. Locks `document.body` scroll on open. Default footer = `Cancel` + `Continue`. Can be hidden via `hideFooter`. The default `Continue` button does nothing other than close (`onAction || onClose`). This is the modal used by **most "placeholder" actions** across the app.

### Pages
- **`pages/SubscriptionListPage.jsx`** — Home dashboard. Greets the user, shows next order date + plan + order value + member savings strip, a "Next OMNI order" command card with `Open details`, then `<PortalOfferStack variant="home">`. Two CTAs in top-right: `Manage subscription` (goes to detail page) and `Add product` (opens the placeholder "Add new subscription" modal).
- **`pages/OrderHistoryPage.jsx`** — Static array of three fulfilled orders (hardcoded). Each row has a `View details` outline button that opens an `Order details` modal with **generic boilerplate copy** — no actual order data is shown.
- **`pages/ReferFriendPage.jsx`** — A bare HTML form (First name, Last name, Email, Phone). Submit fires `onOpenModal("Referral eligibility")` which shows one sentence of placeholder. "Already submitted a referral? Review status." button → another placeholder modal. No referral code is rendered here despite `App.jsx` having logic for a `Copy referral code` modal that **nothing in the UI ever triggers** (dead code path).
- **`pages/AccountPage.jsx`** — Four info cards: Name, Email, Shipping address, Payment method. Each `Edit` button opens an empty `ActionModal` with one boilerplate sentence — **none of the edits exist** on this surface. (Real shipping/billing editors live inside `ProductWorkspace` on the Manage screen.) Confusing — Account screen looks editable but isn't.
- **`pages/SubscriptionDetailPage.jsx`** — The Manage Subscription surface. Owns most of the working flows: Order now, Change next order date, Skip (with confirm + success screen), Pause (4/8/12 weeks via toast), Manage payment, Update shipping, Cancel subscription (via `CancelIntroVideoModal` → `CancellationFlow`). Also embeds `<PortalOfferStack variant="manage">` and `<ProductWorkspace>`.

### Offer surface
- **`components/PortalOfferStack.jsx`** — Holds three separate offer arrays (`offers`, `manageOffers`, `homeOffers`) and renders different card UIs per `variant`. Each card opens an `ActionModal` with rich copy + bullets + image. **The modal Continue button (e.g. "Add gummies", "Swap my flavor", "Upgrade to quarterly") has no `onAction` handler — so clicking the offer CTA only closes the modal.** No state is mutated, no order changes, no toast.
- **`components/PortalOfferBlock.jsx`** — Legacy hero/campaign block used only by the default (non-home, non-manage) variant of `PortalOfferStack`. With current page wiring (`home` and `manage` are the only variants used), this component renders **only inside dead branches**.

### Subscription tools surface
- **`components/ProductWorkspace.jsx`** — The real working workspace under the offer grid on Manage. It contains:
  - **Claim Free Gift** card → opens a two-step modal: (1) ship to me OR send to friend → (2) friend form. On confirm it `localStorage`-locks the claim for **60 seconds only** (`GIFT_LOCK_KEY` + `until = Date.now()+60000`, lines 81–123). After 60 seconds the lock auto-resets and the gift card reappears — i.e. customers can re-claim repeatedly. Almost certainly an unintended dev value; in production this should be tied to the subscription record, not a 1-minute timer.
  - **Swap Flavor** card → Peach / Watermelon → `Confirm swap` modal → sets `flavorSaved = true` → inline confirmation text.
  - **Shipping information** card → `Edit shipping` modal with real form fields and a `Save address` button that just closes the modal (no persistence).
  - **Billing** card → `Edit billing` (card number/CVV disabled), `Add backup card` (writes to local component state — visible only until reload). Persistence is not connected.
  - **Summary** card with subtotal, shipping, hardcoded `Apply` promo button (no handler).
  - **You might also like** rail with three product recommendations. Each `Add` button opens an `Add to next order` placeholder modal.
- **`components/CancelIntroVideoModal.jsx`** — Save-attempt #0 before cancellation. Plays `/assets/omni-founder-message.mp4` (autoplay, unmuted) with three Skip radio options (1 / 2 / 4 weeks). Outline button = "Continue to cancellation". Primary button = "Skip next order" (selected option saved to a toast only — no real skip applied).
- **`components/CancellationFlow.jsx`** — The full cancellation flow (15 reasons, 7 branch types). Detailed in section 4 below.

### Data
- **`data/subscription.js`** — Hardcoded subscription record (status, next order date, frequency, products array, shipping, payment). The portal **does not fetch live data**; everything is read from this object.

### Styles
- **`src/styles.css`** — 5,284 lines. One stylesheet for the whole portal. Mobile breakpoints exist at 540 / 700 / 720 / 760 / 980 / 1040 px. Approximately **40+ class names defined in CSS that are never referenced in any JSX** (e.g. `card`, `info-card`, `danger-zone`, `dashboard-head`, `current-product-row`, `delivery-row`, `cancel-link`, `eligible-note`, `btn-sm`). Dead but harmless — bloats the bundle, makes future cleanup risky.

---

## 2. Full customer journey map

| # | Step | What the customer sees | What controls it |
|---|---|---|---|
| 1 | **Portal entry** | App boots straight to Home — no login UI, no auth | `App.jsx` (`view = "home"` default) |
| 2 | **Home (Hello, Saba)** | Greeting, next order strip, "Next OMNI order" card, three home offer cards (Try gummies / Swap flavor / Upgrade to quarterly) | `SubscriptionListPage.jsx` + `PortalOfferStack variant="home"` |
| 3 | **Navigate via left rail** | Home / Order History / Refer a Friend / Manage Subscriptions / Account / Log out | `PortalNav.jsx` |
| 4 | **Order History** | Three hardcoded fulfilled orders, each with "View details" → placeholder modal | `OrderHistoryPage.jsx` |
| 5 | **Refer a Friend** | Form (name / email / phone) → "Check eligibility" → placeholder modal; "Review status" → placeholder modal | `ReferFriendPage.jsx` |
| 6 | **Manage Subscriptions** | Hero ($115 · Next on June 26), four action buttons (Order now / Next order date / Skip / More), Your subscription card, Member offers (2 cards), then full ProductWorkspace | `SubscriptionDetailPage.jsx` |
| 7 | **Account** | Four info cards with Edit buttons that open placeholders | `AccountPage.jsx` |
| 8 | **Log out** | Placeholder modal with text only — no actual logout | `App.jsx` line 46 |

### Sub-flows from Manage Subscriptions

**Order now** → `ActionModal` ("Your next OMNI order is ready to process today.") → Cancel / Continue → Continue closes modal. *No state change. No charge logic stubbed. Dead-feeling.*

**Next order date** → `ActionModal` with HTML5 `<input type="date">` (min 2026-05-07) → `Save date` → toast "Next order date updated." + the hero `displayDate` updates locally. *This one actually persists in component state.*

**Skip** → `Skip this order?` confirm modal with `Yes, skip it` / `Keep my order` → on Yes, **the entire page is replaced** by a full-screen "Your order has been skipped" success screen (`skip-success-screen` block, line 60 of SubscriptionDetailPage). No way back except left-rail navigation. The body of the page is gone until the user clicks Home or another nav item. *Borderline dead-end — see issues.*

**More menu** → reveals Pause subscription / Cancel subscription / Manage payment / Update shipping.

**Pause** → `Pause subscription` modal with three buttons (4 / 8 / 12 weeks) → each just fires a toast and closes. *No pause is actually applied.*

**Manage payment** / **Update shipping** → boilerplate modals from More menu, even though the same surfaces exist as real forms inside `ProductWorkspace`. Two places to edit the same data, one fake, one half-real.

**Cancel subscription** → opens `CancelIntroVideoModal` (founder video + skip 1/2/4 weeks). User can:
  - Close the X → returns to Manage
  - Pick a skip option + click "Skip next order" → toast only, no actual skip
  - Click "Continue to cancellation" → opens `CancellationFlow` (the long flow)

### Offer paths (Home + Manage)

Home offers (`homeOffers` in PortalOfferStack):
1. **Try OMNI today** (add gummies) → modal with copy → CTA "Add gummies" closes modal, no order edit.
2. **Swap Flavor** → modal → CTA "Swap my flavor" closes modal, no swap. *(Note: the real swap UI lives in `ProductWorkspace` on Manage — these home tiles only describe the action; they don't perform it.)*
3. **Upgrade to Quarterly** → modal → CTA "Upgrade to quarterly" closes modal, no plan change.

Manage offers (`manageOffers`):
1. **Upgrade to Quarterly** → modal → "Upgrade now" closes modal.
2. **Add Electrolytes** → modal → "Add to subscription" closes modal.

**Every offer modal is a marketing card with no terminal action.** This is the single biggest gap in the retention surface — the customer is invited to act, then nothing happens.

### Working actions inside `ProductWorkspace`

- **Claim Free Gift** (real flow, 2 steps, optimistic UI, **60-second lock**)
- **Swap Flavor** (real local state with confirm modal)
- **Edit shipping** (real form, save button does not persist)
- **Edit billing** (card number / CVV disabled — non-functional editor)
- **Add backup card** (writes to in-memory `backupCards` array — lost on refresh)
- **Recommended products / Add** → placeholder modal
- **Apply promo code** → button has no handler

---

## 3. Per-screen flow map (the format you asked for)

### Screen: Header
- Purpose: brand and global nav back to shop / account / cart
- Customer actions available: "SHOP NOW" link (`href="#"`), account icon (no handler), cart icon (no handler)
- Next screen or modal: none — clicks do nothing
- Controlled by file: `components/Header.jsx`
- Retention role: very low — should expose member status, points, or "next order in X days"
- Issues or notes: three visible CTAs are all non-functional. The account icon is the most likely-to-be-clicked element and it's dead.

### Screen: Home (Hello, Saba)
- Purpose: surface next order, push upgrades, give one-click manage entry
- Customer actions: `Manage subscription`, `Add product`, `Open details`, three offer cards (Add gummies / Swap flavor / Upgrade to quarterly)
- Next: Manage subscription → SubscriptionDetailPage. Add product → placeholder modal. Offer cards → marketing modals that close on confirm.
- File: `pages/SubscriptionListPage.jsx`, `components/PortalOfferStack.jsx`
- Retention role: high — first impression. Currently strong visually, weak operationally.
- Issues: offers are not wired to portal state. "Add product" goes to placeholder. Order value + member savings strip is a good retention proof; keep it.

### Screen: Manage Subscription (hero + four buttons)
- Purpose: control surface for the active subscription
- Customer actions: Back, Order now, Next order date, Skip, More (Pause / Cancel / Manage payment / Update shipping)
- Next: each opens a modal (most are placeholder) — Skip opens confirm → success screen; Cancel opens video modal → cancellation flow
- File: `pages/SubscriptionDetailPage.jsx`
- Retention role: highest — every retention save lives here
- Issues:
  - Cancel sits next to Manage payment / Update shipping in the More menu, with no visual de-emphasis or extra friction beyond the video gate
  - Pause is offered only as 4/8/12-week buttons with no "Pause until X date" option
  - The four primary buttons (Order now / Next order date / Skip / More) are visually identical outlines — no hierarchy that signals **Skip and Pause are the retention-positive options**

### Screen: Manage Subscription — embedded offers (2 cards)
- Purpose: cross-sell quarterly upgrade + electrolytes
- Actions: click card → marketing modal → CTA → closes modal
- File: `components/PortalOfferStack.jsx` (`manageOffers`)
- Retention role: medium — well written, but the "Upgrade now" / "Add to subscription" CTAs are not connected to subscription mutation logic
- Issues: customer expects clicking "Upgrade now" to actually upgrade. Right now it does nothing.

### Screen: Manage Subscription — Product Workspace
- Purpose: claim gift, swap flavor, edit shipping / billing, see summary, see recommendations
- Actions: many (see file summary)
- File: `components/ProductWorkspace.jsx`
- Retention role: high — this is where most "felt-real" actions are concentrated
- Issues:
  - Free gift `localStorage` 60-second timer (line 82)
  - Edit billing has disabled card number / CVV (line 414, 417) — looks like a form but can't be used
  - Add backup card writes to ephemeral state only
  - Promo input has no submit logic

### Screen: Skip success
- Purpose: confirmation after skipping the next order
- Actions: none on the page itself — only left rail
- File: `pages/SubscriptionDetailPage.jsx` lines 59–79
- Retention role: low (and risky)
- Issues: the entire main panel is replaced. There's no "Return to subscription overview" button (compare with `CancellationSavedScreen` which has one — they should match). A user who just skipped is in the most positive retention moment and is shown nothing to do next. Add a "Back to subscription" + an upsell (e.g., "Want to skip one more?" / "Add electrolytes to the next box").

### Screen: Pause modal
- Purpose: pick a pause length
- Actions: 4 / 8 / 12 weeks → toast → modal closes
- File: `pages/SubscriptionDetailPage.jsx` lines 176–185
- Retention role: high — but it's currently just chrome
- Issues: no "custom restart date", no confirmation screen, no follow-up. Compare to the same pause UX inside `CancellationFlow.branchConfig.pause` which is much richer (2 / 4 / 8 weeks + custom restart date + note). The two pause UIs disagree.

### Screen: Cancel intro / founder video
- Purpose: emotional save attempt before the cancellation funnel
- Actions: close, continue to cancellation, pick skip option, "Skip next order"
- File: `components/CancelIntroVideoModal.jsx`
- Retention role: high
- Issues: video autoplays unmuted (line 38). Many browsers block this; the failure is silently swallowed (`.catch(() => {})`). Customer hears nothing or jumps when audio kicks in unexpectedly. Add a mute-by-default fallback with a clear unmute control.

### Screen: Order History
- Purpose: review past orders
- Actions: View details → placeholder modal
- File: `pages/OrderHistoryPage.jsx`
- Retention role: low/medium (proves value over time)
- Issues: data is hardcoded (3 orders). View details opens a generic modal. No tracking number, invoice link, reorder, or rate-product. Big missed retention surface.

### Screen: Refer a Friend
- Purpose: drive referrals
- Actions: form submit, "Review status"
- File: `pages/ReferFriendPage.jsx`
- Retention role: high
- Issues: the page asks the customer to **submit their own details** to "check eligibility" — that is backwards. A referral page should show the customer's referral link/code first (the `Copy referral code` modal exists in `App.jsx` but is never triggered) and a share button. The "eligibility" framing reads like a denial-first policy.

### Screen: Account
- Purpose: edit profile and payment
- Actions: Edit on each of four cards → placeholder modal
- File: `pages/AccountPage.jsx`
- Retention role: medium
- Issues: real edit forms exist inside `ProductWorkspace` but not here. Two surfaces for the same data and only one has working forms. Consolidate or wire up.

### Screen: Cancellation Flow (multi-step modal)
See section 4 for the full breakdown.

---

## 4. Cancellation flow — deep dive

### Entry
Cancel can be reached from one place only: **More menu on the Manage page → "Cancel subscription"** (lines 109–110 of `SubscriptionDetailPage.jsx`). That opens `CancelIntroVideoModal` (save attempt #0 — founder video + skip 1/2/4 weeks). Only the outline button "Continue to cancellation" enters the real flow.

### Flow architecture (in `CancellationFlow.jsx`)
The flow has five steps and tracks each via `omni:cancellation` custom events + `dataLayer.push`:

1. **reason** — pick one of 15 reasons (`CancellationReasonSelect`)
2. **save** — reason-specific save page with sub-reason selector, insight cards, and 2–4 CTAs (`CancellationSavePage`)
3. **branch** — chosen save option (skip / pause / cadence / savings / product / education / plan)
4. **rescue** — final save attempt with reason-specific copy + "recommended" + "optional" action cards (`CancellationRescuePage`)
5. **confirm** — *only here* does the destructive "Cancel subscription" button appear (`CancellationFinalConfirm`)

A separate **Contact support** path can short-circuit the flow at the save step (issue/packaging/digestion/sugar/editing/other reasons) — it opens `https://contact.gorgias.help/en-US/forms/0c4rzba9?context=...` in a new tab and closes the modal.

### The 15 reasons and what happens after each

| # | Reason | Save page primary CTA | Save page secondary CTAs | Rescue page action(s) | Final cancel option exists? |
|---|---|---|---|---|---|
| 1 | I haven't seen results yet | Build my consistency plan | Move to 8 weeks | Build consistency plan / Move to 8 weeks | Yes (after rescue) |
| 2 | Hard to remember / not consistent | Build my habit plan | Move to 8 weeks · Skip next order | Build habit plan / Pause | Yes |
| 3 | I'm stocked up | Skip next order | 8 wk · 12 wk · Pause | Skip / Move to 12 weeks | Yes |
| 4 | Too expensive | Apply 50% off next 3 orders | Skip and keep offer · Move to 8 weeks | Apply savings / Keep current plan | Yes |
| 5 | I don't like subscriptions | Skip next order | Pause · 8 weeks | Skip / Pause | Yes |
| 6 | Flavor or texture not a fit | Swap to a better fit | Get my product plan | Swap flavor / Switch format | Yes |
| 7 | Too much sugar | Switch to electrolyte stick packs | Skip · Contact support | Switch to electrolytes / Skip | Yes |
| 8 | Not agreeing with digestion | Build gentler routine | Switch product · Contact support | Switch to electrolytes / Build gentler routine | Yes |
| 9 | Orders ship too fast | Move next order date | 8 wk · 12 wk · Skip | Move date / Skip / 8 weeks | Yes |
| 10 | I no longer need it | Pause | Skip · 12 weeks | Pause / Skip | Yes |
| 11 | Issue with my gummies | Contact support (requires detail) | Pause | Contact support / Pause | Yes |
| 12 | Packaging issue | Contact support (requires detail) | Pause | Contact support / Pause | Yes |
| 13 | I found a better alternative | See why members stay | Get personalized plan · Apply savings | Swap flavor / Switch format | Yes |
| 14 | Trouble editing subscription | Change delivery frequency | Skip · Pause · Contact support | Pause / Skip (default) | Yes |
| 15 | Other reason | Contact support | Pause · Skip | Pause / Skip (default) | Yes |

### Final cancel option
The **only** "Cancel subscription" red/destructive button lives on the `CancellationFinalConfirm` step (line 1036). To reach it, the customer must pass through: cancel-intro-video → reason select → save page → "Review final step" link → rescue page → "Continue to final cancellation" text link → confirm screen with "Contact support" on the left and "Cancel subscription" on the right.

That's **6 screens of friction** between "I want to cancel" and the destructive button. That is retention-positive design.

### Retention scoring of the cancellation flow

**Strengths**
- 15 reason taxonomy is detailed and product-aware (digestion, sugar, packaging, etc.)
- Every reason has a unique save copy + at least 2 alternatives — no generic "are you sure?"
- Reasons that need support (issue, packaging) are routed to Gorgias with `?context=...` rather than letting the customer churn over a fixable problem
- Event tracking (`omni:cancellation` + `dataLayer.push`) is wired up — leadership can see funnel drop-off per step
- Final destructive button is small, secondary in visual weight, and gated behind a rescue page
- The "Review final step" link is intentionally low-emphasis text (good — softens the exit ramp)

**Risks**
- The cancellation flow's pause / skip / cadence options are **richer and better than the ones in the main portal** (Pause has custom restart date here, only 4/8/12 buttons in the main More menu). A customer who pauses *outside* the cancel flow gets a worse experience than a customer who threatens to cancel. That's perverse.
- Selected sub-reason in the cancel flow does not persist to the rescue/confirm step — useful diagnostic data is captured in events but not shown back to the customer (could be used to reinforce save copy: "You said one extra pouch — here's how to time the next order.")
- "Apply 50% off next 3 orders" (line 102) is offered only on the "Too expensive" reason. It is a one-time-feeling discount with no enforcement — there's no proof in the data that the offer actually applies, nor any cap protection.
- "Cancel subscription" on `CancellationFinalConfirm` uses `btn btn-primary` styling (line 1036) — meaning the destructive action is rendered in your **primary brand color**, side-by-side with a Contact support outline button. The primary visual style on a destructive button violates standard UX hierarchy and reads as "this is the recommended action." Should be `btn-outline` or a muted/secondary style; Contact support should be primary.
- The `CancellationSavedScreen` final confirmation says "Your subscription stays active" but the rescue/branch actions don't actually persist anywhere — visual confidence vs. backend reality is a churn liability when the customer's next order still ships unchanged.

**Verdict:** the cancellation funnel structure is retention-focused. The main portal around it is not. A customer who is *thinking* about canceling but doesn't enter the cancel flow has access to weaker retention tools than one who does.

---

## 5. Broken / confusing / dead-end paths

### Buttons and links that do nothing
| Location | Element | File | What's wrong |
|---|---|---|---|
| Header | "SHOP NOW" text-link | `Header.jsx` line 9 | `href="#"` |
| Header | Account icon button | `Header.jsx` lines 15–21 | No onClick |
| Header | Cart icon button | `Header.jsx` lines 22–29 | No onClick |
| Footer | "SHOP NOW" / "CONTACT US" / "ACCOUNT LOGIN" | `Footer.jsx` 22–28 | `href="#"` |
| Footer | TikTok / Instagram / Facebook | `Footer.jsx` 39–41 | `href="#"` |
| Footer | Terms / Privacy / Refunds | `Footer.jsx` 44–46 | `href="#"` |
| Footer | Newsletter email input | `Footer.jsx` 16 | No submit, no handler |
| Home | "Add product" | `App.jsx` 27 + 47 | Placeholder modal only |
| Home offers | All 3 CTAs | `PortalOfferStack.jsx` 168–202 | Modal Continue button has no `onAction` |
| Manage offers | "Upgrade now" / "Add to subscription" | `PortalOfferStack.jsx` 205–240 | Same — modal closes, no mutation |
| Manage | "Order now" Continue | `SubscriptionDetailPage.jsx` 159–161 | Just text |
| Manage | "Manage payment" / "Update shipping" in More | `SubscriptionDetailPage.jsx` 186–191 | Placeholder, while real forms exist in ProductWorkspace |
| Order History | "View details" on every order | `OrderHistoryPage.jsx` 41 | Generic modal copy |
| Account | "Edit" on all four cards | `AccountPage.jsx` 26 | Boilerplate sentence |
| ProductWorkspace | "Apply" promo code | `ProductWorkspace.jsx` 274 | No handler |
| ProductWorkspace | "Add" on recommended products | `ProductWorkspace.jsx` 300 | Placeholder modal |
| ProductWorkspace | "Edit billing" Card number / CVV | `ProductWorkspace.jsx` 414, 417 | `<input>` is `disabled` |
| ProductWorkspace | "Save address" / "Save changes" | `ProductWorkspace.jsx` 407, 419 | Just closes modal |

### Dead-end screens
- **Skip success** (line 59–79 of `SubscriptionDetailPage.jsx`) — main column is wiped, no next-step CTA, no toast, no "Back to subscription". Customer has to use the left rail.
- **`CancellationSavedScreen`** at least has a "Return to subscription overview" button (line 1056). The Skip success screen should match.
- **Refer-a-friend submission** — submit → modal → modal closes → user is left on the form. No "thank you, here's your code" surface.

### UI hierarchy / confusion
- All four primary buttons on the Manage hero use the same `btn-outline` style (Next order date / Skip / More). Order now is `btn-primary`. Skip and Pause — your highest-value retention actions — visually look equal to Cancel-adjacent actions hiding behind More. Reposition: make **Skip** the visual hero, demote Cancel.
- "Cancel subscription" in More menu is just text — equal weight with Pause, Manage payment, Update shipping. Should be visually de-emphasized (smaller, gray, separated by a divider) and Pause should be promoted to the main button row.
- "Add product" sits next to "Manage subscription" with equal weight on home. Add product is the lower-intent action and currently dead anyway.
- `PortalOfferStack` exists in three variants — `home`, `manage`, and a default variant — and the default variant (which uses `PortalOfferBlock` with hotspots) is **not actually used** anywhere in the live wiring. That's a whole branch of dead code (`offers` array + `PortalOfferBlock.jsx`).
- `App.jsx` modal switch includes branches for `Copy referral code`, `Referral eligibility`, `Referral status` — but only the latter two are reachable from `ReferFriendPage.jsx`. `Copy referral code` is a dead modal title (line 48).

### Mobile / responsive notes
- Side nav `PortalNav` auto-scrolls active item into view (good for horizontal mobile scroll).
- `styles.css` has breakpoints at 540/720/760/980 — coverage is reasonable but the offer card grid on Manage (two cards side by side) likely cramps under 540px; verify on real device.
- `CancelIntroVideoModal` video autoplays unmuted — on iOS Safari this is blocked silently, and the founder save gets skipped. Add a poster + mute fallback.
- Skip success screen takes the full main column — on mobile this is even more of a void.

### Contrast / weight
- `mini-label` and `cancel-kicker` are visually small/gray (good for hierarchy) but used throughout — verify against WCAG AA against the white card backgrounds; in CSS several gray values are around `#888–#999` which can fail on light backgrounds.
- Cancel page's primary destructive button is currently `btn-primary` (line 1036) — should be visually destructive *or* visually de-emphasized, not in your primary brand color.

### Repeated / unused code
- `Icons.jsx` — `RefreshIcon` and `TagIcon` not used. Minor.
- `PortalOfferBlock.jsx` — only used by the unused default variant of `PortalOfferStack`.
- ~40 CSS class names defined but never referenced in any JSX or template literal: notable examples `danger-zone`, `dashboard-head`, `current-product-row`, `delivery-row`, `cancel-link`, `eligible-note`, `btn-sm`, `info-card`.
- `App.jsx` has a `Copy referral code` modal branch that no UI triggers.
- Two parallel surfaces edit the same data — Account page Edit buttons (fake) vs. ProductWorkspace shipping/billing cards (real but non-persistent). Pick one.

---

## 6. Clean flow map (per-screen, the requested format)

```
SCREEN: Home (Hello, Saba)
PURPOSE: First impression, surface next order + offers, route to Manage
ACTIONS: Manage subscription · Add product · Open details · 3 offer cards
NEXT: Manage page (works) · placeholder modal · Manage page · marketing modal (no action)
FILE: pages/SubscriptionListPage.jsx + components/PortalOfferStack.jsx (home)
RETENTION ROLE: HIGH — primary save surface before More menu
ISSUES: Offer CTAs do nothing. Add product is a dead modal.

SCREEN: Order History
PURPOSE: Show past orders, prove value
ACTIONS: View details (per order)
NEXT: Placeholder modal
FILE: pages/OrderHistoryPage.jsx
RETENTION ROLE: MEDIUM — proves consistency
ISSUES: Hardcoded data, no reorder, no invoice, no tracking, no review prompts

SCREEN: Refer a Friend
PURPOSE: Drive referrals
ACTIONS: Submit eligibility form · Review status
NEXT: Placeholder modal
FILE: pages/ReferFriendPage.jsx
RETENTION ROLE: HIGH — referral-driven retention proxy
ISSUES: Asks for *customer's* info instead of showing referral code. Eligibility framing is denial-first. Dead-end after submit.

SCREEN: Manage Subscription (hero)
PURPOSE: Control the active subscription
ACTIONS: Back · Order now · Next order date · Skip · More
NEXT: Modals (most placeholder) · Skip confirm · Cancel intro
FILE: pages/SubscriptionDetailPage.jsx
RETENTION ROLE: HIGHEST
ISSUES: Pause and Cancel hidden behind More. No visual hierarchy between save actions and exit actions.

SCREEN: Skip confirm
PURPOSE: Confirm a skip
ACTIONS: Yes, skip it · Keep my order
NEXT: Skip success screen
FILE: SubscriptionDetailPage.jsx
RETENTION ROLE: HIGH (Skip is a save action)
ISSUES: After Yes, customer lands in an empty success screen.

SCREEN: Skip success
PURPOSE: Confirmation
ACTIONS: None (only left rail)
NEXT: —
FILE: SubscriptionDetailPage.jsx lines 59–79
RETENTION ROLE: HIGH but DEAD
ISSUES: No CTA. No upsell. No "Back to subscription". This is your single best chance for a thank-you upsell and it's blank.

SCREEN: Pause modal
PURPOSE: Pause the subscription
ACTIONS: 4 weeks · 8 weeks · 12 weeks
NEXT: Toast, modal closes
FILE: SubscriptionDetailPage.jsx 176–185
RETENTION ROLE: HIGHEST — most retention-positive non-skip action
ISSUES: No custom restart date. No confirmation step. No persistence. Less rich than the same flow inside CancellationFlow.

SCREEN: Manage Subscription — Member offers (2 cards)
PURPOSE: Upsell / cross-sell while on the management surface
ACTIONS: Upgrade now · Add to subscription
NEXT: Marketing modals
FILE: components/PortalOfferStack.jsx (manage)
RETENTION ROLE: MEDIUM
ISSUES: CTAs don't act.

SCREEN: Product Workspace — Claim Free Gift
PURPOSE: Promote member exclusivity, give back
ACTIONS: Ship with my next order · Send to a friend (form)
NEXT: Toast or friend overlay
FILE: components/ProductWorkspace.jsx
RETENTION ROLE: HIGH
ISSUES: 60-second localStorage lock — gift reappears after a minute. Likely unintended.

SCREEN: Product Workspace — Swap Flavor
PURPOSE: Reduce taste-fit churn
ACTIONS: Peach · Watermelon · Confirm swap → modal → Confirm
NEXT: Inline confirmation
FILE: ProductWorkspace.jsx
RETENTION ROLE: HIGH
ISSUES: Local state only — no backend persistence.

SCREEN: Product Workspace — Shipping / Billing / Summary / Recommendations
PURPOSE: Edit account details, see totals, cross-sell
ACTIONS: Edit shipping · Edit billing · Add backup card · Apply promo · Add (rec product)
NEXT: Modals (forms) or placeholder
FILE: ProductWorkspace.jsx
RETENTION ROLE: MEDIUM
ISSUES: Edit billing inputs are disabled. Promo has no handler. Recommendations open placeholder modal. Saved data is component-state only.

SCREEN: Cancel intro video modal
PURPOSE: Emotional save before the cancel flow
ACTIONS: Skip 1/2/4 weeks · Skip next order · Continue to cancellation · Close
NEXT: Toast or cancellation flow
FILE: components/CancelIntroVideoModal.jsx
RETENTION ROLE: HIGH
ISSUES: Video autoplays unmuted (blocked on iOS Safari, silently failed). Skip button doesn't apply a real skip.

SCREEN: Cancellation reason select
PURPOSE: Diagnose the cancel intent
ACTIONS: Pick 1 of 15 reasons · Continue · Back
NEXT: Save page
FILE: components/CancellationFlow.jsx
RETENTION ROLE: HIGH
ISSUES: None major — well structured.

SCREEN: Cancellation save page
PURPOSE: First save attempt
ACTIONS: Sub-reason picker · 2–4 CTAs · "Review final step" text link
NEXT: Branch screen or rescue page
FILE: CancellationFlow.jsx
RETENTION ROLE: HIGHEST
ISSUES: Sub-reason captured to events but not shown back. Insight cards copy is strong.

SCREEN: Cancellation branch screen
PURPOSE: Apply the chosen save action (skip / pause / cadence / savings / product / education / plan)
ACTIONS: Pick option · Save / Apply
NEXT: Saved screen
FILE: CancellationFlow.jsx
RETENTION ROLE: HIGHEST
ISSUES: Save labels are persuasive ("Save and keep subscription"). Actual mutations are not connected — data only sets a `savedMessage` string.

SCREEN: Cancellation rescue page
PURPOSE: Final save attempt
ACTIONS: Recommended action + Optional action · "Continue to final cancellation" text link
NEXT: Confirm page
FILE: CancellationFlow.jsx
RETENTION ROLE: HIGHEST
ISSUES: None major — this is the strongest part of the entire portal.

SCREEN: Cancellation final confirm
PURPOSE: Destructive confirmation
ACTIONS: Contact support · Cancel subscription
NEXT: Cancellation complete or new support tab
FILE: CancellationFlow.jsx
RETENTION ROLE: LAST DEFENSE
ISSUES: Destructive "Cancel subscription" button uses btn-primary styling — same visual weight as a save CTA. Contact support is outline. The hierarchy invites the customer to click cancel.

SCREEN: Account
PURPOSE: Edit profile and payment
ACTIONS: 4 Edit buttons
NEXT: Placeholder modals
FILE: pages/AccountPage.jsx
RETENTION ROLE: LOW
ISSUES: All edit buttons are dead. Confusing parallel to the working forms inside Manage > Product Workspace.

SCREEN: Header / Footer
PURPOSE: Brand + global links
ACTIONS: Cart, Account, Shop, Social, Terms, Privacy
NEXT: Nothing
FILE: components/Header.jsx, components/Footer.jsx
RETENTION ROLE: LOW
ISSUES: Every link is href="#". Account and Cart icons look interactive, do nothing.
```

---

## 7. Leadership summary

**What's working**
- The cancellation flow is genuinely retention-focused — 15 reasons, reason-specific save copy, branch screens for skip / pause / cadence / savings / product swap, a rescue page, and a final confirm that visually de-emphasizes "Cancel subscription" with a text link to reach it. Cancellation event tracking is wired up.
- The Manage page concentrates real retention controls — Skip flow with explicit confirm, Pause options, Next-order-date picker that actually updates the displayed date.
- ProductWorkspace ships a working Swap Flavor flow (with a confirm modal) and a multi-step Claim Free Gift flow with both "ship to me" and "send to friend" paths — both rare and valuable retention surfaces.
- Visual design is consistent: one button primitive, one modal primitive, shared CSS, shared mini-label / kicker typography.
- Home screen leads with retention proof (member savings, next order, plan summary) before pushing offers — correct ordering.

**What's risky**
- **The offer surface does not act.** Home offers (Add gummies / Swap flavor / Upgrade to quarterly) and Manage offers (Upgrade to Quarterly / Add Electrolytes) all open marketing modals whose Continue button has no `onAction` handler. Clicking "Upgrade now" does nothing. Customers reach for save-positive actions and get silence.
- **Pause and Skip are richer inside the cancellation flow than outside it.** A customer who chooses Pause from the More menu gets 4/8/12-week buttons and a toast. The same customer threatening to cancel gets 2/4/8/custom restart date with a confirmation screen. Reward the customer who didn't threaten to cancel.
- **The destructive "Cancel subscription" button on the final confirm uses `btn-primary` styling.** That's the same visual weight as your save CTAs. The hierarchy invites the click. (CancellationFlow.jsx line 1036.)
- **The Skip success screen is a blank dead-end.** No "Back to subscription", no upsell, no thank-you. This is your highest-conversion moment for an upsell and it's empty. (SubscriptionDetailPage.jsx 59–79.)
- **Free gift unlocks every 60 seconds.** `GIFT_LOCK_KEY` uses a 1-minute localStorage timer, which means a customer could re-claim the gift indefinitely. (ProductWorkspace.jsx line 82.)
- **Account page edits are decorative.** All four Edit buttons open boilerplate modals. The real edit forms live in ProductWorkspace and don't persist either. Two surfaces for the same data, neither working end-to-end, creates dispute and refund risk later when a customer says "I changed my address" and the order ships to the old one.
- **Footer / Header are non-functional.** Every link is `href="#"`. Account icon and Cart icon are dead buttons. For a brand portal that is a trust signal — feels unfinished.
- **Refer-a-friend flow asks the customer to apply for eligibility instead of sharing a code.** The `Copy referral code` modal exists in App.jsx but is unreachable. Reversed funnel.
- **Order History shows hardcoded fulfilled orders with no reorder / invoice / tracking.** Wasted retention surface.
- **The cancellation save mutations are not connected to a backend.** A customer who chooses "Skip next order" or "Apply 50% off next 3 orders" inside the flow sees the saved message but no real action is taken — when their next order ships anyway, this becomes a refund/dispute generator.

**What to fix first (in order)**
1. **Wire offer CTAs to actual actions.** Home and Manage offer modals need real `onAction` — at minimum, route them to existing skip/swap/upgrade flows. Right now the customer's clearest save-positive actions are silent. Highest retention ROI.
2. **Fix the destructive button hierarchy.** `cancel-confirm-destructive` should be visually demoted (gray, outline, or muted). `Contact support` should be the primary visual action on `CancellationFinalConfirm`.
3. **Make Skip success not a void.** Add a return CTA and a contextual upsell ("Want to add electrolytes to the next box?"). Mirror the `CancellationSavedScreen` layout.
4. **Promote Skip and Pause out of the More menu** into the primary action row on Manage. Demote Cancel into a small text link at the bottom of the More menu.
5. **Unify pause UX.** The cancellation flow's pause options (custom restart date + note) belong in the main Pause modal too. Don't reward threat-to-cancel.
6. **Fix the free-gift lock.** Replace the 60-second localStorage timer with a single-claim flag tied to the subscription record.
7. **Consolidate the Account / ProductWorkspace edit surfaces.** One working set of forms; remove the fake one.
8. **Wire backend persistence behind the cancellation save branches and the main pause/skip/swap actions.** Today the UI says "saved" — the order still ships. That's the single highest dispute / refund risk in this app.
9. **Flip the refer-a-friend page.** Show the customer their referral code/link first; remove the "eligibility" denial framing.
10. **Fix header / footer links.** Hook up Cart icon, Account icon, SHOP NOW, social links, and terms / privacy / refunds. These are trust signals and they're all dead.

**What needs developer attention specifically**
- `App.jsx`: connect "Log out", "Add new subscription", "Copy referral code" modal branches to real actions or delete them.
- `PortalOfferStack.jsx`: each `ActionModal` needs `onAction` wired (lines 191, 229, 266) — currently the Continue button only closes the modal.
- `SubscriptionDetailPage.jsx`: the More menu items (Pause subscription, Manage payment, Update shipping) need real backend calls (lines 176–191). The skip success screen needs a return CTA (lines 59–79).
- `CancellationFlow.jsx`: line 1036 — change destructive button styling. Connect the branch `onDone` callbacks to actual subscription mutations.
- `ProductWorkspace.jsx`: remove the 60-second free-gift timer (lines 82, 111–123). Enable the disabled card number / CVV inputs on Edit billing or remove the form. Wire promo input.
- `AccountPage.jsx`: either implement the four Edit modals or remove the buttons.
- `OrderHistoryPage.jsx`: connect to real order data + add reorder / view-invoice / track CTAs.
- `ReferFriendPage.jsx`: lead with the customer's referral code; deprecate the eligibility form pattern.
- `Header.jsx` + `Footer.jsx`: hook up the dead links.

**Net assessment.** The bones of a retention-focused portal are here — the cancellation flow is the proof. Outside that flow, the portal is closer to a marketing surface than a control surface: it shows the customer what's possible without letting them do it. The single highest-leverage move is to connect the offer CTAs and save actions to real backend mutations, then re-prioritize Skip and Pause to the front of the Manage surface. Do that and the funnel becomes "control first, cancel last." Right now it is "marketing first, cancel-flow-saves-the-day."
