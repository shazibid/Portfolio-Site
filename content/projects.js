// Single source of truth for the 5 project "discs" — both the 3D case art
// in the rack (bg/ink) and the case-study text in the side panel read from
// this list, in this order. Add/reorder/edit a project here only.
export const projects = [
  {
    title: 'miniplayer',
    sub: 'swift · swiftui · 2026',
    bg: '#e9447f',
    ink: '#ffffff',
    meta: 'track 01 · july 2026',
    stack: 'swift · swiftui · xcuitest · github actions',
    body: 'a tiny always-on-top macos widget that shows what\'s playing in spotify or apple music and controls it without switching apps. no dock icon, no menu bar clutter. it auto-switches between sources and comes in four skins: liquid glass pill, spinning cd, click-wheel ipod, and vinyl.',
    n1: 'spotify has no queue in its applescript dictionary, so i hand-wrote the oauth flow (loopback http callback server, token store with refresh) and a typed web api client to power the ipod\'s "up next".',
    n2: 'media control sits behind a protocol with an injectable fake: 58 unit tests plus 3 xcuitest smoke tests, with unit tests gating every pr in ci.'
  },
  {
    title: 'se-sitrep',
    sub: 'javascript · supabase · 2026',
    bg: '#2ba7b5',
    ink: '#06232a',
    meta: 'track 02 · june 2026 · class project winner',
    stack: 'javascript · supabase · playwright · github actions',
    body: 'a standup dashboard for small agile teams, built by a 10-person team with no framework and no build step. daily check-ins, mood trends, blocker tracking, github issue and pr sync, shared calendars, and a tracker for how much ai assistance the team is using.',
    n1: 'top contributor (62 commits). i built the postgres foundation on supabase (schema, row-level security, join-code onboarding, auth gate), replaced the mock state with a shared db layer, and wrote the halftone design system every page uses.',
    n2: 'shipped the github rest client (auth, error mapping, pagination) and the pr data layer, plus the circle switcher and settings. i also un-broke ci after five stacked bugs had been hiding failures for five merges.'
  },
  {
    title: 'aesthetic',
    sub: 'aws · gemini vision · 2026',
    bg: '#2a2740',
    ink: '#f5c9e4',
    meta: 'track 03 · jan — apr 2026',
    stack: 'swe intern · aws lambda · s3 · gemini vision',
    body: 'a fashion shopping app. i built the serverless gmail pipeline on lambda (oauth, incremental sync, orchestration, s3) that pulls structured purchase data out of retailer email, then owned the in-app shopping experience ui end to end.',
    n1: 'emails are full of logos, banners and tracking pixels, so i built an image extractor: domain filtering, heuristic scoring, dedup, then gemini vision to confirm each image is a wearable item.',
    n2: 'made the image-model choice with data: an eval harness scored 5 models across 26 product photos with html/csv reports. the winner now generates the lay-flat product imagery.'
  },
  {
    title: 'carefi',
    sub: 'next.js · typescript · 2025',
    bg: '#f0b942',
    ink: '#3a2c07',
    meta: 'track 04 · november 2025 · hackathon winner',
    stack: 'next.js · typescript · tailwind',
    body: 'an ai dermatology web service that won best coast hackathon. i built the core input flow: a three-angle facial photo workflow with guided reference imagery, drag-and-drop uploads, previews, and client-side validation, so the model gets usable photos on the first try.',
    n1: 'upload state that survives real users: duplicate detection across batches, rejected files never generate previews, and removed files can be picked again.',
    n2: 'checkout and onboarding: payment formatting, four-field validation, bidirectional budget checks, and progression gating so nobody skips ahead with bad data.'
  },
  {
    title: 'arity',
    sub: 'python · clustering · 2025',
    bg: '#f0ece3',
    ink: '#2a2740',
    meta: 'track 05 · aug — dec 2025',
    stack: 'ml project fellow · python · scikit-learn',
    body: 'can you tell a 90° turn from a u-turn or lane change using only phone sensors? with arity (insurance telematics) i cleaned 60,000+ ios and android events and engineered features from raw gps and motion data, then modeled them without labels.',
    n1: 'ran 12+ k-means, dbscan and hdbscan workflows. a 3-cluster k-means cleanly separated 90° turns, u-turns and lane changes; the team\'s supervised random forest then hit 96% accuracy.',
    n2: 'led a 6-person team through sprint planning and model review with arity stakeholders, translating raw clusters into labels a non-ml reader can use.'
  }
];
