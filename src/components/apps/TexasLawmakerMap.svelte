<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<script>
  import { spring } from "svelte/motion";
  import { fade, fly } from "svelte/transition";
  import {
    px,
    py,
    toPath,
    TEXAS_OUTLINE,
    NEIGHBORS,
    HIGHWAYS,
    CITIES,
    LANDMARKS,
    WATER_LABELS,
    RIVERS,
    RIO_GRANDE,
    CITY_CELLS,
    TEXAS_PATH,
    DEFAULT_VIEW,
    viewAround,
  } from "../../lib/texasGeo.js";
  import {
    TEXAS_STATS,
    NEIGHBOR_STATS,
    CITY_STATS,
    CITY_STATS_METHOD,
    STATS_SOURCES,
  } from "../../lib/hempStats.js";

  let {
    lawmakers = [],
    selectedEmails = [],
    focusRequest = null,
    title = "TEXAS LAWMAKERS",
    isFullscreen = false,
    onToggleFullscreen = null,
  } = $props();

  /**
   * Identity key for focus and navigation. NOT the email address: the federal
   * offices don't publish one, so all three carry email:"" and any email-keyed
   * lookup collapses them onto whichever comes first — stepping past Ted Cruz
   * looked like the list had dead-ended. Mail-list membership still keys off
   * email, because that's the thing actually being mailed.
   */
  function keyOf(rep) {
    if (!rep) return null;
    return rep.email ? `email:${rep.email}` : `name:${rep.name}`;
  }

  let activeKey = $state(null);
  let hoveredKey = $state(null);

  /** Which way the card slides in: +1 stepping forward, -1 stepping back. */
  let stepDirection = $state(1);
  let showLegend = $state(false);

  // Roads and rivers are useful once you're in close, but they're noise on the
  // first look — off by default.
  let showRoads = $state(false);
  let showRivers = $state(false);
  let showBorders = $state(true);

  // Spring-animated viewBox, matching the pan/zoom feel of the main /map panel.
  const vx = spring(DEFAULT_VIEW.x, { stiffness: 0.24, damping: 0.78, precision: 0.05 });
  const vy = spring(DEFAULT_VIEW.y, { stiffness: 0.24, damping: 0.78, precision: 0.05 });
  const vw = spring(DEFAULT_VIEW.w, { stiffness: 0.24, damping: 0.78, precision: 0.05 });
  const vh = spring(DEFAULT_VIEW.h, { stiffness: 0.24, damping: 0.78, precision: 0.05 });

  let zoomFactor = $derived(DEFAULT_VIEW.w / $vw);

  // The SVG scales its viewBox to fit the stage, so a "20 unit" label renders
  // at wildly different physical sizes. Measure the stage and convert desired
  // *screen pixels* into user units, so type is the size we asked for at every
  // zoom level and on every screen.
  let stageW = $state(0);
  let stageH = $state(0);

  let renderScale = $derived(
    stageW && stageH ? Math.min(stageW / $vw, stageH / $vh) : 0,
  );

  /** Screen pixels -> SVG user units. */
  let u = $derived((screenPx) => (renderScale ? screenPx / renderScale : 0));

  // Small screens get slightly tighter type so labels don't collide.
  let compact = $derived(stageW > 0 && stageW < 520);
  let ts = $derived(compact ? 0.82 : 1);

  // The money figures are sized for a phone stage, where they read fine — but
  // they keep that size on a desktop column or a TV and turn microscopic
  // relative to everything around them. The stats sheet and the neighbour
  // revenue labels scale up with the measured stage instead; the rest of the
  // map's type keeps its constant screen size.
  let statScale = $derived(stageW > 520 ? Math.min(1.8, stageW / 520) : 1);

  let activeRep = $derived(
    lawmakers.find((l) => keyOf(l) === activeKey) || null,
  );

  /**
   * A clicked/focused pin wins — otherwise the card would vanish the moment
   * you moved the pointer off the dot toward it. Hover only drives the card
   * when nothing is pinned.
   */
  let infoRep = $derived(
    activeRep || lawmakers.find((l) => keyOf(l) === hoveredKey) || null,
  );

  const texasPath = toPath(TEXAS_OUTLINE, true);
  const rioGrandePath = toPath(RIO_GRANDE);
  const neighborPaths = NEIGHBORS.map((n) => ({ ...n, d: toPath(n.coords, true) }));
  const highwayPaths = HIGHWAYS.map((h) => ({ ...h, d: toPath(h.coords) }));
  const riverPaths = RIVERS.map((r) => ({ ...r, d: toPath(r.coords) }));

  // Quick-jump chips for the places people actually look for.
  const CHIP_NAMES = [
    "DALLAS–FORT WORTH",
    "HOUSTON",
    "AUSTIN",
    "SAN ANTONIO",
    "EL PASO",
    "LUBBOCK",
    "AMARILLO",
    "CORPUS CHRISTI",
    "MCALLEN",
    "GALVESTON",
    "WACO",
    "MIDLAND",
    "TYLER",
  ];
  const chipCities = CHIP_NAMES.map((n) => CITIES.find((c) => c.name === n)).filter(
    Boolean,
  );

  let activeCity = $state(null);
  let showStats = $state(false);

  /** Which page of the stats sheet is open. */
  let statsTab = $state("money");

  /**
   * ALL / SENATE / HOUSE pin filter. "Senate" is shorthand for everything that
   * isn't the House — state senators, the Lt. Governor and Governor, and the
   * federal offices — because that's the group the map started with.
   */
  let chamberMode = $state("all");

  function inChamber(rep) {
    if (chamberMode === "all") return true;
    if (chamberMode === "house") return rep.chamber === "house";
    return rep.chamber !== "house";
  }

  let roster = $derived(lawmakers.filter((l) => inChamber(l)));

  function cycleChamber() {
    chamberMode =
      chamberMode === "all" ? "senate" : chamberMode === "senate" ? "house" : "all";
    // A focused pin that just got filtered out would leave a ghost card
    // pointing at nothing.
    hoveredKey = null;
    if (activeRep && !inChamber(activeRep)) resetView();
  }

  /**
   * Bar length as a percentage of the biggest value in a set. Texas is included
   * in the neighbour scale on purpose — seeing $5.5B next to $590M is the point.
   */
  function barPct(value, max) {
    if (!value || !max) return 0;
    return Math.max(1.5, (value / max) * 100);
  }

  const NEIGHBOR_MAX = Math.max(
    TEXAS_STATS.retailValue,
    ...NEIGHBOR_STATS.map((n) => n.revenueValue || 0),
  );
  const NEIGHBOR_TAX_MAX = Math.max(
    TEXAS_STATS.taxValue,
    ...NEIGHBOR_STATS.map((n) => n.taxValue || 0),
  );
  const CITY_MAX = Math.max(...CITY_STATS.map((c) => c.revenueValue || 0));

  /* --- REPRESENTATION tab: who actually holds the Texas Legislature. --- */
  const HOUSE_SEATS = 150;
  const SENATE_SEATS = 31;

  let houseMembers = $derived(lawmakers.filter((l) => l.chamber === "house"));
  let senateMembers = $derived(
    lawmakers.filter((l) => l.chamber === "senate" && l.position === "Senator"),
  );

  function partySplit(list) {
    const r = list.filter((l) => l.party === "R").length;
    const d = list.filter((l) => l.party === "D").length;
    return { r, d };
  }

  let houseParty = $derived(partySplit(houseMembers));
  let senateParty = $derived(partySplit(senateMembers));

  /** Ban-stance spread across every office on the map, unrated included. */
  let stanceDist = $derived.by(() => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const l of lawmakers) counts[stanceOf(l).score] += 1;
    return counts;
  });
  let ratedCount = $derived(lawmakers.length - stanceDist[0]);

  /**
   * Each dot's fill blends party into ban stance. The party half is shaded by
   * chamber — Senate & statewide run deep red/blue, the House runs light
   * red/blue — so who's a senator and who's a House rep reads from colour
   * alone, even at sizes where circle-vs-diamond is too small to tell.
   */
  const PARTY_HUE = {
    sen: { rep: "#b91c1c", dem: "#1d4ed8", ind: "#71717a" },
    hou: { rep: "#fca5a5", dem: "#93c5fd", ind: "#d4d4d8" },
  };

  function chamberTone(rep) {
    return rep.chamber === "house" ? "hou" : "sen";
  }
  const STANCE_HUE = {
    s0: "#a1a1aa",
    s1: "#34d399",
    s2: "#a3e635",
    s3: "#fbbf24",
    s4: "#fb923c",
    s5: "#f87171",
  };

  function ringId(rep) {
    return `txRing-${chamberTone(rep)}-${partyTone(rep.party)}-${stanceOf(rep).tone}`;
  }

  /** One gradient per chamber/party/stance combo actually present. */
  let ringGradients = $derived.by(() => {
    const seen = new Map();
    for (const rep of navigableReps) {
      const id = ringId(rep);
      if (seen.has(id)) continue;
      seen.set(id, {
        id,
        from: PARTY_HUE[chamberTone(rep)][partyTone(rep.party)],
        to: STANCE_HUE[stanceOf(rep).tone],
      });
    }
    return [...seen.values()];
  });

  /** Sortable senator table inside the stats sheet. */
  let statsSort = $state({ key: "stance", dir: -1 });

  const STATS_COLUMNS = [
    { key: "name", label: "NAME" },
    { key: "party", label: "P" },
    { key: "position", label: "OFFICE" },
    { key: "stance", label: "BAN" },
    { key: "region", label: "REGION" },
    { key: "phone", label: "PHONE" },
  ];

  function sortBy(key) {
    statsSort =
      statsSort.key === key
        ? { key, dir: -statsSort.dir }
        : { key, dir: key === "stance" ? -1 : 1 };
  }

  let sortedLawmakers = $derived.by(() => {
    const { key, dir } = statsSort;
    return [...roster].sort((a, b) => {
      if (key === "stance") {
        return ((a.banLikelihood ?? 0) - (b.banLikelihood ?? 0)) * dir;
      }
      const av = String(a[key] ?? "").toLowerCase();
      const bv = String(b[key] ?? "").toLowerCase();
      return av.localeCompare(bv) * dir;
    });
  });

  /**
   * How likely this office is to vote for the ban, 1 (supports legal hemp) to
   * 5 (driving the ban). 0/absent means we have no record for them yet, which
   * is shown as unrated rather than guessed at.
   */
  const STANCE = {
    1: { label: "SUPPORTS LEGAL HEMP", tone: "s1" },
    2: { label: "PREFERS REGULATION", tone: "s2" },
    3: { label: "MIXED / UNCLEAR", tone: "s3" },
    4: { label: "LEANS TOWARD BAN", tone: "s4" },
    5: { label: "DRIVING THE BAN", tone: "s5" },
  };

  function stanceOf(rep) {
    const n = Number(rep?.banLikelihood);
    if (!Number.isFinite(n) || n < 1 || n > 5) {
      return { label: "NO RECORD YET", tone: "s0", score: 0 };
    }
    return { ...STANCE[Math.round(n)], score: Math.round(n) };
  }

  /** Party letter for the badge — R red, D blue, anything else neutral. */
  function partyTone(party) {
    if (party === "R") return "rep";
    if (party === "D") return "dem";
    return "ind";
  }

  /** Stubs with no coordinates would otherwise plot at 0,0 out in the Atlantic. */
  function hasCoords(rep) {
    return (
      typeof rep?.lat === "number" &&
      typeof rep?.lng === "number" &&
      Number.isFinite(rep.lat) &&
      Number.isFinite(rep.lng) &&
      !(rep.lat === 0 && rep.lng === 0)
    );
  }

  /** Only offices that can actually be shown on the map are navigable. */
  let navigableReps = $derived(roster.filter(hasCoords));

  /**
   * Arrow / swipe stepping through the roster. Wraps at both ends, and starts
   * from the first office when nothing is open yet.
   */
  function stepRep(delta) {
    const list = navigableReps;
    if (list.length === 0) return;
    stepDirection = delta > 0 ? 1 : -1;
    const current = list.findIndex((l) => keyOf(l) === activeKey);
    // Wraps both ways: next past the last office comes back to the first.
    const next =
      current === -1
        ? list[delta > 0 ? 0 : list.length - 1]
        : list[(current + delta + list.length) % list.length];
    if (!next) return;
    activeCity = null;
    activeKey = keyOf(next);
    setView(viewAround(next.lng, next.lat, 300));
  }

  /**
   * ← / → step between senators too, but only while the map is actually on
   * screen. Its carousel slide stays mounted while the reader scrolls down
   * through the bio, and re-aiming a map they can't see would be a ghost
   * interaction. Typing in a field always wins.
   */
  let stageEl = $state(null);
  let mapOnScreen = $state(false);

  $effect(() => {
    if (!stageEl) return;
    if (typeof IntersectionObserver === "undefined") {
      mapOnScreen = true;
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        mapOnScreen = entry.isIntersecting;
      },
      { threshold: 0.2 },
    );
    io.observe(stageEl);
    return () => io.disconnect();
  });

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      el.isContentEditable
    );
  }

  function handleMapKeys(e) {
    if (isTypingTarget(document.activeElement)) return;

    // Esc closes the stats sheet first. Caught in the capture phase and stopped
    // dead, because TitlePage also listens on window and would otherwise close
    // the whole store panel out from under it.
    if (e.key === "Escape" && showStats) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      showStats = false;
      return;
    }

    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    // While the stats sheet is up the arrows belong to its scrolling tables.
    if (showStats) return;
    if (!mapOnScreen || navigableReps.length < 2) return;
    // Stop the browser scrolling the panel sideways as well.
    e.preventDefault();
    stepRep(e.key === "ArrowRight" ? 1 : -1);
  }

  // Horizontal swipe on the card steps between senators; vertical scrolling of
  // the card's own text is left alone.
  let touchStartX = 0;
  let touchStartY = 0;

  function onCardTouchStart(e) {
    const t = e.changedTouches?.[0];
    if (!t) return;
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }

  function onCardTouchEnd(e) {
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    stepRep(dx < 0 ? 1 : -1);
  }

  function initialsOf(rep) {
    const stripped = rep.name.replace(
      /^(Lt\.?\s*Gov\.?|Sen\.?|Rep\.?|Gov\.?)\s*/i,
      "",
    );
    return stripped
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  // The springs report an interpolated value mid-flight. Zoom steps must work
  // off where we're *going*, or a click during the animation snaps the view
  // back to wherever the tween happened to be.
  let target = { ...DEFAULT_VIEW };

  function setView(v) {
    target = { ...v };
    vx.set(v.x);
    vy.set(v.y);
    vw.set(v.w);
    vh.set(v.h);
  }

  /** Same as setView but skips the spring, so a drag tracks the finger exactly. */
  function setViewHard(v) {
    target = { ...v };
    vx.set(v.x, { hard: true });
    vy.set(v.y, { hard: true });
    vw.set(v.w, { hard: true });
    vh.set(v.h, { hard: true });
  }

  /**
   * Drag to pan, mouse and touch through the same pointer events. A press only
   * becomes a pan past a few pixels, so tapping a pin still selects it rather
   * than nudging the map. Once it IS a pan the detail card is dismissed — it
   * covers the corner you're dragging toward and pins to a rep you've moved
   * away from.
   */
  let isPanning = $state(false);
  let panMoved = false;
  let panStart = null;

  function onPanStart(e) {
    if (e.button !== undefined && e.button !== 0) return;
    panMoved = false;
    panStart = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      vx: target.x,
      vy: target.y,
    };
  }

  function onPanMove(e) {
    if (!panStart || e.pointerId !== panStart.id || !renderScale) return;
    const dxPx = e.clientX - panStart.x;
    const dyPx = e.clientY - panStart.y;

    if (!panMoved) {
      if (Math.hypot(dxPx, dyPx) < 5) return;
      panMoved = true;
      isPanning = true;
      activeKey = null;
      hoveredKey = null;
      activeCity = null;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }

    // The view centre stays inside the default frame, so a hard fling can
    // never lose Texas off the edge of the screen.
    setViewHard({
      x: Math.max(
        DEFAULT_VIEW.x - target.w / 2,
        Math.min(
          DEFAULT_VIEW.x + DEFAULT_VIEW.w - target.w / 2,
          panStart.vx - dxPx / renderScale,
        ),
      ),
      y: Math.max(
        DEFAULT_VIEW.y - target.h / 2,
        Math.min(
          DEFAULT_VIEW.y + DEFAULT_VIEW.h - target.h / 2,
          panStart.vy - dyPx / renderScale,
        ),
      ),
      w: target.w,
      h: target.h,
    });
  }

  function onPanEnd(e) {
    if (panStart && e?.pointerId === panStart.id) {
      e.currentTarget?.releasePointerCapture?.(e.pointerId);
    }
    panStart = null;
    isPanning = false;
    // panMoved stays true until the next press so the click that ends a drag
    // doesn't also zoom to whatever was under the cursor.
  }

  /**
   * The click a drag releases would still land on whatever pin or city the
   * pointer happened to stop over. Caught on the way down and killed before
   * any zoomTo sees it; a clean press resets panMoved in onPanStart.
   */
  function onStageClickCapture(e) {
    if (!panMoved) return;
    panMoved = false;
    e.stopPropagation();
    e.preventDefault();
  }

  function resetView() {
    activeKey = null;
    activeCity = null;
    setView(DEFAULT_VIEW);
  }

  function zoomTo(rep) {
    // Clicking the already-focused lawmaker zooms back out — "in and out of their name".
    if (activeKey === keyOf(rep)) {
      resetView();
      return;
    }
    activeCity = null;
    activeKey = keyOf(rep);
    setView(viewAround(rep.lng, rep.lat, 300));
  }

  function zoomToCity(city, height = 220) {
    if (activeCity === city.name) {
      resetView();
      return;
    }
    activeKey = null;
    activeCity = city.name;
    setView(viewAround(city.lng, city.lat, height));
  }

  // Deep enough to pick out individual DFW suburbs.
  const MIN_VIEW_W = 40;

  function stepZoom(factor) {
    const cx = target.x + target.w / 2;
    const cy = target.y + target.h / 2;
    const nw = Math.min(DEFAULT_VIEW.w, Math.max(MIN_VIEW_W, target.w * factor));
    const nh = (nw * 9) / 16;
    setView({ x: cx - nw / 2, y: cy - nh / 2, w: nw, h: nh });
  }

  function isSelected(email) {
    return selectedEmails.includes(email);
  }

  let focusedKey = $derived(activeKey || hoveredKey);
  let focusedRep = $derived(
    lawmakers.find((l) => keyOf(l) === focusedKey) || null,
  );

  const CELL_BY_NAME = new Map(CITY_CELLS.map((c) => [c.name, c.d]));

  /**
   * City names sit beside their dot on the map, but a name is only drawn if
   * its box doesn't collide with one already placed. Candidates are tried in
   * importance order (big cities first) and each gets four candidate
   * positions, so DFW reads cleanly instead of turning into a smear. Lawmaker
   * pins reserve their space first — their names must never be obscured.
   */
  function boxesOverlap(a, b) {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  }

  let inViewport = $derived(
    (x, y) =>
      x > $vx - u(30) &&
      x < $vx + $vw + u(30) &&
      y > $vy - u(20) &&
      y < $vy + $vh + u(20),
  );

  /**
   * Lawmaker names get the same collision treatment as cities — six DFW
   * offices sit on top of each other, and drawing all six names produced an
   * unreadable stack. Names that can't find clear space are dropped; hover or
   * zoom in to see them.
   */
  let pinLabels = $derived.by(() => {
    if (!renderScale || !showDetail || focusedKey) return [];
    const placed = [];
    const out = [];

    for (const rep of navigableReps) {
      const x = px(rep.lng);
      const y = py(rep.lat);
      if (!inViewport(x, y)) continue;

      const hw = u(nameHalfWidth(rep));
      const h = u(26 * ts);
      const options = [
        { oy: -u(15) },
        { oy: u(30) },
        { oy: -u(34) },
        { oy: u(49) },
      ];

      for (const o of options) {
        const box = { x: x - hw, y: y + o.oy - u(13 * ts), w: hw * 2, h };
        if (placed.some((p) => boxesOverlap(p, box))) continue;
        placed.push(box);
        out.push({ rep, x, y: y + o.oy, box });
        break;
      }
    }
    return out;
  });

  let cityLabels = $derived.by(() => {
    if (!renderScale) return [];

    const inView = inViewport;

    // Lawmaker names claim their space first — they're the point of the map.
    // A bare pin is just a dot, and label plates sit behind their text, so a
    // dot under a label is fine; only a drawn *name* needs the room.
    const placed = pinLabels.map((p) => p.box);
    if (focusedRep) {
      const hw = u(nameHalfWidth(focusedRep));
      placed.push({
        x: px(focusedRep.lng) - hw,
        y: py(focusedRep.lat) - u(32 * ts),
        w: hw * 2,
        h: u(46 * ts),
      });
    }

    const out = [];
    const candidates = CITIES.filter((c) => labelVisible(c.tier)).sort(
      (a, b) => a.tier - b.tier,
    );

    for (const c of candidates) {
      const dx = px(c.lng);
      const dy = py(c.lat);
      if (!inView(dx, dy)) continue;

      const fs = (c.tier === 1 ? 12.5 : c.tier === 2 ? 10.5 : 9) * ts;
      // Size the plate to the text that actually gets drawn, not the full name.
      const w = u((c.short || c.name).length * fs * 0.66 + 12);
      const h = u(fs + 8);

      const options = [
        { ox: u(11), oy: u(3.5), anchor: "start" },
        { ox: -u(11), oy: u(3.5), anchor: "end" },
        { ox: 0, oy: -u(12), anchor: "middle" },
        { ox: 0, oy: u(18), anchor: "middle" },
      ];

      for (const o of options) {
        const tx = dx + o.ox;
        const ty = dy + o.oy;
        const bx =
          o.anchor === "start" ? tx - u(4) : o.anchor === "end" ? tx - w + u(4) : tx - w / 2;
        const box = { x: bx, y: ty - h * 0.78, w, h };
        if (placed.some((p) => boxesOverlap(p, box))) continue;
        placed.push(box);
        out.push({ city: c, tx, ty, anchor: o.anchor, fs, box });
        break;
      }
    }
    return out;
  });

  /** Cells belonging to a labelled city get a brighter outline. */
  let labelledCells = $derived(
    cityLabels.map((l) => CELL_BY_NAME.get(l.city.name)).filter(Boolean),
  );

  /** Landmarks place last — they yield to every lawmaker and city name. */
  let landmarkLabels = $derived.by(() => {
    if (!renderScale || !showDetail) return [];
    const placed = [
      ...pinLabels.map((p) => p.box),
      ...cityLabels.map((c) => c.box),
    ];
    const out = [];

    for (const lm of LANDMARKS) {
      if (!dotVisible(lm.tier)) continue;
      const x = px(lm.lng);
      const y = py(lm.lat);
      if (!inViewport(x, y)) continue;

      const fs = 8.5 * ts;
      const w = u(lm.name.length * fs * 0.62 + 10);
      const h = u(fs + 6);
      const box = { x: x - w / 2, y: y + u(11 * ts), w, h };
      // The icon needs clear space too, not just the caption.
      const iconBox = { x: x - u(9), y: y - u(9), w: u(18), h: u(18) };
      if (placed.some((p) => boxesOverlap(p, box) || boxesOverlap(p, iconBox)))
        continue;
      placed.push(box, iconBox);
      out.push({ lm, x, y, box, fs });
    }
    return out;
  });

  /** Rough half-width of the name plate, in screen px. */
  function nameHalfWidth(rep) {
    const label = rep.shortName || rep.name;
    const title = rep.title || "";
    const chars = Math.max(label.length * 9, title.length * 5.6);
    return Math.max(34, chars / 2 + 8) * ts;
  }

  /**
   * Ticking a name in the recipient list drives the map: checking someone
   * flies to them and pops their name, unchecking pulls back out to the whole
   * state. `seq` makes repeat toggles of the same person re-fire.
   */
  let lastFocusSeq = -1;
  $effect(() => {
    const req = focusRequest;
    if (!req || req.seq === lastFocusSeq) return;
    lastFocusSeq = req.seq;
    const rep = lawmakers.find((l) => l.email === req.email);
    if (!rep) return;
    if (req.zoomIn) {
      activeCity = null;
      activeKey = keyOf(rep);
      setView(viewAround(rep.lng, rep.lat, 300));
    } else {
      resetView();
    }
  });

  // Dots for every real city so you can see where everything is; the *labels*
  // come in progressively, otherwise thirty names fight over the same corner
  // of DFW and none of them are readable.
  function dotVisible(tier) {
    if (tier === 1 || tier === 2) return true;
    if (tier === 3) return zoomFactor >= 1.6;
    return zoomFactor >= 3.2;
  }

  function labelVisible(tier) {
    if (tier === 1) return true;
    if (tier === 2) return zoomFactor >= 1.3;
    if (tier === 3) return zoomFactor >= 2.2;
    return zoomFactor >= 4.5;
  }

  // Zoomed out the map is about *where the cities are*. River names, highway
  // shields, landmark captions and lawmaker names would all pile on top of
  // each other, so they wait until you zoom in — or, for a lawmaker, until you
  // point at their dot.
  let showDetail = $derived(zoomFactor >= 1.6);
</script>

<svelte:window onkeydowncapture={handleMapKeys} />

<div class="tx-map">
  <!-- Header -->
  <div class="tx-head">
    <div class="tx-title">
      <span class="tx-dot"></span>
      <span class="tx-title-text">{title}</span>
    </div>
    <div class="tx-tools">
      <!-- Zoom and reset live in the bar under the map now; this row is for
           layers and the stats sheet. -->
      <button
        class="tx-btn tx-btn-chamber"
        class:tx-btn-chamber-on={chamberMode !== "all"}
        onclick={cycleChamber}
        title="Cycle which offices are pinned: everyone, Senate & statewide, or the Texas House"
        >{chamberMode === "all"
          ? "⬥ ALL"
          : chamberMode === "senate"
            ? "● SENATE"
            : "◆ HOUSE"}</button
      >
      <button
        class="tx-btn tx-btn-stats"
        class:tx-btn-stats-on={showStats}
        onclick={() => (showStats = !showStats)}
        title="Money on the table: revenue and tax, state by state"
        aria-expanded={showStats}>★ STATS</button
      >
      <button
        class="tx-btn"
        class:tx-btn-on={showBorders}
        onclick={() => (showBorders = !showBorders)}
        title="Toggle city boundaries">BORDERS</button
      >
      <button
        class="tx-btn"
        class:tx-btn-on={showRoads}
        onclick={() => (showRoads = !showRoads)}
        title="Toggle highways">HWY</button
      >
      <button
        class="tx-btn"
        class:tx-btn-on={showRivers}
        onclick={() => (showRivers = !showRivers)}
        title="Toggle rivers">RIV</button
      >
      <button
        class="tx-btn"
        class:tx-btn-on={showLegend}
        onclick={() => (showLegend = !showLegend)}
        title="Toggle legend">KEY</button
      >
    </div>
  </div>

  <!-- City quick-jump chips -->
  <div class="tx-chips">
    <button
      class="tx-chip tx-chip-all"
      class:on={!activeCity && !activeKey}
      onclick={resetView}>ALL TEXAS</button
    >
    {#each chipCities as c}
      <button
        class="tx-chip"
        class:on={activeCity === c.name}
        onclick={() => zoomToCity(c, 130)}>{c.name}</button
      >
    {/each}
  </div>

  <div
    class="tx-stage"
    bind:this={stageEl}
    bind:clientWidth={stageW}
    bind:clientHeight={stageH}
  >
    <!-- Touch events stop here: the carousel behind the map treats a
         horizontal swipe as "next slide", and a pan is exactly that gesture. -->
    <svg
      viewBox="{$vx} {$vy} {$vw} {$vh}"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Interactive map of Texas showing state lawmakers"
      class:tx-panning={isPanning}
      onpointerdown={onPanStart}
      onpointermove={onPanMove}
      onpointerup={onPanEnd}
      onpointercancel={onPanEnd}
      onclickcapture={onStageClickCapture}
      ontouchstart={(e) => e.stopPropagation()}
      ontouchend={(e) => e.stopPropagation()}
    >
      <defs>
        <radialGradient id="txGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="txFill" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stop-color="#f472b6" stop-opacity="0.16" />
          <stop offset="45%" stop-color="#a855f7" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.08" />
        </linearGradient>
        <linearGradient id="txEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f472b6" />
          <stop offset="55%" stop-color="#c084fc" />
          <stop offset="100%" stop-color="#22d3ee" />
        </linearGradient>
        <radialGradient id="txVignette" cx="50%" cy="45%" r="75%">
          <stop offset="55%" stop-color="#000" stop-opacity="0" />
          <stop offset="100%" stop-color="#000" stop-opacity="0.55" />
        </radialGradient>
        <clipPath id="txClip">
          <path d={TEXAS_PATH} />
        </clipPath>
        <!-- Pin dot fills: party colour blending into ban-likelihood, so one
             glance gives you both. One def per combo actually present. -->
        {#each ringGradients as g (g.id)}
          <linearGradient id={g.id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color={g.from} />
            <stop offset="100%" stop-color={g.to} />
          </linearGradient>
        {/each}
      </defs>

      <!-- Gulf / open water backdrop -->
      <rect x={$vx} y={$vy} width={$vw} height={$vh} class="tx-water" />

      <!-- Neighbouring states & Mexico -->
      {#each neighborPaths as n}
        <path d={n.d} class="tx-neighbor" vector-effect="non-scaling-stroke" />
      {/each}
      <!-- Neighbour labels: postal code, cannabis status, and what that market
           is worth a year. The money crossing the state line is the argument. -->
      {#each neighborPaths as n}
        {@const lx = px(n.labelAt[0])}
        {@const ly = py(n.labelAt[1])}
        <text
          x={lx}
          y={ly}
          class="tx-state-label"
          text-anchor="middle"
          style="font-size: {u(17 * ts * statScale)}px"
          >{n.abbr || n.name}{#if n.cannabis}<tspan
              class="tx-weed-{n.cannabis}"
              style="font-size: {u(15 * ts * statScale)}px"
              >  {n.cannabis === "rec" ? "🌿" : "⚕"}</tspan
            >{/if}</text
        >
        {#if n.revenue}
          <text
            x={lx}
            y={ly + u(14 * ts * statScale)}
            class="tx-state-revenue tx-weed-{n.cannabis}"
            text-anchor="middle"
            style="font-size: {u(9.5 * ts * statScale)}px">{n.revenue}</text
          >
        {/if}
      {/each}

      <!-- Texas -->
      <path d={texasPath} class="tx-state" vector-effect="non-scaling-stroke" />

      <!-- City territory borders, clipped to the state outline -->
      {#if showBorders}
        <g clip-path="url(#txClip)" transition:fade={{ duration: 180 }}>
          {#each CITY_CELLS as cell}
            <path
              d={cell.d}
              class="tx-cell"
              class:tx-cell-major={cell.tier <= 2}
              vector-effect="non-scaling-stroke"
            />
          {/each}
        </g>
      {/if}

      <!-- Rivers -->
      {#if showRivers}
        <g transition:fade={{ duration: 180 }}>
          <path d={rioGrandePath} class="tx-river" vector-effect="non-scaling-stroke" />
          {#each riverPaths as r}
            <path d={r.d} class="tx-river" vector-effect="non-scaling-stroke" />
          {/each}
        </g>
      {/if}
      {#if showDetail && showRivers}
        {#each RIVERS as r}
          <text
            transition:fade={{ duration: 160 }}
            x={px(r.labelAt[0])}
            y={py(r.labelAt[1])}
            class="tx-river-label"
            text-anchor="middle"
            transform={r.rotate
              ? `rotate(${r.rotate} ${px(r.labelAt[0])} ${py(r.labelAt[1])})`
              : null}
            style="font-size: {u(9 * ts)}px">{r.name}</text
          >
        {/each}
      {/if}

      <!-- Highways -->
      {#if showRoads}
        <g transition:fade={{ duration: 180 }}>
          {#each highwayPaths as h}
            <path
              d={h.d}
              class="tx-hwy"
              class:tx-hwy-us={h.kind === "us"}
              vector-effect="non-scaling-stroke"
            />
          {/each}
        </g>
      {/if}

      <!-- Highway shields -->
      {#if showDetail && showRoads}
        {#each HIGHWAYS as h}
          <g transition:fade={{ duration: 160 }}>
            <rect
              x={px(h.shieldAt[0]) - u(17 * ts)}
              y={py(h.shieldAt[1]) - u(8 * ts)}
              width={u(34 * ts)}
              height={u(16 * ts)}
              rx={u(3)}
              class="tx-shield"
              class:tx-shield-us={h.kind === "us"}
              vector-effect="non-scaling-stroke"
            />
            <text
              x={px(h.shieldAt[0])}
              y={py(h.shieldAt[1]) + u(4 * ts)}
              class="tx-shield-text"
              text-anchor="middle"
              style="font-size: {u(9.5 * ts)}px">{h.label}</text
            >
          </g>
        {/each}
      {/if}

      <!-- Water labels -->
      {#each WATER_LABELS as w}
        {#if w.size >= 20 || showDetail}
          <text
            transition:fade={{ duration: 160 }}
            x={px(w.lng)}
            y={py(w.lat)}
            class="tx-water-label"
            text-anchor="middle"
            transform={w.rotate
              ? `rotate(${w.rotate} ${px(w.lng)} ${py(w.lat)})`
              : null}
            style="font-size: {u((w.size >= 20 ? 18 : 9) * ts)}px">{w.name}</text
          >
        {/if}
      {/each}

      <!-- Landmarks -->
      <!-- Landmarks are pictorial; they'd cheapen the wide shot, so they only
           appear once you've zoomed in — and only where they don't collide. -->
      {#each landmarkLabels as ll (ll.lm.name)}
        <g transition:fade={{ duration: 180 }} class="tx-callout">
          <text
            x={ll.x}
            y={ll.y + u(5)}
            text-anchor="middle"
            style="font-size: {u(15 * ts)}px">{ll.lm.icon}</text
          >
          <rect
            x={ll.box.x}
            y={ll.box.y}
            width={ll.box.w}
            height={ll.box.h}
            rx={u(3)}
            class="tx-label-plate"
          />
          <text
            x={ll.x}
            y={ll.y + u(18 * ts)}
            class="tx-landmark-label"
            text-anchor="middle"
            style="font-size: {u(ll.fs)}px">{ll.lm.name}</text
          >
        </g>
      {/each}

      <!-- Cities -->
      {#each CITIES as c}
        {#if dotVisible(c.tier)}
          <g
            transition:fade={{ duration: 180 }}
            class="tx-city-hit"
            onclick={() => zoomToCity(c, c.tier >= 3 ? 90 : 220)}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                zoomToCity(c, c.tier >= 3 ? 90 : 220);
              }
            }}
            role="button"
            aria-label="Zoom to {c.name}"
            tabindex="-1"
          >
            <!-- clickable target so any town can be zoomed straight into -->
            <circle
              cx={px(c.lng)}
              cy={py(c.lat)}
              r={u(9)}
              fill="transparent"
            />
            {#if c.capital}
              <path
                d="M{px(c.lng)},{py(c.lat) - u(7)} L{px(c.lng) + u(6.5)},{py(
                  c.lat,
                ) + u(4.5)} L{px(c.lng) - u(6.5)},{py(c.lat) + u(4.5)} Z"
                class="tx-capital"
                vector-effect="non-scaling-stroke"
              />
            {:else}
              <circle
                cx={px(c.lng)}
                cy={py(c.lat)}
                r={u(c.tier === 1 ? 4.5 : c.tier === 2 ? 3.2 : 2.4)}
                class="tx-city"
                class:tx-city-major={c.tier === 1}
                vector-effect="non-scaling-stroke"
              />
            {/if}
          </g>
        {/if}
      {/each}

      <!-- Territory outline of every city that got a name this frame -->
      <g clip-path="url(#txClip)">
        {#each labelledCells as d}
          <path d={d} class="tx-cell-called" vector-effect="non-scaling-stroke" />
        {/each}
      </g>

      <!-- City names, placed beside their dot and never overlapping -->
      {#each cityLabels as l (l.city.name)}
        <g class="tx-callout">
          <rect
            x={l.box.x}
            y={l.box.y}
            width={l.box.w}
            height={l.box.h}
            rx={u(3)}
            class="tx-label-plate"
            class:tx-label-plate-major={l.city.tier === 1}
          />
          <text
            x={l.tx}
            y={l.ty}
            text-anchor={l.anchor}
            class="tx-city-label"
            class:tx-city-label-major={l.city.tier === 1}
            style="font-size: {u(l.fs)}px">{l.city.short || l.city.name}</text
          >
        </g>
      {/each}

      <!-- Lawmaker pins. Order is deliberately stable: reordering the nodes
           under the cursor makes the browser fire mouseleave and the hover
           flickers. The focused label is drawn in an overlay layer below. -->
      {#each navigableReps as rep}
        {@const isOn = isSelected(rep.email)}
        {@const isActive = activeKey === keyOf(rep)}
        {@const isHot = hoveredKey === keyOf(rep)}
        {@const isFocused = isActive || isHot}
        {@const cx = px(rep.lng)}
        {@const cy = py(rep.lat)}
        {@const rDot = u(isFocused ? 7 : showDetail ? 4 : 2.6)}
        <g
          class="tx-pin"
          class:tx-pin-active={isActive}
          onclick={() => zoomTo(rep)}
          onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              zoomTo(rep);
            }
          }}
          onmouseenter={() => (hoveredKey = keyOf(rep))}
          onmouseleave={() => (hoveredKey = null)}
          onfocus={() => (hoveredKey = keyOf(rep))}
          onblur={() => (hoveredKey = null)}
          role="button"
          aria-label="{rep.position || 'Lawmaker'} {rep.name}"
          tabindex="0"
        >
          {#if isActive || isHot}
            <circle {cx} {cy} r={u(24)} fill="url(#txGlow)" />
          {/if}
          <!-- Invisible hit target, bigger than the dot itself. -->
          <circle {cx} {cy} r={u(showDetail ? 13 : 8)} fill="transparent" />
          <!-- One small dot per office: 184 have to share the map, so each is
               a single tiny mark. The fill gradient blends party colour into
               ban stance; Senate & statewide are circles, House diamonds. -->
          {#if rep.chamber === "house"}
            <rect
              x={cx - rDot}
              y={cy - rDot}
              width={rDot * 2}
              height={rDot * 2}
              transform="rotate(45 {cx} {cy})"
              class="tx-pin-dot"
              class:tx-pin-on={isOn}
              style="fill: url(#{ringId(rep)})"
              vector-effect="non-scaling-stroke"
            />
          {:else}
            <circle
              {cx}
              {cy}
              r={rDot}
              class="tx-pin-dot"
              class:tx-pin-on={isOn}
              style="fill: url(#{ringId(rep)})"
              vector-effect="non-scaling-stroke"
            />
          {/if}
          <!-- Names stay off the map until you point at a dot or zoom in —
               fifteen labels at once is an unreadable pile. Once one rep is
               focused the others step back so its name is never buried. -->
        </g>
      {/each}

      <!-- Lawmaker names, collision-culled so they never stack -->
      {#each pinLabels as pl (keyOf(pl.rep))}
        <g class="tx-callout">
          <rect
            x={pl.box.x}
            y={pl.box.y}
            width={pl.box.w}
            height={pl.box.h}
            rx={u(3)}
            class="tx-pin-plate tx-pin-plate-quiet"
            vector-effect="non-scaling-stroke"
          />
          <text
            x={pl.x}
            y={pl.y}
            text-anchor="middle"
            class="tx-pin-label"
            style="font-size: {u(11.5 * ts)}px"
            >{pl.rep.shortName || pl.rep.name}</text
          >
          <text
            x={pl.x}
            y={pl.y + u(10 * ts)}
            text-anchor="middle"
            class="tx-pin-sub"
            style="font-size: {u(8 * ts)}px">{pl.rep.title}</text
          >
        </g>
      {/each}

      <!-- Focused lawmaker's name, drawn above every other layer so it is
           never buried by a city label or another pin. -->
      {#if focusedRep}
        <g class="tx-focus-label">
          <rect
            x={px(focusedRep.lng) - u(nameHalfWidth(focusedRep))}
            y={py(focusedRep.lat) - u(15) - u(13 * ts)}
            width={u(nameHalfWidth(focusedRep) * 2)}
            height={u(28 * ts)}
            rx={u(4)}
            class="tx-pin-plate"
            vector-effect="non-scaling-stroke"
          />
          <text
            x={px(focusedRep.lng)}
            y={py(focusedRep.lat) - u(15)}
            text-anchor="middle"
            class="tx-pin-label tx-pin-label-active"
            style="font-size: {u(15 * ts)}px"
            >{focusedRep.shortName || focusedRep.name}</text
          >
          <text
            x={px(focusedRep.lng)}
            y={py(focusedRep.lat) - u(15) + u(11 * ts)}
            text-anchor="middle"
            class="tx-pin-sub"
            style="font-size: {u(9 * ts)}px">{focusedRep.title}</text
          >
        </g>
      {/if}
    </svg>

    <!-- Legend -->
    {#if showLegend}
      <div class="tx-legend" transition:fade={{ duration: 140 }}>
        <h4>MAP KEY</h4>
        <div class="tx-legend-row"><span class="sw sw-on"></span> On your mail list (green ring)</div>
        <div class="tx-legend-row"><span class="sw sw-off"></span> Senate &amp; statewide — deep red/blue circle</div>
        <div class="tx-legend-row"><span class="sw sw-house"></span> Texas House — light red/blue diamond</div>
        <div class="tx-legend-note">
          Dot colour blends party (red R · blue D) into ban stance (green
          supports legal hemp → red driving the ban · grey no record).
        </div>
        <div class="tx-legend-row"><span class="sw sw-capital"></span> State capital</div>
        <div class="tx-legend-row"><span class="sw sw-cell"></span> City boundary</div>
        <div class="tx-legend-row"><span class="sw sw-hwy"></span> Interstate</div>
        <div class="tx-legend-row"><span class="sw sw-us"></span> US highway</div>
        <div class="tx-legend-row"><span class="sw sw-river"></span> Major river</div>
        <div class="tx-legend-row">
          <span class="sw-glyph tx-legend-rec">🌿</span> Neighbour: adult-use retail
        </div>
        <div class="tx-legend-row">
          <span class="sw-glyph tx-legend-med">⚕</span> Neighbour: medical only
        </div>
        <div class="tx-legend-note">
          Hover a pin for detail · tap any dot to zoom in · tap again to zoom out
        </div>
        <div class="tx-legend-note">
          Neighbour sales figures are approximate annual retail totals.
        </div>
      </div>
    {/if}

    <!-- Lawmaker detail — follows hover, stays pinned on the clicked pin -->
    {#if infoRep}
      {@const stance = stanceOf(infoRep)}
      <div
        class="tx-card"
        class:tx-card-ghost={!activeRep}
        ontouchstart={onCardTouchStart}
        ontouchend={onCardTouchEnd}
        role="group"
        aria-label="Lawmaker detail — swipe or use the arrow keys to move between offices"
      >
        <!-- Keyed on the identity key, not the email: the federal offices share
             an empty address, so an email key never changed between them and the
             card never re-animated. -->
        {#key keyOf(infoRep)}
          <!-- Entrance only. An out transition would keep the outgoing copy in
               the flow and visibly double the card's height mid-swap. -->
          <div in:fly={{ x: stepDirection * 18, y: -6, duration: 200 }}>
            <div class="tx-card-head">
              <div
                class="tx-avatar"
                class:on={isSelected(infoRep.email)}
                class:dem={infoRep.party === "D"}
              >
                {initialsOf(infoRep)}
              </div>
              <div class="tx-card-idbox">
                <div class="tx-card-name">
                  {#if infoRep.party}
                    <span
                      class="tx-party tx-party-{partyTone(infoRep.party)}"
                      title={infoRep.party === "R"
                        ? "Republican"
                        : infoRep.party === "D"
                          ? "Democrat"
                          : infoRep.party}>{infoRep.party}</span
                    >
                  {/if}
                  {infoRep.name}
                </div>
                <div class="tx-card-title">{infoRep.title}</div>
              </div>
              {#if navigableReps.length > 1}
                <div class="tx-card-nav">
                  <button
                    class="tx-card-step"
                    onclick={() => stepRep(-1)}
                    aria-label="Previous senator"
                    title="Previous senator">‹</button
                  >
                  <button
                    class="tx-card-step"
                    onclick={() => stepRep(1)}
                    aria-label="Next senator"
                    title="Next senator">›</button
                  >
                </div>
              {/if}
              {#if activeRep}
                <button class="tx-card-x" onclick={resetView} aria-label="Close"
                  >✕</button
                >
              {/if}
            </div>

            <!-- Where they stand, at a glance: 1 supports, 5 driving the ban. -->
            <div class="tx-stance tx-stance-{stance.tone}">
              <span class="tx-stance-label">{stance.label}</span>
              <span class="tx-stance-meter" aria-hidden="true">
                {#each [1, 2, 3, 4, 5] as step}
                  <i class:lit={stance.score >= step}></i>
                {/each}
              </span>
              {#if stance.score}
                <span class="tx-stance-score">{stance.score}/5</span>
              {/if}
            </div>

            <div class="tx-card-meta">
              {#if infoRep.position}
                <span class="tx-card-position">{infoRep.position}</span>
              {/if}
              <span>📍 {infoRep.hometown || infoRep.region}</span>
              {#if infoRep.phone}
                <a class="tx-card-tel" href="tel:{infoRep.phone.replace(/[^\d+]/g, '')}"
                  >☎ {infoRep.phone}</a
                >
              {/if}
            </div>

            {#if infoRep.record}
              <div class="tx-card-record tx-record-{stance.tone}">
                <span class="tx-tag tx-tag-hot">ON THIS ISSUE</span>
                {infoRep.record}
              </div>
            {/if}

            {#if infoRep.counties}
              <div class="tx-card-counties">
                <span class="tx-tag">REPRESENTS</span>
                {infoRep.counties}
              </div>
            {/if}

            <!-- Every claim in the record above is traceable, so the citations
                 ship with it rather than living in a spreadsheet somewhere. -->
            {#if infoRep.sources?.length}
              <details class="tx-card-sources">
                <summary
                  ><span class="tx-tag">SOURCES</span>
                  {infoRep.sources.length} cited</summary
                >
                <ul>
                  {#each infoRep.sources as source (source.url)}
                    <li>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer">{source.label} ↗</a
                      >
                    </li>
                  {/each}
                </ul>
              </details>
            {/if}

            {#if infoRep.email}
              <a class="tx-card-email" href="mailto:{infoRep.email}"
                >{infoRep.email}</a
              >
            {:else if infoRep.contactUrl}
              <!-- Federal offices don't publish a mailbox; the webform is the
                   only real route in. -->
              <a
                class="tx-card-email tx-card-form"
                href={infoRep.contactUrl}
                target="_blank"
                rel="noopener noreferrer">✉ Official contact form ↗</a
              >
            {/if}
            {#if infoRep.emailVerified === false && infoRep.email}
              <div class="tx-card-warn">
                ⚠ Address unconfirmed — verify before sending
              </div>
            {/if}

            {#if infoRep.email}
              <div class="tx-card-status" class:on={isSelected(infoRep.email)}>
                {isSelected(infoRep.email)
                  ? "✓ ON YOUR MAIL LIST"
                  : "○ NOT ON YOUR MAIL LIST"}
              </div>
            {/if}

            {#if navigableReps.length > 1}
              <div class="tx-card-hint">
                ‹ swipe, tap arrows or press ← → ›
              </div>
            {/if}
          </div>
        {/key}
      </div>
    {/if}

    <!-- STATS sheet. Sits over the stage so it works the same collapsed or
         full screen, and scrolls internally rather than growing the map. -->
    {#if showStats}
      <div
        class="tx-stats"
        style="--s: {statScale}"
        transition:fade={{ duration: 130 }}
      >
        <div class="tx-stats-head">
          <span class="tx-stats-title">★ TEXAS STATS</span>
          <button
            class="tx-stats-x"
            onclick={() => (showStats = false)}
            aria-label="Close stats">✕</button
          >
        </div>

        <div class="tx-stats-tabs">
          <button
            class="tx-stats-tab"
            class:on={statsTab === "money"}
            onclick={() => (statsTab = "money")}>💰 MONEY ON THE TABLE</button
          >
          <button
            class="tx-stats-tab"
            class:on={statsTab === "reps"}
            onclick={() => (statsTab = "reps")}>🏛 REPRESENTATION</button
          >
        </div>

        <div class="tx-stats-body">
          {#if statsTab === "money"}
          <!-- Texas -->
          <section>
            <h5>TEXAS — WHAT THE BAN ERASES</h5>
            <div class="tx-stat-grid">
              <div class="tx-stat big">
                <span class="v">{TEXAS_STATS.retail}</span>
                <span class="k">Annual sales</span>
              </div>
              <div class="tx-stat">
                <span class="v">{TEXAS_STATS.tax}</span>
                <span class="k">Tax the state collects</span>
              </div>
              <div class="tx-stat">
                <span class="v">{TEXAS_STATS.impact}</span>
                <span class="k">Total economic impact</span>
              </div>
              <div class="tx-stat">
                <span class="v">{TEXAS_STATS.jobs}</span>
                <span class="k">Jobs</span>
              </div>
              <div class="tx-stat">
                <span class="v">{TEXAS_STATS.businesses}</span>
                <span class="k">Businesses</span>
              </div>
              <div class="tx-stat">
                <span class="v">{TEXAS_STATS.retailerSales}</span>
                <span class="k">From {TEXAS_STATS.retailers} retailers</span>
              </div>
            </div>
            <!-- Where that $5.5B sits, metro by metro. Estimated splits. -->
            <div class="tx-chips-row">
              {#each CITY_STATS as c}
                <span class="tx-city-chip">
                  <b>{c.city.replace("Dallas–Fort Worth", "Dallas")}</b>
                  {c.revenue}
                </span>
              {/each}
              <span class="tx-city-chip tx-city-chip-note">est.</span>
            </div>

            <p class="tx-stats-note">{TEXAS_STATS.note}</p>
            <p class="tx-stats-note tx-stats-src">{TEXAS_STATS.source}</p>
          </section>

          <!-- Neighbours, as a chart. Texas is on the same scale deliberately:
               the gap between $5.5B and everyone else IS the argument. -->
          <section>
            <h5>SALES PER YEAR — TEXAS vs THE STATE LINE</h5>
            <div class="tx-chart">
              <div class="tx-bar-row tx-bar-tx">
                <span class="tx-bar-label">TX</span>
                <span class="tx-bar-track">
                  <span
                    class="tx-bar tx-bar-fill-tx"
                    style="width: {barPct(
                      TEXAS_STATS.retailValue,
                      NEIGHBOR_MAX,
                    )}%"
                  ></span>
                </span>
                <span class="tx-bar-value">{TEXAS_STATS.retail}</span>
              </div>
              {#each NEIGHBOR_STATS as n}
                <div class="tx-bar-row">
                  <span class="tx-bar-label">{n.abbr}</span>
                  <span class="tx-bar-track">
                    {#if n.revenueValue}
                      <span
                        class="tx-bar tx-bar-fill-{n.status}"
                        style="width: {barPct(n.revenueValue, NEIGHBOR_MAX)}%"
                      ></span>
                    {:else}
                      <span class="tx-bar-none">{n.revenue}</span>
                    {/if}
                  </span>
                  <span class="tx-bar-value"
                    >{n.revenueValue ? n.revenue : "—"}</span
                  >
                </div>
              {/each}
            </div>

            <h5 class="tx-h5-gap">TAX COLLECTED PER YEAR</h5>
            <div class="tx-chart">
              <div class="tx-bar-row tx-bar-tx">
                <span class="tx-bar-label">TX</span>
                <span class="tx-bar-track">
                  <span
                    class="tx-bar tx-bar-fill-tx"
                    style="width: {barPct(
                      TEXAS_STATS.taxValue,
                      NEIGHBOR_TAX_MAX,
                    )}%"
                  ></span>
                </span>
                <span class="tx-bar-value">{TEXAS_STATS.tax}</span>
              </div>
              {#each NEIGHBOR_STATS as n}
                <div class="tx-bar-row">
                  <span class="tx-bar-label">{n.abbr}</span>
                  <span class="tx-bar-track">
                    {#if n.taxValue}
                      <span
                        class="tx-bar tx-bar-fill-{n.status}"
                        style="width: {barPct(n.taxValue, NEIGHBOR_TAX_MAX)}%"
                      ></span>
                    {:else}
                      <span class="tx-bar-none">{n.tax}</span>
                    {/if}
                  </span>
                  <span class="tx-bar-value">{n.tax}</span>
                </div>
              {/each}
            </div>

            <div class="tx-table-wrap tx-table-gap">
              <table class="tx-table">
                <thead>
                  <tr>
                    <th>STATE</th>
                    <th>STATUS</th>
                    <th class="num">SALES</th>
                    <th class="num">TAX</th>
                  </tr>
                </thead>
                <tbody>
                  {#each NEIGHBOR_STATS as n}
                    <tr>
                      <td class="strong">{n.abbr}</td>
                      <td>
                        <span class="tx-pill tx-pill-{n.status}"
                          >{n.status === "rec"
                            ? "🌿"
                            : n.status === "med"
                              ? "⚕"
                              : "✕"} {n.statusLabel}</span
                        >
                      </td>
                      <td class="num">{n.revenue}</td>
                      <td class="num strong">{n.tax}</td>
                    </tr>
                    <tr class="tx-table-sub">
                      <td colspan="4">
                        <span class="tx-basis tx-basis-{n.basis}"
                          >{n.basis}</span
                        >
                        {n.period !== "—" ? `${n.period} · ` : ""}{n.taxRate} · {n.drive}{n.note
                          ? ` — ${n.note}`
                          : ""}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </section>

          <!-- Cities -->
          <section>
            <h5>TEXAS METROS — ESTIMATED SHARE</h5>
            <div class="tx-chart">
              {#each CITY_STATS as c}
                <div class="tx-bar-row">
                  <span class="tx-bar-label tx-bar-label-wide">{c.city}</span>
                  <span class="tx-bar-track">
                    <span
                      class="tx-bar tx-bar-fill-city"
                      style="width: {barPct(c.revenueValue, CITY_MAX)}%"
                    ></span>
                  </span>
                  <span class="tx-bar-value">{c.revenue}</span>
                </div>
              {/each}
            </div>
            <div class="tx-table-wrap tx-table-gap">
              <table class="tx-table">
                <thead>
                  <tr>
                    <th>METRO</th>
                    <th class="num">POP</th>
                    <th class="num">SHARE</th>
                    <th class="num">EST. SALES</th>
                  </tr>
                </thead>
                <tbody>
                  {#each CITY_STATS as c}
                    <tr>
                      <td class="strong">{c.city}</td>
                      <td class="num">{c.metroPop}</td>
                      <td class="num">{c.share}</td>
                      <td class="num strong">{c.revenue}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <p class="tx-stats-note tx-stats-warn">
              ⚠ {CITY_STATS_METHOD}
            </p>
          </section>

          {:else}
            <!-- REPRESENTATION: who speaks for Texas, and what we know so far. -->
            <section>
              <h5>THE TEXAS LEGISLATURE — WHO SPEAKS FOR US</h5>
              <div class="tx-stat-grid">
                <div class="tx-stat big">
                  <span class="v">{houseMembers.length}/{HOUSE_SEATS}</span>
                  <span class="k">House seats filled</span>
                </div>
                <div class="tx-stat big">
                  <span class="v">{senateMembers.length}/{SENATE_SEATS}</span>
                  <span class="k">Senate seats filled</span>
                </div>
                <div class="tx-stat">
                  <span class="v">{houseParty.r + senateParty.r}</span>
                  <span class="k">Republicans</span>
                </div>
                <div class="tx-stat">
                  <span class="v">{houseParty.d + senateParty.d}</span>
                  <span class="k">Democrats</span>
                </div>
                <div class="tx-stat">
                  <span class="v">{ratedCount}</span>
                  <span class="k">Rated on the ban so far</span>
                </div>
                <div class="tx-stat">
                  <span class="v">{lawmakers.length}</span>
                  <span class="k">Offices on this map</span>
                </div>
              </div>
              <p class="tx-stats-note">
                Every Texas House district, every Senate district, the Lt.
                Governor and the Governor — plus the three federal offices that
                control the November 12th deadline.
              </p>
            </section>

            <section>
              <h5>PARTY CONTROL — TEXAS HOUSE ({HOUSE_SEATS} SEATS)</h5>
              <div class="tx-chart">
                <div class="tx-bar-row">
                  <span class="tx-bar-label">REP</span>
                  <span class="tx-bar-track">
                    <span
                      class="tx-bar tx-bar-fill-rparty"
                      style="width: {barPct(houseParty.r, HOUSE_SEATS)}%"
                    ></span>
                  </span>
                  <span class="tx-bar-value">{houseParty.r}</span>
                </div>
                <div class="tx-bar-row">
                  <span class="tx-bar-label">DEM</span>
                  <span class="tx-bar-track">
                    <span
                      class="tx-bar tx-bar-fill-dparty"
                      style="width: {barPct(houseParty.d, HOUSE_SEATS)}%"
                    ></span>
                  </span>
                  <span class="tx-bar-value">{houseParty.d}</span>
                </div>
                {#if HOUSE_SEATS - houseMembers.length > 0}
                  <div class="tx-bar-row">
                    <span class="tx-bar-label">—</span>
                    <span class="tx-bar-track">
                      <span
                        class="tx-bar tx-bar-fill-vacant"
                        style="width: {barPct(
                          HOUSE_SEATS - houseMembers.length,
                          HOUSE_SEATS,
                        )}%"
                      ></span>
                    </span>
                    <span class="tx-bar-value"
                      >{HOUSE_SEATS - houseMembers.length} vacant</span
                    >
                  </div>
                {/if}
              </div>

              <h5 class="tx-h5-gap">
                PARTY CONTROL — TEXAS SENATE ({SENATE_SEATS} SEATS)
              </h5>
              <div class="tx-chart">
                <div class="tx-bar-row">
                  <span class="tx-bar-label">REP</span>
                  <span class="tx-bar-track">
                    <span
                      class="tx-bar tx-bar-fill-rparty"
                      style="width: {barPct(senateParty.r, SENATE_SEATS)}%"
                    ></span>
                  </span>
                  <span class="tx-bar-value">{senateParty.r}</span>
                </div>
                <div class="tx-bar-row">
                  <span class="tx-bar-label">DEM</span>
                  <span class="tx-bar-track">
                    <span
                      class="tx-bar tx-bar-fill-dparty"
                      style="width: {barPct(senateParty.d, SENATE_SEATS)}%"
                    ></span>
                  </span>
                  <span class="tx-bar-value">{senateParty.d}</span>
                </div>
                {#if SENATE_SEATS - senateMembers.length > 0}
                  <div class="tx-bar-row">
                    <span class="tx-bar-label">—</span>
                    <span class="tx-bar-track">
                      <span
                        class="tx-bar tx-bar-fill-vacant"
                        style="width: {barPct(
                          SENATE_SEATS - senateMembers.length,
                          SENATE_SEATS,
                        )}%"
                      ></span>
                    </span>
                    <span class="tx-bar-value"
                      >{SENATE_SEATS - senateMembers.length} vacant</span
                    >
                  </div>
                {/if}
              </div>
            </section>

            <section>
              <h5>
                WHERE THEY STAND ON THE BAN — {ratedCount} RATED, {stanceDist[0]}
                UNKNOWN
              </h5>
              <div class="tx-chart">
                {#each [5, 4, 3, 2, 1, 0] as s}
                  <div class="tx-bar-row">
                    <span class="tx-bar-label tx-bar-label-xwide"
                      >{s === 0 ? "NO RECORD YET" : STANCE[s].label}</span
                    >
                    <span class="tx-bar-track">
                      <span
                        class="tx-bar"
                        style="width: {barPct(
                          stanceDist[s],
                          lawmakers.length,
                        )}%; background: {STANCE_HUE[`s${s}`]}"
                      ></span>
                    </span>
                    <span class="tx-bar-value">{stanceDist[s]}</span>
                  </div>
                {/each}
              </div>
              <p class="tx-stats-note">
                A 1 supports legal hemp; a 5 is driving the ban. Every office
                here is now rated from its own roll call — SB 3 in the House and
                on Senate concurrence, HB 46, and authorship of the ban bills —
                with the citations on each card. Tap any row in the table below
                to fly to them on the map.
              </p>
            </section>

          <!-- The full roster, filtered by the ALL / SENATE / HOUSE toggle -->
          <section>
            <h5>
              THE {roster.length} OFFICES — TAP A COLUMN TO SORT
            </h5>
            <div class="tx-table-wrap">
              <table class="tx-table tx-table-reps">
                <thead>
                  <tr>
                    {#each STATS_COLUMNS as col}
                      <th>
                        <button
                          class="tx-sort"
                          class:on={statsSort.key === col.key}
                          onclick={() => sortBy(col.key)}
                        >
                          {col.label}{statsSort.key === col.key
                            ? statsSort.dir > 0
                              ? " ▲"
                              : " ▼"
                            : ""}
                        </button>
                      </th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each sortedLawmakers as rep (keyOf(rep))}
                    {@const s = stanceOf(rep)}
                    <!-- Row click is a shortcut to focus them on the map; the
                         same is reachable from the pins and the ← → keys, so
                         the row itself stays a plain table row. -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <tr
                      class="tx-rep-row"
                      class:on={activeKey === keyOf(rep)}
                      onclick={() => hasCoords(rep) && zoomTo(rep)}
                    >
                      <td class="strong">
                        <!-- Photo slot: falls back to initials until images land. -->
                        <span class="tx-rep-face" class:dem={rep.party === "D"}>
                          {#if rep.photo}
                            <img src={rep.photo} alt="" />
                          {:else}
                            {initialsOf(rep)}
                          {/if}
                        </span>
                        {rep.name}
                      </td>
                      <td>
                        <span class="tx-party tx-party-{partyTone(rep.party)}"
                          >{rep.party}</span
                        >
                      </td>
                      <td class="dim">{rep.position || ""}</td>
                      <td>
                        <span class="tx-score tx-score-{s.tone}"
                          >{s.score || "–"}</span
                        >
                      </td>
                      <td class="dim">{rep.region || ""}</td>
                      <td>
                        {#if rep.phone}
                          <a
                            class="tx-card-tel"
                            href="tel:{rep.phone.replace(/[^\d+]/g, '')}"
                            onclick={(e) => e.stopPropagation()}>{rep.phone}</a
                          >
                        {/if}
                      </td>
                    </tr>
                    <tr class="tx-table-sub">
                      <td colspan="6">
                        <strong>{s.label}</strong> · {rep.email ||
                          "no public email — contact form"}{rep.counties
                          ? ` · ${rep.counties}`
                          : ""}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </section>

          {/if}

          <section>
            <h5>WHERE THESE NUMBERS COME FROM</h5>
            <ul class="tx-sources">
              {#if statsTab === "money"}
                {#each STATS_SOURCES as s}
                  <li>{s}</li>
                {/each}
              {:else}
                <li>
                  Roster: 89th Texas Legislature member lists, pulled July 30,
                  2026. House District 93 and Senate District 22 are vacant.
                </li>
                <li>
                  House pins and the newly added Senate pins sit on the
                  member's hometown, not a district office — same-city
                  districts are spread a few miles apart so every pin stays
                  clickable.
                </li>
                <li>
                  Emails for the added offices follow each chamber's
                  first.last convention and are UNVERIFIED — confirm before a
                  mass send. House phone numbers are the Capitol switchboard.
                </li>
              {/if}
            </ul>
          </section>
        </div>
      </div>
    {/if}

    <!-- Zoom readout -->
    <div class="tx-zoom">{zoomFactor.toFixed(1)}×</div>
    <div class="tx-vignette"></div>
    <div class="tx-scanlines"></div>
  </div>

  <!-- Primary controls, under the map where a thumb can reach them without
       scrolling the toolbar above. -->
  <div class="tx-foot">
    <button
      class="tx-foot-btn"
      onclick={() => stepZoom(0.6)}
      aria-label="Zoom in"
      title="Zoom in">+</button
    >
    <button
      class="tx-foot-btn"
      onclick={() => stepZoom(1.6)}
      aria-label="Zoom out"
      title="Zoom out">−</button
    >
    <button
      class="tx-foot-btn tx-foot-wide"
      onclick={resetView}
      aria-label="Reset view"
      title="Reset view">RESET</button
    >
    {#if onToggleFullscreen}
      <button
        class="tx-foot-btn tx-foot-wide tx-foot-full"
        class:on={isFullscreen}
        onclick={onToggleFullscreen}
        title={isFullscreen ? "Exit full screen (Esc)" : "Full screen"}
        aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
        >{isFullscreen ? "⤡ FULL" : "⤢ FULL"}</button
      >
    {/if}
  </div>
</div>

<style>
  .tx-map {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background:
      radial-gradient(
        ellipse at 22% 12%,
        rgba(244, 114, 182, 0.16) 0%,
        transparent 55%
      ),
      radial-gradient(
        ellipse at 82% 88%,
        rgba(34, 211, 238, 0.14) 0%,
        transparent 55%
      ),
      linear-gradient(165deg, #140a24 0%, #080814 55%, #04040c 100%);
    overflow: hidden;
  }

  .tx-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 5px 8px;
    border-bottom: 1px solid rgba(16, 185, 129, 0.18);
    background: rgba(0, 0, 0, 0.55);
    z-index: 5;
    flex-shrink: 0;
    min-width: 0;
  }

  /* Bottom control bar: the actions worth reaching for, always visible.
     The safe-area inset lives here rather than on the fullscreen wrapper —
     .tx-map is absolute/inset-0, which lines up with the wrapper's PADDING box,
     so padding out there never moved these buttons off the home bar. */
  .tx-foot {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 8px;
    padding-bottom: max(5px, env(safe-area-inset-bottom));
    border-top: 1px solid rgba(16, 185, 129, 0.2);
    background: rgba(0, 0, 0, 0.62);
    z-index: 6;
    flex-shrink: 0;
  }

  .tx-foot-btn {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: rgba(255, 255, 255, 0.82);
    font-family: ui-monospace, monospace;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    border-radius: 6px;
    cursor: pointer;
    /* Thumb-sized rather than toolbar-sized. */
    min-width: 34px;
    min-height: 28px;
    padding: 0 8px;
    transition: all 0.15s ease;
  }

  .tx-foot-wide {
    flex: 1;
  }

  .tx-foot-btn:hover {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.55);
    color: #fff;
  }

  .tx-foot-btn:active {
    transform: scale(0.96);
  }

  .tx-foot-full {
    border-color: rgba(16, 185, 129, 0.45);
    color: #d1fae5;
  }

  .tx-foot-full.on {
    background: rgba(16, 185, 129, 0.26);
    border-color: rgba(16, 185, 129, 0.65);
    color: #fff;
  }

  .tx-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: ui-monospace, "SFMono-Regular", monospace;
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: #d4d4d8;
    min-width: 59px;
  }

  .tx-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tx-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
    animation: txPulse 1.8s ease-in-out infinite;
    flex-shrink: 0;
  }

  @keyframes txPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(0.8); }
  }

  /* The toolbar can't fit on a phone, so it scrolls sideways instead of
     squashing every button into an unreadable sliver. */
  .tx-tools {
    display: flex;
    gap: 4px;
    min-width: 0;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 1px;
  }

  .tx-tools::-webkit-scrollbar {
    display: none;
  }

  .tx-tools .tx-btn {
    flex: 0 0 auto;
  }

  .tx-btn {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.75);
    font-family: ui-monospace, monospace;
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 3px 7px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.18s ease;
    line-height: 1.4;
  }

  .tx-btn:hover {
    background: rgba(16, 185, 129, 0.18);
    border-color: rgba(16, 185, 129, 0.5);
    color: #fff;
  }

  .tx-btn-on {
    background: rgba(16, 185, 129, 0.25);
    border-color: rgba(16, 185, 129, 0.6);
    color: #fff;
  }

  /* Cyan while a chamber filter is active, so a "missing" chamber's pins are
     explained by the toolbar and not mistaken for lost data. */
  .tx-btn-chamber-on {
    background: rgba(34, 211, 238, 0.22);
    border-color: rgba(34, 211, 238, 0.65);
    color: #a5f3fc;
  }

  /* Gold, so it reads as the one button on this row worth pressing. */
  .tx-btn-stats {
    background: rgba(251, 191, 36, 0.16);
    border-color: rgba(251, 191, 36, 0.6);
    color: #fde68a;
  }

  .tx-btn-stats:hover {
    background: rgba(251, 191, 36, 0.3);
    border-color: rgba(251, 191, 36, 0.85);
    color: #fff;
  }

  .tx-btn-stats-on {
    background: rgba(251, 191, 36, 0.85);
    border-color: #fbbf24;
    color: #1c1917;
  }

  /* --- stats sheet --- */
  .tx-stats {
    position: absolute;
    inset: 0;
    z-index: 40;
    display: flex;
    flex-direction: column;
    background: rgba(4, 4, 12, 0.97);
    backdrop-filter: blur(3px);
  }

  .tx-stats-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 9px;
    border-bottom: 1px solid rgba(251, 191, 36, 0.35);
    background: rgba(251, 191, 36, 0.1);
    flex-shrink: 0;
  }

  /* Everything in the sheet rides --s, the stage-width scale set inline on
     .tx-stats — 1 on a phone, up to 1.8 on a TV. Boxes sized to fit text
     (label columns, bar heights, avatars) scale with it or the type clips. */
  .tx-stats-title {
    font-family: ui-monospace, monospace;
    font-size: calc(0.6rem * var(--s, 1));
    font-weight: 900;
    letter-spacing: 0.14em;
    color: #fde68a;
  }

  .tx-stats-x {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    font-size: calc(0.75rem * var(--s, 1));
    line-height: 1;
    padding: 2px 4px;
  }

  .tx-stats-x:hover { color: #fff; }

  .tx-stats-tabs {
    display: flex;
    gap: 6px;
    padding: calc(7px * var(--s, 1)) calc(9px * var(--s, 1)) 0;
    flex-shrink: 0;
  }

  .tx-stats-tab {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 7px;
    color: rgba(255, 255, 255, 0.6);
    font-family: ui-monospace, monospace;
    font-size: calc(0.5rem * var(--s, 1));
    font-weight: 900;
    letter-spacing: 0.1em;
    padding: calc(5px * var(--s, 1)) 4px;
    cursor: pointer;
    white-space: nowrap;
  }

  .tx-stats-tab:hover { color: #fff; }

  .tx-stats-tab.on {
    background: rgba(251, 191, 36, 0.85);
    border-color: #fbbf24;
    color: #1c1917;
  }

  .tx-stats-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: calc(9px * var(--s, 1));
    display: flex;
    flex-direction: column;
    gap: calc(14px * var(--s, 1));
  }

  .tx-stats-body h5 {
    margin: 0 0 6px;
    font-family: ui-monospace, monospace;
    font-size: calc(0.5rem * var(--s, 1));
    font-weight: 900;
    letter-spacing: 0.16em;
    color: rgba(251, 191, 36, 0.9);
  }

  .tx-stat-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(calc(96px * var(--s, 1)), 1fr)
    );
    gap: 6px;
  }

  .tx-stat {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 6px 7px;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
  }

  .tx-stat .v {
    font-family: ui-monospace, monospace;
    font-size: calc(0.78rem * var(--s, 1));
    font-weight: 900;
    color: #fff;
    line-height: 1.15;
  }

  .tx-stat.big .v {
    font-size: calc(1.05rem * var(--s, 1));
    color: #34d399;
  }

  .tx-stat .k {
    font-size: calc(0.46rem * var(--s, 1));
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
  }

  /* Metro splits as small chips, directly under the headline numbers. */
  .tx-chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 6px;
  }

  .tx-city-chip {
    display: inline-flex;
    align-items: baseline;
    gap: 3px;
    padding: 1px 5px;
    border-radius: 4px;
    border: 1px solid rgba(251, 191, 36, 0.28);
    background: rgba(251, 191, 36, 0.08);
    font-family: ui-monospace, monospace;
    font-size: calc(0.44rem * var(--s, 1));
    line-height: 1.6;
    color: #fde68a;
    white-space: nowrap;
  }

  .tx-city-chip b {
    color: rgba(255, 255, 255, 0.55);
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .tx-city-chip-note {
    border-style: dashed;
    border-color: rgba(255, 255, 255, 0.18);
    background: none;
    color: rgba(255, 255, 255, 0.35);
    font-style: italic;
  }

  .tx-stats-note {
    margin: 6px 0 0;
    font-size: calc(0.46rem * var(--s, 1));
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.42);
  }

  .tx-stats-warn { color: rgba(251, 191, 36, 0.75); }
  .tx-stats-src { color: rgba(255, 255, 255, 0.3); font-style: italic; }

  .tx-h5-gap { margin-top: 12px !important; }
  .tx-table-gap { margin-top: 10px; }

  /* --- bar charts. Plain divs: no chart library for six bars. --- */
  .tx-chart {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .tx-bar-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: ui-monospace, monospace;
    font-size: calc(0.47rem * var(--s, 1));
  }

  .tx-bar-label {
    flex: 0 0 calc(22px * var(--s, 1));
    font-weight: 900;
    color: rgba(255, 255, 255, 0.62);
    letter-spacing: 0.06em;
  }

  .tx-bar-label-wide {
    flex: 0 0 calc(84px * var(--s, 1));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Stance names ("SUPPORTS LEGAL HEMP") need more room than metro names. */
  .tx-bar-label-xwide {
    flex: 0 0 calc(118px * var(--s, 1));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tx-bar-track {
    flex: 1;
    min-width: 0;
    height: calc(11px * var(--s, 1));
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .tx-bar {
    height: 100%;
    border-radius: 3px;
    transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tx-bar-fill-tx {
    background: linear-gradient(90deg, #f472b6, #c084fc);
  }

  .tx-bar-fill-rec { background: linear-gradient(90deg, #10b981, #34d399); }
  .tx-bar-fill-med { background: linear-gradient(90deg, #2563eb, #60a5fa); }
  .tx-bar-fill-none { background: rgba(239, 68, 68, 0.5); }
  .tx-bar-fill-city { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
  .tx-bar-fill-rparty { background: linear-gradient(90deg, #dc2626, #f87171); }
  .tx-bar-fill-dparty { background: linear-gradient(90deg, #2563eb, #60a5fa); }
  .tx-bar-fill-vacant { background: rgba(161, 161, 170, 0.4); }

  .tx-bar-none {
    padding-left: 5px;
    font-size: calc(0.42rem * var(--s, 1));
    color: rgba(255, 255, 255, 0.32);
    white-space: nowrap;
  }

  .tx-bar-value {
    flex: 0 0 auto;
    min-width: calc(46px * var(--s, 1));
    text-align: right;
    font-weight: 800;
    color: #fff;
    font-variant-numeric: tabular-nums;
  }

  .tx-bar-tx .tx-bar-label,
  .tx-bar-tx .tx-bar-value { color: #f9a8d4; }

  /* How much weight a figure carries. */
  .tx-basis {
    display: inline-block;
    margin-right: 4px;
    padding: 0 3px;
    border-radius: 3px;
    font-size: calc(0.38rem * var(--s, 1));
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    vertical-align: 1px;
  }

  .tx-basis-reported { background: rgba(16, 185, 129, 0.28); color: #6ee7b7; }
  .tx-basis-derived { background: rgba(96, 165, 250, 0.25); color: #93c5fd; }
  .tx-basis-modelled { background: rgba(251, 191, 36, 0.25); color: #fde68a; }
  .tx-basis-contested { background: rgba(239, 68, 68, 0.25); color: #fca5a5; }
  .tx-basis-none { background: rgba(161, 161, 170, 0.25); color: #d4d4d8; }

  .tx-sources {
    margin: 0;
    padding-left: 14px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .tx-sources li {
    font-size: calc(0.44rem * var(--s, 1));
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.4);
  }

  .tx-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tx-table {
    width: 100%;
    border-collapse: collapse;
    font-family: ui-monospace, monospace;
    font-size: calc(0.5rem * var(--s, 1));
  }

  .tx-table th {
    text-align: left;
    padding: 3px 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
    color: rgba(255, 255, 255, 0.5);
    font-size: calc(0.44rem * var(--s, 1));
    letter-spacing: 0.1em;
    white-space: nowrap;
  }

  .tx-table td {
    padding: 4px 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.75);
    vertical-align: middle;
  }

  .tx-table .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .tx-table .strong { color: #fff; font-weight: 800; }
  .tx-table .dim { color: rgba(255, 255, 255, 0.5); }

  /* Context line under each row — small, wraps, never fights the numbers. */
  .tx-table-sub td {
    padding: 0 5px 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    font-size: calc(0.43rem * var(--s, 1));
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.36);
    white-space: normal;
  }

  .tx-pill {
    display: inline-block;
    padding: 1px 4px;
    border-radius: 4px;
    font-size: calc(0.42rem * var(--s, 1));
    font-weight: 800;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .tx-pill-rec { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
  .tx-pill-med { background: rgba(96, 165, 250, 0.18); color: #93c5fd; }
  .tx-pill-none { background: rgba(239, 68, 68, 0.18); color: #fca5a5; }

  .tx-sort {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    cursor: pointer;
    text-transform: uppercase;
  }

  .tx-sort:hover { color: #fde68a; }
  .tx-sort.on { color: #fbbf24; }

  .tx-rep-row { cursor: pointer; }
  .tx-rep-row:hover td { background: rgba(255, 255, 255, 0.05); }
  .tx-rep-row.on td { background: rgba(16, 185, 129, 0.12); }

  /* Placeholder until real portraits are dropped in. */
  .tx-rep-face {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: calc(16px * var(--s, 1));
    height: calc(16px * var(--s, 1));
    margin-right: 4px;
    border-radius: 999px;
    overflow: hidden;
    background: rgba(239, 68, 68, 0.75);
    color: #fff;
    font-size: calc(0.4rem * var(--s, 1));
    font-weight: 900;
    vertical-align: middle;
    flex-shrink: 0;
  }

  .tx-rep-face.dem { background: rgba(59, 130, 246, 0.8); }

  .tx-rep-face img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Solid chip, dark text. Deliberately its own class set: reusing the card's
     .tx-stance-* here would drag their `color` in and the digit would end up the
     same colour as its own background. */
  .tx-score {
    display: inline-block;
    min-width: calc(14px * var(--s, 1));
    padding: 0 3px;
    border-radius: 3px;
    text-align: center;
    font-weight: 900;
    color: #0c0a09;
  }

  .tx-score-s0 { background: #a1a1aa; }
  .tx-score-s1 { background: #34d399; }
  .tx-score-s2 { background: #a3e635; }
  .tx-score-s3 { background: #fbbf24; }
  .tx-score-s4 { background: #fb923c; }
  .tx-score-s5 { background: #f87171; }

  /* Sits with the other tools but reads as the primary action on the map. */
  .tx-btn-full {
    border-color: rgba(16, 185, 129, 0.42);
    color: rgba(209, 250, 229, 0.95);
  }

  /* --- city jump chips --- */
  .tx-chips {
    display: flex;
    gap: 4px;
    padding: 5px 8px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    flex-shrink: 0;
    z-index: 5;
  }

  .tx-chips::-webkit-scrollbar { display: none; }

  .tx-chip {
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.72);
    font-family: ui-monospace, monospace;
    font-size: 0.53rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    padding: 3px 8px;
    border-radius: 999px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.16s ease;
  }

  .tx-chip:hover {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
  }

  .tx-chip.on {
    background: rgba(16, 185, 129, 0.85);
    border-color: #10b981;
    color: #04110b;
  }

  .tx-chip-all {
    border-color: rgba(16, 185, 129, 0.45);
    color: #6ee7b7;
  }

  .tx-stage {
    position: relative;
    flex: 1;
    min-height: 0;
  }

  .tx-stage svg {
    width: 100%;
    height: 100%;
    display: block;
    touch-action: none;
    cursor: grab;
  }

  .tx-stage svg.tx-panning { cursor: grabbing; }
  .tx-stage svg.tx-panning * { cursor: grabbing; }

  /* --- geography --- */
  .tx-water { fill: #05060f; }

  .tx-neighbor {
    fill: rgba(255, 255, 255, 0.025);
    stroke: rgba(196, 181, 253, 0.2);
    stroke-width: 1px;
  }

  .tx-state {
    fill: url(#txFill);
    stroke: url(#txEdge);
    stroke-width: 2.4px;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.4));
  }

  /* Derived city territories — the "where am I" layer */
  .tx-cell {
    fill: none;
    stroke: rgba(34, 211, 238, 0.34);
    stroke-width: 0.85px;
  }

  .tx-cell-major {
    stroke: rgba(244, 114, 182, 0.45);
    stroke-width: 1.2px;
  }

  .tx-cell-called {
    fill: rgba(34, 211, 238, 0.06);
    stroke: rgba(103, 232, 249, 0.85);
    stroke-width: 1.5px;
    filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.5));
  }

  .tx-city-hit { cursor: zoom-in; }

  .tx-callout { pointer-events: none; }

  /* Plate behind each city name so the dots never eat the text */
  .tx-label-plate {
    fill: rgba(5, 6, 15, 0.78);
    stroke: rgba(34, 211, 238, 0.18);
    stroke-width: 0.6px;
    pointer-events: none;
  }

  .tx-label-plate-major {
    fill: rgba(5, 6, 15, 0.88);
    stroke: rgba(244, 114, 182, 0.4);
  }

  /* Cinematic finish */
  .tx-vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse at 50% 45%,
      transparent 52%,
      rgba(2, 2, 8, 0.62) 100%
    );
    z-index: 4;
  }

  .tx-scanlines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.16;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.05) 0px,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px,
      transparent 3px
    );
    z-index: 4;
  }

  .tx-river {
    fill: none;
    stroke: #38bdf8;
    stroke-width: 1.3px;
    stroke-opacity: 0.62;
    stroke-linecap: round;
  }

  .tx-river-label {
    fill: rgba(56, 189, 248, 0.72);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    letter-spacing: 0.14em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.9);
    stroke-width: 2.4px;
    pointer-events: none;
    user-select: none;
  }

  .tx-hwy {
    fill: none;
    stroke: #f59e0b;
    stroke-width: 1.6px;
    stroke-opacity: 0.72;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .tx-hwy-us {
    stroke: #94a3b8;
    stroke-width: 1.1px;
    stroke-opacity: 0.55;
    stroke-dasharray: 5 4;
  }

  .tx-shield {
    fill: rgba(10, 10, 15, 0.9);
    stroke: #f59e0b;
    stroke-width: 1px;
  }

  .tx-shield-us { stroke: #94a3b8; }

  .tx-shield-text {
    fill: #fbbf24;
    font-family: ui-monospace, monospace;
    font-weight: 800;
    letter-spacing: 0.02em;
    pointer-events: none;
    user-select: none;
  }

  .tx-state-label {
    fill: rgba(255, 255, 255, 0.42);
    font-family: ui-monospace, monospace;
    font-weight: 800;
    letter-spacing: 0.3em;
    pointer-events: none;
    user-select: none;
  }

  /* What the market next door is worth every year. */
  .tx-state-revenue {
    font-family: ui-monospace, monospace;
    font-weight: 800;
    letter-spacing: 0.06em;
    pointer-events: none;
    user-select: none;
    opacity: 0.85;
  }

  /* 🌿 adult-use retail, ⚕ medical programme only. */
  .tx-weed-rec { fill: #34d399; }
  .tx-weed-med { fill: #60a5fa; }

  .tx-water-label {
    fill: rgba(56, 189, 248, 0.45);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    font-style: italic;
    letter-spacing: 0.22em;
    pointer-events: none;
    user-select: none;
  }

  .tx-city {
    fill: #e4e4e7;
    stroke: #09090b;
    stroke-width: 1px;
  }

  .tx-city-major {
    fill: #fff;
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
  }

  .tx-capital {
    fill: #fbbf24;
    stroke: #09090b;
    stroke-width: 1px;
    filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.7));
  }

  .tx-city-label {
    fill: rgba(235, 235, 240, 0.88);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    letter-spacing: 0.06em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.92);
    stroke-width: 3px;
    pointer-events: none;
    user-select: none;
  }

  .tx-city-label-major {
    fill: #fff;
    font-weight: 900;
    letter-spacing: 0.12em;
  }

  .tx-landmark-label {
    fill: rgba(251, 191, 36, 0.82);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    letter-spacing: 0.06em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.92);
    stroke-width: 2.6px;
    pointer-events: none;
    user-select: none;
  }

  /* --- lawmaker pins --- */
  .tx-pin { cursor: pointer; }

  /* The fill is a per-rep gradient set inline — party colour blending into
     ban stance. The thin dark rim keeps pale dots visible over bright map
     labels; the mail list is a green ring so the blend is never covered up. */
  .tx-pin-dot {
    stroke: rgba(0, 0, 0, 0.55);
    stroke-width: 0.8px;
    transition: stroke 0.2s ease;
  }

  .tx-pin-dot.tx-pin-on {
    stroke: #34d399;
    stroke-width: 1.6px;
  }

  .tx-pin:hover .tx-pin-dot,
  .tx-pin-active .tx-pin-dot {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.55));
  }

  .tx-pin-plate {
    fill: rgba(4, 8, 14, 0.92);
    stroke: rgba(16, 185, 129, 0.55);
    stroke-width: 1px;
    pointer-events: none;
  }

  .tx-pin-plate-quiet {
    fill: rgba(4, 6, 14, 0.8);
    stroke: rgba(16, 185, 129, 0.28);
  }

  .tx-pin-label {
    fill: #fff;
    font-family: ui-monospace, monospace;
    font-weight: 900;
    letter-spacing: 0.05em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.96);
    stroke-width: 3.4px;
    pointer-events: none;
    user-select: none;
  }

  .tx-pin-label-active {
    fill: #6ee7b7;
    letter-spacing: 0.09em;
  }

  .tx-pin-sub {
    fill: rgba(255, 255, 255, 0.75);
    font-family: ui-monospace, monospace;
    font-weight: 700;
    letter-spacing: 0.06em;
    paint-order: stroke fill;
    stroke: rgba(5, 7, 12, 0.96);
    stroke-width: 2.8px;
    pointer-events: none;
    user-select: none;
  }

  /* --- overlays --- */
  /* Collapsed, the map stage is only ~270px tall, and the key had grown past
     it. Cap it to the stage and let it scroll rather than spill. */
  .tx-legend {
    position: absolute;
    right: 8px;
    bottom: 8px;
    top: 8px;
    background: rgba(5, 7, 12, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 7px 9px;
    font-family: ui-monospace, monospace;
    z-index: 6;
    width: min(180px, 58%);
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
  }

  /* Roomy enough on a real screen to sit as a small card again. */
  @media (min-height: 520px) {
    .tx-legend {
      top: auto;
      max-height: calc(100% - 16px);
    }
  }

  .tx-legend h4 {
    margin: 0 0 6px;
    font-size: 0.52rem;
    letter-spacing: 0.16em;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 800;
  }

  .tx-legend-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.55rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 3px;
  }

  .sw {
    width: 9px;
    height: 9px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  /* Glyph swatches line up with the dot swatches above them. */
  .sw-glyph {
    width: 9px;
    flex-shrink: 0;
    font-size: 8px;
    line-height: 1;
    text-align: center;
  }

  .tx-legend-rec { color: #34d399; }
  .tx-legend-med { color: #60a5fa; }

  .sw-on {
    background: linear-gradient(135deg, #ef4444, #fbbf24);
    border: 2px solid #34d399;
    box-shadow: 0 0 6px rgba(52, 211, 153, 0.7);
  }
  .sw-off { background: linear-gradient(135deg, #b91c1c, #1d4ed8); }
  .sw-house {
    background: linear-gradient(135deg, #fca5a5, #93c5fd);
    border-radius: 2px;
    transform: rotate(45deg) scale(0.85);
  }
  .sw-capital {
    background: #fbbf24;
    border-radius: 0;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
  .sw-hwy { background: #f59e0b; height: 3px; border-radius: 2px; }
  .sw-us { background: #94a3b8; height: 3px; border-radius: 2px; }
  .sw-river { background: #38bdf8; height: 3px; border-radius: 2px; }
  .sw-cell {
    background: none;
    border: 1px solid rgba(226, 232, 240, 0.6);
    border-radius: 2px;
  }

  .tx-legend-note {
    margin-top: 5px;
    padding-top: 5px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.5;
  }

  /* Parked in the top-left, out of the way of the state itself. While it's
     only following the pointer it ignores the mouse entirely — otherwise
     hovering a pin that sits under the card fights with the card and the
     hover flickers. Once a pin is clicked the card becomes interactive. */
  .tx-card {
    position: absolute;
    left: 8px;
    top: 8px;
    width: min(268px, calc(100% - 16px));
    max-height: calc(100% - 16px);
    overflow-y: auto;
    background: rgba(5, 7, 12, 0.96);
    border: 1px solid rgba(16, 185, 129, 0.4);
    border-radius: 10px;
    padding: 9px 11px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
    font-family: ui-monospace, monospace;
    z-index: 7;
  }

  .tx-card-ghost {
    pointer-events: none;
  }

  .tx-card-head {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .tx-avatar {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    color: #fecaca;
    background: linear-gradient(145deg, rgba(239, 68, 68, 0.35), rgba(127, 29, 29, 0.5));
    border: 1px solid rgba(239, 68, 68, 0.55);
  }

  .tx-avatar.dem {
    color: #bfdbfe;
    background: linear-gradient(145deg, rgba(59, 130, 246, 0.35), rgba(30, 58, 138, 0.5));
    border-color: rgba(59, 130, 246, 0.55);
  }

  .tx-avatar.on {
    color: #04110b;
    background: linear-gradient(145deg, #34d399, #059669);
    border-color: #10b981;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
  }

  .tx-card-idbox { flex: 1; min-width: 0; }

  .tx-card-name {
    font-size: 0.72rem;
    font-weight: 900;
    color: #fff;
    letter-spacing: 0.03em;
    line-height: 1.25;
  }

  .tx-card-x {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    font-size: 0.7rem;
    padding: 0 2px;
    line-height: 1;
    flex-shrink: 0;
  }

  .tx-card-x:hover { color: #fff; }

  /* Party affiliation, readable at a glance next to the name. */
  .tx-party {
    display: inline-block;
    min-width: 1.05em;
    padding: 0 0.28em;
    margin-right: 4px;
    border-radius: 3px;
    font-size: 0.62rem;
    font-weight: 900;
    line-height: 1.35;
    text-align: center;
    vertical-align: baseline;
  }

  .tx-party-rep {
    background: rgba(239, 68, 68, 0.9);
    color: #fff;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.45);
  }

  .tx-party-dem {
    background: rgba(59, 130, 246, 0.9);
    color: #fff;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.45);
  }

  .tx-party-ind {
    background: rgba(161, 161, 170, 0.85);
    color: #18181b;
  }

  /* Prev/next through the roster. */
  .tx-card-nav {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
  }

  .tx-card-step {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: rgba(255, 255, 255, 0.75);
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 900;
    line-height: 1;
    /* Big enough to hit with a thumb without crowding the card. */
    min-width: 22px;
    min-height: 22px;
    padding: 0;
    transition: all 0.15s ease;
  }

  .tx-card-step:hover {
    background: rgba(16, 185, 129, 0.24);
    border-color: rgba(16, 185, 129, 0.6);
    color: #fff;
  }

  .tx-card-step:active { transform: scale(0.92); }

  .tx-card-hint {
    margin-top: 6px;
    font-size: 0.44rem;
    letter-spacing: 0.1em;
    text-align: center;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
  }

  /* --- stance: 1 supports legal hemp … 5 driving the ban --- */
  .tx-stance {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 7px;
    padding: 3px 6px;
    border-radius: 6px;
    border: 1px solid currentColor;
    font-size: 0.47rem;
    font-weight: 900;
    letter-spacing: 0.09em;
  }

  .tx-stance-label { flex: 1; min-width: 0; }
  .tx-stance-score { opacity: 0.85; font-variant-numeric: tabular-nums; }

  .tx-stance-meter {
    display: inline-flex;
    gap: 2px;
    flex-shrink: 0;
  }

  .tx-stance-meter i {
    width: 5px;
    height: 9px;
    border-radius: 1.5px;
    background: currentColor;
    opacity: 0.22;
  }

  .tx-stance-meter i.lit { opacity: 1; }

  .tx-stance-s0 { color: #a1a1aa; background: rgba(161, 161, 170, 0.1); }
  .tx-stance-s1 { color: #34d399; background: rgba(16, 185, 129, 0.14); }
  .tx-stance-s2 { color: #a3e635; background: rgba(163, 230, 53, 0.13); }
  .tx-stance-s3 { color: #fbbf24; background: rgba(251, 191, 36, 0.13); }
  .tx-stance-s4 { color: #fb923c; background: rgba(251, 146, 60, 0.14); }
  .tx-stance-s5 { color: #f87171; background: rgba(239, 68, 68, 0.16); }

  /* The record text carries the same colour, so the language and the rating
     agree without having to read the label. */
  .tx-record-s0 { border-left: 2px solid rgba(161, 161, 170, 0.5); }
  .tx-record-s1 { border-left: 2px solid #34d399; }
  .tx-record-s2 { border-left: 2px solid #a3e635; }
  .tx-record-s3 { border-left: 2px solid #fbbf24; }
  .tx-record-s4 { border-left: 2px solid #fb923c; }
  .tx-record-s5 { border-left: 2px solid #f87171; }

  .tx-card-record[class*="tx-record-"] {
    padding-left: 7px;
  }

  .tx-record-s1, .tx-record-s2 { color: rgba(236, 253, 245, 0.9); }
  .tx-record-s4, .tx-record-s5 { color: rgba(254, 242, 242, 0.9); }

  .tx-card-title {
    font-size: 0.56rem;
    color: #6ee7b7;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-top: 2px;
  }

  .tx-card-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 0.53rem;
    color: rgba(255, 255, 255, 0.62);
    margin-top: 6px;
  }

  /* Office title, sitting to the left of where they're based. */
  .tx-card-position {
    color: #6ee7b7;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .tx-tag {
    display: inline-block;
    font-size: 0.44rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.42);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 3px;
    padding: 0 3px;
    margin-right: 4px;
    vertical-align: 1px;
  }

  .tx-tag-hot {
    color: #fca5a5;
    border-color: rgba(239, 68, 68, 0.5);
    background: rgba(239, 68, 68, 0.12);
  }

  .tx-card-record {
    font-size: 0.53rem;
    color: rgba(255, 255, 255, 0.82);
    margin-top: 6px;
    line-height: 1.5;
  }

  .tx-card-counties {
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 5px;
    line-height: 1.45;
  }

  .tx-card-sources {
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.45);
    margin-top: 5px;
    line-height: 1.45;
  }

  .tx-card-sources summary {
    cursor: pointer;
    list-style: none;
  }

  .tx-card-sources summary::-webkit-details-marker {
    display: none;
  }

  .tx-card-sources ul {
    margin: 4px 0 0;
    padding-left: 10px;
    list-style: none;
  }

  .tx-card-sources li {
    margin-top: 3px;
    text-indent: -6px;
    padding-left: 6px;
  }

  .tx-card-sources li::before {
    content: "· ";
    color: rgba(255, 255, 255, 0.3);
  }

  .tx-card-sources a {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
  }

  .tx-card-sources a:hover {
    color: #6ee7b7;
    text-decoration: underline;
  }

  .tx-card-email {
    display: block;
    font-size: 0.5rem;
    color: rgba(255, 255, 255, 0.55);
    margin-top: 5px;
    word-break: break-all;
    text-decoration: none;
  }

  .tx-card-email:hover {
    color: #6ee7b7;
    text-decoration: underline;
  }

  .tx-card-form {
    color: #93c5fd;
    font-weight: 700;
  }

  .tx-card-form:hover { color: #fff; }

  /* Tappable on a phone — the whole point of showing the number. */
  .tx-card-tel {
    color: #6ee7b7;
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px dotted rgba(110, 231, 183, 0.5);
    white-space: nowrap;
  }

  .tx-card-tel:hover {
    color: #fff;
    border-bottom-color: #fff;
  }

  .tx-card-warn {
    font-size: 0.48rem;
    color: #fbbf24;
    margin-top: 3px;
    line-height: 1.4;
  }

  /* Read-only status — the recipient list below the map is the control. */
  .tx-card-status {
    margin-top: 7px;
    padding: 4px 6px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.5rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-align: center;
  }

  .tx-card-status.on {
    border-color: rgba(16, 185, 129, 0.55);
    background: rgba(16, 185, 129, 0.16);
    color: #6ee7b7;
  }

  .tx-zoom {
    position: absolute;
    top: 8px;
    right: 8px;
    font-family: ui-monospace, monospace;
    font-size: 0.52rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 2px 6px;
    pointer-events: none;
    z-index: 6;
  }

  @media (prefers-reduced-motion: reduce) {
    .tx-dot { animation: none; }
  }
</style>
