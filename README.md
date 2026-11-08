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

## ENT art direction and carousel refinement

The currently deployed Site is unchanged. This local revision retains and redesigns the services and team carousels; the clinic gallery now uses the same manual navigation language with a shorter landscape format. Native touch scrolling, scroll snapping, keyboard arrows/Home/End, disabled endpoint controls, visible ranges, live announcements and reduced-motion support replace fixed-pixel scrolling. There is no autoplay.

Image audit:
- Hero: the generic posed clinician is replaced by an explicitly illustrative ear-examination scene.
- Services: otoscopy, a clinic audiometer, clinic endoscopy equipment, a throat examination, and clinic surgical instruments. Generic phone/stethoscope/syringe imagery is no longer used.
- Team: original clinic portraits, cropped consistently into a wider frame to preserve faces and shoulders.
- Specialties and patient convenience: concise static grids remain useful for scanning; they are not converted into sliders.
- Locations: both verified addresses and telephone numbers remain visible in static cards.
- Clinic gallery: authentic ORL rooms, reception, microscope and recovery-space photographs, plus the reference-inspired typographic oval.
- Closing CTA: the reference-aligned lifestyle image remains as a wellbeing interlude, explicitly labeled illustrative.
- Footer: oversized brand signature, concise clinic navigation, dedicated location/phone columns, email, opening hours and demo disclosure.

New illustrative photos are licensed under https://www.pexels.com/license/:
- https://www.pexels.com/photo/doctor-and-patient-during-examination-8313446/
- https://www.pexels.com/photo/a-patient-having-ear-examination-5206951/
- https://www.pexels.com/photo/doctor-and-patient-during-examination-7579824/

Inter is self-hosted as Latin and Latin Extended WOFF2 fonts; the SIL Open Font License is included in public/fonts/OFL.txt. Bosnian characters are supported locally with no external font requests.

## Client annotation corrections — 8 November 2026

Replaced the outdoor closing image with an ear examination (Pexels photo 5206942, https://www.pexels.com/photo/a-doctor-doing-an-ear-examination-5206942/). The gallery's decorative text tile is now an authentic clinic-room photograph, with all five gallery items using the same photo-card structure. Removed visible illustration/provenance notices and the footer's independent-demo statement as explicitly requested. Retained descriptive image alt text and noindex metadata. Verified the corrections at 390, 1237 and 1440px, including image loading, gallery controls and page overflow.
