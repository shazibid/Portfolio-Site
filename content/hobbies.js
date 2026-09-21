// What the laptop screen shows. List tabs take items: [name, blurb, chip label, meter 0..1 or null] (games) / [name, blurb, chip label] (hobbies); the 'workspace' tab is drawn by room/screen.js.
export const tabs = [
  {
    name: 'games',
    items: [
      ['valorant', 'ascendant 1 · i was a certified sweat', 'ASCENDANT 1', 0.62],
      ['overwatch', 'platinum 2 · the first game i ever got into', 'PLATINUM 2', 0.45],
      ['genshin impact', 'alhaitham main · my tmobile break-time grind', 'AR 45', 0.75],
      ['minecraft', 'one more round of bedwars, then i can sleep', 'SANDBOX', null],
      ['tomodachi life', 'running a tiny chaotic island', 'LIFE SIM', null]
    ]
  },
  {
    name: 'hobbies',
    items: [
      ['art & painting', 'my not-so-failed art career', 'CREATIVE'],
      ['the band', 'unofficial oc band · i sing + play guitar', 'VOCALS + GUITAR'],
      ['piano', 'classically trained for 8 years', '8 YEARS'],
      ['figure skating', 'falling gracefully on purpose', 'SINCE AGE 19'],
      ['beaches + big cities', 'sand now, skyline next · post-grad goal: nyc', 'NEXT: NYC'],
      ['nails + makeup', 'one of my favorites, just another way to get creative', 'DIY + FRIENDS']
    ]
  },
  { name: 'workspace', kind: 'workspace' }
];
