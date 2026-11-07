# ENT homepage — local visual review

8 November 2026. Local revision only; no source push or deployment was performed. Published source HEAD remains `2b0d16dfe49154a5c7e63e2a0dfb6c2b973712cf`.

| Section | Decision and visual treatment |
| --- | --- |
| Navigation and hero | Retained the reference's left headline, right photographic subject, facts and pill CTAs. Replaced the generic portrait with an explicitly illustrative ear examination. Adjusted the mobile frame to preserve the examination context. Navigation has a light, readable capsule over the photograph. |
| Services | Kept the manual carousel. Five ENT-specific services; consistent image frames, restrained gradients, aligned captions, card-width navigation, visible ranges and disabled endpoint controls. Otoscopy and throat examination images are illustrative; diagnostic equipment and instruments are from the official clinic gallery. |
| Specialties | Retained the directly scannable static grid; two columns on smaller screens. |
| Team | Kept the carousel and authentic portraits. Wider, consistent image windows preserve faces and shoulders; qualifications and profile links remain readable. |
| Patient convenience | Retained the static utility grid and verified clinic facts. |
| Locations | Retained two static contact cards so both addresses and phones remain discoverable without swiping. Added clearly separated opening hours and map links. |
| Clinic gallery | Refined into a compact manual landscape carousel. Authentic rooms, reception and ORL equipment, with the reference-inspired typographic oval aligned to the same image ratio. |
| FAQ | Retained native, keyboard-accessible disclosure panels and a direct email link. |
| Closing CTA | Retained the reference-aligned wellbeing photography, labeled illustrative, with a narrower four-line headline and readable telephone CTAs. |
| Footer | Retained the oversized signature but rebuilt the contact hierarchy: clinic introduction, navigation, separate location columns, prominent phones, email, opening-hours strip and demo notice. |

## Verification

- Production export and TypeScript passed.
- Browser widths: 320, 390, 640, 768, 1024, 1440 and 1920 px.
- All three carousels: next/previous controls, endpoint disabling, keyboard arrows, Home/End and consistent slide dimensions passed.
- Real Chromium touch events verified native swiping for all three carousels at 390 px.
- Smooth navigation and reduced-motion behavior verified.
- Mobile menu, Escape and focus return; FAQ disclosure; local Bosnian font loading; noindex metadata and brand palette verified.
- No broken images, failed resources, runtime errors, horizontal page overflow or clipped visible text.
- Axe WCAG 2 A/AA and WCAG 2.1 AA rules returned no automated violations at 1440 and 390 px. Photograph overlays also received visual review; automated testing is not a full accessibility certification.

Final screenshots and the detailed JSON check report are retained in `/workspace/work/ent-review/`.
