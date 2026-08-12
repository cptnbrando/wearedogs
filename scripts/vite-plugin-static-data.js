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
 * Subdirs in `rootMounts` are instead exposed at the site root
 * (/correspondence/* ← src/data/correspondence/): the letters are imported
 * into the bundle AND must keep their standalone /correspondence/<slug>
 * URLs, which Jekyll on gh-pages turns into real pages.
 *
 * Only the subdirs in `include`/`rootMounts` are exposed, and only data file
 * types (.json/.md/.txt); .js modules like fundraiser/texas/* are build-time
 * import material and never ship as raw files.
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
 * @param {{ include?: string[], rootMounts?: string[] }} [options]
 *   include:    src/data subdirs exposed at /data/<subdir>/
 *   rootMounts: src/data subdirs exposed at /<subdir>/ (site root)
 */
export default function staticData(options = {}) {
  const include = options.include || ["fundraiser", "store"];
  const rootMounts = options.rootMounts || ["correspondence"];
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
        // /data/<subdir>/* → src/data/<subdir>/*, or /<mount>/* for root mounts
        let rel = null;
        if (url.startsWith("/data/")) {
          rel = decodeURIComponent(url.slice("/data/".length));
          if (!include.includes(rel.split("/")[0])) return next();
        } else {
          const mount = rootMounts.find((m) => url.startsWith(`/${m}/`));
          if (!mount) return next();
          rel = decodeURIComponent(url.slice(1));
        }
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
      for (const top of [...include, ...rootMounts]) {
        const base = path.join(dataDir(), top);
        if (!fs.existsSync(base)) continue;
        const atRoot = rootMounts.includes(top);
        for (const file of walk(base)) {
          if (!MIME[path.extname(file).toLowerCase()]) continue;
          const rel = path.relative(dataDir(), file);
          // include/ subdirs land in dist/data/<subdir>; root mounts in dist/<subdir>
          const dest = atRoot
            ? path.join(outDir, rel)
            : path.join(outDir, "data", rel);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(file, dest);
        }
      }
    },
  };
}
