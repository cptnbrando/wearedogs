/**
 * Map data, reassembled: locations.json holds where places are and what they
 * look like; reviews.json holds what we thought of them (review, best dishes,
 * best times, directions, extra notes) keyed by location id. Kept as two
 * files so a location can exist before it has a review; merged here so the
 * map keeps consuming one array of full spots.
 */
import locations from "./locations.json";
import reviews from "./reviews.json";

export const mapSpots = locations.map((location) => ({
  ...location,
  ...(reviews[location.id] || {}),
}));

export default mapSpots;
