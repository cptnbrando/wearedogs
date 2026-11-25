/**
 * dogs.red is home. The same site is also served at wearedogs.net (GitHub
 * Pages) and wearedogs.pages.dev, and all of them keep working: nobody is
 * redirected, because what a visitor saved in the browser on one address
 * (theme, passcodes, game saves) cannot follow them to another.
 *
 * Links meant to be opened somewhere else are the exception. A share link, a
 * pairing link or a QR code made on a mirror points at dogs.red, so people
 * gather on one address over time. That matters for more than tidiness: two
 * tabs can only share one music player when they are on the same address.
 */

const HOME_ORIGIN = "https://dogs.red";
/** The other addresses that serve this same site in production. */
const MIRROR_HOSTS = ["wearedogs.net", "www.wearedogs.net", "wearedogs.pages.dev"];

/**
 * The origin to put in a link that will be opened elsewhere (shared, scanned,
 * pasted). Home when this page is a production mirror; otherwise this page's
 * own origin, so a dev server and the LAN keep linking to themselves.
 * @returns {string}
 */
export function linkOrigin() {
  if (typeof location === "undefined") return HOME_ORIGIN;
  return MIRROR_HOSTS.indexOf(location.hostname) !== -1 ? HOME_ORIGIN : location.origin;
}
