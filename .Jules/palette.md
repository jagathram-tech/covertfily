## 2024-11-20 - Add ARIA labels to icon-only buttons
**Learning:** Icon-only elements without ARIA labels are inaccessible to screen readers as the visual context provided by icons (e.g., FontAwesome) is not read aloud. We must provide explicit aria-label attributes and use aria-hidden="true" on the icons themselves.
**Action:** When auditing or adding icon-only elements (such as social links or 'remove' buttons), ensure they always have an descriptive aria-label, and ensure the nested icons have aria-hidden="true" to avoid double reading.
