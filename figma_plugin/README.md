# OMNI Portal Map Builder — Figma Development Plugin

This is a Figma development plugin that builds the OMNI customer portal
interaction map as **native Figma objects**: frames with auto-layout,
rectangles, text layers, and `figma.createConnector()` 1px arrows.

Every page is a parent frame. Every button, card, input, and chip is a child
rectangle (or auto-layout frame) inside its parent page. Every click is a
Figma connector between the specific button rectangle and its destination
frame.

## Install (one minute)

1. In Figma desktop, open or create any Figma Design file.
2. **Plugins → Development → Import plugin from manifest…**
3. Pick `manifest.json` inside this folder (`figma_plugin/`).
4. **Plugins → Development → OMNI Portal Map Builder** to run.

You'll get a notification at the bottom when it's done. The full map is
auto-selected and the viewport zooms to fit. Drag, recolor, reroute — everything
is native and editable.

> The plugin works in both Figma Design and FigJam (`editorType` includes both).
> Connectors render most cleanly in FigJam.

## What it builds

- **5 portal page frames**: Home, Order History, Refer a Friend, Account,
  Manage Subscriptions. Each frame contains its real buttons, cards, inputs,
  and links as named child layers.
- **~22 modal / dropdown frames**: every modal triggered from the portal
  (Order now, Skip confirm, Pause, Upgrade Quarterly, Add Electrolytes, Claim
  Free Gift, Edit cards, Add backup, etc.) plus the More dropdown.
- **Before You Cancel modal** and the **Cancellation Reason picker** with all
  15 reason rows as clickable child rectangles.
- **15 reason lanes**, one per reason, stacked vertically:
  Save page → reason-specific branch screens → rescue page → final confirm.
  Branches are duplicated per lane (per the live source).
- **Terminal outcomes**: cancelled, saved, external Gorgias support exit,
  skip success page, toast layer.
- **~200 connector arrows** — labelled with the clicked button text, 1px
  stroke, elbowed routing, with an arrow head on the destination side.

## Editing

Every layer is named (`scene: home`, `manage_sub_btn: Manage subscription`,
`edge: home.manage_sub_btn → manage`, etc.) so you can find anything in the
layers panel by typing.

## Regenerating

The plugin embeds all scene + connector data inline. To change it, edit
`build_figma_plugin.py` (a Python generator that emits this `code.js`), then
re-run the generator and re-import the manifest.
