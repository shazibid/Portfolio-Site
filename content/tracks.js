// One "now playing" track per project disc (real songs, 30s previews), same order as content/projects.js.
// preview is a 30s Apple Music clip (from the iTunes Search API); link opens the full song, art is the album cover printed on the disc.
export const tracks = [
  {
    title: 'the less i know the better',
    artist: 'tame impala',
    preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f2/e9/c4/f2e9c461-78b6-374e-681d-b654295df3a4/mzaf_6068998697660055296.plus.aac.p.m4a',
    link: 'https://music.apple.com/us/album/the-less-i-know-the-better/1440838039?i=1440838488',
    art: './assets/covers/0.jpg'
  },
  {
    title: 'pain',
    artist: 'pinkpantheress',
    preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2b/57/6d/2b576d5e-8153-0407-ed8b-531d99f7dd06/mzaf_2690121680269691609.plus.aac.p.m4a',
    link: 'https://music.apple.com/us/album/pain/1587060922?i=1587060923',
    art: './assets/covers/1.jpg'
  },
  {
    title: 'normal girl',
    artist: 'sza',
    preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/cf/e4/82/cfe4820a-2830-d4b2-af62-e44e479ceb84/mzaf_6960146568850049402.plus.aac.p.m4a',
    link: 'https://music.apple.com/us/album/normal-girl/1239976329?i=1239976613',
    art: './assets/covers/2.jpg'
  },
  {
    title: 'slow dancing in the dark',
    artist: 'joji',
    preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/eb/7e/ec/eb7eec40-40b9-104b-7849-3c024463160f/mzaf_8862954327442459482.plus.aac.p.m4a',
    link: 'https://music.apple.com/us/album/slow-dancing-in-the-dark/1724894191?i=1724894200',
    art: './assets/covers/3.jpg'
  },
  {
    title: 'redbone',
    artist: 'childish gambino',
    preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/05/f1/e2/05f1e25b-aa46-5a60-040a-a8d52483d487/mzaf_5014076935652388885.plus.aac.p.m4a',
    link: 'https://music.apple.com/us/album/redbone/1771719334?i=1771719595',
    art: './assets/covers/4.jpg'
  }
];
