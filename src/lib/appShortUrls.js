/**
 * One-segment short urls that open an app directly: dogs.red/cc → converter,
 * dogs.red/d → Data Train, dogs.red/captions → Captions, dogs.red/lv → Lyric Video (not /video: the /vid proxy to the data host would take it).
 *
 * Kept free of imports so both the client router and the build-time share-card
 * plugin (scripts/vite-plugin-share-cards.js) can read the same list.
 */
export const APP_SHORT_URLS = {
  'cc': 'converter',
  'd': 'dataflash',
  'data': 'dataflash',
  'captions': 'captions',
  'lv': 'lyricvideo',
};
