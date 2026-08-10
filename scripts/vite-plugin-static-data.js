import fs from "node:fs";
import path from "node:path";

/**
 * Static data out of src/data: the runtime-fetched datasets (campaigns.json
 * is 564 KB — far too big to bundle) live with the rest of the data under
 * src/data/, and this plugin keeps them reachable at /data/<subdir>/<file>:
 *
 *  - dev:   a middleware serves /data/fundraiser/* and /data/store/* straight
 *           from src/data/
 *  - build: the same files are copied into dist/data/ after the bundle is
 *           written (closeBundle, like share-cards, so the legacy plugin's
 *           second pass can't cause emit conflicts)
 *
 * Only the subdirs in `include` are exposed, and only data file types
 * (.json/.md/.txt); .js modules like fundraiser/texas/* are build-time import
 * material and never ship as raw files.
 */

const MIME = {
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(path.join(dir, entry.name))
      : [path.join(dir, entry.name)],
  );
}

/**
 * @param {{ include?: string[] }} [options] top-level src/data subdirs to expose
 */
export default function staticData(options = {}) {
  const include = options.include || ["fundraiser", "store"];
  let root = process.cwd();
  let outDir = "dist";

  const dataDir = () => path.join(root, "src", "data");

  return {
    name: "wad-static-data",

    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || "").split("?")[0];
        if (!url.startsWith("/data/")) return next();
        const rel = decodeURIComponent(url.slice("/data/".length));
        if (!include.includes(rel.split("/")[0])) return next();
        const file = path.join(dataDir(), rel);
        // path.join normalizes ../ away; anything escaping src/data is refused.
        if (!file.startsWith(dataDir() + path.sep)) return next();
        const mime = MIME[path.extname(file).toLowerCase()];
        if (!mime) return next();
        if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) return next();
        res.setHeader("Content-Type", mime);
        fs.createReadStream(file).pipe(res);
      });
    },

    closeBundle() {
      for (const top of include) {
        const base = path.join(dataDir(), top);
        if (!fs.existsSync(base)) continue;
        for (const file of walk(base)) {
          if (!MIME[path.extname(file).toLowerCase()]) continue;
          const rel = path.relative(dataDir(), file);
          const dest = path.join(outDir, "data", rel);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(file, dest);
        }
      }
    },
  };
}
