import * as fflate from "fflate";

/**
 * Package a list of files into a ZIP archive Blob.
 * @param {Array<{ name: string, data: Uint8Array }>} files
 * @returns {Promise<Blob>}
 */
export function createZip(files) {
  return new Promise((resolve, reject) => {
    const zipObj = {};
    for (const file of files) {
      zipObj[file.name] = file.data;
    }
    fflate.zip(zipObj, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(new Blob([data], { type: "application/zip" }));
      }
    });
  });
}

/**
 * Extract files from a ZIP archive Blob/Uint8Array.
 * @param {Uint8Array} uint8Array
 * @returns {Promise<Record<string, Uint8Array>>}
 */
export function unzip(uint8Array) {
  return new Promise((resolve, reject) => {
    fflate.unzip(uint8Array, (err, unzipped) => {
      if (err) {
        reject(err);
      } else {
        resolve(unzipped);
      }
    });
  });
}
