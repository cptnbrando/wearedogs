/**
 * Single-segment short URLs that deep-link straight into a campaign:
 * wearedogs.net/thc, /doja, /grass, …
 *
 * Lives in its own dependency-free module because it has two consumers:
 * router.svelte.js resolves the alias at runtime, and the share-cards build
 * plugin prerenders each alias path with the campaign's meta tags so crawlers
 * see the card without running JavaScript.
 */
export const CAMPAIGN_ALIASES = {
  'thc': 'save-texas-hemp',
  'doja': 'save-texas-hemp',
  'grass': 'save-texas-hemp',
  'hemp': 'save-texas-hemp',
  'texas-thc': 'save-texas-hemp',
  'weed': 'save-texas-hemp',
  'pot': 'save-texas-hemp',
  'ganja': 'save-texas-hemp',
  'delta-9': 'save-texas-hemp',
  'za': 'save-texas-hemp',
};
