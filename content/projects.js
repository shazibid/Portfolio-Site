// Single source of truth for the 5 project "discs" — both the 3D case art
// in the rack (bg/ink) and the case-study text in the side panel read from
// this list, in this order. Add/reorder/edit a project here only.
// repo: public code link, or null when the code is private (the panel then says so).
// live: optional deployed-site link (adds a "live demo" button).
// shot: optional screenshot / animated WebP filename in assets/projects/, shown at the top of the panel.
export const projects = [
  {
    title: 'miniplayer',
    repo: 'https://github.com/shazibid/miniplayer',
    shot: 'miniplayer.webp',
    sub: 'swift · swiftui · 2026',
    bg: '#e9447f',
    ink: '#ffffff',
    meta: 'track 01 · july 2026',
    stack: 'swift · swiftui · xcuitest · github actions',
    body: 'a floating now-playing widget for macos. it shows what\'s playing in spotify or apple music and lets you skip and pause without switching apps. it lives in the menu bar or the dock, whichever you prefer, as one small borderless window that stays on top. it follows whichever app is playing and comes in four skins: a liquid glass pill, a spinning cd, a spinning vinyl record, and a click-wheel ipod.',
    n1: 'spotify\'s applescript interface can\'t report a queue, so i wrote the oauth login (authorization code with pkce, loopback callback server, token store with refresh) and a typed web api client to power the ipod skin\'s "up next". apple music gets its queue out of the box.',
    n2: 'media control sits behind a protocol with an injectable fake: unit tests cover parsing, pkce, the oauth loopback server, token storage and queue matching without needing either app running. xcuitest smoke tests drive the real app, and ci gates every pr.'
  },
  {
    title: 'se-sitrep',
    repo: 'https://github.com/cse110-sp26-group13/CSE-110-SE-SitRep',
    live: 'https://cse110-sp26-group13.github.io/CSE-110-SE-SitRep/',
    shot: 'sitrep.webp',
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
    repo: null,
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
    repo: 'https://github.com/jonathanle17/CareFi/tree/main/carefi',
    sub: 'next.js · typescript · 2025',
    bg: '#f0b942',
    ink: '#3a2c07',
    meta: 'track 04 · november 2025 · hackathon winner',
    stack: 'next.js · typescript · tailwind · supabase',
    body: 'an ai dermatology assistant that turns a skin questionnaire and three face photos into a personalized routine with budget-aware product swaps. built with a 4-person team; won best coast hackathon. i was the #2 contributor and owned the photo-upload pipeline end to end.',
    n1: 'the upload flow: guided three-angle photos, drag-and-drop, cross-batch duplicate detection, and file state that survives real users (rejected files never preview, removed ones can be re-picked), backed by a supabase storage layer with bucket policies and an upload api route.',
    n2: 'also built checkout and onboarding (payment formatting, four-field validation, bidirectional budget checks, progression gating) and the account settings page with display-name and password-change endpoints.'
  },
  {
    title: 'arity',
    repo: 'https://github.com/shazibid/ARITY-BTT-PROJECT-1',
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
