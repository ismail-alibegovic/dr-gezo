# Poliklinika Dr. Gežo — independent homepage concept

Local-only Next.js + TypeScript + Tailwind CSS demo. Not deployed.

## Run

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `npm run build` validates the production build.

## Sources and factual limits

Researched 7 November 2026:
- https://www.drgezo.ba/ — brand, history, hours, contacts, existing medical imagery.
- https://www.drgezo.ba/css/style.css — primary #3156A3, secondary #42B3E5, neutral backgrounds.
- https://drgezo.ba/nas-tim/doktori — names, portraits, displayed qualifications. The site labels Anid Gežo as a specialist in its heading, while the biographical text still includes historical specialist-training details. Use clinic confirmation before official publication.
- https://www.drgezo.ba/kontakt — addresses and contacts.
- https://www.drgezo.ba/usluge/ambulantne-usluge — ORL service categories.
- https://dribbble.com/shots/27616287-Healthcare-Clinic-Platform — URL did not return usable content in this environment; the user-supplied full-page reference image served as the visual specification.

Official clinic portraits and logo are used solely for this requested independent concept; obtain clinic authorization before public use. No testimonials or patient statistics are invented. Individual clinical availability is not asserted.

Illustrative images: Unsplash photos `1594824476967-48c8b964273f`, `1576091160399-112ba8d25d1d`, and `1576091160550-2173dba999ef` via images.unsplash.com, under the standard Unsplash license (https://unsplash.com/license). Stock subjects are not represented as clinic staff. Other medical illustrations are reused from the official clinic site. The page has noindex/nofollow metadata and a Bosnian demo notice.

## Verification

Production build and TypeScript passed. Chromium/Playwright tested 1440, 768 and 390 pixel widths, image loading, horizontal overflow, menu, FAQ and runtime errors. Full-page screenshots retained in /workspace/work. Visual refinement used the supplied reference: headline scale, portrait placement, blue gradient treatment, card proportions, section rhythm, and oversized footer.

## Final visual review

Navigation integrated into the hero; desktop hero set to 880px, service cards to 500px, and team cards to 510px. Major section intervals expanded to match the supplied reference's visual rhythm. Gallery cards show a sliver of the next item. Card labels remain anchored over the lower gradient. The oversized footer wordmark fills the available width. The mobile hero crop clears the headline and uses a two-column treatment for specialties, benefits and clinic imagery.

Additional authentic clinic photos come from https://www.drgezo.ba/foto-galerija (audiometer, ORL room, instruments, reception and microscope). The closing lifestyle composition uses Pexels photos 6293240 and 6293241, under https://www.pexels.com/license/:
- https://www.pexels.com/photo/a-woman-stretching-her-arms-6293240/
- https://www.pexels.com/photo/a-woman-stretching-her-arms-6293241/

The exact original doctor pose and uniform background cannot be reproduced using the available authentic clinic portraits; their original photographs are preserved rather than replacing staff with stock subjects. Eight verified ORL specialty categories replace the reference's sixteen general specialties, and verified location cards replace unsourced testimonials.
