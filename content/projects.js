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
    stack: 'swift · swiftui · xcuitest',
    body: 'an always-on-top macos playback widget driving spotify and apple music over an applescript bridge, with automatic source switching and four interchangeable skins.',
    n1: 'hand-wrote the spotify oauth flow: loopback http callback server, persistent token store with refresh, typed web api client for queue data.',
    n2: 'media control behind a protocol with an injectable fake — 58 unit tests, 3 xcuitest smoke tests, gated in ci.'
  },
  {
    title: 'se-sitrep',
    sub: 'javascript · supabase · 2026',
    bg: '#2ba7b5',
    ink: '#06232a',
    meta: 'track 02 · june 2026 · class project winner',
    stack: 'javascript · supabase · playwright',
    body: 'led a 10-person team shipping a full-stack agile platform: standup dashboard, blocker tracking, github activity sync, calendar views, ai-agent activity monitoring.',
    n1: 'refactored the frontend skeleton into modules — dashboard layout, shared state and selectors, feature modules, navigation.',
    n2: 'built the postgres foundation: schema and rls, join-code onboarding, auth gating, a shared db.js layer replacing mock state.'
  },
  {
    title: 'aesthetic',
    sub: 'aws · gemini vision · 2026',
    bg: '#2a2740',
    ink: '#f5c9e4',
    meta: 'track 03 · jan — apr 2026',
    stack: 'swe intern · aws · gemini vision',
    body: 'built a serverless gmail ingestion pipeline on lambda — oauth, incremental sync, orchestration, s3 — that pulls structured purchase data out of retailer email and surfaces products in-app.',
    n1: 'product-image extraction: domain filtering, heuristic scoring, dedup, gemini vision validation to find wearable fashion.',
    n2: 'benchmarked 5 image-generation models across 26 product photos and picked the one now used for lay-flat imagery.'
  },
  {
    title: 'carefi',
    sub: 'next.js · typescript · 2025',
    bg: '#f0b942',
    ink: '#3a2c07',
    meta: 'track 04 · november 2025 · hackathon winner',
    stack: 'next.js · typescript · tailwind',
    body: 'an ai dermatology web service. i built the three-angle facial photo workflow: guided reference imagery, drag-and-drop uploads, duplicate detection, previews, client-side validation.',
    n1: 'cross-batch duplicate detection and resilient file state — rejected files never generate previews, removed ones can be re-picked.',
    n2: 'checkout and onboarding with payment formatting, four-field validation, bidirectional budget checks, progression gating.'
  },
  {
    title: 'arity',
    sub: 'python · clustering · 2025',
    bg: '#f0ece3',
    ink: '#2a2740',
    meta: 'track 05 · aug — dec 2025',
    stack: 'ml project fellow · python',
    body: 'classified vehicle turns from telematics data: cleaned and engineered features from 60,000+ ios and android events, turning raw gps and sensor fields into modeling variables.',
    n1: '12+ k-means, dbscan and hdbscan workflows; a 3-cluster k-means separating 90° turns, u-turns and lane changes.',
    n2: 'led 6 people through sprint planning and model review with arity stakeholders, translating clusters into readable labels.'
  }
];
