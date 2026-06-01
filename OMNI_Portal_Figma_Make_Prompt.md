# Figma Make prompt — OMNI Customer Portal redesign

Copy everything between the `---PROMPT START---` and `---PROMPT END---` markers into Figma Make.

---PROMPT START---

Design a premium, retention-first customer portal for **OMNI Creatine**, a daily creatine gummy and electrolyte wellness brand. This is a redesign of an existing React portal — keep the same information architecture, fix the retention surfaces. Output desktop (1280px) and mobile (390px) frames for every screen below.

## Brand & tone

- Voice: confident, calm, premium wellness. No exclamation marks. No "amazing" copy.
- Audience: subscribers managing a recurring monthly gummy delivery.
- Mood: clean, modern, soft-bright. Editorial product photography over peachy/cream backgrounds.
- Logo: serif lowercase wordmark "omni" with a small registered mark.

## Design system

**Colors**
- Background page: #FBF7F0 (warm off-white)
- Card surface: #FFFFFF
- Primary text: #1A1A1A
- Muted text: #6E6A63
- Mini-label: #8C8780, uppercase, letter-spacing +0.06em, 11–12px
- Accent peach: #F4B895
- Accent watermelon: #F08E7A
- Accent electrolyte (pear): #C8D896
- Primary button bg: #1A1A1A, text #FFFFFF
- Outline button: 1px #1A1A1A border, transparent fill, text #1A1A1A
- Destructive: text/border #8C2D1F, never filled with brand black
- Header: #0E0E0E with white logo
- Footer: same #0E0E0E with white logo
- Success: #1F8A4C, status pill bg #E5F3EB
- Warning/save: #B8821D, pill bg #FBEFD4

**Typography**
- Display headings: serif (e.g. Tiempos Headline / Canela), weight 500
- Body: sans-serif (e.g. Inter / Söhne), weight 400 and 500
- H1 desktop 36/44, H2 24/32, H3 18/24, body 15/22, small 13/18, mini-label 11/14
- Member greeting on Home: H1 36 serif, "Hello, Saba"

**Spacing**
- Base unit: 4px
- Section gap: 32–40px desktop, 24px mobile
- Card padding: 24px desktop, 20px mobile
- Page max width: 1180px

**Radius**
- Card: 20px
- Pill / chip: 999px
- Button: 999px (pill) for primary actions, 8px for inputs

**Shadow**
- Card: 0 1px 2px rgba(0,0,0,.04), 0 6px 24px rgba(0,0,0,.04)
- Modal: 0 24px 60px rgba(0,0,0,.18)

**Reusable components** (build these as variants in Figma)
1. Button — variants: primary, outline, ghost, destructive-outline; sizes: sm, md, block; states: rest, hover, active, disabled, loading
2. Mini-label (uppercase tag)
3. Status pill — Active, Paused, Skipped, Saved
4. Card — base, hero, summary, offer
5. Modal — sm, md, wide; with optional eyebrow / image / bullet list / two-button footer
6. Side nav item — rest, active, hover; collapsible to horizontal chip-rail on mobile
7. Offer card — image-left media block with eyebrow, title, CTA arrow
8. Toast — bottom-right with check icon
9. Input + select with floating labels
10. Date picker (calendar inline) for "Next order date"

## Layout

**Desktop shell**
- Sticky black header (64px tall): "SHOP NOW" link left, centered logo, right cluster with Account avatar + cart icon. Active member badge next to avatar.
- Side nav rail (240px) on dashboard pages, content max-width 940px.
- Footer with dark surface, three columns, social row, fine print.

**Mobile shell**
- Same black header, hamburger replaces side rail.
- Side nav collapses to a horizontal scrolling chip rail under the header on dashboard pages, with the active chip auto-centered.

## Side nav items (in order)
Home · Order History · Refer a Friend · Manage Subscriptions · Account · Log out (separated by 1px divider above Log out).

## Screen specs

### 1. Home — `Hello, Saba`
**Goal:** make the customer feel in control and rewarded; route to retention actions first.

Sections, top to bottom:
1. Greeting block — H1 "Hello, Saba", supporting line "Logged in as buy@omnicreatine.com", tertiary line "Thank you for being a member since January 2026!" Right side of the same row: two buttons — **Skip next order** (primary), **Manage subscription** (outline). *(Critical retention move: lead with Skip, not Add product.)*
2. Account summary strip — four mini stats in a horizontal card: Active subscription (Next order date), Current plan, Order value, Member savings ("$80 saved this cycle"). Mini-label on top, bold value below.
3. Next OMNI order command card — H2 "Ships June 26", short copy ("Three pouches are queued for your next delivery"), and a row of three quick chips: **Skip** · **Change date** · **Open details**. *(Retention chips live where the customer actually looks, not buried in a More menu.)*
4. Member offers heading — mini-label "Member offers", H2 "Fresh ways to upgrade your next order".
5. Member offers grid — three offer cards: Try electrolytes · Swap flavor · Upgrade to quarterly. Each card has product image, eyebrow, title, CTA with arrow. **CTAs perform the real action — not a marketing modal.** Confirm with toast.

### 2. Order History
- Page header — H1 "Order History", subtitle "Review recent OMNI orders and fulfillment details."
- List of order cards, each row: Order number · Date · Status pill (Fulfilled/Processing) · Product summary · Total · three actions (View invoice · Track shipment · Reorder).
- Empty state: friendly illustration + "No orders yet. Your first OMNI box ships [date]."

### 3. Refer a Friend
**Critical fix:** flip the funnel. The current portal asks the customer to apply for eligibility — design this so the customer's referral code is the hero.

- Hero: H1 "Give 20%, get 20%", supporting copy.
- Referral code card: large monospaced code (e.g. `OMNI-SABA-47`) with a copy button and three share buttons (iMessage, WhatsApp, Email). Include a shareable link with copy icon.
- Status row: mini-label "Referrals sent" / "Friends ordered" / "Rewards earned" — three counters.
- Secondary section: "How it works" — three icons in a row.
- Bottom: small text link "Referral policy" → modal.

### 4. Manage Subscription
**Critical retention move:** Skip and Pause are first-class; Cancel is a small text link.

Layout:
1. Hero — Back button, H1 "Every 4 weeks", price "$115.00 · Next on June 26".
2. Primary action row — four pill buttons: **Skip next order** (primary), **Pause** (primary), **Change next order date** (outline), **Order now** (outline). 
3. Secondary action row — text links: "Manage payment" · "Update shipping" · "Cancel subscription" (smallest, gray, last).
4. Current subscription card — product image left, product name + flavor + frequency + status pill + next date in middle, price + per-order on right.
5. Member offers — two large offer cards (Upgrade to Quarterly, Add Electrolytes). Same real-action behavior as Home offers.
6. Product Workspace — two columns:
   - Left: Claim Free Gift card (large image, "Claim free gift" CTA — single-use only, no timer reset), Swap Flavor card with two flavor tiles, Shipping info card with Edit, Billing card with primary + backup card and Add backup, Summary card with subtotal/shipping/promo input + total.
   - Right: "You might also like" — three product recommendation cards with flavor select and Add button.

### 5. Account
- Single column of editable info cards: Name, Email, Shipping address, Payment method.
- **Each card has an inline Edit state** (not a modal) — clicking Edit converts the card into a form with Save / Cancel. Save shows a toast and stays on the page.
- This is the only place these fields are editable — remove the duplicate forms from Manage > Product Workspace.

### 6. Cancellation flow (modal stack)
Keep the existing 5-step funnel: Reason → Save → Branch → Rescue → Confirm.

Visual polish:
- Step indicator at top (1 of 5).
- Reason list: 15 reasons as radio-row cards with a primary title and helper line.
- Save page: hero headline + body, optional sub-reason selector grid (chips), insight cards (3-up checkmark grid), two CTAs (primary + secondary), and a small text link "Review final step".
- Branch page: a single big choice grid (e.g. cadence options as pills), one primary "Save" CTA with the chosen value baked in ("Move to 8 weeks"), and a small text link "Review final step".
- Rescue page: "Recommended" card + "Optional" card, each with its own button; below them a small text link "Continue to final cancellation".
- Final confirm page: pill + headline + body + two buttons. **Contact support = primary filled button. Cancel subscription = outline destructive (#8C2D1F border, transparent fill, dark red text).** Reverse the current hierarchy.
- Saved success: green check, "Saved" pill, headline that echoes the action ("Your next order was skipped"), CTA "Return to subscription overview".
- Cancelled success: gray check, "Cancelled" pill, soft "You'll still have access to your account if you want to restart later", CTA "Done".

### 7. Skip success screen (currently a dead end — fix this)
Full-card success state inside the Manage page (not full-screen takeover):
- Green check medallion, "Skipped" status pill, H2 "Your June 26 order has been skipped", body "Your subscription stays active. Your next order will ship July 24."
- Action row: **Add electrolytes to next box** (primary), **Pause subscription** (outline), **Back to subscription** (text link).
- A small contextual upsell card under the action row: "Since you skipped, want to stretch deliveries to every 8 weeks? Save more, manage less." with a "Move to 8 weeks" CTA.

### 8. Pause flow
Promote the pause modal to feel like a real flow. Match the richness of the cancellation flow's pause options:
- Modal header: H2 "Pause your subscription".
- Body: "Take a break without closing the account."
- Pill grid: 2 weeks · 4 weeks · 8 weeks · Custom restart date.
- If Custom, reveal a date picker.
- Optional textarea: "Anything we should know? (optional)"
- Primary CTA: "Pause subscription".
- Confirmation screen mirrors the Skip success: status pill "Paused until Jul 24", action row with Resume now / Change date / Back to subscription.

### 9. Cancel intro / founder video modal
- Modal sized 720px wide.
- Top: "Before you cancel" eyebrow, H2 "A quick note from OMNI".
- Plan summary row: product image + Every 4 weeks + Next date + price.
- Video player: 16:9, **muted by default with a clear unmute icon**, poster image visible until play. Captions toggle.
- Skip options as three pills: Skip 1 week · Skip 2 weeks · Skip 4 weeks.
- Bottom actions: **Skip next order** (primary), **Continue to cancellation** (text link).

### 10. Header / Footer (currently dead links — fix this)
- Header right cluster: Account avatar opens a small menu (Account, Order History, Log out). Cart icon opens a slide-over cart panel.
- Footer columns: Shop (links to shop), Connect (real contact form), Support (Help center, Returns, Subscription FAQ). Social row links to real socials. Bottom row: Terms · Privacy · Refunds. Newsletter form has a working submit + "You're in" inline confirmation.

## Retention-first behavioral rules (apply across the whole portal)

1. **Control before cancel.** Skip and Pause are always one click from any subscription surface. Cancel is always a small text link, never a button.
2. **Confirmation never dead-ends.** Every success screen has at least one outbound action (return, upsell, or related save).
3. **Offers act, never just describe.** Every offer CTA in the design must show what state changes after the click (toast text, status pill update, or next-order summary update).
4. **One source of truth per data field.** Shipping and payment edit only on Account. Manage page links out to Account when needed, not duplicate forms.
5. **Destructive styling is muted.** Brand black is for save CTAs. Destructive is outline + dark red. Never brand-primary on destructive actions.
6. **Visual hierarchy reflects retention value.** Skip and Pause use the primary button style. Cancel uses a text link. Order now uses outline.
7. **Member proof is always visible.** Member savings, member-since date, next order date appear on the Home overview strip and on the Manage hero.

## States to design

- Default, hover, active, focus, disabled, loading for every interactive component.
- Empty states for: Order History (no orders yet), Referrals (no friends yet), Workspace recommendations (no recommendations).
- Error states for: payment failure, address invalid, promo code invalid.
- Toast states: success, info, warning, error.

## Mobile rules

- Stack all multi-column layouts to one column under 760px.
- Action rows on Manage hero wrap to two-up grid under 540px, with **Skip** and **Pause** on the top row.
- Side nav collapses to horizontal chip rail; active chip auto-centers.
- Modals become bottom-sheets under 540px with a drag handle and 16px safe-area inset.
- Skip success and Pause success states fill the card, not the whole viewport.

## Deliverables

For each screen above, produce: 1 desktop frame (1280px), 1 mobile frame (390px), plus modal/overlay variants where called for. Group frames by section. Include a "Design system" page with color tokens, type ramp, button variants, card variants, status pills, modal variants, and the toast.

Add a one-line note on every screen explaining the retention move it carries (e.g. "Skip success — converts a save moment into an upsell").

---PROMPT END---

## How to use this

1. Open Figma → Figma Make.
2. Paste the prompt between the markers.
3. Run. Generate the design system page first, then the screens. Most Figma Make sessions handle 3–4 screens at a time well — break the screen specs into batches if needed.
4. Refine with follow-up prompts like "tighten the Manage hero so Skip and Pause are visually heaviest" or "tone down the cancel confirm button — outline destructive only".

## What this prompt encodes from the audit

- Lead with Skip on Home (not Add product).
- Surface Skip and Pause as primary buttons on Manage, demote Cancel to a text link.
- Make every offer CTA terminate in a real state change with a toast.
- Replace the dead Skip success with an upsell + return CTAs.
- Match the in-portal Pause UX to the richer one inside Cancellation.
- Remove the duplicate edit surface on Account.
- Reverse the cancel-confirm hierarchy (Support primary, Cancel outline destructive).
- Mute the founder video by default.
- Flip the referral page to show the code first, not an eligibility form.
- Fix header/footer dead links and the disabled card fields.
