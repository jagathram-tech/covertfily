## Palette Journal

## 2024-05-18 - Make Div CTAs Keyboard Accessible
**Learning:** Custom non-semantic interactive elements (like the `.dropzone` div used heavily across the site for file uploads) require explicit handling to be fully accessible. They don't naturally receive focus or respond to keyboard interactions like native `<button>` or `<input>` elements.
**Action:** Always ensure that custom div/span CTAs have `role="button"`, `tabindex="0"`, standard focus rings (e.g. `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none`), and an explicit `onkeydown` handler for the 'Enter' and 'Space' keys (including `event.preventDefault()` to stop page scrolling) to trigger their primary action.
