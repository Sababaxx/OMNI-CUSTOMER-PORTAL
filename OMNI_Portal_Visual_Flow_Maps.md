# OMNI Customer Portal — Visual Flow Maps

Visual companion to the audit. Built from the actual files in `src/`.

**Status legend used across every diagram:**

| Label | Meaning |
|---|---|
| `Works` | Real action, persisted in component state |
| `Placeholder` | Opens a modal with boilerplate copy, no action |
| `Dead click` | Element looks interactive, has no handler |
| `Local only` | Mutates state but does not persist beyond reload |
| `Needs backend` | Shows "saved" but does not call a backend |

---

## 1. Full portal experience map

```mermaid
flowchart LR
    Entry([Portal entry<br/>no login screen]):::ok --> Home

    subgraph Header
        H1[SHOP NOW link]:::dead
        H2[Account icon]:::dead
        H3[Cart icon]:::dead
    end

    subgraph Footer
        F1[Shop/Connect links]:::dead
        F2[Newsletter input]:::dead
        F3[Social links]:::dead
        F4[Terms / Privacy / Refunds]:::dead
    end

    Home[Home dashboard<br/>SubscriptionListPage]:::ok
    Home -->|Manage subscription| Manage[Manage Subscription<br/>SubscriptionDetailPage]:::ok
    Home -->|Add product| AddNew[Add new subscription<br/>placeholder modal]:::placeholder
    Home -->|Open details| Manage
    Home -->|3 offer cards| HomeOfferModal[Offer modals<br/>Add gummies / Swap / Upgrade]:::placeholder

    Home -->|Side nav| Orders[Order History]:::placeholder
    Home -->|Side nav| Refer[Refer a Friend]:::placeholder
    Home -->|Side nav| Account[Account]:::placeholder
    Home -->|Side nav| Logout[Log out modal<br/>placeholder]:::placeholder

    Orders -->|View details| OrdersModal[Order details<br/>boilerplate]:::placeholder
    Refer -->|Check eligibility| ReferModal[Referral eligibility<br/>placeholder]:::placeholder
    Refer -->|Review status| ReferStatus[Referral status<br/>placeholder]:::placeholder
    Account -->|4 Edit buttons| AccountModals[Edit name/email/<br/>shipping/payment<br/>placeholder]:::placeholder

    classDef ok fill:#1f8a4c,stroke:#0f5a30,color:#fff
    classDef placeholder fill:#e3a934,stroke:#8c6500,color:#1a1a1a
    classDef dead fill:#c33,stroke:#7a0000,color:#fff
    classDef local fill:#6c8ebf,stroke:#2c4a78,color:#fff
    classDef needs fill:#9b5de5,stroke:#5b2d8c,color:#fff
```

**Notes**
- No real auth — portal boots straight into Home.
- Five real navigation paths in the side rail; Home → Manage is the only one with substantive working flows.
- Three of five side-nav surfaces (Orders, Refer, Account) end in placeholder modals.
- Header and Footer are entirely non-functional — every link is `href="#"`, both icon buttons have no handler.

---

## 2. Manage Subscription flow

```mermaid
flowchart TD
    Mgr[Manage Subscription hero<br/>Every 4 weeks · Next Jun 26]:::ok

    Mgr -->|Back| Home([Home]):::ok
    Mgr -->|Order now| OrderNow[Order now modal<br/>Continue closes only]:::placeholder
    Mgr -->|Next order date| DatePicker[Date picker modal<br/>HTML5 input]:::local
    Mgr -->|Skip| SkipConfirm[Skip this order?<br/>confirm modal]:::ok
    Mgr -->|More| More{More menu}

    More -->|Pause subscription| PauseModal[Pause modal<br/>4/8/12 wk buttons<br/>toast only]:::placeholder
    More -->|Cancel subscription| CancelIntro[Founder video modal<br/>CancelIntroVideoModal]:::ok
    More -->|Manage payment| PayModal[Manage payment<br/>boilerplate]:::placeholder
    More -->|Update shipping| ShipModal[Update shipping<br/>boilerplate]:::placeholder

    SkipConfirm -->|Yes, skip it| SkipSuccess[Skip success screen<br/>BLANK — no CTA]:::needs
    SkipConfirm -->|Keep my order| Mgr

    Mgr --> OfferRow[Member offers — 2 cards<br/>Quarterly · Electrolytes]:::placeholder
    OfferRow -->|Upgrade now / Add to sub| OfferModals[Offer modals<br/>Continue closes only]:::placeholder

    Mgr --> WS[Product Workspace]:::ok
    WS --> Gift[Claim Free Gift<br/>2-step flow]:::local
    WS --> Swap[Swap Flavor<br/>Peach/Watermelon]:::local
    WS --> ShipEdit[Edit shipping form<br/>Save closes only]:::local
    WS --> BillEdit[Edit billing<br/>card # / CVV disabled]:::dead
    WS --> Backup[Add backup card<br/>component state only]:::local
    WS --> Promo[Apply promo<br/>no handler]:::dead
    WS --> Recs[Recommended products<br/>Add → placeholder]:::placeholder

    CancelIntro -->|Continue to cancellation| Cflow([Cancellation Flow<br/>see Diagram 4]):::ok
    CancelIntro -->|Skip next order| CancelSkipToast[Toast — no skip applied]:::placeholder

    classDef ok fill:#1f8a4c,stroke:#0f5a30,color:#fff
    classDef placeholder fill:#e3a934,stroke:#8c6500,color:#1a1a1a
    classDef dead fill:#c33,stroke:#7a0000,color:#fff
    classDef local fill:#6c8ebf,stroke:#2c4a78,color:#fff
    classDef needs fill:#9b5de5,stroke:#5b2d8c,color:#fff
```

**Notes**
- The four hero buttons (Order now / Next order date / Skip / More) all use the same visual weight — Skip and Pause have no hierarchy advantage over the dead Order now.
- Pause is hidden inside More. So is Cancel. Same submenu, equal weight — bad framing.
- Date picker is the only hero button that actually mutates state.
- Skip success screen replaces the full main panel and offers no CTA → return to subscription. Worst dead-end in the app.
- ProductWorkspace contains the most "feels real" surfaces but persistence is local-only.

---

## 3. Offer and retention surface map

```mermaid
flowchart LR
    subgraph HomeSurface[Home — PortalOfferStack variant=home]
        HO1[Add gummies]:::placeholder
        HO2[Swap flavor]:::placeholder
        HO3[Upgrade to quarterly]:::placeholder
    end

    subgraph ManageSurface[Manage — PortalOfferStack variant=manage]
        MO1[Upgrade to Quarterly]:::placeholder
        MO2[Add Electrolytes]:::placeholder
    end

    subgraph Workspace[Product Workspace — actual controls]
        W1[Claim Free Gift]:::local
        W2[Swap Flavor]:::local
        W3[Recommended products Add]:::placeholder
        W4[Apply promo]:::dead
    end

    subgraph CoreActions[Subscription controls — Manage hero & More]
        C1[Skip — confirm flow]:::ok
        C2[Next order date — date picker]:::local
        C3[Pause — 4/8/12 wk]:::placeholder
        C4[Order now]:::placeholder
        C5[Cancel — full save flow]:::ok
    end

    subgraph InsideCancel[Save options inside Cancellation Flow]
        IC1[Skip — full options]:::needs
        IC2[Pause — incl. custom date]:::needs
        IC3[Cadence change 4/8/12]:::needs
        IC4[Savings 50% off x3]:::needs
        IC5[Product swap]:::needs
        IC6[Education]:::needs
        IC7[Plan / habit / consistency]:::needs
    end

    HomeSurface -.expected to mutate.-> CoreActions
    ManageSurface -.expected to mutate.-> CoreActions

    classDef ok fill:#1f8a4c,stroke:#0f5a30,color:#fff
    classDef placeholder fill:#e3a934,stroke:#8c6500,color:#1a1a1a
    classDef dead fill:#c33,stroke:#7a0000,color:#fff
    classDef local fill:#6c8ebf,stroke:#2c4a78,color:#fff
    classDef needs fill:#9b5de5,stroke:#5b2d8c,color:#fff
```

**Notes**
- Every customer-facing offer card on Home and Manage is a marketing card that opens a modal — no offer CTA mutates anything.
- The only retention actions outside the cancel funnel that feel real are Skip (full confirm flow, but no backend), the date picker, the swap-flavor flow, and the free-gift flow.
- The richest retention controls are buried *inside* the cancellation flow — visible only to customers who actively try to cancel. Customers who pause/skip outside the flow get a weaker UX.

---

## 4. Cancellation flow visual map

```mermaid
flowchart TD
    Start[Manage > More > Cancel]:::ok --> Intro[Cancel intro / founder video<br/>autoplays unmuted]:::ok

    Intro -->|Close X| ManageBack([Manage]):::ok
    Intro -->|Skip 1/2/4 wk → Skip next order| IntroToast[Toast — not a real skip]:::placeholder
    Intro -->|Continue to cancellation| Reason[Step 1 — Reason select<br/>15 reasons]:::ok

    Reason --> Save[Step 2 — Save page<br/>sub-reason + 2-4 CTAs]:::ok

    Save -->|Branch CTA| Branch[Step 3 — Branch screen<br/>skip / pause / cadence / savings /<br/>product / education / plan]:::needs
    Save -->|Contact support| Gorgias[Gorgias support form<br/>opens new tab with context]:::ok
    Save -->|Review final step text link| Rescue[Step 4 — Rescue page<br/>recommended + optional]:::ok

    Branch -->|Save / Apply| Saved[Saved confirmation<br/>'Subscription stays active']:::needs
    Branch -->|Back| Save

    Rescue -->|Recommended / Optional action| Branch
    Rescue -->|Continue to final cancellation| Confirm[Step 5 — Final confirm]:::ok

    Confirm -->|Contact support| Gorgias
    Confirm -->|Cancel subscription button — currently btn-primary| Done[Cancellation complete]:::ok

    classDef ok fill:#1f8a4c,stroke:#0f5a30,color:#fff
    classDef placeholder fill:#e3a934,stroke:#8c6500,color:#1a1a1a
    classDef dead fill:#c33,stroke:#7a0000,color:#fff
    classDef local fill:#6c8ebf,stroke:#2c4a78,color:#fff
    classDef needs fill:#9b5de5,stroke:#5b2d8c,color:#fff
```

### Cancellation reasons grouped by branch type

```mermaid
flowchart LR
    R1[Results or consistency<br/>'I haven't seen results']:::reason -->|Save action| S1[Build consistency plan<br/>+ Move to 8 weeks]
    R2[Consistency / habit<br/>'Hard to remember']:::reason -->|Save action| S2[Build habit plan<br/>+ Move to 8 weeks + Skip]
    R3[Stocked up]:::reason -->|Save action| S3[Skip + Move to 8/12 wk + Pause]
    R4[Price<br/>'Too expensive']:::reason -->|Save action| S4[Apply 50% off next 3 orders<br/>+ Skip and keep offer + 8 wk]
    R5[Subscription resistance<br/>'I just wanted one']:::reason -->|Save action| S5[Skip + Pause + 8 wk]
    R6[Flavor or texture]:::reason -->|Save action| S6[Swap to better fit<br/>+ Product plan]
    R7[Sugar / too sweet]:::reason -->|Save action| S7[Switch to electrolyte stick packs<br/>+ Skip + Support]
    R8[Digestion]:::reason -->|Save action| S8[Build gentler routine<br/>+ Switch product + Support]
    R9[Shipping too fast]:::reason -->|Save action| S9[Move next date + 8/12 wk + Skip]
    R10[No longer need it]:::reason -->|Save action| S10[Pause + Skip + 12 wk]
    R11[Product issue]:::reason -->|Save action| S11[Contact support — requires details<br/>+ Pause]
    R12[Packaging issue]:::reason -->|Save action| S12[Contact support — requires details<br/>+ Pause]
    R13[Found better alternative]:::reason -->|Save action| S13[See why members stay<br/>+ Personalized plan + Savings]
    R14[Trouble editing subscription]:::reason -->|Save action| S14[Change frequency + Skip + Pause + Support]
    R15[Other reason]:::reason -->|Save action| S15[Contact support + Pause + Skip]

    classDef reason fill:#2e3a59,stroke:#0d1a3a,color:#fff
```

**Notes**
- The destructive **Cancel subscription** button on the final confirm screen currently uses `btn-primary` styling. Visually it competes with save CTAs. Should be visually demoted.
- Every reason offers ≥2 save actions before the final-cancel exit ramp.
- Support routes (Gorgias) carry `?context=<reason>` so the team gets the diagnostic.
- Branch screen save messages display "Subscription stays active" but the mutations are not connected to a backend — dispute risk.

---

## 5. Broken or risky paths

```mermaid
flowchart TD
    subgraph H[Header — Header.jsx]
        H1[SHOP NOW link href=#]:::dead
        H2[Account icon — no onClick]:::dead
        H3[Cart icon — no onClick]:::dead
    end

    subgraph F[Footer — Footer.jsx]
        F1[SHOP NOW / CONTACT US / ACCOUNT LOGIN]:::dead
        F2[Newsletter input — no submit]:::dead
        F3[TikTok / Instagram / Facebook]:::dead
        F4[Terms / Privacy / Refunds]:::dead
    end

    subgraph HomeP[Home — SubscriptionListPage]
        Hp1[Add product]:::placeholder
        Hp2[Home offer CTAs — 3 cards]:::placeholder
    end

    subgraph MgrP[Manage — SubscriptionDetailPage]
        Mp1[Order now Continue]:::placeholder
        Mp2[Pause 4/8/12 wk — toast only]:::placeholder
        Mp3[Manage payment]:::placeholder
        Mp4[Update shipping in More]:::placeholder
        Mp5[Skip success screen — blank]:::dead
        Mp6[Manage offer CTAs — 2 cards]:::placeholder
    end

    subgraph WS[Product Workspace]
        Wp1[Apply promo button]:::dead
        Wp2[Recommended Add buttons]:::placeholder
        Wp3[Edit billing — card # / CVV disabled]:::dead
        Wp4[Save address — closes modal, no persist]:::local
        Wp5[Add backup card — local only]:::local
        Wp6[Free gift — 60 sec localStorage reset]:::dead
    end

    subgraph Acct[Account — AccountPage]
        Ap1[Edit Name]:::placeholder
        Ap2[Edit Email]:::placeholder
        Ap3[Edit Shipping]:::placeholder
        Ap4[Edit Payment]:::placeholder
    end

    subgraph OrdRef[Other surfaces]
        OR1[Order History — View details modal]:::placeholder
        OR2[Refer a Friend — eligibility submit]:::placeholder
        OR3[Refer a Friend — Review status]:::placeholder
        OR4[Log out modal]:::placeholder
    end

    classDef placeholder fill:#e3a934,stroke:#8c6500,color:#1a1a1a
    classDef dead fill:#c33,stroke:#7a0000,color:#fff
    classDef local fill:#6c8ebf,stroke:#2c4a78,color:#fff
```

**Notes**
- ~30 user-clickable elements are non-terminal. The visual weight of these elements is the same as elements that actually work.
- The Skip success screen is the only flat dead-end — every other broken path at least closes a modal.
- Free Gift 60-second reset is a logic bug, not just a missing handler.

---

## 6. Retention priority heatmap

```mermaid
flowchart LR
    subgraph FIX1[Fix first — directly hurts retention now]
        A1[Wire PortalOfferStack CTA actions<br/>PortalOfferStack.jsx]:::p1
        A2[Skip success dead end<br/>SubscriptionDetailPage.jsx 59-79]:::p1
        A3[Pause flow inconsistency<br/>SubscriptionDetailPage.jsx 176-185]:::p1
        A4[Free gift 60 sec reset<br/>ProductWorkspace.jsx 82]:::p1
        A5[Cancel final button styling<br/>CancellationFlow.jsx 1036]:::p1
        A6[Backend persistence for save actions<br/>across portal]:::p1
    end

    subgraph FIX2[Fix next — invisible churn / dispute risk]
        B1[Account edit modals fake<br/>AccountPage.jsx]:::p2
        B2[Order History no real data<br/>OrderHistoryPage.jsx]:::p2
        B3[Refer flow reversed<br/>ReferFriendPage.jsx]:::p2
        B4[Cancel intro video unmuted<br/>CancelIntroVideoModal.jsx]:::p2
        B5[Header/Footer dead links<br/>Header.jsx / Footer.jsx]:::p2
        B6[Disabled card inputs<br/>ProductWorkspace.jsx 414-417]:::p2
        B7[Promote Skip / Pause out of More<br/>SubscriptionDetailPage.jsx]:::p2
    end

    subgraph FIX3[Clean up later — tech debt and hygiene]
        C1[Remove unused PortalOfferBlock variant<br/>PortalOfferBlock.jsx]:::p3
        C2[Remove unused icons<br/>Icons.jsx]:::p3
        C3[Remove Copy referral code modal branch<br/>App.jsx 48]:::p3
        C4[Prune 40+ unused CSS classes<br/>styles.css]:::p3
        C5[Consolidate Account vs Workspace edits<br/>AccountPage + ProductWorkspace]:::p3
        C6[Sub-reason persistence to confirm step<br/>CancellationFlow.jsx]:::p3
    end

    classDef p1 fill:#c33,stroke:#7a0000,color:#fff
    classDef p2 fill:#e3a934,stroke:#8c6500,color:#1a1a1a
    classDef p3 fill:#6c8ebf,stroke:#2c4a78,color:#fff
```

**Notes**
- Fix-first items are the path between "looks like retention" and "is retention". Most are <1 day of dev.
- Backend persistence (A6) is the single highest dispute/refund liability — a customer who sees "saved" but whose next order still ships will charge back.

---

## 7. Screen-by-screen visual cards

```mermaid
flowchart TB
    S1["
    <b>Home Dashboard</b>
    Purpose: First impression + route to Manage
    Actions: Manage subscription · Add product · Open details · 3 offer cards
    Next: Manage page · placeholder modal · marketing modals
    Status: Works (nav) · Placeholder (offers)
    Files: pages/SubscriptionListPage.jsx · PortalOfferStack.jsx
    Retention risk: HIGH — offers do not act
    "]:::card

    S2["
    <b>Order History</b>
    Purpose: Review past orders
    Actions: View details
    Next: Boilerplate modal
    Status: Placeholder
    Files: pages/OrderHistoryPage.jsx
    Retention risk: MEDIUM — no reorder / invoice / tracking
    "]:::card

    S3["
    <b>Refer a Friend</b>
    Purpose: Drive referrals
    Actions: Submit eligibility form · Review status
    Next: Placeholder modals
    Status: Placeholder (and reversed funnel)
    Files: pages/ReferFriendPage.jsx
    Retention risk: HIGH — asks customer to apply instead of share
    "]:::card

    S4["
    <b>Manage Subscription — Hero</b>
    Purpose: Subscription control surface
    Actions: Order now · Next order date · Skip · More
    Next: Modals · Skip confirm · Cancel intro
    Status: Mixed — Skip + Date work; Order now + More items placeholder
    Files: pages/SubscriptionDetailPage.jsx
    Retention risk: HIGHEST — Skip and Pause buried; Cancel co-equal
    "]:::card

    S5["
    <b>Skip Confirm + Success</b>
    Purpose: Confirm skip then thank customer
    Actions: Yes / Keep
    Next: Skip success screen (blank)
    Status: Confirm Works · Success dead-ends
    Files: pages/SubscriptionDetailPage.jsx 59-79
    Retention risk: HIGH — blank success kills momentum
    "]:::card

    S6["
    <b>Pause Modal</b>
    Purpose: Pause subscription
    Actions: 4 / 8 / 12 weeks
    Next: Toast then close
    Status: Placeholder (toast only)
    Files: pages/SubscriptionDetailPage.jsx 176-185
    Retention risk: HIGHEST — weaker than the in-cancel pause UX
    "]:::card

    S7["
    <b>Member Offer Cards (Home + Manage)</b>
    Purpose: Upsell / cross-sell
    Actions: Click card to open modal
    Next: Marketing modals — Continue closes only
    Status: Placeholder
    Files: components/PortalOfferStack.jsx
    Retention risk: HIGH — entire offer surface inactive
    "]:::card

    S8["
    <b>Product Workspace</b>
    Purpose: Claim gift · Swap flavor · Edit shipping/billing · Promo · Recs
    Actions: Many — see Diagram 2
    Next: Inline confirm or modal
    Status: Mostly Local only · billing card # disabled
    Files: components/ProductWorkspace.jsx
    Retention risk: HIGH — feels real, nothing persists
    "]:::card

    S9["
    <b>Cancel Intro Video Modal</b>
    Purpose: Emotional save before cancel funnel
    Actions: Skip 1/2/4 wk · Continue to cancellation · Close
    Next: Toast or cancellation flow
    Status: Works (UX) · Skip is Placeholder
    Files: components/CancelIntroVideoModal.jsx
    Retention risk: HIGH — autoplays unmuted, blocked on iOS Safari
    "]:::card

    S10["
    <b>Cancellation Flow (5 steps)</b>
    Purpose: Retention funnel + final cancel
    Actions: Reason → Save → Branch → Rescue → Confirm
    Next: Saved screen or Cancellation complete
    Status: Works as a funnel · Needs backend for saves
    Files: components/CancellationFlow.jsx
    Retention risk: STRONGEST surface — but save actions don't persist
    "]:::card

    S11["
    <b>Account</b>
    Purpose: Edit profile and payment
    Actions: 4 Edit buttons
    Next: Boilerplate modals
    Status: Placeholder
    Files: pages/AccountPage.jsx
    Retention risk: MEDIUM — competes with real forms in Workspace
    "]:::card

    S12["
    <b>Header / Footer</b>
    Purpose: Brand + global links
    Actions: Shop / Account / Cart / Social / Terms
    Next: Nothing
    Status: Dead clicks
    Files: components/Header.jsx · components/Footer.jsx
    Retention risk: LOW (trust signal)
    "]:::card

    classDef card fill:#f5f1ea,stroke:#5b3a1f,color:#1a1a1a,font-size:11px
```

**How to use these visuals**

- Diagrams 1–4 are the customer-journey reference for Nick, Kirten, and Levani.
- Diagram 5 is the punch list of broken paths the team needs to either remove or wire up.
- Diagram 6 is the ranked work order for dev.
- Diagram 7 is the screen-by-screen one-pager for everyone else.

All diagrams render natively in GitHub, Notion, Slack canvas, and any Markdown editor with Mermaid enabled.
