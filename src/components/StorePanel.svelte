<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<script>
  import { onMount, onDestroy, untrack } from "svelte";
  import { fade, scale, fly } from "svelte/transition";
  import { marked } from "marked";
  import BasePanel from "./BasePanel.svelte";
  import ProductImageSlideshow from "./apps/ProductImageSlideshow.svelte";
  import ThreeDShirtCanvas from "./apps/ThreeDShirtCanvas.svelte";
  import TexasLawmakerMap from "./apps/TexasLawmakerMap.svelte";
  import {
    ShoppingCart,
    ArrowLeft,
    Trash2,
    Plus,
    Minus,
    Check,
    X,
    Share2,
    Maximize2,
  } from "lucide-svelte";

  let {
    isClosing = false,
    onClose,
    initialCampaignId = $bindable(null),
    initialProductId = $bindable(null),
    initialStatsTab = $bindable(null),
    depth = $bindable(0),
  } = $props();

  let products = $state([]);
  let campaigns = $state([]);
  let cart = $state([]);
  let isCartOpen = $state(false);
  let cartHistoryPushed = $state(false);
  let selectedProduct = $state(null);
  let lastSelectedProductId = $state("");
  let selectedCampaign = $state(null);
  let campaignBioText = $state("");
  let currentStoreMode = $state("fundraising"); // Default to "fundraising" per user requirement
  let activeImageIdx = $state(0);
  let isImageFullscreen = $state(false);
  let isMapFullscreen = $state(false);
  let now = $state(Date.now());
  let countdownInterval;

  /**
   * Escape has to be caught in the capture phase. TitlePage listens for it on
   * window as well and closes the whole store, so an open overlay has to
   * swallow the key before it gets that far. With nothing expanded we let it
   * through untouched, and Escape still closes the panel as it always has.
   */
  function handleKeyDown(e) {
    if (e.key !== "Escape") return;
    if (!isImageFullscreen && !isMapFullscreen) return;
    // stopImmediatePropagation as well: when the event is dispatched straight at
    // window both listeners sit on the target, where stopPropagation alone
    // wouldn't hold the other one back.
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (isImageFullscreen) isImageFullscreen = false;
    else isMapFullscreen = false;
  }

  /**
   * Calculates real-time countdown to a target date.
   * @param {string|number} endDateTarget
   * @param {number} currentMs
   * @returns {{ days: number, hours: number, minutes: number, seconds: number, isZero: boolean, totalMs: number, formattedDaysLeft: string }}
   */
  function getCountdown(endDateTarget, currentMs) {
    if (!endDateTarget) return null;
    const targetMs = new Date(endDateTarget).getTime();
    if (isNaN(targetMs)) return null;
    const diff = Math.max(0, targetMs - currentMs);
    const isZero = diff <= 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const formattedDaysLeft = isZero
      ? "0 DAYS LEFT"
      : `${days} DAY${days === 1 ? "" : "S"} LEFT`;

    return {
      days,
      hours,
      minutes,
      seconds,
      isZero,
      totalMs: diff,
      formattedDaysLeft,
    };
  }

  /**
   * The Texas campaign runs on two deadlines: the July 31st state shelf pull
   * that takes everything but Delta-9, then the November 12th federal
   * reclassification that takes the rest. Once the first lapses the countdown
   * rolls onto the second on its own, no redeploy needed.
   * @param {any} campaign
   * @param {number} currentMs
   * @returns {{ target: string, label: string } | null}
   */
  function getActiveDeadline(campaign, currentMs) {
    if (!campaign) return null;
    const stages = [
      { target: campaign.endDate, label: campaign.endDateLabel, final: false },
      {
        target: campaign.finalEndDate,
        label: campaign.finalEndDateLabel,
        final: true,
      },
    ].filter((s) => s.target && !isNaN(new Date(s.target).getTime()));
    if (stages.length === 0) return null;
    const upcoming = stages.find(
      (s) => new Date(s.target).getTime() > currentMs,
    );
    return upcoming || stages[stages.length - 1];
  }

  /* ------------------------------------------------------------------ */
  /* SALE DAY — July 31st only                                           */
  /* ------------------------------------------------------------------ */

  /**
   * The moment the shelf-pull countdown hits zero, the campaign flips into a
   * one-day "SALE DAY" takeover: gold clock counting to midnight, money
   * confetti, the bio swapped for the clearance pitch, the map re-lit in cash
   * colours. At midnight into August 1st everything reverts on its own and the
   * November federal countdown takes over — no redeploy either way.
   */
  const SALE_CAMPAIGN_ID = "save-texas-hemp";
  const SALE_DAY_MS = 24 * 60 * 60 * 1000;

  /**
   * ✋ MANUAL SWITCHES — code-only on purpose. Sale day is July 31st and
   * nothing a URL can turn on or move. Flip SALE_PREVIEW to hand-force the
   * gold takeover while developing, NOV_PREVIEW for the post-sale November
   * mode. Both back to `false` before committing.
   */
  const SALE_PREVIEW = false;
  const NOV_PREVIEW = false;

  /** The 24-hour window that starts when the shelf-pull countdown hits zero. */
  function saleWindowOf(campaign) {
    if (campaign?.id !== SALE_CAMPAIGN_ID) return null;
    const start = new Date(campaign.endDate ?? NaN).getTime();
    if (!Number.isFinite(start)) return null;
    return { start, end: start + SALE_DAY_MS };
  }

  function isSaleNow(campaign, currentMs) {
    if (campaign?.id !== SALE_CAMPAIGN_ID) return false;
    if (SALE_PREVIEW) return true;
    const w = saleWindowOf(campaign);
    return !!w && currentMs >= w.start && currentMs < w.end;
  }

  let saleWindow = $derived(saleWindowOf(selectedCampaign));
  let saleActive = $derived(isSaleNow(selectedCampaign, now));

  /**
   * From August 1st onward the campaign speaks in the past tense: the shelf
   * pull happened, the fight is the November 12th federal deadline. Bio and
   * petition letter both swap to their November versions, and the amber
   * "FINAL COUNTDOWN" clock (already handled by getActiveDeadline) takes over.
   */
  let novActive = $derived(
    !saleActive &&
      selectedCampaign?.id === SALE_CAMPAIGN_ID &&
      (NOV_PREVIEW || (!!saleWindow && now >= saleWindow.end)),
  );

  /** Which letter the send buttons actually put in front of lawmakers. */
  let activeContactReps = $derived(
    novActive && selectedCampaign?.novContactReps
      ? selectedCampaign.novContactReps
      : selectedCampaign?.contactReps,
  );

  /** Keys the bio block so each phase change re-animates the text in. */
  let bioPhase = $derived(saleActive ? "sale" : novActive ? "nov" : "base");

  const SALE_MARQUEE =
    "💰 SALE DAY SALE DAY 💵 BIG BARGAINS 💶 ALL GOODS MUST GO 💷 EVERYTHING MUST GO 🏧 ONE DAY ONLY 🤑 ALL SALES FINAL 💸 ";

  /* The fireworks display: money emoji launched from the bottom of the screen
     the moment the sale flips on, while the clock visibly winds itself back. */
  const SALE_EMOJI = ["💰", "💵", "💶", "💷", "🏧", "🤑", "💸", "🪙", "💳", "🛒", "🏷️", "🌿"];
  let saleCelebrating = $state(false);
  let saleBurst = $state([]);
  let clockWinding = $state(false);
  let saleCelebrationTimeout = null;
  let clockWindTimeout = null;

  function windTheClock() {
    clockWinding = true;
    if (clockWindTimeout) clearTimeout(clockWindTimeout);
    clockWindTimeout = setTimeout(() => (clockWinding = false), 2600);
  }

  function startSaleCelebration() {
    const pieces = [];
    for (let i = 0; i < 54; i++) {
      pieces.push({
        id: i,
        emoji: SALE_EMOJI[i % SALE_EMOJI.length],
        left: Math.random() * 100,
        delay: Math.random() * 4.5,
        duration: 2.6 + Math.random() * 2.6,
        size: 16 + Math.random() * 28,
        drift: (Math.random() - 0.5) * 180,
        spin: (Math.random() - 0.5) * 720,
      });
    }
    saleBurst = pieces;
    saleCelebrating = true;
    windTheClock();
    if (saleCelebrationTimeout) clearTimeout(saleCelebrationTimeout);
    saleCelebrationTimeout = setTimeout(() => {
      saleCelebrating = false;
      saleBurst = [];
    }, 10000);
  }

  // Fire on the rising edge (including a page opened mid-sale — walking in the
  // door during the fireworks still gets you fireworks); wind the clock again
  // on the falling edge as the November countdown takes back over.
  let wasSaleActive = false;
  $effect(() => {
    const active = saleActive;
    untrack(() => {
      if (active && !wasSaleActive) startSaleCelebration();
      else if (!active && wasSaleActive) windTheClock();
      wasSaleActive = active;
    });
  });

  onDestroy(() => {
    if (saleCelebrationTimeout) clearTimeout(saleCelebrationTimeout);
    if (clockWindTimeout) clearTimeout(clockWindTimeout);
  });
  let scrollDirection = $state(1);
  let isVideoPlaying = $state(false);
  let selectedSize = $state("M");
  let sizes = [
    "6XS",
    "5XS",
    "4XS",
    "3XS",
    "2XS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
    "5XL",
    "6XL",
  ];

  $effect(() => {
    if (selectedProduct) {
      lastSelectedProductId = selectedProduct.id;
    }
  });

  // Resolve initial deep links on mount after data is loaded
  $effect(() => {
    if (products.length > 0 && initialProductId) {
      const matched = products.find((p) => p.id === initialProductId);
      if (
        matched &&
        (!selectedProduct || selectedProduct.id !== initialProductId)
      ) {
        selectedProduct = matched;
        currentStoreMode = "merch";
      }
    } else if (!initialProductId && selectedProduct !== null) {
      selectedProduct = null;
    }
  });

  $effect(() => {
    if (campaigns.length > 0 && initialCampaignId) {
      let resolvedId = initialCampaignId;
      if (resolvedId === "police-injustice") {
        resolvedId = "justice-for-rusty";
        initialCampaignId = "justice-for-rusty";
        history.replaceState(
          { view: "store", campaignId: resolvedId, depth: 2 },
          "",
          `/store/campaign/${resolvedId}`,
        );
      }
      const matched = campaigns.find((c) => c.id === resolvedId);
      if (
        matched &&
        (!selectedCampaign || selectedCampaign.id !== resolvedId)
      ) {
        selectedCampaign = matched;
        currentStoreMode = "fundraising";
        activeImageIdx = 0;
      }
    } else if (!initialCampaignId && selectedCampaign !== null) {
      selectedCampaign = null;
    }
  });

  $effect(() => {
    const camp = selectedCampaign;
    // During the July 31st sale window the pitch itself goes on clearance;
    // from August 1st it speaks in the past tense about the November deadline.
    const bioUrl =
      camp && saleActive && camp.saleBioUrl
        ? camp.saleBioUrl
        : camp && novActive && camp.novBioUrl
          ? camp.novBioUrl
          : camp?.bioUrl;
    if (camp && bioUrl) {
      fetch(bioUrl)
        .then((res) => (res.ok ? res.text() : ""))
        .then((text) => {
          campaignBioText = text;
        })
        .catch((e) => {
          console.error("Error loading campaign bio:", e);
          campaignBioText = "";
        });
    } else {
      campaignBioText = "";
    }
  });

  const BIO_LINK_CLASS =
    "text-red-500 hover:text-red-400 underline decoration-red-500/30 hover:decoration-red-400 transition-colors duration-200";

  // Bios are markdown. Markdown links, <url> autolinks and bare pasted URLs all
  // resolve through the one parser now, so there are no bespoke link regexes to
  // keep in sync — and any other inline markdown works for free.
  marked.use({
    gfm: true,
    renderer: {
      link({ href, tokens }) {
        const label = this.parser.parseInline(tokens);
        const isRawUrl = label === href;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="${BIO_LINK_CLASS}${isRawUrl ? " break-all" : ""}">${label}</a>`;
      },
    },
  });

  /**
   * Older bios embed raw <a> tags rather than markdown. marked passes those
   * through untouched, so give them the same styling markdown links get.
   */
  function styleRawAnchors(html) {
    return html.replace(
      /<a (?![^>]*\bclass=)([^>]*)>/g,
      `<a $1 target="_blank" rel="noopener noreferrer" class="${BIO_LINK_CLASS}">`,
    );
  }

  /**
   * Renders a markdown bio into one HTML string per paragraph, so each stays a
   * separate <p>. Inline-only parsing keeps a stray "1." or "- " in the older
   * bios as literal text instead of silently turning it into a list.
   * @param {string} text - The raw markdown bio.
   * @returns {string[]} An array of formatted HTML paragraph strings.
   */
  function formatBioText(text) {
    if (!text) return [];
    // Empty blocks are kept: a stray blank line already renders as an extra
    // paragraph gap today, and dropping them would reflow the older bios.
    return text
      .split(/\r?\n\r?\n/)
      .map((para) => styleRawAnchors(marked.parseInline(para.trim())));
  }

  /**
   * Emphasis pass for the critical Texas cannabis campaign. Money, hard
   * statistics, deadlines and the load-bearing phrases get pulled out of the
   * wall of text so the argument reads at a glance.
   */
  const MONTHS =
    "January|February|March|April|May|June|July|August|September|October|November|December";

  const KEY_PHRASES = [
    "will of the people",
    "real people",
    "real lives",
    "real businesses",
    "catastrophic losses",
    "shut their doors",
    "sudden closure",
    "overnight",
    "permanently",
    "illicit street market",
    "illegal street dealer scene",
    "unregulated",
    "untaxed",
    "far more dangerous",
    "extremely rare",
    "not the will of the people",
    "reconsider",
  ];

  /**
   * Order matters: the long clauses are listed first so they swallow the
   * numbers inside them and land as one emphasised statement rather than a
   * string of separately-highlighted fragments.
   */
  const CRITICAL_RE = new RegExp(
    [
      // 1 — the headline: what happens on Friday, and what November takes
      "(On Friday,?\\s*July\\s*31(?:st)?[\\s\\S]{0,90}?pulled off all Texas shelves" +
        "|Come November\\s*12(?:th)?[\\s\\S]{0,140}?Delta-9 included, is gone)",
      // 2 — what the ban destroys
      "(destroys hundreds of Texas small businesses[\\s\\S]{0,140}?wipes out millions in tax revenue" +
        "|thousands of people get fired[\\s\\S]{0,240}?produce nothing of value f(?:or|rom) Texas)",
      // 3 — procedural detail, deliberately played down
      "(\\b21[- ]day\\b|\\bJuly\\s*10(?:th)?\\b|\\bTexas Register\\b|\\bTexas DSHS\\b)",
      // 4 — money
      "(\\$\\s?\\d[\\d,]*(?:\\.\\d+)?(?:\\s*(?:billion|million|thousand))?(?:\\s*dollars?)?|\\bmulti-billion dollar\\b|\\b\\d+(?:\\.\\d+)?\\s*billion dollars?\\b)",
      // 5 — hard statistics
      "(\\b\\d{1,3}(?:,\\d{3})+\\b|\\b\\d+(?:\\.\\d+)?%|~\\d[\\d,]*\\b)",
      // 6 — deadlines
      `((?:Friday,?\\s+)?(?:${MONTHS})\\s+\\d{1,2}(?:st|nd|rd|th)?\\b|\\bFriday\\b|\\bNovember\\b)`,
      // 7 — load-bearing phrases
      `(${KEY_PHRASES.join("|")})`,
    ].join("|"),
    "gi",
  );

  const CRITICAL_CLASSES = [
    "em-alarm",
    "em-harm",
    "em-muted",
    "em-money",
    "em-stat",
    "em-deadline",
    "em-key",
  ];

  function emphasizeWith(html, re, classes, fallback) {
    if (!html) return html;
    // Only transform text nodes — never the inside of an existing tag.
    return html
      .split(/(<[^>]*>)/)
      .map((chunk, i) => {
        if (i % 2 === 1) return chunk; // this chunk is a tag
        return chunk.replace(re, (match, ...groups) => {
          const hit = groups.findIndex(
            (g, gi) => gi < classes.length && g !== undefined,
          );
          const cls = classes[hit] || fallback;
          const tag = cls === "em-muted" ? "span" : "b";
          return `<${tag} class="crit ${cls}">${match}</${tag}>`;
        });
      })
      .join("");
  }

  function emphasizeCritical(html) {
    return emphasizeWith(html, CRITICAL_RE, CRITICAL_CLASSES, "em-key");
  }

  /**
   * Sale-day emphasis: the clearance pitch reads like a used-car lot flyer,
   * so the highlighter follows suit — shouted slogans, money, and the
   * midnight deadline.
   */
  const SALE_RE = new RegExp(
    [
      // 1 — the shouted slogans
      "(SALE DAY SALE DAY|SALE SALE SALE(?:\\s+SALE)*|ALL GOODS MUST GO|ALL STOCK MUST GO|EVERYTHING MUST GO|ALL SALES ARE FINAL|MUST GO|BIG BARGAINS?)",
      // 2 — money
      "(\\$\\s?\\d[\\d,]*(?:\\.\\d+)?(?:\\s*(?:BILLION|MILLION|billion|million))?(?:\\s*DOLLARS?| dollars?)?(?:\\s*A YEAR)?|\\d+%\\s*(?:off|OFF)|\\b\\d{1,3}(?:,\\d{3})+\\b)",
      // 3 — the deadline
      "(MIDNIGHT(?: TONIGHT)?|TONIGHT|TODAY,?\\s*JULY 31ST|ONE DAY ONLY|TODAY ONLY|LAST DAY|FINAL (?:DAY|HOURS?)|November 12th|104-day)",
      // 4 — the merchandise
      "(SALE|CLEARANCE|DOORBUSTER|BARGAINS?|DEALS?|MARKDOWNS?|FREE)",
    ].join("|"),
    "g",
  );

  const SALE_CLASSES = [
    "sale-em-shout",
    "sale-em-money",
    "sale-em-deadline",
    "sale-em-key",
  ];

  function emphasizeSale(html) {
    return emphasizeWith(html, SALE_RE, SALE_CLASSES, "sale-em-key");
  }

  /**
   * Act two of the sale pitch: everything from the "BUT BE WARNED" banner
   * down trades bargain gold for police red & blue — charges and sentences
   * light up red, the law itself lights up blue.
   */
  const WARN_MARKER = "BUT BE WARNED";

  const WARN_RE = new RegExp(
    [
      // 1 — the charges (red)
      "(PUNISHABLE BY LAW|CONTRABAND|STATE JAIL FELONY|Class [AB](?: misdemeanor)?|felony charge|FELONY|felony|misdemeanor|criminals?|conviction|guilty|jail(?:house)?|prison|locked up)",
      // 2 — the sentences and fines (deep red, pulsing)
      "(180 days to 2 years|2 to 20 years|up to \\d+\\s?(?:days?|years?|hours?)|\\d+\\s?(?:days?|years?|hours?)|\\$\\d[\\d,]*(?:\\.\\d+)?|6 months)",
      // 3 — the law itself (blue)
      "(Texas Penal Code|officer suspicion|Austin police|police|breathalyzer|field test|background checks?|public record|drug screen|driver's license|judge|walk the line|piss kits?)",
      // 4 — the hinge between legal and illegal
      "(August 1st|midnight|30 DAYS)",
    ].join("|"),
    "g",
  );

  const WARN_CLASSES = [
    "warn-em-crime",
    "warn-em-sentence",
    "warn-em-cop",
    "warn-em-key",
  ];

  function emphasizeWarning(html) {
    return emphasizeWith(html, WARN_RE, WARN_CLASSES, "warn-em-key");
  }

  /** The bio, one HTML string per paragraph, for the campaign detail view. */
  let bioParas = $derived(
    formatBioText(campaignBioText || selectedCampaign?.description || ""),
  );

  /** Index of the "BUT BE WARNED" banner; -1 outside sale mode. */
  let warnIdx = $derived(
    saleActive ? bioParas.findIndex((p) => p.includes(WARN_MARKER)) : -1,
  );

  /**
   * Only the hard-penalty paragraphs get the red/blue evidence boxes — a
   * page where everything is highlighted highlights nothing. Matched by
   * snippet so the copy can be reworded without breaking the styling.
   */
  const WARN_BOX_SNIPPETS = [
    "Possession of up to 2 ounces",
    "Over 2 ounces",
    "But your vapes, your dabs",
    "Selling or even",
    "hunch trumps your sober evening",
  ];

  /** Box sequence number per paragraph (-1 = not boxed), for red/blue alternation. */
  let warnBoxOrder = $derived.by(() => {
    let n = 0;
    return bioParas.map((p) => {
      if (warnIdx < 0 || !WARN_BOX_SNIPPETS.some((s) => p.includes(s)))
        return -1;
      return n++;
    });
  });

  /* ------------------------------------------------------------------ */
  /* COP MODE — the warning section is on screen                         */
  /* ------------------------------------------------------------------ */

  /**
   * How many warning paragraphs are currently visible. While any of them is
   * on screen the whole page — panel, workspace, and the map — trades the
   * bargain gold for police red & blue, and trades back the moment the
   * reader scrolls up out of the section. Watching every paragraph (not
   * just the banner) is what keeps the lights on while the reader is deep
   * in the section with the banner already scrolled past.
   */
  let copSentinels = $state(0);
  let copMode = $derived(saleActive && copSentinels > 0);

  /** Svelte action: counts this node in/out of the viewport when active. */
  function warnWatch(node, active) {
    let io = null;
    let visible = false;
    const clear = () => {
      if (visible) {
        copSentinels -= 1;
        visible = false;
      }
      io?.disconnect();
      io = null;
    };
    const setup = (on) => {
      clear();
      if (!on || typeof IntersectionObserver === "undefined") return;
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !visible) {
            visible = true;
            copSentinels += 1;
          } else if (!entry.isIntersecting && visible) {
            visible = false;
            copSentinels -= 1;
          }
        },
        { threshold: 0.1 },
      );
      io.observe(node);
    };
    setup(active);
    return { update: setup, destroy: clear };
  }

  let isCriticalCampaign = $derived(selectedCampaign?.id === "save-texas-hemp");

  $effect(() => {
    // Reset video playing state when active slide index changes
    const _idx = activeImageIdx;
    const _camp = selectedCampaign;
    untrack(() => {
      isVideoPlaying = false;
      // Sliding off the map (or switching campaigns) should never leave the
      // next visit stuck in an expanded map.
      isMapFullscreen = false;
    });
  });

  /**
   * A product's flash sale, but only while its window is open — outside it
   * the listing silently reverts to full price, same clock discipline as the
   * campaign takeover. Data lives on the product in products.json.
   */
  function productSaleNow(product) {
    const s = product?.sale;
    if (!s) return null;
    const a = new Date(s.start ?? NaN).getTime();
    const b = new Date(s.end ?? NaN).getTime();
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    return now >= a && now < b ? s : null;
  }

  /** "WHY $100K OFF?" — hop from a product straight to its sale campaign. */
  function openSaleCampaign(campaignId) {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;
    selectedProduct = null;
    initialProductId = null;
    currentStoreMode = "fundraising";
    selectCampaign(camp);
  }

  // Navigation handlers that update URL history
  function selectProduct(product) {
    selectedProduct = product;
    initialProductId = product.id;
    currentStoreMode = "merch";
    depth = 2;
    history.pushState(
      { view: "store", productId: product.id, depth: 2 },
      "",
      `/store/product/${product.id}`,
    );
  }

  function deselectProduct() {
    selectedProduct = null;
    initialProductId = null;
    if (history.state?.productId) {
      history.back();
    } else if (window.location.pathname.includes("/store/product/")) {
      history.replaceState({ view: "store", depth: 1 }, "", "/store");
      depth = 1;
    }
  }

  function selectCampaign(campaign) {
    selectedCampaign = campaign;
    initialCampaignId = campaign.id;
    currentStoreMode = "fundraising";
    activeImageIdx = 0;
    scrollDirection = 1;
    depth = 2;
    history.pushState(
      { view: "store", campaignId: campaign.id, depth: 2 },
      "",
      `/store/campaign/${campaign.id}`,
    );
  }

  function slideIn(node, { duration = 300, direction = 1 }) {
    return {
      duration,
      css: (t) =>
        `transform: translate3d(${(1 - t) * 100 * direction}%, 0, 0);`,
    };
  }

  function slideOut(node, { duration = 300, direction = 1 }) {
    return {
      duration,
      css: (t) =>
        `transform: translate3d(${(1 - t) * -100 * direction}%, 0, 0);`,
    };
  }

  function terminalGlitchIn(node, { duration = 300 } = {}) {
    return {
      duration,
      css: (t, u) => {
        if (u === 0) return `opacity: 1; transform: none; filter: none;`;
        const randomSkew = (Math.random() * 30 - 15).toFixed(2);
        const randomShiftX = (Math.random() * 30 - 15).toFixed(1);
        const randomShiftY = (Math.random() * 8 - 4).toFixed(1);
        const randomRed = (Math.random() * 6 - 3).toFixed(0);
        const randomCyan = -randomRed;

        return `
          opacity: ${t > 0.15 ? 0.8 + Math.random() * 0.2 : t};
          transform: translate3d(${randomShiftX}px, ${randomShiftY}px, 0) skewX(${randomSkew}deg);
          filter: drop-shadow(${randomRed}px 0 0 rgba(239, 68, 68, 0.6)) drop-shadow(${randomCyan}px 0 0 rgba(16, 185, 129, 0.6));
        `;
      },
    };
  }

  function terminalGlitchOut(node, { duration = 250 } = {}) {
    return {
      duration,
      css: (t, u) => {
        if (t === 0) return `opacity: 0; transform: none; filter: none;`;
        const randomSkew = (Math.random() * 35 - 17.5).toFixed(2);
        const randomShiftX = (Math.random() * 35 - 17.5).toFixed(1);
        const randomShiftY = (Math.random() * 8 - 4).toFixed(1);
        const randomRed = (Math.random() * 6 - 3).toFixed(0);
        const randomCyan = -randomRed;

        return `
          opacity: ${t};
          transform: translate3d(${randomShiftX}px, ${randomShiftY}px, 0) skewX(${randomSkew}deg);
          filter: drop-shadow(${randomRed}px 0 0 rgba(239, 68, 68, 0.6)) drop-shadow(${randomCyan}px 0 0 rgba(16, 185, 129, 0.6));
        `;
      },
    };
  }

  function conditionalGlitchIn(node, options) {
    if (selectedProduct && selectedProduct.id === "fight-the-ceo") {
      return terminalGlitchIn(node, { duration: 300 });
    }
    return fade(node, { duration: 120 });
  }

  function conditionalGlitchOut(node, options) {
    if (lastSelectedProductId === "fight-the-ceo") {
      return terminalGlitchOut(node, { duration: 250 });
    }
    return fade(node, { duration: 80 });
  }

  // Workspace Swiping System
  let swipeStartX = 0;
  let swipeStartY = 0;
  let isSwiping = false;

  function handleWorkspacePointerDown(e) {
    if (e.button !== 0) return;
    isSwiping = true;
    swipeStartX = e.clientX;
    swipeStartY = e.clientY;
  }

  function handleWorkspacePointerUp(e) {
    if (!isSwiping) return;
    isSwiping = false;
    const deltaX = e.clientX - swipeStartX;
    const deltaY = e.clientY - swipeStartY;
    handleSwipeGesture(deltaX, deltaY);
  }

  function handleWorkspaceTouchStart(e) {
    if (e.touches.length === 1) {
      isSwiping = true;
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
    }
  }

  function handleWorkspaceTouchEnd(e) {
    if (!isSwiping) return;
    isSwiping = false;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = touch.clientY - swipeStartY;
    handleSwipeGesture(deltaX, deltaY);
  }

  function handleSwipeGesture(deltaX, deltaY) {
    if (selectedProduct || selectedCampaign) return;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        if (currentStoreMode === "merch") {
          currentStoreMode = "fundraising";
          deselectCampaign();
        }
      } else {
        if (currentStoreMode === "fundraising") {
          currentStoreMode = "merch";
          deselectProduct();
        }
      }
    }
  }

  function deselectCampaign() {
    selectedCampaign = null;
    initialCampaignId = null;
    if (history.state?.campaignId) {
      history.back();
    } else if (window.location.pathname.includes("/store/campaign/")) {
      history.replaceState({ view: "store", depth: 1 }, "", "/store");
      depth = 1;
    }
  }

  // Share system
  let showCopiedAlert = $state(false);
  let copyTimeout = null;

  function handleShare(type, id, e) {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/store/${type}/${id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        showCopiedAlert = true;
        if (copyTimeout) clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          showCopiedAlert = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  }

  // Head metadata for the open campaign, mirroring BlogApp's <svelte:head>.
  // This is what keeps the browser tab correct while navigating inside the SPA;
  // the crawler-facing copy of these same tags is baked into real HTML at build
  // time by scripts/vite-plugin-share-cards.js, because link unfurlers never run
  // JavaScript and would otherwise see the 404 shim.
  let campaignShareTitle = $derived(
    selectedCampaign ? `${selectedCampaign.title} — DOGS` : "DOGS",
  );

  let campaignShareDescription = $derived(
    (selectedCampaign?.description ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200),
  );

  let campaignShareImage = $derived(
    selectedCampaign?.media?.find((m) => m?.type === "image" && m.url)?.url ??
      selectedCampaign?.images?.[0] ??
      "",
  );

  // Lawmaker geolocation & metadata now lives with the campaign in
  // campaigns.json, so the roster can be corrected without a code change.
  // Priority offices lead the roster — they're the confirmed addresses and the
  // ones worth hitting first, so they head the list and act as the fallback
  // selection whenever geolocation can't narrow things down.
  let lawmakers = $derived(
    [...(selectedCampaign?.lawmakers ?? [])].sort(
      (a, b) => (a.priority ?? 9) - (b.priority ?? 9),
    ),
  );

  let priorityEmails = $derived(
    lawmakers.filter((l) => l.priority === 1).map((l) => l.email),
  );

  // The lawmaker roster is the single source of truth for who gets mailed.
  // Campaigns that predate it can still supply a bare contactReps.emails list.
  // Offices without an address are skipped: the federal ones take constituent
  // mail through a webform, and an empty entry would put a stray comma in the
  // mailto and an unusable blank row in the picker.
  let campaignRecipients = $derived(
    lawmakers.length > 0
      ? lawmakers.map((l) => l.email).filter((e) => e && e.trim())
      : (selectedCampaign?.contactReps?.emails ?? []).filter(
          (e) => e && e.trim(),
        ),
  );

  /** Who to select when we can't do better — the confirmed priority offices. */
  let fallbackReps = $derived(
    priorityEmails.length > 0 ? priorityEmails : campaignRecipients.slice(0, 3),
  );

  // Only a roster with real coordinates can be drawn.
  let hasLawmakerMap = $derived(
    lawmakers.some(
      (l) => typeof l.lat === "number" && typeof l.lng === "number",
    ),
  );

  // Email Lawmakers Action System
  let showEmailCopiedAlert = $state(false);
  let showSortMailPanel = $state(false);
  let selectedReps = $state([]);
  let isLocating = $state(false);
  let locationStatusText = $state("");
  let emailCopyTimeout = null;

  /**
   * Recipients per mailto hand-off. Mail clients cap the URL they accept —
   * Windows hands ShellExecute roughly 2,000 characters and the petition body
   * already eats most of that — so a single 181-address blast gets silently
   * truncated or dropped on the floor. Forty addresses is inside every client
   * worth supporting, and keeps the number of hand-offs down to something a
   * person will actually finish.
   */
  const MAIL_BATCH_SIZE = 40;

  /**
   * The standardised default send: every Senate, statewide and federal office
   * that publishes an address. It's a fixed list that fits in one mailto, so
   * the big green button does something valid and predictable before anyone
   * touches a checkbox. All 150 House districts at once would blow the limit —
   * those come in through Find My Location, the stance buttons, or REACH ALL.
   */
  let defaultReps = $derived.by(() => {
    const nonHouse = lawmakers
      .filter((l) => l.email && l.email.trim() && l.chamber !== "house")
      .map((l) => l.email);
    if (nonHouse.length > 0) return nonHouse;
    return campaignRecipients.slice(0, MAIL_BATCH_SIZE);
  });

  const DEFAULT_GROUP_LABEL = "Senate, statewide & federal offices";

  // Sync selected reps when campaign changes.
  $effect(() => {
    if (campaignRecipients.length > 0) {
      selectedReps = [...defaultReps];
      locationStatusText = "";
    }
  });

  function getRepInfo(email) {
    const meta = lawmakers.find((r) => r.email === email);
    if (meta) return meta;
    const namePart = email
      .split("@")[0]
      .replace("senator.", "")
      .replace(".", " ");
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    return {
      email,
      name: formattedName,
      title: "Representative",
      region: "Texas",
    };
  }

  function buildMailto(emails, contactReps) {
    return (
      `mailto:?bcc=${encodeURIComponent(emails.join(","))}` +
      `&subject=${encodeURIComponent(contactReps?.subject ?? "")}` +
      `&body=${encodeURIComponent(contactReps?.body ?? "")}`
    );
  }

  function chunkEmails(emails, size = MAIL_BATCH_SIZE) {
    const out = [];
    for (let i = 0; i < emails.length; i += size) out.push(emails.slice(i, i + size));
    return out;
  }

  /**
   * One send, however many recipients. Anything that fits goes straight to the
   * mail client; anything that doesn't opens the batch sheet rather than
   * handing the OS a URL it will quietly truncate.
   */
  function sendToEmails(emails, contactReps, kind = "selection") {
    const list = emails.filter((e) => e && e.trim());
    if (!contactReps || list.length === 0) return;
    if (list.length > MAIL_BATCH_SIZE) {
      openBatchSheet(list, contactReps, kind);
      return;
    }
    window.location.href = buildMailto(list, contactReps);
  }

  /**
   * The primary button, with the sorter closed. Falls back to the standardised
   * default group so it is never a dead click, even if someone opened the
   * sorter, cleared every box and collapsed it again.
   */
  function handleBlastEm(contactReps) {
    sendToEmails(
      selectedReps.length > 0 ? selectedReps : defaultReps,
      contactReps,
      "selection",
    );
  }

  function handleEmailSelected(contactReps) {
    sendToEmails(selectedReps, contactReps, "selection");
  }

  // Drives the map: ticking a name flies to them, unticking pulls back out.
  let mapFocusRequest = $state(null);
  let mapFocusSeq = 0;

  function handleToggleRep(email) {
    const wasSelected = selectedReps.includes(email);
    if (wasSelected) {
      selectedReps = selectedReps.filter((e) => e !== email);
    } else {
      selectedReps = [...selectedReps, email];
    }
    if (lawmakers.some((l) => l.email === email)) {
      mapFocusRequest = { email, zoomIn: !wasSelected, seq: ++mapFocusSeq };
    }
  }

  function handleSelectAllReps(emails) {
    selectedReps = [...emails];
  }

  function handleDeselectAllReps() {
    selectedReps = [];
  }

  /** Great-circle distance in miles — plain lat/lng deltas badly distort at Texas' latitude. */
  function haversineMiles(lat1, lng1, lat2, lng2) {
    const R = 3958.8;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function applyClosestReps(pos, allEmails) {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    const sorted = lawmakers
      .filter(
        (rep) => typeof rep.lat === "number" && typeof rep.lng === "number",
      )
      .map((rep) => ({
        email: rep.email,
        name: rep.name,
        chamber: rep.chamber,
        dist: haversineMiles(userLat, userLng, rep.lat, rep.lng),
      }))
      .sort((a, b) => a.dist - b.dist);

    // Closest two from each chamber, so the user's House rep makes the list
    // instead of being crowded out by a cluster of nearby senators (or vice
    // versa). Only reps this campaign actually mails count.
    const eligible = sorted.filter((r) => allEmails.includes(r.email));
    const closestHouse = eligible
      .filter((r) => r.chamber === "house")
      .slice(0, 2);
    const closestSenate = eligible
      .filter((r) => r.chamber !== "house")
      .slice(0, 2);
    const validClosest = [...closestHouse, ...closestSenate];

    if (validClosest.length === 0) {
      selectedReps = [...fallbackReps];
      locationStatusText =
        "📍 Found you, but no mapped reps matched. Selected the priority offices instead.";
      return;
    }

    // Always keep the confirmed priority offices in the send, then add whoever
    // is nearest — a local rep is persuasive, but the priority list is the
    // one that actually moves this.
    const closestEmails = validClosest.map((r) => r.email);
    selectedReps = [
      ...priorityEmails,
      ...closestEmails.filter((e) => !priorityEmails.includes(e)),
    ];

    const topNames = [closestHouse[0], closestSenate[0]]
      .filter(Boolean)
      .map((r) => r.name)
      .join(", ");
    const accuracy = pos.coords.accuracy
      ? ` ±${Math.round(pos.coords.accuracy / 1609) || "<1"}mi`
      : "";
    locationStatusText = `📍 Priority offices + your closest House & Senate reps${accuracy} — ${topNames}`;
  }

  /**
   * Picking the nearest senator needs city-level accuracy at best — the offices
   * are tens of miles apart — so this asks for a cheap, cache-friendly,
   * low-accuracy fix. Android's "approximate location" is already more than
   * enough, and a recent cached fix comes back instantly.
   *
   * The subtle part is the timeout. Chrome starts the `timeout` clock the moment
   * getCurrentPosition is called and runs the permission prompt on that same
   * clock, so any timeout short enough to be useful for a fix will fire while
   * the user is still reading the prompt — reported as a bogus "timed out".
   * So the request goes out with no timeout at all, and we only start our own
   * clock once the permission has actually been answered.
   */
  const LOCATION_OPTS = {
    enableHighAccuracy: false,
    maximumAge: 300000,
  };

  /** How long to wait for a fix once the human is out of the loop. */
  const FIX_TIMEOUT_MS = 15000;
  /** Budget covering prompt + fix together, when we can't tell them apart. */
  const BLIND_TIMEOUT_MS = 45000;

  async function handleUseLocation(allEmails) {
    const tail = `Selected the ${fallbackReps.length} priority offices — or tick the boxes below.`;

    if (!navigator.geolocation) {
      locationStatusText =
        "⚠️ This browser does not support location. Pick your reps from the list below.";
      return;
    }
    // isSecureContext already treats localhost/127.0.0.1 as secure; anything
    // else on plain http (a LAN IP from `vite --host`, say) can't geolocate.
    if (typeof window !== "undefined" && !window.isSecureContext) {
      locationStatusText =
        "⚠️ Location needs a secure (https) connection. Pick your reps from the list below.";
      return;
    }

    // A site the user has already blocked fails instantly and silently in
    // Chrome. Say so plainly instead of spinning on a request that can't win.
    let permission = null;
    try {
      permission = await navigator.permissions.query({ name: "geolocation" });
    } catch {
      // Older Safari can't query this one — fall through and just ask.
    }
    if (permission?.state === "denied") {
      selectedReps = [...fallbackReps];
      locationStatusText = `📍 Location is blocked for this site in your browser settings. ${tail}`;
      return;
    }

    isLocating = true;
    const waitingOnHuman = permission?.state === "prompt";
    locationStatusText = waitingOnHuman
      ? "Waiting for location permission..."
      : "Locating nearby Texas representatives...";

    // First result wins; a late straggler can't re-fire either branch.
    let settled = false;
    let fixTimer = null;
    const once = (fn) => (arg) => {
      if (settled) return;
      settled = true;
      clearTimeout(fixTimer);
      isLocating = false;
      fn(arg);
    };

    const succeed = once((pos) => applyClosestReps(pos, allEmails));

    // Any failure falls back to the confirmed priority offices — never to
    // nothing, and never to an unverified address.
    const giveUp = once((err) => {
      selectedReps = [...fallbackReps];
      if (err && err.code === 1) {
        locationStatusText = `📍 Location permission was denied. ${tail}`;
      } else if (err && err.code === 3) {
        locationStatusText = `📍 Location timed out. ${tail}`;
      } else {
        locationStatusText = `📍 Location unavailable right now. ${tail}`;
      }
    });

    const startFixClock = () => {
      clearTimeout(fixTimer);
      fixTimer = setTimeout(() => giveUp({ code: 3 }), FIX_TIMEOUT_MS);
    };

    if (!permission) {
      // No Permissions API: one generous budget has to cover both waits.
      fixTimer = setTimeout(() => giveUp({ code: 3 }), BLIND_TIMEOUT_MS);
    } else if (permission.state === "granted") {
      startFixClock();
    } else {
      // Only start counting once the prompt is answered. A denial arrives as a
      // code 1 on the error callback, so this only has to watch for the grant.
      permission.addEventListener("change", function onDecision() {
        permission.removeEventListener("change", onDecision);
        if (settled) return;
        if (permission.state === "granted") {
          locationStatusText = "Locating nearby Texas representatives...";
          startFixClock();
        }
      });
    }

    navigator.geolocation.getCurrentPosition(succeed, giveUp, LOCATION_OPTS);
  }

  function handleCopyRepsEmails(emails) {
    if (!emails || emails.length === 0) return;
    navigator.clipboard
      .writeText(emails.join(", "))
      .then(() => {
        showEmailCopiedAlert = true;
        if (emailCopyTimeout) clearTimeout(emailCopyTimeout);
        emailCopyTimeout = setTimeout(() => {
          showEmailCopiedAlert = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy emails:", err);
      });
  }

  /* ------------------------------------------------------------------ */
  /* Sorting the mail by where they actually stand                       */
  /* ------------------------------------------------------------------ */

  /**
   * banLikelihood runs 1 (supports legal hemp) to 5 (driving the ban); 0 or
   * absent means we have no record for that office and it stays out of every
   * stance bucket rather than being guessed at.
   */
  function stanceScore(rep) {
    const n = Number(rep?.banLikelihood);
    return Number.isFinite(n) && n >= 1 && n <= 5 ? Math.round(n) : 0;
  }

  const STANCE_LABELS = {
    0: "No record yet",
    1: "Supports legal hemp",
    2: "Prefers regulation over a ban",
    3: "Mixed / unclear",
    4: "Leans toward the ban",
    5: "Driving the ban",
  };

  // Full class strings, not interpolated ones — Tailwind scans this file as
  // plain text and never sees a class it has to compute.
  const STANCE_GROUPS = [
    {
      id: "for",
      label: "🌿 THOSE FOR WEED",
      range: "SCORE 1–2",
      blurb:
        "Already voting your way. Thank them and ask them to hold the line.",
      match: (s) => s === 1 || s === 2,
      btn: "bg-emerald-950/50 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300",
      count: "text-emerald-400",
    },
    {
      id: "middle",
      label: "🤔 THOSE IN THE MIDDLE",
      range: "SCORE 3",
      blurb: "Mixed or unclear record — these are the votes still in play.",
      match: (s) => s === 3,
      btn: "bg-amber-950/50 hover:bg-amber-900/60 border-amber-500/40 text-amber-300",
      count: "text-amber-400",
    },
    {
      id: "against",
      label: "🚫 THOSE AGAINST WEED",
      range: "SCORE 4–5",
      blurb: "Leaning toward the ban or driving it. They need to hear from you.",
      match: (s) => s === 4 || s === 5,
      btn: "bg-red-950/50 hover:bg-red-900/60 border-red-500/40 text-red-300",
      count: "text-red-400",
    },
  ];

  /** Mailable addresses per stance bucket, in roster order. */
  let stanceBuckets = $derived.by(() => {
    const out = {};
    for (const g of STANCE_GROUPS) {
      out[g.id] = lawmakers
        .filter((l) => l.email && l.email.trim() && g.match(stanceScore(l)))
        .map((l) => l.email);
    }
    return out;
  });

  /** Campaigns without a scored roster don't get the stance row at all. */
  let hasStanceData = $derived(
    STANCE_GROUPS.some((g) => (stanceBuckets[g.id] ?? []).length > 0),
  );

  function handleSelectStanceGroup(group) {
    const emails = stanceBuckets[group.id] ?? [];
    if (emails.length === 0) return;
    selectedReps = [...emails];
    locationStatusText = `${group.label} — ${emails.length} offices selected (${group.range.toLowerCase()}). ${group.blurb}`;
  }

  /**
   * THIS MEANS WAR — the captain and his officers. Lt. Gov. Patrick runs
   * the Senate calendar where every House reform bill since 2019 has died;
   * Perry wrote SB 3; Shaheen killed the House's regulate-don't-ban
   * substitute. One button aims the letter at the ban's actual architects
   * instead of the whole fleet.
   */
  const WAR_TARGET_NAMES = ["Dan Patrick", "Charles Perry", "Matt Shaheen"];

  let warTargets = $derived(
    lawmakers
      .filter((l) => WAR_TARGET_NAMES.includes(l.name) && l.email?.trim())
      .map((l) => l.email),
  );

  function handleTargetCaptain() {
    if (warTargets.length === 0) return;
    selectedReps = [...warTargets];
    locationStatusText =
      "🏴‍☠️ Broadside loaded: Lt. Gov. Dan Patrick (captain of the anti-weed ship — his Senate calendar is where House reform dies), Sen. Charles Perry (wrote SB 3), Rep. Matt Shaheen (killed the House's regulate-don't-ban plan). Fire when ready.";
  }

  /* ------------------------------------------------------------------ */
  /* Reaching the whole roster, forty at a time                          */
  /* ------------------------------------------------------------------ */

  let showBatchSheet = $state(false);
  let batchKind = $state("all");
  let batchContactReps = $state(null);
  let batchEmails = $state([]);
  /** Batch indexes already handed to the mail client or copied. */
  let batchesDone = $state([]);

  let batches = $derived(chunkEmails(batchEmails));

  function openBatchSheet(emails, contactReps, kind = "all") {
    batchEmails = [...emails];
    batchContactReps = contactReps;
    batchKind = kind;
    batchesDone = [];
    showBatchSheet = true;
  }

  function markBatchDone(i) {
    if (!batchesDone.includes(i)) batchesDone = [...batchesDone, i];
  }

  function handleOpenBatch(i) {
    const batch = batches[i];
    if (!batch || !batchContactReps) return;
    markBatchDone(i);
    window.location.href = buildMailto(batch, batchContactReps);
  }

  function handleCopyBatch(i) {
    const batch = batches[i];
    if (!batch) return;
    markBatchDone(i);
    handleCopyRepsEmails(batch);
  }

  /* ------------------------------------------------------------------ */
  /* One random persuadable office                                       */
  /* ------------------------------------------------------------------ */

  /**
   * Scores 2–4 are everyone who isn't a locked-in vote in either direction —
   * the offices where one well-argued email is still worth sending. One name
   * with a story attached is a far easier ask than a list of 181.
   */
  let persuadableReps = $derived(
    lawmakers.filter((l) => {
      const s = stanceScore(l);
      return l.email && l.email.trim() && s >= 2 && s <= 4;
    }),
  );

  let showRandomSheet = $state(false);
  let randomRep = $state(null);

  function rollRandomRep() {
    const pool = persuadableReps.filter((l) => l.email !== randomRep?.email);
    const from = pool.length > 0 ? pool : persuadableReps;
    if (from.length === 0) return;
    randomRep = from[Math.floor(Math.random() * from.length)];
  }

  function openRandomSheet() {
    if (persuadableReps.length === 0) return;
    randomRep = null;
    rollRandomRep();
    showRandomSheet = true;
  }

  function handleMailRandomRep(contactReps) {
    if (!randomRep?.email) return;
    sendToEmails([randomRep.email], contactReps, "random");
  }

  function handleAddRandomRep() {
    if (!randomRep?.email || selectedReps.includes(randomRep.email)) return;
    selectedReps = [...selectedReps, randomRep.email];
  }

  // Load products and campaigns on mount
  onMount(async () => {
    countdownInterval = setInterval(() => {
      now = Date.now();
    }, 1000);

    try {
      const res = await fetch("/data/products.json");
      if (res.ok) {
        products = await res.json();
      }
    } catch (e) {
      console.error("Error loading products:", e);
    }
    try {
      const res = await fetch("/data/campaigns.json");
      if (res.ok) {
        campaigns = await res.json();
      }
    } catch (e) {
      console.error("Error loading campaigns:", e);
    }
    loadCart();
  });

  onDestroy(() => {
    if (countdownInterval) clearInterval(countdownInterval);
  });

  // Load cart from localStorage and re-verify stock
  function loadCart() {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("wearedogs_cart");
    if (saved) {
      try {
        const parsedCart = JSON.parse(saved);
        // Verify stock immediately
        verifyCartStock(parsedCart);
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
  }

  // Stock verification engine
  function verifyCartStock(currentCart) {
    if (products.length === 0) {
      // If products haven't loaded yet, just set cart for now
      cart = currentCart;
      return;
    }

    let updatedCart = [];
    let removedItems = [];

    for (const item of currentCart) {
      const dbProduct = products.find((p) => p.id === item.id);
      if (dbProduct && dbProduct.inStock) {
        updatedCart.push(item);
      } else {
        removedItems.push(item.title);
      }
    }

    cart = updatedCart;
    saveCart();

    if (removedItems.length > 0) {
      alert(
        `The following items in your cart are no longer in stock and have been removed:\n- ${removedItems.join("\n- ")}`,
      );
    }
  }

  function saveCart() {
    if (typeof window !== "undefined") {
      localStorage.setItem("wearedogs_cart", JSON.stringify(cart));
    }
  }

  function addToCart(product, size) {
    if (!product.inStock) return;

    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size,
    );
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        size: size,
        image: product.image,
        checkoutUrl: product.checkoutUrl,
        quantity: 1,
      });
    }
    saveCart();
    isCartOpen = true;
  }

  function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
  }

  // Total price calculator
  let totalPrice = $derived(() => {
    let total = 0;
    for (const item of cart) {
      const priceNum = parseFloat(item.price.replace("$", ""));
      total += priceNum * item.quantity;
    }
    return `$${total.toFixed(2)}`;
  });

  // Re-verify stock when cart is opened
  $effect(() => {
    if (isCartOpen) {
      untrack(() => {
        verifyCartStock(cart);
      });
    }
  });

  function handleCheckout() {
    if (cart.length === 0) return;
    // Route to external checkout pipelines
    cart.forEach((item) => {
      window.open(item.checkoutUrl, "_blank");
    });
    // Clear cart after checkout
    cart = [];
    saveCart();
    isCartOpen = false;
  }

  // Sync cart drawer state with browser history (back button closes cart)
  $effect(() => {
    if (isCartOpen) {
      if (!history.state?.cartOpen && !cartHistoryPushed) {
        const nextDepth = depth + 1;
        history.pushState(
          {
            view: "store",
            cartOpen: true,
            productId: selectedProduct?.id || null,
            campaignId: selectedCampaign?.id || null,
            depth: nextDepth,
          },
          "",
        );
        cartHistoryPushed = true;
        depth = nextDepth;
      }
    } else {
      if (cartHistoryPushed) {
        history.back();
        cartHistoryPushed = false;
        depth = Math.max(1, depth - 1);
      }
    }
  });

  onDestroy(() => {
    if (cartHistoryPushed) {
      history.back();
      cartHistoryPushed = false;
    }
  });

  // Touch swipe handling for fundraising carousel
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  function handleTouchStart(e) {
    // The map slide owns its own gestures — don't let a tap on it swipe away.
    if (currentMediaItem?.type === "map") return;
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }
  }

  function handleTouchEnd(e) {
    if (currentMediaItem?.type === "map") return;
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      const swipeThreshold = 50;
      if (
        Math.abs(diffX) > swipeThreshold &&
        Math.abs(diffX) > Math.abs(diffY)
      ) {
        if (diffX > 0) {
          // Swipe left -> Next image/video
          scrollDirection = 1;
          activeImageIdx = (activeImageIdx + 1) % campaignMedia.length;
        } else {
          // Swipe right -> Previous image/video
          scrollDirection = -1;
          activeImageIdx =
            (activeImageIdx - 1 + campaignMedia.length) % campaignMedia.length;
        }
      }
    }
  }

  // Reactive/derived values for campaign media (support video, images & the map)
  let campaignMedia = $derived.by(() => {
    const base =
      selectedCampaign?.media?.length > 0
        ? selectedCampaign.media
        : selectedCampaign?.images?.map((img) => ({
            type: "image",
            url: img,
          })) || [];
    // Campaigns that ship a lawmaker roster get an interactive map slide. It
    // goes FIRST — the map is the thing that actually does something, so it's
    // the thing you land on. Share images are untouched by this: the meta
    // tags and prerendered cards read campaign.media/images directly, never
    // this assembled carousel order.
    if (!(selectedCampaign?.lawmakers?.length > 0)) return base;
    const map = { type: "map", url: "lawmaker-map" };
    return [map, ...base];
  });

  let currentMediaItem = $derived(campaignMedia[activeImageIdx] || null);

  let mapSlideIdx = $derived(campaignMedia.findIndex((m) => m.type === "map"));

  /**
   * A /stats/<tab> deep link has to land on the map slide before the map can
   * open its sheet — the carousel only mounts the active slide. Runs once the
   * campaign's media is actually assembled.
   */
  $effect(() => {
    if (!initialStatsTab || mapSlideIdx < 0) return;
    untrack(() => {
      if (activeImageIdx !== mapSlideIdx) {
        scrollDirection = activeImageIdx > mapSlideIdx ? -1 : 1;
        activeImageIdx = mapSlideIdx;
      }
    });
  });

  /** Bring the lawmaker map into view in the carousel. */
  function jumpToMap() {
    if (mapSlideIdx < 0) return;
    scrollDirection = activeImageIdx > mapSlideIdx ? -1 : 1;
    activeImageIdx = mapSlideIdx;
  }

  function toggleSortMailPanel() {
    showSortMailPanel = !showSortMailPanel;
    // Opening the sorter jumps the carousel to the map so you can see who you
    // are actually mailing while you tick the boxes.
    if (showSortMailPanel) jumpToMap();
  }

  /**
   * The carousel must fit the panel without scrolling on desktop. Guessing with
   * `vh` doesn't work — the workspace is shorter than the viewport by a varying
   * amount of panel chrome — so measure it and cap the media box directly,
   * leaving room for the thumbnail strip and gaps beneath it.
   */
  let workspaceH = $state(0);
  // thumbnail strip + its gap + the workspace's own vertical padding
  const CAROUSEL_CHROME_PX = 152;
  let mediaMaxPx = $derived(
    workspaceH > 0 ? Math.max(240, workspaceH - CAROUSEL_CHROME_PX) : 0,
  );

  // "JUMP TO EMAIL" — scroll the send buttons into view from the countdown widget.
  let emailActionEl = $state(null);
  let emailActionFlash = $state(false);
  let emailFlashTimeout = null;

  /**
   * The store workspace is a nested scroll container that silently ignores
   * `scrollIntoView({behavior:"smooth"})`, so drive its scrollTop directly and
   * snap into place if the smooth animation never happens.
   */
  function scrollIntoViewSmart(el) {
    if (!el) return;
    let sc = el.parentElement;
    while (sc && sc !== document.body) {
      const cs = getComputedStyle(sc);
      if (
        /(auto|scroll)/.test(cs.overflowY) &&
        sc.scrollHeight > sc.clientHeight + 2
      )
        break;
      sc = sc.parentElement;
    }

    if (!sc || sc === document.body) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const offset =
      sc.scrollTop +
      el.getBoundingClientRect().top -
      sc.getBoundingClientRect().top -
      Math.max(0, (sc.clientHeight - el.clientHeight) / 2);
    const dest = Math.max(
      0,
      Math.min(offset, sc.scrollHeight - sc.clientHeight),
    );

    sc.scrollTo({ top: dest, behavior: "smooth" });
    setTimeout(() => {
      if (Math.abs(sc.scrollTop - dest) > 8) sc.scrollTop = dest;
    }, 450);
  }

  function jumpToEmailActions() {
    if (!emailActionEl) return;
    scrollIntoViewSmart(emailActionEl);
    emailActionFlash = true;
    if (emailFlashTimeout) clearTimeout(emailFlashTimeout);
    emailFlashTimeout = setTimeout(() => (emailActionFlash = false), 2200);
  }

  function handlePopState(e) {
    if (!e.state?.cartOpen && isCartOpen) {
      isCartOpen = false;
      cartHistoryPushed = false;
      if (e.state?.depth !== undefined) {
        depth = e.state.depth;
      }
    } else if (e.state?.cartOpen && !isCartOpen) {
      isCartOpen = true;
      cartHistoryPushed = true;
      if (e.state?.depth !== undefined) {
        depth = e.state.depth;
      }
    }
  }
</script>

<svelte:window
  onpopstate={handlePopState}
  onkeydowncapture={handleKeyDown}
/>

<svelte:head>
  {#if selectedCampaign}
    <title>{campaignShareTitle}</title>
    <meta name="description" content={campaignShareDescription} />
    <meta property="og:title" content={campaignShareTitle} />
    <meta property="og:description" content={campaignShareDescription} />
    <meta
      property="og:url"
      content="{window.location.origin}/store/campaign/{selectedCampaign.id}"
    />
    {#if campaignShareImage}
      <meta property="og:image" content={campaignShareImage} />
    {/if}
    <meta property="twitter:title" content={campaignShareTitle} />
    <meta property="twitter:description" content={campaignShareDescription} />
  {/if}
</svelte:head>

<BasePanel title="DOGS SHOP" {isClosing} {onClose}>
  <div
    class="store-container w-full h-full relative font-mono text-zinc-100 flex flex-col"
  >
    <!-- Header Controls. Shorter on a phone: this bar sits above the fold on
         every campaign, so its height is pure cost on a small screen. -->
    <div
      class="flex justify-between items-center px-2.5 sm:px-4 h-9 sm:h-14 bg-zinc-950/20 border-b border-zinc-800 shrink-0 store-header"
    >
      <div class="flex items-center h-full">
        {#if currentStoreMode === "merch" && selectedProduct}
          <button
            class="flex items-center gap-1.5 sm:gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-[11px] sm:text-sm font-semibold cursor-pointer py-0.5 sm:py-1 px-1.5 sm:px-2.5 hover:bg-zinc-900/60 rounded-lg whitespace-nowrap"
            onclick={deselectProduct}
          >
            <ArrowLeft size={16} /> BACK TO CATALOG
          </button>
        {:else if currentStoreMode === "fundraising" && selectedCampaign}
          <button
            class="flex items-center gap-1.5 sm:gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-[11px] sm:text-sm font-semibold cursor-pointer py-0.5 sm:py-1 px-1.5 sm:px-2.5 hover:bg-zinc-900/60 rounded-lg whitespace-nowrap"
            onclick={deselectCampaign}
          >
            <ArrowLeft size={16} /> BACK TO CAMPAIGNS
          </button>
        {:else}
          <!-- Mode Toggle Switch -->
          <div
            class="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 gap-1"
          >
            <button
              class="px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 cursor-pointer"
              class:bg-white={currentStoreMode === "merch"}
              class:text-black={currentStoreMode === "merch"}
              class:text-zinc-400={currentStoreMode !== "merch"}
              onclick={() => {
                currentStoreMode = "merch";
                deselectProduct();
              }}
            >
              <span class="hidden sm:inline">MERCHANDISE</span>
              <span class="inline sm:hidden text-sm">👕</span>
            </button>
            <button
              class="px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 cursor-pointer"
              class:bg-white={currentStoreMode === "fundraising"}
              class:text-black={currentStoreMode === "fundraising"}
              class:text-zinc-400={currentStoreMode !== "fundraising"}
              onclick={() => {
                currentStoreMode = "fundraising";
                deselectCampaign();
              }}
            >
              <span class="hidden sm:inline">FUNDRAISERS</span>
              <span class="inline sm:hidden text-sm">🎡</span>
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Main Workspace -->
    <div
      class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 grid-rows-1 image-panel store-workspace"
      class:sale-workspace={saleActive}
      class:cop-workspace={copMode}
      class:campaign-open={currentStoreMode === "fundraising" &&
        !!selectedCampaign}
      bind:clientHeight={workspaceH}
      onpointerdown={handleWorkspacePointerDown}
      onpointerup={handleWorkspacePointerUp}
      ontouchstart={handleWorkspaceTouchStart}
      ontouchend={handleWorkspaceTouchEnd}
      role="region"
      aria-label="Store Catalog Panel"
    >
      {#if currentStoreMode === "merch"}
        <div
          class="w-full col-start-1 row-start-1"
          transition:fade={{ duration: 200 }}
        >
          {#if !selectedProduct}
            <!-- WARNING NOTICE BANNER -->
            {#if !products.some((p) => p.inStock)}
              <div
                class="max-w-7xl mx-auto mb-6 p-4 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 font-mono text-xs flex items-center gap-3 shadow-lg"
              >
                <span class="text-xl select-none">⚠️</span>
                <div>
                  <span
                    class="font-bold text-red-400 uppercase tracking-wider block text-xs sm:text-sm"
                  >
                    NOTHING FOR SALE RIGHT NOW
                  </span>
                  <span
                    class="text-[11px] text-zinc-400 font-sans mt-0.5 block"
                  >
                    All official merchandise is currently out of stock or
                    unavailable. Please check back later or visit our active
                    Fundraisers tab!
                  </span>
                </div>
              </div>
            {/if}

            <!-- MERCHANDISE GRID VIEW -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
              in:fade={{ duration: 120 }}
              out:fade={{ duration: 80 }}
            >
              {#each products as product}
                {@const pSale = productSaleNow(product)}
                <div
                  class="relative flex flex-col justify-between overflow-hidden bg-zinc-900/40 border rounded-xl transition-all duration-300 group {pSale
                    ? 'border-yellow-500/60 hover:border-yellow-400 shadow-lg shadow-yellow-950/30'
                    : 'border-zinc-800 hover:border-zinc-700'}"
                >
                  <!-- Flash-sale banner: one day only, priced to move -->
                  {#if pSale}
                    <div
                      class="absolute top-2 left-2 z-20 px-2 py-1 bg-yellow-400 text-black font-black font-mono text-[9px] tracking-widest uppercase rounded shadow-lg animate-pulse pointer-events-none"
                    >
                      🤑 {pSale.amountOff} · TODAY ONLY
                    </div>
                  {/if}
                  <!-- Caution tape for sold-out items -->
                  {#if !product.inStock}
                    <div
                      class="absolute inset-0 bg-black/60 z-10 flex items-center justify-center pointer-events-none"
                    >
                      <div
                        class="caution-tape text-center py-2 w-[150%] rotate-12 bg-yellow-400 text-black font-black text-sm tracking-widest uppercase border-y-2 border-black select-none shadow-lg"
                      >
                        SOLD OUT
                      </div>
                    </div>
                  {/if}

                  <!-- Product Graphic Box -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="aspect-square bg-black/20 border-b border-zinc-800/60 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden"
                    onclick={() => product.inStock && selectProduct(product)}
                  >
                    {#if product.image && product.image.startsWith("http")}
                      <img
                        src={product.image}
                        alt={product.title}
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    {:else}
                      <div
                        class="w-24 h-24 text-zinc-700 group-hover:text-zinc-500 transition-colors duration-300 flex items-center justify-center"
                      >
                        {#if product.title.includes("FIGHT") || product.title.includes("CEO")}
                          <span class="text-5xl select-none">🥊</span>
                        {:else if product.title.includes("T-SHIRT")}
                          <svg
                            viewBox="0 0 24 24"
                            class="w-16 h-16 fill-none stroke-current"
                            stroke-width="1.5"
                          >
                            <path
                              d="M4 8.5V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5M4 8.5L8 5m-4 3.5l-2-1.5L4 4m16 4.5l-4-3.5m4 3.5l2-1.5L20 4M8 5a4 4 0 0 1 8 0"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        {:else if product.title.includes("HOODIE")}
                          <svg
                            viewBox="0 0 24 24"
                            class="w-16 h-16 fill-none stroke-current"
                            stroke-width="1.5"
                          >
                            <path
                              d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9m-14 0l3-5m11 5l-3-5m-8 0h6m-3 0v4m0 0a2 2 0 1 0 0 4 2 2 0 1 0 0-4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        {:else if product.title.includes("HAT")}
                          <svg
                            viewBox="0 0 24 24"
                            class="w-16 h-16 fill-none stroke-current"
                            stroke-width="1.5"
                          >
                            <path
                              d="M2 17h20M6 17v-4a6 6 0 0 1 12 0v4M12 7V4m0 0l-2 1m2-1l2 1"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        {:else}
                          <svg
                            viewBox="0 0 24 24"
                            class="w-16 h-16 fill-none stroke-current"
                            stroke-width="1.5"
                          >
                            <path
                              d="M7 4h10v12a4 4 0 0 1-8 0V4zM7 8h10M9 16h6"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        {/if}
                      </div>
                    {/if}
                  </div>

                  <!-- Product Details -->
                  <div class="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3
                        class="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors duration-200"
                      >
                        {product.title}
                      </h3>
                      <p class="text-xs text-zinc-500 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>
                    <div
                      class="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/40"
                    >
                      {#if pSale}
                        <span class="flex items-baseline gap-1.5 min-w-0">
                          <span
                            class="text-[10px] text-zinc-500 line-through font-mono shrink-0"
                            >{product.price}</span
                          >
                          <span class="font-black text-sm text-yellow-400"
                            >{pSale.price}</span
                          >
                        </span>
                      {:else}
                        <span class="font-bold text-sm text-red-500"
                          >{product.price}</span
                        >
                      {/if}
                      <button
                        class="px-3 py-1 bg-white text-black font-bold text-xs rounded hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer disabled:cursor-not-allowed"
                        disabled={!product.inStock}
                        onclick={() => selectProduct(product)}
                      >
                        VIEW
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <!-- DETAIL VIEW -->
            {@const dSale = productSaleNow(selectedProduct)}
            <div
              class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch"
              in:conditionalGlitchIn
              out:conditionalGlitchOut
            >
              <!-- Left: Product Picture Slideshow -->
              <div
                class="w-full bg-black/40 border border-zinc-800 rounded-2xl flex flex-col items-center justify-between p-3 relative overflow-hidden mx-auto h-full max-h-[380px] lg:max-h-[460px] xl:max-h-[500px]"
              >
                <ProductImageSlideshow
                  images={selectedProduct.images ||
                    (selectedProduct.image ? [selectedProduct.image] : [])}
                  productTitle={selectedProduct.title}
                />
              </div>

              <!-- Right: Details -->
              <div
                class="flex flex-col min-h-0 h-full bg-zinc-900/20 border border-zinc-800/60 p-4 sm:p-5 rounded-2xl max-h-[380px] lg:max-h-[460px] xl:max-h-[500px] overflow-hidden"
              >
                <div class="flex justify-between items-start gap-3 shrink-0">
                  <h1
                    class="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-wider"
                  >
                    {selectedProduct.title}
                  </h1>
                  <div class="flex items-center gap-2 shrink-0">
                    {#if dSale}
                      <span class="flex flex-col items-end leading-tight">
                        <span
                          class="text-[11px] sm:text-xs text-zinc-500 line-through font-mono"
                          >{selectedProduct.price}</span
                        >
                        <span
                          class="text-base sm:text-lg lg:text-xl text-yellow-400 font-black"
                          >{dSale.price}</span
                        >
                      </span>
                    {:else}
                      <span
                        class="text-base sm:text-lg lg:text-xl text-red-500 font-black"
                        >{selectedProduct.price}</span
                      >
                    {/if}
                    <button
                      onclick={(e) =>
                        handleShare("product", selectedProduct.id, e)}
                      class="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                      title="Copy Share Link"
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>

                <!-- Description: always full text, never clamped. Owns the
                     panel's scroll so it can never be compacted away. -->
                <div
                  class="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar mt-2 sm:mt-3 pb-3 pr-1 border-b border-zinc-800/80"
                >
                  <p
                    class="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans"
                  >
                    {selectedProduct.description}
                  </p>
                </div>

                <!-- Size selector -->
                {#if selectedProduct.id === "fight-the-ceo" || (selectedProduct.checkoutUrl && (!selectedProduct.sizes || selectedProduct.sizes.length === 0))}
                  <!-- No size selector for FIGHT THE CEO or direct Cash App checkout items -->
                {:else if selectedProduct.sizes && selectedProduct.sizes.length > 0 && selectedProduct.sizes[0] !== "One Size"}
                  <div class="mt-3 sm:mt-4 shrink-0">
                    <span
                      class="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2"
                      >SELECT SIZE</span
                    >
                    <div class="flex flex-wrap gap-2">
                      {#each selectedProduct.sizes as size}
                        <button
                          class="px-3 py-1.5 border border-zinc-800 rounded text-xs font-bold hover:border-zinc-500 transition-all duration-200 cursor-pointer"
                          class:active-size={selectedSize === size}
                          onclick={() => (selectedSize = size)}
                        >
                          {size}
                        </button>
                      {/each}
                    </div>
                  </div>
                {:else}
                  <div class="mt-3 sm:mt-4 shrink-0">
                    <span
                      class="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1"
                      >SIZE</span
                    >
                    <span class="text-sm font-bold text-zinc-400">ONE SIZE</span
                    >
                  </div>
                {/if}

                <div
                  class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-zinc-800/80 shrink-0"
                >
                  {#if dSale}
                    <div
                      class="mb-3 px-3 py-2 bg-yellow-400 text-black font-black font-mono text-[10px] sm:text-[11px] tracking-widest uppercase rounded-lg text-center animate-pulse"
                    >
                      🤑 {dSale.amountOff} — {dSale.label}
                    </div>
                  {/if}
                  {#if selectedProduct.id === "fight-the-ceo" || selectedProduct.checkoutUrl}
                    <a
                      href={selectedProduct.checkoutUrl ||
                        "https://cash.app/$cptnbrando"}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/30 cursor-pointer text-center"
                    >
                      🟢 PAY & CHALLENGE VIA CASH APP ($cptnbrando)
                    </a>
                    {#if dSale?.campaignId}
                      <button
                        onclick={() => openSaleCampaign(dSale.campaignId)}
                        class="w-full mt-2.5 py-2.5 bg-gradient-to-r from-yellow-500/20 to-emerald-500/20 hover:from-yellow-500/35 hover:to-emerald-500/35 border border-yellow-500/50 text-yellow-300 font-black rounded-xl text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-center"
                      >
                        {dSale.campaignLabel ?? "🌿 SEE THE SALE DAY CAMPAIGN"}
                      </button>
                    {/if}
                  {:else}
                    <button
                      class="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/30 cursor-pointer"
                      onclick={() =>
                        window.open("https://cash.app/$cptnbrando", "_blank")}
                    >
                      <ShoppingCart size={18} /> ADD TO CART
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <!-- FUNDRAISING MODE -->
        <div
          class="w-full col-start-1 row-start-1"
          transition:fade={{ duration: 200 }}
        >
          {#if !selectedCampaign}
            <!-- CAMPAIGNS CATALOG -->
            <div class="max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in">
              <!-- Active Campaigns Section -->
              <div>
                <h2
                  class="text-sm font-bold text-white tracking-widest uppercase mb-4 border-b border-zinc-850 pb-2"
                >
                  ⚡ ACTIVE CAMPAIGNS
                </h2>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {#each campaigns.filter((c) => c.status === "active") as campaign}
                    {@const raisedVal = parseFloat(
                      campaign.raised.replace(/[^0-9.]/g, ""),
                    )}
                    {@const goalVal = parseFloat(
                      campaign.goal.replace(/[^0-9.]/g, ""),
                    )}
                    {@const progressVal = Math.min(
                      100,
                      Math.round((raisedVal / goalVal) * 100),
                    )}
                    {@const cardSale = isSaleNow(campaign, now)}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                      class="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 group"
                      onclick={() => selectCampaign(campaign)}
                    >
                      <div>
                        <div
                          class="aspect-video w-full rounded-lg overflow-hidden bg-black/40 border border-zinc-800/60 mb-3 relative"
                        >
                          <img
                            src={campaign.images[0]}
                            alt={campaign.title}
                            class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                          />
                          {#if cardSale}
                            <span
                              class="absolute top-2 left-2 px-1.5 py-0.5 bg-yellow-400 text-black font-bold font-mono text-[9px] tracking-widest uppercase rounded z-10"
                              >🤑 SALE</span
                            >
                          {:else}
                            <span
                              class="absolute top-2 left-2 px-1.5 py-0.5 bg-emerald-600 text-white font-bold font-mono text-[9px] tracking-widest uppercase rounded z-10"
                              >ACTIVE</span
                            >
                          {/if}

                          {#if cardSale}
                            {@const saleW = saleWindowOf(campaign)}
                            {@const saleT = getCountdown(saleW?.end, now)}
                            {#if saleT}
                              <div
                                class="absolute top-2.5 right-2.5 px-2 py-1 bg-yellow-400/95 border border-yellow-200 text-black font-mono rounded-md shadow-lg shadow-yellow-900/60 backdrop-blur-md flex items-center gap-1.5 z-10 animate-pulse"
                              >
                                <span class="text-[10px] sm:text-xs">💰</span>
                                <span
                                  class="font-extrabold text-[10px] sm:text-xs tracking-wider uppercase"
                                  >SALE DAY SALE DAY</span
                                >
                                <span
                                  class="hidden md:inline text-[10px] font-bold border-l border-black/30 pl-1.5"
                                >
                                  {String(saleT.hours).padStart(2, "0")}h {String(
                                    saleT.minutes,
                                  ).padStart(2, "0")}m {String(
                                    saleT.seconds,
                                  ).padStart(2, "0")}s LEFT
                                </span>
                              </div>
                            {/if}
                          {:else if campaign.endDate}
                            {@const deadline = getActiveDeadline(campaign, now)}
                            {@const timer = getCountdown(deadline?.target, now)}
                            {#if timer}
                              <div
                                class="absolute top-2.5 right-2.5 px-2 py-1 bg-red-950/85 border border-red-500/80 text-white font-mono rounded-md shadow-lg shadow-red-950/70 backdrop-blur-md flex items-center gap-1.5 z-10 animate-pulse"
                              >
                                <span class="text-[10px] sm:text-xs">⏳</span>
                                <span
                                  class="font-extrabold text-[10px] sm:text-xs tracking-wider uppercase text-red-100"
                                  >{timer.formattedDaysLeft}</span
                                >
                                <span
                                  class="hidden md:inline text-[10px] text-zinc-300 font-semibold border-l border-red-500/40 pl-1.5"
                                >
                                  {String(timer.days).padStart(2, "0")}d {String(
                                    timer.hours,
                                  ).padStart(2, "0")}h {String(
                                    timer.minutes,
                                  ).padStart(2, "0")}m {String(
                                    timer.seconds,
                                  ).padStart(2, "0")}s
                                </span>
                              </div>
                            {/if}
                          {/if}
                        </div>
                        <h3
                          class="font-bold text-sm text-zinc-100 group-hover:text-white uppercase transition-colors"
                        >
                          {campaign.title}
                        </h3>
                        <p class="text-xs text-zinc-500 line-clamp-2 mt-1.5">
                          {campaign.description}
                        </p>
                      </div>

                      {#if campaign.id !== "save-texas-hemp"}
                        <div class="mt-4 pt-3 border-t border-zinc-800/40">
                          <div
                            class="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1.5"
                          >
                            <span>
                              {#if campaign.id === "sidewalk-chalk-defense" || campaign.id === "browser-age-api"}
                                Signatures: {progressVal}%
                              {:else}
                                Progress: {progressVal}%
                              {/if}
                            </span>
                            <span class="text-red-500 font-bold">
                              {#if campaign.id === "sidewalk-chalk-defense" || campaign.id === "browser-age-api"}
                                {campaign.raised.replace("$", "")} / {campaign.goal.replace(
                                  "$",
                                  "",
                                )}
                              {:else}
                                {campaign.raised} / {campaign.goal}
                              {/if}
                            </span>
                          </div>
                          <div
                            class="w-full h-1.5 bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden"
                          >
                            <div
                              class="h-full bg-red-500"
                              style="width: {progressVal}%"
                            ></div>
                          </div>
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Completed Campaigns Section -->
              {#if campaigns.some((c) => c.status === "completed")}
                <div>
                  <h2
                    class="text-sm font-bold text-zinc-500 tracking-widest uppercase mb-4 border-b border-zinc-850 pb-2"
                  >
                    ✓ COMPLETED CAMPAIGNS
                  </h2>
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-opacity duration-200"
                  >
                    {#each campaigns.filter((c) => c.status === "completed") as campaign}
                      <!-- svelte-ignore a11y_click_events_have_key_events -->
                      <!-- svelte-ignore a11y_no_static_element_interactions -->
                      <div
                        class="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 group"
                        onclick={() => selectCampaign(campaign)}
                      >
                        <div>
                          <div
                            class="aspect-video w-full rounded-lg overflow-hidden bg-black/45 border border-zinc-900 mb-3 relative grayscale"
                          >
                            <img
                              src={campaign.images[0]}
                              alt={campaign.title}
                              class="w-full h-full object-cover"
                            />
                            <span
                              class="absolute top-2 left-2 px-1.5 py-0.5 bg-orange-600 text-white font-bold font-mono text-[9px] tracking-widest uppercase rounded"
                              >COMPLETED</span
                            >
                          </div>
                          <h3
                            class="font-bold text-sm text-zinc-400 group-hover:text-white uppercase transition-colors"
                          >
                            {campaign.title}
                          </h3>
                          <p class="text-xs text-zinc-650 line-clamp-2 mt-1.5">
                            {campaign.description}
                          </p>
                        </div>

                        <div class="mt-4 pt-3 border-t border-zinc-900">
                          <div
                            class="flex justify-between items-center text-[10px] font-mono text-zinc-500"
                          >
                            <span>Funded: 100%+</span>
                            <span class="text-emerald-500 font-bold"
                              >{campaign.raised} raised</span
                            >
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            {@const raisedNum = parseFloat(
              selectedCampaign.raised.replace(/[^0-9.]/g, ""),
            )}
            {@const goalNum = parseFloat(
              selectedCampaign.goal.replace(/[^0-9.]/g, ""),
            )}
            {@const progressPct = Math.min(
              100,
              Math.round((raisedNum / goalNum) * 100),
            )}
            <!-- STEAM-STYLE CAMPAIGN VIEW -->
            <div
              class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start animate-fade-in campaign-grid"
            >
              <!-- Left Side: Media Carousel (Col 7) -->
              <div
                class="sm:col-span-7 flex flex-col gap-3 sm:gap-4 min-w-0 min-h-0 sm:sticky sm:top-4 md:top-6 lg:top-8 campaign-media-col"
              >
                <!-- Big Image Showcase -->
                <!-- The map needs more vertical room than a 16:9 photo does.
                     Both are capped against the viewport so the carousel and
                     its thumbnail strip always fit on screen without scrolling. -->
                <div
                  class="relative w-full bg-black/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg group touch-pan-y campaign-media-box {currentMediaItem?.type ===
                  'map'
                    ? 'aspect-[4/3]'
                    : 'aspect-video'}"
                  style={mediaMaxPx
                    ? `max-height: ${currentMediaItem?.type === "map" ? mediaMaxPx : Math.min(mediaMaxPx, 460)}px`
                    : undefined}
                  ontouchstart={handleTouchStart}
                  ontouchend={handleTouchEnd}
                  role="region"
                  aria-label="Campaign Media Showcase"
                >
                  {#key activeImageIdx}
                    {#if currentMediaItem}
                      {#if currentMediaItem.type === "map"}
                        <!-- Expanding in place rather than mounting a second
                             copy keeps the map's zoom, pan and open rep card. -->
                        <div
                          class={isMapFullscreen
                            ? "fixed inset-0 z-[99999] bg-black overflow-hidden p-2 sm:p-4 max-h-[100dvh]"
                            : "absolute inset-0"}
                          in:fade={{ duration: 200 }}
                        >
                          <TexasLawmakerMap
                            {lawmakers}
                            selectedEmails={selectedReps}
                            focusRequest={mapFocusRequest}
                            title={`${lawmakers.length} 🐘🫏`}
                            saleMode={saleActive}
                            {copMode}
                            bind:initialStatsTab
                            campaignId={selectedCampaign.id}
                            isFullscreen={isMapFullscreen}
                            onToggleFullscreen={() =>
                              (isMapFullscreen = !isMapFullscreen)}
                          />
                        </div>
                      {:else if currentMediaItem.type === "video"}
                        {#if isVideoPlaying}
                          {#if currentMediaItem.url.includes("youtube.com") || currentMediaItem.url.includes("youtu.be")}
                            <iframe
                              in:slideIn={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              out:slideOut={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              src={currentMediaItem.url +
                                (currentMediaItem.url.includes("?")
                                  ? "&autoplay=1"
                                  : "?autoplay=1")}
                              title="Fundraiser video player"
                              class="absolute inset-0 w-full h-full"
                              style="border: none;"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerpolicy="strict-origin-when-cross-origin"
                              allowfullscreen
                            ></iframe>
                          {:else}
                            <video
                              in:slideIn={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              out:slideOut={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              src={currentMediaItem.url}
                              class="absolute inset-0 w-full h-full object-cover"
                              controls
                              autoplay
                              muted
                              loop
                              playsinline
                            ></video>
                          {/if}
                        {:else}
                          <!-- svelte-ignore a11y_click_events_have_key_events -->
                          <!-- svelte-ignore a11y_no_static_element_interactions -->
                          <div
                            class="absolute inset-0 w-full h-full cursor-pointer overflow-hidden flex items-center justify-center bg-black/80"
                            onclick={() => (isVideoPlaying = true)}
                          >
                            <img
                              src={currentMediaItem.thumbnail ||
                                (selectedCampaign.images &&
                                  selectedCampaign.images[0])}
                              alt=""
                              class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-125 pointer-events-none"
                            />
                            <img
                              in:slideIn={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              out:slideOut={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              src={currentMediaItem.thumbnail ||
                                (selectedCampaign.images &&
                                  selectedCampaign.images[0])}
                              alt={selectedCampaign.title}
                              class="relative w-full h-full object-contain z-10 p-0.5"
                            />
                            <div
                              class="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/45 transition-colors duration-200"
                            >
                              <div
                                class="w-16 h-16 rounded-full bg-black/70 hover:bg-red-600 border border-white/10 flex items-center justify-center transition-all duration-300 shadow-2xl scale-95 hover:scale-105"
                              >
                                <span
                                  class="text-white text-2xl ml-1 select-none"
                                  >▶</span
                                >
                              </div>
                            </div>
                          </div>
                        {/if}
                      {:else}
                        <button
                          type="button"
                          aria-label="Expand image fullscreen"
                          class="absolute inset-0 w-full h-full flex items-center justify-center bg-black/80 overflow-hidden cursor-zoom-in group/img border-none p-0 appearance-none bg-transparent"
                          onclick={() => (isImageFullscreen = true)}
                        >
                          <img
                            src={currentMediaItem.url}
                            alt=""
                            class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-125 pointer-events-none"
                          />
                          <img
                            in:slideIn={{
                              duration: 300,
                              direction: scrollDirection,
                            }}
                            out:slideOut={{
                              duration: 300,
                              direction: scrollDirection,
                            }}
                            src={currentMediaItem.url}
                            alt={selectedCampaign.title}
                            class="relative w-full h-full object-contain z-10 p-0.5"
                          />
                          <div
                            class="absolute bottom-2.5 right-2.5 px-2 py-1 bg-black/75 border border-zinc-700/80 rounded-md text-white text-[10px] font-mono font-bold flex items-center gap-1.5 opacity-80 group-hover/img:opacity-100 transition-opacity z-20 pointer-events-none shadow-md backdrop-blur-sm"
                          >
                            <Maximize2 size={12} class="text-zinc-300" />
                            <span
                              class="hidden sm:inline uppercase tracking-wider text-[9px]"
                              >Tap to expand</span
                            >
                          </div>
                        </button>
                      {/if}
                    {/if}
                  {/key}

                  <!-- Inline chevrons — on every slide EXCEPT the map, where
                       they sat on top of the lawmaker popup and swallowed
                       taps meant for it. On the map slide the thumbnail strip
                       still changes slides, as before. -->
                  {#if campaignMedia.length > 1 && currentMediaItem?.type !== "map"}
                    <button
                      class="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/65 hover:bg-black/90 border border-zinc-700/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl opacity-70 hover:opacity-100 active:scale-95"
                      onclick={(e) => {
                        e.stopPropagation();
                        scrollDirection = -1;
                        activeImageIdx =
                          (activeImageIdx - 1 + campaignMedia.length) %
                          campaignMedia.length;
                      }}
                      aria-label="Previous slide"
                    >
                      <span class="text-sm font-bold select-none">◀</span>
                    </button>
                    <button
                      class="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/65 hover:bg-black/90 border border-zinc-700/80 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl opacity-70 hover:opacity-100 active:scale-95"
                      onclick={(e) => {
                        e.stopPropagation();
                        scrollDirection = 1;
                        activeImageIdx =
                          (activeImageIdx + 1) % campaignMedia.length;
                      }}
                      aria-label="Next slide"
                    >
                      <span class="text-sm font-bold select-none">▶</span>
                    </button>
                  {/if}

                  <!-- Position ribbon: dots replaced by a serrated strip along
                       the bottom edge — one skewed segment per slide, filled
                       up to the current position, so it reads like a border
                       that charges and drains as you page back and forth. -->
                  <div
                    class="carousel-ribbon"
                    class:sale-ribbon={saleActive}
                    class:cop-ribbon={copMode}
                    aria-hidden="true"
                  >
                    {#each campaignMedia as _, idx}
                      <span
                        class="ribbon-seg"
                        class:filled={idx <= activeImageIdx}
                      ></span>
                    {/each}
                  </div>
                </div>

                <!-- Thumbnails row -->
                <div class="flex gap-3 overflow-x-auto pb-1 campaign-thumbs">
                  {#each campaignMedia as mediaItem, idx}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                    <div
                      role="button"
                      tabindex="0"
                      onclick={() => {
                        scrollDirection = idx > activeImageIdx ? 1 : -1;
                        activeImageIdx = idx;
                      }}
                      class="relative w-20 aspect-video rounded-lg border overflow-hidden cursor-pointer hover:border-zinc-400 transition-all duration-200 bg-zinc-950 shrink-0"
                      class:border-red-500={activeImageIdx === idx}
                      class:border-zinc-800={activeImageIdx !== idx}
                    >
                      {#if mediaItem.type === "map"}
                        <div
                          class="w-full h-full flex flex-col items-center justify-center gap-0.5 bg-gradient-to-br transition-colors duration-1000 {saleActive
                            ? 'from-yellow-900 via-emerald-950 to-black'
                            : 'from-emerald-950 to-black'}"
                        >
                          <span class="text-base leading-none select-none"
                            >{saleActive ? "💰" : "🗺️"}</span
                          >
                          <span
                            class="text-[7px] font-mono font-bold tracking-widest transition-colors duration-1000 {saleActive
                              ? 'text-yellow-300'
                              : 'text-emerald-400'}"
                            >{saleActive ? "SALE" : "MAP"}</span
                          >
                        </div>
                      {:else if mediaItem.type === "video"}
                        <img
                          src={mediaItem.thumbnail || mediaItem.url}
                          alt="Video Thumbnail"
                          class="w-full h-full object-cover opacity-80"
                        />
                        <div
                          class="absolute inset-0 flex items-center justify-center bg-black/40"
                        >
                          <span class="text-white text-xs select-none">▶</span>
                        </div>
                      {:else}
                        <img
                          src={mediaItem.url}
                          alt=""
                          class="absolute inset-0 w-full h-full object-cover blur-md opacity-30 pointer-events-none"
                        />
                        <img
                          src={mediaItem.url}
                          alt="Thumbnail"
                          class="relative w-full h-full object-contain z-10 p-0.5"
                        />
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Right Side: Details & Milestone Progression (Col 5) -->
              <div
                class="sm:col-span-5 flex flex-col justify-between bg-zinc-900/20 border border-zinc-800/60 p-4 sm:p-5 lg:p-6 rounded-2xl detail-panel"
                class:sale-panel={saleActive}
                class:cop-panel={copMode}
              >
                <div>
                  <div
                    class="flex justify-between items-start gap-3 border-b border-zinc-850 pb-4"
                  >
                    <div>
                      {#if saleActive}
                        <span
                          class="px-2 py-0.5 bg-yellow-400/15 border border-yellow-400/50 text-yellow-300 font-bold font-mono text-[9px] tracking-widest uppercase rounded"
                        >
                          🔥 SALE ON — ALL GOODS MUST GO
                        </span>
                      {:else if selectedCampaign.status === "active"}
                        <span
                          class="px-2 py-0.5 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono text-[9px] tracking-widest uppercase rounded"
                        >
                          ACTIVE
                        </span>
                      {:else}
                        <span
                          class="px-2 py-0.5 bg-orange-600/10 border border-orange-500/30 text-orange-400 font-bold font-mono text-[9px] tracking-widest uppercase rounded"
                        >
                          COMPLETED
                        </span>
                      {/if}
                      <h1
                        class="text-xl sm:text-2xl font-extrabold tracking-wider mt-2 uppercase"
                        class:sale-title={saleActive}
                      >
                        {saleActive
                          ? "💰 SALE DAY SALE DAY 💰"
                          : selectedCampaign.title}
                      </h1>
                    </div>
                    <button
                      onclick={(e) =>
                        handleShare("campaign", selectedCampaign.id, e)}
                      class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer mt-2 shrink-0"
                      title="Copy Share Link"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>

                  {#if selectedCampaign.endDate && !isMapFullscreen}
                    {@const deadline = getActiveDeadline(selectedCampaign, now)}
                    {@const timer = getCountdown(deadline?.target, now)}
                    {@const saleTimer =
                      saleActive && saleWindow
                        ? getCountdown(saleWindow.end, now)
                        : null}
                    <!-- The clock's pulsing/blurred layers composite above the
                         fullscreen map overlay, so it isn't just covered — it
                         has to actually unmount while the map owns the screen. -->
                    {#if saleTimer}
                      <!-- SALE DAY takeover: the same clock, wound back to
                           midnight and re-lit in bargain-bin gold. Reverts on
                           its own at midnight into August 1st. -->
                      <div
                        class="mt-3 p-2.5 sm:p-3 rounded-xl border flex flex-col gap-2 shadow-lg shrink-0 sale-widget"
                      >
                        <!-- Row 0: the barker's marquee -->
                        <div class="sale-marquee" aria-hidden="true">
                          <span>{SALE_MARQUEE}</span><span>{SALE_MARQUEE}</span>
                        </div>

                        <!-- Row 1: what this countdown now is -->
                        <div class="flex items-center gap-2 min-w-0">
                          <span class="text-sm sm:text-base sale-coin shrink-0"
                            >💰</span
                          >
                          <div class="flex flex-col min-w-0 flex-1">
                            <span
                              class="text-[9px] font-mono uppercase tracking-widest text-black/80 font-extrabold leading-tight"
                            >
                              SALE DAY SALE DAY — BIG BARGAINS
                            </span>
                            <span
                              class="text-xs sm:text-sm font-black text-black uppercase tracking-wider leading-tight"
                            >
                              {#if saleTimer.isZero}
                                SALE'S OVER — SHELVES ARE BARE!
                              {:else}
                                ALL GOODS MUST GO BY MIDNIGHT!
                              {/if}
                            </span>
                          </div>
                        </div>

                        <!-- Row 2: the clock, wound back and counting to close -->
                        <div class="sale-clock-stage">
                          <div
                            class="flex items-center justify-center gap-1 font-mono text-xs font-bold text-yellow-300 bg-black/90 px-2.5 py-1 rounded-lg border border-yellow-400/60 w-full shrink-0 shadow-inner"
                            class:clock-wind={clockWinding}
                          >
                            <!-- Total hours, not hours-of-day: a forced
                                 preview can sit more than 24h out and the
                                 clock must never lie about time left. -->
                            <span
                              >{String(
                                saleTimer.days * 24 + saleTimer.hours,
                              ).padStart(2, "0")}h</span
                            >
                            <span
                              class="text-emerald-400 font-extrabold text-[10px] animate-pulse"
                              >:</span
                            >
                            <span
                              >{String(saleTimer.minutes).padStart(2, "0")}m</span
                            >
                            <span
                              class="text-emerald-400 font-extrabold text-[10px] animate-pulse"
                              >:</span
                            >
                            <span class="text-yellow-200 font-black animate-pulse"
                              >{String(saleTimer.seconds).padStart(2, "0")}s</span
                            >
                            <span
                              class="text-[9px] text-emerald-300 font-extrabold tracking-widest pl-1.5 border-l border-yellow-500/40"
                              >TIL CLOSE</span
                            >
                          </div>
                        </div>

                        <!-- Row 3: straight to the action, same as always -->
                        {#if selectedCampaign.contactReps}
                          <button
                            onclick={jumpToEmailActions}
                            class="jump-to-email w-full py-2 px-3 bg-black hover:bg-zinc-900 text-yellow-300 font-black rounded-lg text-[10px] sm:text-[11px] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-950/40 active:scale-95"
                          >
                            💸 JUMP TO EMAIL <span class="jump-arrow">↓</span>
                          </button>
                        {/if}
                      </div>
                    {:else if timer}
                      <!-- Two-stage clock: red for the July 31st shelf pull,
                           amber once it lapses and the November 12th federal
                           deadline takes over. Always three stacked rows —
                           deadline, clock, jump button — never side by side. -->
                      {@const fin = deadline.final}
                      <div
                        class="mt-3 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r {fin
                          ? 'from-amber-950/80 via-zinc-900/90 to-amber-950/80 border-amber-500/50 shadow-amber-950/30'
                          : 'from-red-950/80 via-zinc-900/90 to-red-950/80 border-red-500/50 shadow-red-950/30'} border flex flex-col gap-2 shadow-lg shrink-0"
                      >
                        <!-- Row 1: which deadline this is -->
                        <div class="flex items-center gap-2 min-w-0">
                          <span
                            class="text-sm sm:text-base animate-pulse shrink-0"
                            >{fin ? "🚨" : "⏳"}</span
                          >
                          <div class="flex flex-col min-w-0 flex-1">
                            <span
                              class="text-[9px] font-mono uppercase tracking-widest {fin
                                ? 'text-amber-400'
                                : 'text-red-400'} font-extrabold leading-tight"
                            >
                              {deadline.label || "BAN DECISION DEADLINE"}
                            </span>
                            <span
                              class="text-xs sm:text-sm font-black text-white uppercase tracking-wider leading-tight"
                            >
                              {#if fin}
                                {#if timer.isZero}
                                  FEDERAL DEADLINE IS HERE — 0 DAYS LEFT!
                                {:else}
                                  FINAL COUNTDOWN: {timer.formattedDaysLeft} FOR
                                  DELTA-9!
                                {/if}
                              {:else if timer.isZero}
                                DECISION DAY IS HERE — 0 DAYS LEFT!
                              {:else}
                                ONLY {timer.formattedDaysLeft}!
                              {/if}
                            </span>
                          </div>
                        </div>

                        <!-- Row 2: the ticking digital clock -->
                        <div
                          class="flex items-center justify-center gap-1 font-mono text-xs font-bold text-white bg-black/85 px-2.5 py-1 rounded-lg border {fin
                            ? 'border-amber-500/40'
                            : 'border-red-500/40'} w-full shrink-0 shadow-inner"
                          class:clock-wind={clockWinding}
                        >
                          <span class="text-white"
                            >{String(timer.days).padStart(2, "0")}d</span
                          >
                          <span
                            class="{fin
                              ? 'text-amber-500'
                              : 'text-red-500'} font-extrabold text-[10px] animate-pulse"
                            >:</span
                          >
                          <span class="text-white"
                            >{String(timer.hours).padStart(2, "0")}h</span
                          >
                          <span
                            class="{fin
                              ? 'text-amber-500'
                              : 'text-red-500'} font-extrabold text-[10px] animate-pulse"
                            >:</span
                          >
                          <span class="text-white"
                            >{String(timer.minutes).padStart(2, "0")}m</span
                          >
                          <span
                            class="{fin
                              ? 'text-amber-500'
                              : 'text-red-500'} font-extrabold text-[10px] animate-pulse"
                            >:</span
                          >
                          <span
                            class="{fin
                              ? 'text-amber-400'
                              : 'text-red-400'} font-black animate-pulse"
                            >{String(timer.seconds).padStart(2, "0")}s</span
                          >
                        </div>

                        <!-- Row 3: straight to the action from the top of the page -->
                        {#if selectedCampaign.contactReps}
                          <button
                            onclick={jumpToEmailActions}
                            class="jump-to-email w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-lg text-[10px] sm:text-[11px] tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40 active:scale-95"
                          >
                            💌 JUMP TO EMAIL <span class="jump-arrow">↓</span>
                          </button>
                        {/if}
                      </div>
                    {/if}
                  {/if}

                  {#if selectedCampaign.id === "justice-for-rusty"}
                    <!-- Full scroll bio, no max-height scrollbar constraint -->
                    <div
                      class="mt-3 sm:mt-4 pb-4 flex flex-col gap-4 selectable-bio"
                    >
                      {#if campaignBioText}
                        {#each formatBioText(campaignBioText) as paragraph}
                          <p
                            class="text-zinc-400 text-sm leading-relaxed font-sans"
                          >
                            {@html paragraph}
                          </p>
                        {/each}
                      {:else}
                        <p
                          class="text-zinc-400 text-sm leading-relaxed font-sans"
                        >
                          {selectedCampaign.description}
                        </p>
                      {/if}
                    </div>

                    <hr class="border-zinc-850 my-2" />

                    <!-- Donation & Social Link Buttons -->
                    {#if selectedCampaign.goFundMeUrl}
                      <div class="mb-3 mt-3">
                        <a
                          href={selectedCampaign.goFundMeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-900/20 cursor-pointer text-center"
                        >
                          🧡 SECURE DONATE VIA GOFUNDME
                        </a>
                      </div>
                    {/if}

                    {#if selectedCampaign.venmoUrl}
                      <div class="mb-3">
                        <a
                          href={selectedCampaign.venmoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-[#008CFF] hover:bg-[#0074D9] text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-900/20 cursor-pointer text-center"
                        >
                          💙 SECURE DONATE VIA VENMO (@{selectedCampaign.venmoUrl.substring(
                            selectedCampaign.venmoUrl.lastIndexOf("/") + 1,
                          )})
                        </a>
                      </div>
                    {/if}

                    {#if selectedCampaign.cashAppUrl}
                      <div class="mb-3">
                        <a
                          href={selectedCampaign.cashAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/25 cursor-pointer text-center"
                        >
                          🟢 SECURE DONATE VIA CASH APP ({selectedCampaign.cashAppUrl.substring(
                            selectedCampaign.cashAppUrl.lastIndexOf("/") + 1,
                          )})
                        </a>
                      </div>
                    {/if}

                    {#if selectedCampaign.petitionUrl}
                      <div class="mb-3">
                        <a
                          href={selectedCampaign.petitionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-[#EC2C22] hover:bg-[#D61E15] text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/20 cursor-pointer text-center"
                        >
                          ✍️ SIGN THE CHANGE.ORG PETITION
                        </a>
                      </div>
                    {/if}

                    {#if selectedCampaign.instagramUrl}
                      <div class="mb-4">
                        <a
                          href={selectedCampaign.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-95 text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-pink-900/20 cursor-pointer text-center"
                        >
                          📸 FOLLOW ON INSTAGRAM (@{selectedCampaign.instagramUrl
                            .replace(/\/$/, "")
                            .substring(
                              selectedCampaign.instagramUrl
                                .replace(/\/$/, "")
                                .lastIndexOf("/") + 1,
                            )})
                        </a>
                      </div>
                    {/if}
                  {:else}
                    <!-- Legacy/Standard layout for other campaigns with milestones/progress -->
                    <!-- Full bio, no max-height constraint: the panel scrolls, the text never compacts -->
                    {#key bioPhase}
                      <!-- Where the pitch turns from gold hype into cop-light
                           warning: everything from warnIdx down is act two. -->
                      <div
                        class="mt-3 sm:mt-4 pb-4 flex flex-col gap-4 selectable-bio"
                        class:critical-bio={isCriticalCampaign}
                        class:sale-bio={saleActive}
                        in:fade={{ duration: 600 }}
                      >
                        <!-- Falls back to the inline description, still in full -->
                        {#each bioParas as paragraph, pIdx}
                          {@const inWarn = warnIdx >= 0 && pIdx >= warnIdx}
                          {@const boxOrder = warnBoxOrder[pIdx] ?? -1}
                          <p
                            use:warnWatch={inWarn}
                            class="text-zinc-400 text-sm leading-relaxed font-sans"
                            class:bio-lede={isCriticalCampaign &&
                              !saleActive &&
                              pIdx === 0}
                            class:sale-lede={saleActive && pIdx === 0}
                            class:warn-banner={inWarn && pIdx === warnIdx}
                            class:warn-para={boxOrder >= 0}
                            class:warn-red={boxOrder >= 0 && boxOrder % 2 === 0}
                            class:warn-blue={boxOrder >= 0 &&
                              boxOrder % 2 === 1}
                          >
                            <!-- Only the boxed penalty paragraphs carry inline
                                 highlights; the rest of the article reads
                                 plain, so the boxes actually land. -->
                            {@html isCriticalCampaign
                              ? saleActive
                                ? boxOrder >= 0
                                  ? emphasizeWarning(paragraph)
                                  : paragraph
                                : emphasizeCritical(paragraph)
                              : paragraph}
                          </p>
                        {/each}
                      </div>
                    {/key}

                    <hr class="border-zinc-850 my-2" />

                    <div class="milestones-section mt-3 sm:mt-4">
                      {#if selectedCampaign.id !== "save-texas-hemp"}
                        <div
                          class="flex justify-between items-center mb-2 font-bold font-mono text-xs"
                        >
                          <span class="text-zinc-500 uppercase tracking-widest">
                            {#if selectedCampaign.id === "sidewalk-chalk-defense" || selectedCampaign.id === "browser-age-api"}
                              PETITION SIGNATURES
                            {:else}
                              FUNDING PERCENTAGE
                            {/if}
                          </span>
                          <span class="text-red-500 text-sm">
                            {#if selectedCampaign.id === "sidewalk-chalk-defense" || selectedCampaign.id === "browser-age-api"}
                              {selectedCampaign.raised.replace("$", "")} / {selectedCampaign.goal.replace(
                                "$",
                                "",
                              )} Signatures ({progressPct}%)
                            {:else}
                              {selectedCampaign.raised} / {selectedCampaign.goal}
                              ({progressPct}%)
                            {/if}
                          </span>
                        </div>

                        <div
                          class="w-full h-3 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden relative mb-4"
                        >
                          <div
                            class="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                            style="width: {progressPct}%"
                          ></div>
                        </div>
                      {/if}

                      <!-- Representative Contact Tool (if available) -->
                      {#if selectedCampaign.contactReps}
                        <div
                          bind:this={emailActionEl}
                          class="mb-4 flex flex-col gap-2.5 rounded-xl transition-all duration-500"
                          class:email-flash={emailActionFlash}
                        >
                          <!-- BLAST 'EM / SEND MAIL Primary Action Button -->
                          {#if !showSortMailPanel}
                            <!-- Untouched, this sends to the standardised
                                 default group — a fixed list that fits in one
                                 mailto — so the button is valid before anyone
                                 opens the sorter. The subtitle spells out
                                 exactly who is about to be mailed. -->
                            {@const blastList =
                              selectedReps.length > 0
                                ? selectedReps
                                : defaultReps}
                            <button
                              onclick={() =>
                                handleBlastEm(activeContactReps)}
                              class="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-black rounded-xl text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 flex flex-col items-center justify-center gap-0.5 shadow-xl shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
                            >
                              <span class="flex items-center gap-1.5">
                                💌 SEND PETITION EMAIL ({blastList.length})
                              </span>
                              <span
                                class="text-[10px] font-mono text-zinc-950/80 font-semibold normal-case tracking-normal px-2"
                              >
                                {blastList === defaultReps
                                  ? DEFAULT_GROUP_LABEL
                                  : `${blastList.length} selected recipients`}
                              </span>
                            </button>
                          {:else}
                            <button
                              onclick={() =>
                                handleEmailSelected(activeContactReps)}
                              disabled={selectedReps.length === 0}
                              class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-black rounded-xl text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 flex flex-col items-center justify-center gap-0.5 shadow-xl shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span class="flex items-center gap-1.5">
                                💌
                                {#if selectedCampaign.id === "browser-age-api"}
                                  SEND PETITION ({selectedReps.length})
                                {:else}
                                  SEND MAIL ({selectedReps.length})
                                {/if}
                              </span>
                              <span
                                class="text-[10px] font-mono text-zinc-950/80 font-semibold normal-case tracking-normal truncate max-w-full px-2"
                              >
                                {selectedReps.length > 0
                                  ? selectedReps.join(", ")
                                  : "No emails selected"}
                              </span>
                            </button>
                          {/if}

                          <!-- Secondary Tool Buttons -->
                          <div class="flex gap-2">
                            <button
                              onclick={toggleSortMailPanel}
                              class="flex-1 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-emerald-400 hover:text-emerald-300 font-bold rounded-xl text-[11px] tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                            >
                              {#if selectedCampaign.id === "browser-age-api"}
                                📬 SELECT RECIPIENTS {showSortMailPanel
                                  ? "▲"
                                  : "▼"}
                              {:else}
                                📬 SORT THE MAIL{showSortMailPanel
                                  ? "▲"
                                  : "▼"}
                              {/if}
                            </button>
                            <button
                              onclick={() => handleCopyRepsEmails(selectedReps)}
                              disabled={selectedReps.length === 0}
                              class="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl text-[11px] tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Copy selected email addresses"
                            >
                              📋 COPY
                            </button>
                          </div>

                          <!-- SORT THE MAIL Interactive Selection Dropdown Panel -->
                          {#if showSortMailPanel}
                            <div
                              transition:fade={{ duration: 150 }}
                              class="p-3.5 bg-zinc-950/95 border border-zinc-800 rounded-xl flex flex-col gap-3 shadow-2xl animate-fade-in"
                            >
                              <!-- Geolocation & Region Selector -->
                              <div
                                class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-850"
                              >
                                <button
                                  onclick={() =>
                                    handleUseLocation(campaignRecipients)}
                                  disabled={isLocating}
                                  class="py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  📍 {isLocating
                                    ? "LOCATING..."
                                    : "USE LOCATION (AUTO-SELECT CLOSEST)"}
                                </button>

                                <div
                                  class="flex items-center gap-2 text-[10px] font-mono text-zinc-400 self-end sm:self-auto"
                                >
                                  <button
                                    onclick={() =>
                                      handleSelectAllReps(campaignRecipients)}
                                    class="text-emerald-400 hover:underline cursor-pointer"
                                  >
                                    Select All
                                  </button>
                                  <span>•</span>
                                  <button
                                    onclick={handleDeselectAllReps}
                                    class="text-zinc-500 hover:text-zinc-300 hover:underline cursor-pointer"
                                  >
                                    Deselect All
                                  </button>
                                </div>
                              </div>

                              <!-- Sort by where they actually stand. Each
                                   button replaces the selection outright, so
                                   what the send button says is always what the
                                   send button does. -->
                              {#if hasStanceData}
                                <div
                                  class="flex flex-col gap-2 pb-2.5 border-b border-zinc-850"
                                >
                                  <div
                                    class="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider"
                                  >
                                    SORT BY WHERE THEY STAND ON WEED
                                  </div>

                                  <div
                                    class="grid grid-cols-1 sm:grid-cols-3 gap-2"
                                  >
                                    {#each STANCE_GROUPS as g (g.id)}
                                      {@const groupEmails =
                                        stanceBuckets[g.id] ?? []}
                                      <button
                                        onclick={() =>
                                          handleSelectStanceGroup(g)}
                                        disabled={groupEmails.length === 0}
                                        title={g.blurb}
                                        class="py-2 px-2.5 border rounded-lg font-mono text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed {g.btn}"
                                      >
                                        <span class="leading-tight"
                                          >{g.label}</span
                                        >
                                        <span
                                          class="text-[9px] font-black {g.count}"
                                          >{groupEmails.length} OFFICES · {g.range}</span
                                        >
                                      </button>
                                    {/each}
                                  </div>

                                  <!-- The captain and his officers: the ban's
                                       actual architects, one broadside. -->
                                  {#if warTargets.length > 0}
                                    <button
                                      onclick={handleTargetCaptain}
                                      title="Select Lt. Gov. Patrick and the ban's architects"
                                      class="w-full py-2.5 px-3 bg-gradient-to-r from-red-950/70 via-zinc-950 to-blue-950/70 hover:from-red-900/70 hover:to-blue-900/70 border border-red-500/50 hover:border-red-400 text-white rounded-lg font-mono text-[10px] font-black transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer shadow-lg"
                                    >
                                      <span class="leading-tight tracking-widest"
                                        >🏴‍☠️ TALK TO THE ARCHITECTS</span
                                      >
                                      <span
                                        class="text-[9px] font-bold text-red-200/80 normal-case tracking-normal"
                                        >Lt. Gov. Patrick, Sen. Perry &amp; Rep.
                                        Shaheen — the ban's architects ({warTargets.length})</span
                                      >
                                    </button>
                                  {/if}

                                  <div class="grid grid-cols-2 gap-2">
                                    <button
                                      onclick={() =>
                                        openBatchSheet(
                                          campaignRecipients,
                                          activeContactReps,
                                          "all",
                                        )}
                                      disabled={campaignRecipients.length === 0}
                                      title="Reach every office on the roster, in mail-client-sized batches"
                                      class="py-2 px-2.5 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 rounded-lg font-mono text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      <span class="leading-tight"
                                        >📣 REACH ALL {campaignRecipients.length}</span
                                      >
                                      <span
                                        class="text-[9px] font-black text-purple-300"
                                        >IN BATCHES OF {MAIL_BATCH_SIZE}</span
                                      >
                                    </button>
                                    <button
                                      onclick={openRandomSheet}
                                      disabled={persuadableReps.length === 0}
                                      title="One persuadable office at random — score 2 to 4"
                                      class="py-2 px-2.5 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/40 text-sky-200 rounded-lg font-mono text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      <span class="leading-tight"
                                        >🎲 RANDOM REP</span
                                      >
                                      <span
                                        class="text-[9px] font-black text-sky-300"
                                        >PERSUADABLE · SCORE 2–4</span
                                      >
                                    </button>
                                  </div>

                                  <button
                                    onclick={() =>
                                      handleSelectAllReps(defaultReps)}
                                    class="text-[10px] font-mono text-zinc-500 hover:text-emerald-400 underline decoration-zinc-700 transition-colors cursor-pointer self-start"
                                  >
                                    ↺ Reset to the default group ({defaultReps.length}
                                    — {DEFAULT_GROUP_LABEL})
                                  </button>
                                </div>
                              {/if}

                              {#if locationStatusText}
                                <div
                                  class="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-500/20"
                                >
                                  {locationStatusText}
                                </div>
                              {/if}

                              <!-- Checked Counter & List -->
                              <div
                                class="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex justify-between items-center"
                              >
                                <span>SELECT SPECIFIC REPRESENTATIVES:</span>
                                <span class="text-emerald-400"
                                  >{selectedReps.length} / {campaignRecipients.length}
                                  Selected</span
                                >
                              </div>

                              <div
                                class="max-h-44 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 pr-1"
                              >
                                {#each campaignRecipients as email, rIdx}
                                  {@const meta = getRepInfo(email)}
                                  {@const isChecked =
                                    selectedReps.includes(email)}
                                  {@const isPriority = meta.priority === 1}
                                  {#if isPriority && rIdx === 0}
                                    <div
                                      class="text-[9px] font-mono font-bold tracking-widest text-amber-400/90 uppercase pt-0.5"
                                    >
                                      ★ Priority offices
                                    </div>
                                  {:else if meta.chamber === "house" && getRepInfo(campaignRecipients[rIdx - 1])?.chamber !== "house"}
                                    <div
                                      class="text-[9px] font-mono font-bold tracking-widest text-zinc-600 uppercase pt-1.5"
                                    >
                                      🏛 Texas House — find your district rep
                                    </div>
                                  {:else if !isPriority && getRepInfo(campaignRecipients[rIdx - 1])?.priority === 1}
                                    <div
                                      class="text-[9px] font-mono font-bold tracking-widest text-zinc-600 uppercase pt-1.5"
                                    >
                                      Senate, statewide &amp; federal
                                    </div>
                                  {/if}
                                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                                  <div
                                    onclick={() => handleToggleRep(email)}
                                    class="flex items-center gap-2.5 p-2 rounded-lg border transition-all cursor-pointer select-none text-[11px] {isChecked
                                      ? 'bg-emerald-950/30 border-emerald-500/40 text-zinc-100'
                                      : 'bg-zinc-900/40 border-zinc-850 text-zinc-400'} {isPriority
                                      ? 'ring-1 ring-amber-500/30'
                                      : ''}"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onchange={() => handleToggleRep(email)}
                                      class="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                                    />
                                    <!-- Three stacked rows: name, then the areas
                                         they serve, then how to reach them. The
                                         name and region used to share one row
                                         and collided on a phone. -->
                                    <div
                                      class="flex-1 min-w-0 flex flex-col gap-0.5"
                                    >
                                      <div
                                        class="font-bold flex items-center gap-1.5 leading-tight"
                                      >
                                        {#if isPriority}
                                          <span class="text-amber-400 shrink-0"
                                            >★</span
                                          >
                                        {/if}
                                        {#if meta.party}
                                          <span
                                            class="shrink-0 px-1 rounded text-[9px] font-black leading-tight {meta.party ===
                                            'R'
                                              ? 'bg-red-600 text-white'
                                              : meta.party === 'D'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-zinc-500 text-black'}"
                                            title={meta.party === "R"
                                              ? "Republican"
                                              : meta.party === "D"
                                                ? "Democrat"
                                                : meta.party}>{meta.party}</span
                                          >
                                        {/if}
                                        <span class="min-w-0 break-words"
                                          >{meta.name}</span
                                        >
                                      </div>

                                      {#if meta.region || meta.counties}
                                        <div
                                          class="text-[10px] font-mono text-zinc-400 leading-snug break-words"
                                        >
                                          {meta.region || meta.counties}
                                        </div>
                                      {/if}

                                      <div
                                        class="text-[10px] font-mono text-zinc-500 leading-snug flex flex-col gap-0.5"
                                      >
                                        <span class="break-all">{email}</span>
                                        {#if meta.phone}
                                          <a
                                            href="tel:{meta.phone.replace(
                                              /[^\d+]/g,
                                              '',
                                            )}"
                                            onclick={(e) => e.stopPropagation()}
                                            class="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-500/40 w-fit"
                                            >☎ {meta.phone}</a
                                          >
                                        {/if}
                                      </div>
                                    </div>
                                  </div>
                                {/each}
                              </div>

                              <!-- Action for Selected -->
                              <div
                                class="pt-2 border-t border-zinc-850 flex gap-2"
                              >
                                <button
                                  onclick={() =>
                                    handleEmailSelected(activeContactReps)}
                                  disabled={selectedReps.length === 0}
                                  class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-lg text-xs tracking-wider transition-all duration-200 flex flex-col items-center justify-center gap-0.5 shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span
                                    >📩 EMAIL SELECTED REPS ({selectedReps.length})</span
                                  >
                                  {#if selectedReps.length > MAIL_BATCH_SIZE}
                                    <span
                                      class="text-[9px] font-mono font-semibold normal-case tracking-normal text-zinc-950/80"
                                      >too many for one email — opens the batch
                                      sender</span
                                    >
                                  {/if}
                                </button>
                                <button
                                  onclick={() =>
                                    handleCopyRepsEmails(selectedReps)}
                                  disabled={selectedReps.length === 0}
                                  class="px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-lg text-[11px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  📋 COPY
                                </button>
                              </div>
                            </div>
                          {/if}
                        </div>
                      {/if}

                      <!-- REPRESENTATION NOTICE — you are about to email offices
                           that almost certainly don't cover your address. Say so
                           plainly, and say why it doesn't much matter. -->
                      {#if isCriticalCampaign}
                        <div
                          class="mb-4 p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-300 font-mono text-xs flex flex-col gap-2.5 shadow-lg"
                        >
                          <div
                            class="flex items-center gap-2 font-bold text-amber-400"
                          >
                            <span class="text-base">⚠️</span> ON WRITING OFFICES
                            OUTSIDE YOUR DISTRICT
                          </div>
                          <div
                            class="text-[11px] text-amber-200/80 leading-relaxed font-sans flex flex-col gap-2"
                          >
                            <p>
                              There are 184 elephants and donkeys in a bucket, the facts are
                              that none of them represent any people or any land
                              whatsoever. In 2026, they represent their
                              re-election, and whoever hands them enough money
                              for their family's vacation to the Bahamas. A
                              market value of half the alcohol industry, yet
                              representation of less than 30% proves this; due to
                              tradition, and systems designed by men 300 years
                              ago, it is impossible for the voice of the people
                              to be represented adequately. All we can do is
                              bark, and pray.
                            </p>
                            <p>
                              DOGS LLC takes no responsibility for who you choose
                              to talk to based on this webpage, it is difficult
                              for one person to represent 31.7 million Texans let
                              alone the 172,336 people this current system
                              demands they represent (31,709,821 people
                              divided by 184 representatives), but frankly, I pay
                              enough taxes in this country for those hired to
                              lead us to realize this dogshit system ain't working
                              right. And millions in a silent majority are left to
                              constantly face new obstacles, new hardships, new
                              pain directly because of their representatives not
                              representing all 172k they are supposed to
                              represent.
                            </p>
                            <p class="font-bold text-amber-300">
                              Do what you want to do. Bark. Bark as loud as
                              possible. Always.
                            </p>
                          </div>
                        </div>
                      {:else if selectedCampaign.donationsStatus === "coming_soon"}
                        <div
                          class="mb-4 p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-300 font-mono text-xs flex flex-col gap-1.5 shadow-lg"
                        >
                          <div
                            class="flex items-center gap-2 font-bold text-amber-400"
                          >
                            <span class="text-base">💳</span> DONATIONS CURRENTLY
                            INACTIVE
                          </div>
                          <p
                            class="text-[11px] text-amber-200/80 leading-relaxed font-sans"
                          >
                            Stripe payment gateway integration is currently
                            being configured for this campaign. Direct financial
                            contributions are not active yet. In the meantime,
                            please use the button above to email Texas lawmakers
                            directly!
                          </p>
                        </div>
                      {/if}

                      <!-- GoFundMe Link button (if exists) -->
                      {#if selectedCampaign.goFundMeUrl}
                        <div class="mb-3">
                          <a
                            href={selectedCampaign.goFundMeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-900/20 cursor-pointer text-center"
                          >
                            🧡 SECURE DONATE VIA GOFUNDME
                          </a>
                        </div>
                      {/if}

                      {#if selectedCampaign.venmoUrl}
                        <div class="mb-3">
                          <a
                            href={selectedCampaign.venmoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-[#008CFF] hover:bg-[#0074D9] text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-900/20 cursor-pointer text-center"
                          >
                            💙 SECURE DONATE VIA VENMO (@{selectedCampaign.venmoUrl.substring(
                              selectedCampaign.venmoUrl.lastIndexOf("/") + 1,
                            )})
                          </a>
                        </div>
                      {/if}

                      <!-- Cash App Link button -->
                      {#if selectedCampaign.cashAppUrl}
                        <div class="mb-3">
                          <a
                            href={selectedCampaign.cashAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/25 cursor-pointer text-center"
                          >
                            🟢 SECURE DONATE VIA CASH APP ({selectedCampaign.cashAppUrl.substring(
                              selectedCampaign.cashAppUrl.lastIndexOf("/") + 1,
                            )})
                          </a>
                        </div>
                      {/if}

                      {#if selectedCampaign.petitionUrl}
                        <div class="mb-3">
                          <a
                            href={selectedCampaign.petitionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-[#EC2C22] hover:bg-[#D61E15] text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/20 cursor-pointer text-center"
                          >
                            ✍️ SIGN THE CHANGE.ORG PETITION
                          </a>
                        </div>
                      {/if}

                      {#if selectedCampaign.instagramUrl}
                        <div class="mb-4">
                          <a
                            href={selectedCampaign.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-95 text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-pink-900/20 cursor-pointer text-center"
                          >
                            📸 FOLLOW ON INSTAGRAM (@{selectedCampaign.instagramUrl
                              .replace(/\/$/, "")
                              .substring(
                                selectedCampaign.instagramUrl
                                  .replace(/\/$/, "")
                                  .lastIndexOf("/") + 1,
                              )})
                          </a>
                        </div>
                      {/if}

                      <div class="mt-2 flex flex-col gap-2">
                        <span
                          class="text-[9px] text-zinc-500 tracking-widest uppercase font-bold"
                          >MILESTONE TARGETS</span
                        >
                        <div class="flex flex-col gap-2 pb-4">
                          {#each selectedCampaign.milestones as milestone}
                            {@const isAchieved =
                              progressPct >= milestone.percentage}
                            <div
                              class="flex items-center gap-3 bg-zinc-950/40 border border-zinc-850 p-2.5 rounded-xl"
                            >
                              <div
                                class="w-5 h-5 rounded border flex items-center justify-center font-bold font-mono text-[9px] transition-colors"
                                class:bg-emerald-500={isAchieved}
                                class:border-emerald-400={isAchieved}
                                class:text-black={isAchieved}
                                class:border-zinc-800={!isAchieved}
                                class:text-zinc-600={!isAchieved}
                              >
                                {#if isAchieved}✓{:else}-{/if}
                              </div>
                              <div class="flex-grow">
                                <div
                                  class="text-[11px] font-bold"
                                  class:text-white={isAchieved}
                                  class:text-zinc-400={!isAchieved}
                                >
                                  {milestone.label}
                                </div>
                                <div class="text-[9px] text-zinc-500 font-mono">
                                  Target: {milestone.percentage}%
                                </div>
                              </div>
                            </div>
                          {/each}
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- SALE DAY FIREWORKS — money launched from the bottom of the screen the
         moment the countdown hits zero. Pure decoration, swallows no clicks. -->
    {#if saleCelebrating}
      <div
        class="fixed inset-0 z-[99998] pointer-events-none overflow-hidden"
        transition:fade={{ duration: 400 }}
        aria-hidden="true"
      >
        {#each saleBurst as p (p.id)}
          <span
            class="sale-firework"
            style="left: {p.left}%; animation-delay: {p.delay}s; animation-duration: {p.duration}s; font-size: {p.size}px; --drift: {p.drift}px; --spin: {p.spin}deg;"
            >{p.emoji}</span
          >
        {/each}
      </div>
    {/if}

    <!-- CART DRAWER -->
    {#if isCartOpen}
      <!-- Backdrop -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onclick={() => (isCartOpen = false)}
      ></div>

      <!-- Drawer Content -->
      <div
        transition:fly={{ x: 500, duration: 300 }}
        class="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-zinc-950/95 border-l border-zinc-800 z-50 flex flex-col justify-between shadow-2xl"
      >
        <!-- Header -->
        <div
          class="flex justify-between items-center p-4 border-b border-zinc-900 bg-zinc-900/20"
        >
          <span class="text-sm font-bold flex items-center gap-2">
            <ShoppingCart size={16} /> SHOPPING CART
          </span>
          <button
            class="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            onclick={() => (isCartOpen = false)}
          >
            <X size={18} />
          </button>
        </div>

        <!-- Body / Items List -->
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {#if cart.length === 0}
            <div
              class="flex flex-col items-center justify-center h-full text-zinc-600 gap-2"
            >
              <ShoppingCart size={48} class="opacity-30" />
              <span class="text-xs font-bold uppercase tracking-widest"
                >Your cart is empty</span
              >
            </div>
          {:else}
            {#each cart as item, index}
              <div
                class="flex items-center gap-4 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80"
              >
                <!-- Mini thumbnail -->
                <div
                  class="w-12 h-12 bg-black/20 rounded border border-zinc-800 flex items-center justify-center text-zinc-600"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="w-6 h-6 fill-none stroke-current"
                    stroke-width="1.5"
                  >
                    <path
                      d="M4 8.5V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5M4 8.5L8 5m-4 3.5l-2-1.5L4 4m16 4.5l-4-3.5m4 3.5l2-1.5L20 4M8 5a4 4 0 0 1 8 0"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h4
                    class="text-xs font-bold text-zinc-200 truncate uppercase"
                  >
                    {item.title}
                  </h4>
                  <div class="text-[10px] text-zinc-500 mt-0.5">
                    SIZE: {item.size} •
                    <span class="text-red-400 font-semibold">{item.price}</span>
                  </div>

                  <!-- Qty Controls -->
                  <div class="flex items-center gap-2 mt-2">
                    <button
                      class="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      onclick={() => updateQuantity(index, -1)}
                    >
                      <Minus size={10} />
                    </button>
                    <span class="text-xs font-mono font-bold w-4 text-center"
                      >{item.quantity}</span
                    >
                    <button
                      class="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      onclick={() => updateQuantity(index, 1)}
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                <!-- Delete -->
                <button
                  class="text-zinc-600 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                  onclick={() => removeFromCart(index)}
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            {/each}
          {/if}
        </div>

        <!-- Footer -->
        {#if cart.length > 0}
          <div
            class="p-4 border-t border-zinc-900 bg-zinc-900/20 flex flex-col gap-4"
          >
            <div class="flex justify-between items-center text-sm font-bold">
              <span class="text-zinc-500">TOTAL:</span>
              <span class="text-red-500 text-base">{totalPrice()}</span>
            </div>
            <button
              class="w-full py-3 bg-green-600 hover:bg-green-500 text-black font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              onclick={handleCheckout}
            >
              <Check size={14} /> SECURE CHECKOUT
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- TOAST NOTIFICATION -->
    {#if showCopiedAlert}
      <div
        transition:fade={{ duration: 150 }}
        class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-red-500 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-2xl border border-red-500/40 z-50 flex items-center gap-2"
      >
        <span>✓ SHARE LINK COPIED</span>
      </div>
    {/if}

    {#if showEmailCopiedAlert}
      <div
        transition:fade={{ duration: 150 }}
        class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-emerald-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 z-50 flex items-center gap-2"
      >
        <span>✓ LAWMAKER EMAILS COPIED</span>
      </div>
    {/if}

    <!-- BATCH SENDER — a mailto can't carry the whole roster, so hand it over
         forty at a time. Every batch can be opened in the mail client or
         copied into whatever the sender actually uses. -->
    {#if showBatchSheet}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        transition:fade={{ duration: 140 }}
        class="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onclick={() => (showBatchSheet = false)}
      >
        <div
          transition:scale={{ duration: 180, start: 0.95 }}
          class="w-full max-w-lg max-h-[88dvh] flex flex-col bg-zinc-950 border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden"
          onclick={(e) => e.stopPropagation()}
          role="dialog"
          tabindex="-1"
          aria-modal="true"
          aria-label="Send to every representative in batches"
        >
          <!-- Header / the compliment -->
          <div
            class="p-4 sm:p-5 bg-gradient-to-br from-purple-950/70 to-zinc-950 border-b border-purple-500/25 flex flex-col gap-2"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex flex-col gap-1 min-w-0">
                <span
                  class="text-[10px] font-mono font-black tracking-widest text-purple-400 uppercase"
                >
                  {batchKind === "all"
                    ? "🏆 Going for the whole roster"
                    : "📬 More recipients than one email can hold"}
                </span>
                <h3
                  class="text-base sm:text-lg font-black text-white leading-tight"
                >
                  {batchKind === "all"
                    ? `Reaching all ${batchEmails.length} Texas offices`
                    : `Sending to ${batchEmails.length} offices`}
                </h3>
              </div>
              <button
                onclick={() => (showBatchSheet = false)}
                class="shrink-0 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close batch sender"
              >
                <X size={15} />
              </button>
            </div>
            <p class="text-[11px] sm:text-xs text-purple-100/80 leading-relaxed">
              {#if batchKind === "all"}
                Almost nobody does this. You're about to put the same letter in
                front of every single office on the roster — the ones who agree
                with you, the ones still deciding, and the ones writing the ban.
                That is exactly how a bill dies.
              {:else}
                That's a big list, and it's more than a single email can carry.
                Here it is, split into pieces your mail client will accept.
              {/if}
            </p>
            <p
              class="text-[10px] font-mono text-zinc-400 leading-relaxed border-l-2 border-purple-500/40 pl-2"
            >
              Mail clients cap how long a single link can be, so this is split
              into {batches.length} batches of up to {MAIL_BATCH_SIZE}. Open each
              one in your mail app, or copy the addresses and paste them in
              yourself. Send them one at a time — your mail client will only
              handle one hand-off at a time.
            </p>
          </div>

          <!-- Progress -->
          <div class="px-4 sm:px-5 py-2.5 border-b border-zinc-900 shrink-0">
            <div
              class="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5"
            >
              <span class="text-zinc-500">Batches handled</span>
              <span class="text-purple-300"
                >{batchesDone.length} / {batches.length}</span
              >
            </div>
            <div
              class="w-full h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-300"
                style="width: {batches.length
                  ? (batchesDone.length / batches.length) * 100
                  : 0}%"
              ></div>
            </div>
          </div>

          <!-- Batch list -->
          <div
            class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 flex flex-col gap-2"
          >
            {#each batches as batch, i}
              {@const from = i * MAIL_BATCH_SIZE + 1}
              {@const to = i * MAIL_BATCH_SIZE + batch.length}
              {@const done = batchesDone.includes(i)}
              <div
                class="p-2.5 rounded-xl border flex items-center gap-2.5 transition-all {done
                  ? 'bg-emerald-950/25 border-emerald-500/40'
                  : 'bg-zinc-900/50 border-zinc-800'}"
              >
                <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                  <span
                    class="text-[11px] font-black tracking-wide {done
                      ? 'text-emerald-300'
                      : 'text-zinc-200'}"
                  >
                    {done ? "✓" : "○"} BATCH {i + 1} — recipients {from}–{to}
                  </span>
                  <span
                    class="text-[9px] font-mono text-zinc-500 truncate"
                    title={batch.join(", ")}
                  >
                    {batch[0]}{batch.length > 1 ? ` … +${batch.length - 1}` : ""}
                  </span>
                </div>
                <button
                  onclick={() => handleOpenBatch(i)}
                  class="shrink-0 px-2.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-lg text-[10px] tracking-wider transition-all cursor-pointer"
                  title="Open this batch in your mail client"
                >
                  💌 MAIL
                </button>
                <button
                  onclick={() => handleCopyBatch(i)}
                  class="shrink-0 px-2.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold rounded-lg text-[10px] tracking-wider transition-all cursor-pointer"
                  title="Copy this batch's addresses"
                >
                  📋 COPY
                </button>
              </div>
            {/each}
          </div>

          <!-- Footer -->
          <div
            class="p-3.5 sm:p-4 border-t border-zinc-900 bg-zinc-900/25 flex flex-col gap-2 shrink-0"
          >
            {#if batches.length > 0 && batchesDone.length === batches.length}
              <div
                class="text-[11px] font-bold text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-2.5 text-center"
              >
                🎉 That's all {batchEmails.length} of them. Every office on this
                roster has your letter.
              </div>
            {/if}
            <div class="flex gap-2">
              <button
                onclick={() => handleCopyRepsEmails(batchEmails)}
                class="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold rounded-lg text-[11px] tracking-wider transition-all cursor-pointer"
              >
                📋 COPY ALL {batchEmails.length} ADDRESSES
              </button>
              <button
                onclick={() => (showBatchSheet = false)}
                class="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white font-bold rounded-lg text-[11px] tracking-wider transition-all cursor-pointer"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- RANDOM REP — one persuadable office, their score, and what they've
         actually said about weed. -->
    {#if showRandomSheet && randomRep}
      {@const score = stanceScore(randomRep)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        transition:fade={{ duration: 140 }}
        class="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        onclick={() => (showRandomSheet = false)}
      >
        <div
          transition:scale={{ duration: 180, start: 0.95 }}
          class="w-full max-w-md max-h-[88dvh] flex flex-col bg-zinc-950 border border-sky-500/40 rounded-2xl shadow-2xl overflow-hidden"
          onclick={(e) => e.stopPropagation()}
          role="dialog"
          tabindex="-1"
          aria-modal="true"
          aria-label="A random persuadable representative"
        >
          <div
            class="p-4 sm:p-5 bg-gradient-to-br from-sky-950/70 to-zinc-950 border-b border-sky-500/25 flex items-start justify-between gap-3 shrink-0"
          >
            <div class="flex flex-col gap-1 min-w-0">
              <span
                class="text-[10px] font-mono font-black tracking-widest text-sky-400 uppercase"
              >
                🎲 One persuadable office, at random
              </span>
              <h3 class="text-base sm:text-lg font-black text-white leading-tight">
                {randomRep.name}
              </h3>
              <span class="text-[11px] font-mono text-sky-200/70 leading-snug">
                {randomRep.title || randomRep.position}
              </span>
            </div>
            <button
              onclick={() => (showRandomSheet = false)}
              class="shrink-0 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          <div
            class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 flex flex-col gap-3"
          >
            <!-- Score -->
            <div
              class="p-3 rounded-xl border flex items-center gap-3 {score >= 4
                ? 'bg-red-950/25 border-red-500/40'
                : score === 3
                  ? 'bg-amber-950/25 border-amber-500/40'
                  : 'bg-emerald-950/25 border-emerald-500/40'}"
            >
              <span
                class="text-2xl font-black shrink-0 {score >= 4
                  ? 'text-red-400'
                  : score === 3
                    ? 'text-amber-400'
                    : 'text-emerald-400'}">{score}<span class="text-sm">/5</span
                ></span
              >
              <div class="flex flex-col gap-1 min-w-0">
                <span
                  class="text-[11px] font-black uppercase tracking-wider {score >=
                  4
                    ? 'text-red-300'
                    : score === 3
                      ? 'text-amber-300'
                      : 'text-emerald-300'}">{STANCE_LABELS[score]}</span
                >
                <span class="flex gap-1" aria-hidden="true">
                  {#each [1, 2, 3, 4, 5] as step}
                    <span
                      class="w-5 h-1.5 rounded-full {score >= step
                        ? score >= 4
                          ? 'bg-red-500'
                          : score === 3
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        : 'bg-zinc-800'}"
                    ></span>
                  {/each}
                </span>
                <span class="text-[9px] font-mono text-zinc-500"
                  >1 = supports legal hemp · 5 = driving the ban</span
                >
              </div>
            </div>

            <!-- Who they are -->
            <div class="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
              {#if randomRep.party}
                <span
                  class="px-1.5 py-0.5 rounded font-black {randomRep.party === 'R'
                    ? 'bg-red-600 text-white'
                    : randomRep.party === 'D'
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-500 text-black'}">{randomRep.party}</span
                >
              {/if}
              {#if randomRep.position}
                <span class="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300"
                  >{randomRep.position}</span
                >
              {/if}
              {#if randomRep.hometown || randomRep.region}
                <span class="text-zinc-400"
                  >📍 {randomRep.hometown || randomRep.region}</span
                >
              {/if}
              {#if randomRep.phone}
                <a
                  href="tel:{randomRep.phone.replace(/[^\d+]/g, '')}"
                  class="text-emerald-400 hover:text-emerald-300 underline decoration-emerald-500/40"
                  >☎ {randomRep.phone}</a
                >
              {/if}
            </div>

            {#if randomRep.counties}
              <div class="text-[11px] text-zinc-400 leading-relaxed">
                <span
                  class="text-[9px] font-mono font-black tracking-widest text-zinc-600 uppercase block mb-0.5"
                  >Represents</span
                >
                {randomRep.counties}
              </div>
            {/if}

            <!-- How they actually feel about weed -->
            {#if randomRep.record}
              <div
                class="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed"
              >
                <span
                  class="text-[9px] font-mono font-black tracking-widest text-amber-400/90 uppercase block mb-1"
                  >Where they stand on weed</span
                >
                {randomRep.record}
              </div>
            {/if}

            <div class="text-[10px] font-mono text-zinc-500 break-all">
              {randomRep.email}
            </div>
          </div>

          <div
            class="p-3.5 sm:p-4 border-t border-zinc-900 bg-zinc-900/25 flex flex-col gap-2 shrink-0"
          >
            <button
              onclick={() => handleMailRandomRep(activeContactReps)}
              class="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-black rounded-xl text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              💌 EMAIL {randomRep.shortName || randomRep.name}
            </button>
            <div class="flex gap-2">
              <button
                onclick={rollRandomRep}
                class="flex-1 py-2.5 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/40 text-sky-200 font-bold rounded-lg text-[11px] tracking-wider transition-all cursor-pointer"
              >
                🎲 ANOTHER ONE
              </button>
              <button
                onclick={handleAddRandomRep}
                disabled={selectedReps.includes(randomRep.email)}
                class="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold rounded-lg text-[11px] tracking-wider transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selectedReps.includes(randomRep.email)
                  ? "✓ ON YOUR LIST"
                  : "+ ADD TO LIST"}
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- FULLSCREEN IMAGE LIGHTBOX OVERLAY -->
    {#if isImageFullscreen && currentMediaItem}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6"
        transition:fade={{ duration: 110 }}
        onclick={() => (isImageFullscreen = false)}
      >
        <!-- Top Control Bar -->
        <div
          class="w-full flex justify-between items-center z-10 max-w-7xl mx-auto px-2"
        >
          <div
            class="text-zinc-300 font-mono text-xs sm:text-sm font-semibold truncate max-w-[70%]"
          >
            {selectedCampaign?.title} ({activeImageIdx + 1} / {campaignMedia.length})
          </div>
          <button
            onclick={(e) => {
              e.stopPropagation();
              isImageFullscreen = false;
            }}
            class="w-10 h-10 rounded-full bg-zinc-900/90 border border-zinc-700 hover:bg-zinc-800 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
            aria-label="Close Fullscreen"
          >
            <X size={20} />
          </button>
        </div>

        <!-- Main Image Container. No stopPropagation here: a click anywhere in
             it should collapse the image, and the chevrons below already stop
             their own events so paging doesn't close the lightbox. -->
        <div
          class="relative flex-1 w-full max-w-7xl flex items-center justify-center my-2 overflow-hidden select-none"
        >
          <!-- Click the image again to collapse it: same gesture that opened
               it, so the carousel toggles instead of hunting for the X.
               Esc and the backdrop both still close it. -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <img
            src={currentMediaItem.url}
            alt={selectedCampaign?.title}
            class="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl cursor-zoom-out"
            transition:scale={{ duration: 130, start: 0.97 }}
            onclick={() => (isImageFullscreen = false)}
          />

          <!-- Navigation Chevrons in Fullscreen -->
          {#if campaignMedia.length > 1}
            <button
              class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black border border-zinc-700 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95 z-20"
              onclick={(e) => {
                e.stopPropagation();
                scrollDirection = -1;
                activeImageIdx =
                  (activeImageIdx - 1 + campaignMedia.length) %
                  campaignMedia.length;
              }}
              aria-label="Previous Image"
            >
              <span class="text-lg sm:text-xl font-bold">◀</span>
            </button>
            <button
              class="absolute right-2 sm:left-auto sm:right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black border border-zinc-700 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-110 active:scale-95 z-20"
              onclick={(e) => {
                e.stopPropagation();
                scrollDirection = 1;
                activeImageIdx = (activeImageIdx + 1) % campaignMedia.length;
              }}
              aria-label="Next Image"
            >
              <span class="text-lg sm:text-xl font-bold">▶</span>
            </button>
          {/if}
        </div>

        <!-- Footer Hint -->
        <div
          class="text-zinc-500 font-mono text-[10px] sm:text-xs tracking-wider uppercase z-10 text-center"
        >
          Tap anywhere outside or press ESC to exit
        </div>
      </div>
    {/if}
  </div>
</BasePanel>

<style>
  /* Custom styles that can't be easily done in tailwind */
  .caution-tape {
    background: repeating-linear-gradient(
      -45deg,
      #eab308,
      #eab308 10px,
      #000000 10px,
      #000000 20px
    );
  }

  .active-size {
    background-color: #f4f4f5 !important; /* zinc-100 */
    color: #09090b !important; /* zinc-950 */
    border-color: #f4f4f5 !important;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .selectable-bio {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }
  .selectable-bio p {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }
  .selectable-bio :global(a) {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }

  /* ---------------------------------------------------------------- */
  /* Critical campaign bio — emphasis                                  */
  /* ---------------------------------------------------------------- */

  /* The bio text is deliberately static. It used to fade and lift each
     paragraph in on scroll, which fought with reading a long argument; the
     panel's own intro transition still plays. */

  /* Opening paragraph carries the argument — give it weight. */
  .bio-lede {
    font-size: 0.95rem !important;
    line-height: 1.65 !important;
    color: #e4e4e7 !important;
    font-weight: 500;
    border-left: 3px solid #10b981;
    padding-left: 0.85rem;
    background: linear-gradient(
      90deg,
      rgba(16, 185, 129, 0.09),
      transparent 65%
    );
    border-radius: 0 8px 8px 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  /* Nothing here may push past the panel edge on a narrow phone. */
  .critical-bio {
    min-width: 0;
    max-width: 100%;
  }

  .critical-bio p {
    overflow-wrap: anywhere;
    word-break: break-word;
    hyphens: auto;
    max-width: 100%;
  }

  .critical-bio :global(b.crit),
  .critical-bio :global(span.crit) {
    font-weight: 800;
    padding: 0 0.18em;
    border-radius: 3px;
    white-space: normal;
    overflow-wrap: anywhere;
  }

  /* Short figures only — keep "$5.5 billion" from splitting across lines. */
  .critical-bio :global(b.em-money),
  .critical-bio :global(b.em-stat) {
    white-space: nowrap;
  }

  /* Dollars — the market this ban erases. */
  .critical-bio :global(b.em-money) {
    color: #34d399;
    background: rgba(16, 185, 129, 0.13);
    box-shadow: inset 0 -0.42em 0 rgba(16, 185, 129, 0.16);
  }

  /* Hard numbers — deaths, licensees, percentages. */
  .critical-bio :global(b.em-stat) {
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.12);
    box-shadow: inset 0 -0.42em 0 rgba(251, 191, 36, 0.14);
  }

  /* Deadlines — the whole point of the campaign. Light enough to actually read. */
  .critical-bio :global(b.em-deadline) {
    color: #fee2e2;
    background: rgba(239, 68, 68, 0.28);
    border-bottom: 1.5px solid rgba(248, 113, 113, 0.8);
    animation: critPulse 2.6s ease-in-out infinite;
  }

  /* The headline fact: what actually happens on Friday. */
  .critical-bio :global(b.em-alarm) {
    display: inline;
    color: #fff;
    font-weight: 900;
    font-size: 1.06em;
    letter-spacing: 0.01em;
    background: linear-gradient(
      90deg,
      rgba(239, 68, 68, 0.42),
      rgba(239, 68, 68, 0.24)
    );
    border-bottom: 2px solid #f87171;
    border-radius: 4px;
    padding: 0.1em 0.28em;
    white-space: normal;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    animation: alarmGlow 3s ease-in-out infinite;
  }

  /* What the ban actually costs. */
  .critical-bio :global(b.em-harm) {
    display: inline;
    color: #fef3c7;
    font-weight: 800;
    background: linear-gradient(
      180deg,
      transparent 12%,
      rgba(245, 158, 11, 0.24) 12%
    );
    border-bottom: 1.5px solid rgba(245, 158, 11, 0.75);
    border-radius: 3px;
    padding: 0.06em 0.2em;
    white-space: normal;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  /* Procedural detail — present, but out of the way. */
  .critical-bio :global(span.em-muted) {
    color: rgba(113, 113, 122, 0.9);
    font-weight: 400;
    font-size: 0.94em;
  }

  .image-panel {
    padding: 15px;
  }

  @keyframes alarmGlow {
    0%,
    100% {
      box-shadow: 0 0 0 rgba(239, 68, 68, 0);
    }
    50% {
      box-shadow: 0 0 16px rgba(239, 68, 68, 0.4);
    }
  }

  /* Load-bearing phrases. */
  .critical-bio :global(b.em-key) {
    color: #f4f4f5;
    background: linear-gradient(
      180deg,
      transparent 58%,
      rgba(244, 244, 245, 0.18) 58%
    );
    white-space: normal;
  }

  @keyframes critPulse {
    0%,
    100% {
      background-color: rgba(239, 68, 68, 0.16);
      border-bottom-color: rgba(239, 68, 68, 0.55);
    }
    50% {
      background-color: rgba(239, 68, 68, 0.3);
      border-bottom-color: rgba(239, 68, 68, 0.95);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Jump-to-email affordance                                          */
  /* ---------------------------------------------------------------- */

  .jump-arrow {
    display: inline-block;
    animation: jumpBob 1.4s ease-in-out infinite;
  }

  @keyframes jumpBob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(3px);
    }
  }

  .email-flash {
    box-shadow:
      0 0 0 2px rgba(16, 185, 129, 0.85),
      0 0 26px rgba(16, 185, 129, 0.45);
    animation: emailFlash 2.2s ease-out;
  }

  @keyframes emailFlash {
    0% {
      box-shadow:
        0 0 0 3px rgba(16, 185, 129, 1),
        0 0 34px rgba(16, 185, 129, 0.7);
    }
    100% {
      box-shadow:
        0 0 0 0 rgba(16, 185, 129, 0),
        0 0 0 rgba(16, 185, 129, 0);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Carousel position ribbon — the serrated strip under the border     */
  /* ---------------------------------------------------------------- */

  .carousel-ribbon {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 0;
    height: 4px;
    display: flex;
    gap: 4px;
    z-index: 20;
    pointer-events: none;
  }

  /* Each slide is one skewed tooth; skew is the serration. */
  .ribbon-seg {
    flex: 1;
    transform: skewX(-24deg);
    border-radius: 1px;
    background: rgba(255, 255, 255, 0.16);
    transition:
      background-color 0.35s ease,
      box-shadow 0.35s ease;
  }

  .ribbon-seg.filled {
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.75);
  }

  .sale-ribbon .ribbon-seg.filled {
    background: #fbbf24;
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.75);
  }

  /* Cop mode: filled teeth alternate red and blue. */
  .cop-ribbon .ribbon-seg.filled:nth-child(odd) {
    background: #ef4444;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.75);
  }

  .cop-ribbon .ribbon-seg.filled:nth-child(even) {
    background: #3b82f6;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.75);
  }

  /* ---------------------------------------------------------------- */
  /* Mobile landscape — the two-column campaign view, made to FIT       */
  /* ---------------------------------------------------------------- */

  /* A phone on its side hits the sm: breakpoint by width and gets the
     desktop two-column layout with nowhere near desktop height — the
     aspect-ratio carousel blows straight past the bottom of the screen.
     Keep the two columns, but change the sizing rules: the media column
     fills the height it actually has (no aspect ratio, compact thumbs)
     and the details column scrolls internally. Everything fits, nothing
     is cut off, and the workspace itself never scrolls. */
  @media (orientation: landscape) and (max-height: 520px) and (min-width: 640px) {
    /* Every vertical pixel of chrome is a pixel the content doesn't get:
       the header collapses to a razor-thin strip. */
    .store-header {
      height: 22px !important;
      padding-left: 8px;
      padding-right: 8px;
    }

    .store-header :global(button) {
      font-size: 10px;
      line-height: 1;
      padding-top: 0;
      padding-bottom: 0;
    }

    .store-header :global(svg) {
      width: 12px;
      height: 12px;
    }

    .campaign-open {
      overflow: hidden;
      padding: 8px 10px;
    }

    .campaign-grid {
      height: 100%;
      min-height: 0;
      grid-template-columns: 13fr 11fr;
      gap: 10px;
      align-items: stretch;
      overflow: hidden;
    }

    .campaign-media-col {
      position: static !important; /* sticky is for a scrolling page */
      grid-column: 1 !important; /* col-span-7 would spawn implicit columns */
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    /* Height is decided by the column now, not by the image ratio. */
    .campaign-media-box {
      aspect-ratio: auto !important;
      flex: 1 1 auto;
      min-height: 0;
      max-height: none !important; /* beats the measured inline cap */
    }

    .campaign-thumbs {
      flex-shrink: 0;
      gap: 6px;
      padding-bottom: 2px;
    }

    .campaign-thumbs > :global(div) {
      width: 3.25rem !important;
    }

    .campaign-grid > .detail-panel {
      grid-column: 2 !important;
      height: 100%;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 10px 12px;
    }
  }

  /* ---------------------------------------------------------------- */
  /* SALE DAY — July 31st takeover                                      */
  /* ---------------------------------------------------------------- */

  /* Everything that changes colour for the sale tweens there and back,
     so the whole panel visibly morphs instead of jump-cutting. */
  .store-workspace {
    transition: background-color 2.5s ease;
  }

  .sale-workspace {
    background-color: rgba(22, 46, 14, 0.35);
  }

  .detail-panel {
    transition:
      background-color 2s ease,
      border-color 2s ease,
      box-shadow 2s ease;
  }

  .sale-panel {
    background-color: rgba(26, 36, 8, 0.55) !important;
    border-color: rgba(251, 191, 36, 0.55) !important;
    box-shadow:
      0 0 0 1px rgba(251, 191, 36, 0.15),
      0 0 34px rgba(251, 191, 36, 0.14);
  }

  .sale-title {
    color: #fde047;
    text-shadow: 0 0 18px rgba(251, 191, 36, 0.5);
    animation: saleTitlePulse 1.6s ease-in-out infinite;
  }

  @keyframes saleTitlePulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
  }

  /* The clearance-gold countdown widget. */
  .sale-widget {
    background: linear-gradient(100deg, #facc15, #fbbf24 40%, #4ade80 130%);
    border-color: #fde047;
    box-shadow:
      0 0 0 1px rgba(253, 224, 71, 0.5),
      0 8px 30px rgba(251, 191, 36, 0.35);
    animation: saleShine 2.4s ease-in-out infinite;
  }

  @keyframes saleShine {
    0%,
    100% {
      box-shadow:
        0 0 0 1px rgba(253, 224, 71, 0.5),
        0 8px 30px rgba(251, 191, 36, 0.35);
    }
    50% {
      box-shadow:
        0 0 0 2px rgba(253, 224, 71, 0.9),
        0 8px 42px rgba(74, 222, 128, 0.45);
    }
  }

  .sale-coin {
    display: inline-block;
    animation: saleCoinFlip 1.8s ease-in-out infinite;
  }

  @keyframes saleCoinFlip {
    0%,
    100% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(180deg);
    }
  }

  /* The barker's marquee across the top of the widget. */
  .sale-marquee {
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.35);
    padding-bottom: 2px;
    font-family: ui-monospace, monospace;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: rgba(0, 0, 0, 0.85);
    user-select: none;
  }

  .sale-marquee span {
    flex-shrink: 0;
    min-width: 100%;
    animation: saleMarquee 16s linear infinite;
  }

  @keyframes saleMarquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  /* The wind-back: the clock face flips backwards over itself while the
     digits roll onto the new countdown — read as the hands being wound. */
  .sale-clock-stage {
    perspective: 480px;
  }

  .clock-wind {
    animation: clockWind 2.6s cubic-bezier(0.22, 1, 0.36, 1);
    transform-style: preserve-3d;
  }

  @keyframes clockWind {
    0% {
      transform: rotateX(0deg);
      filter: brightness(1);
    }
    55% {
      filter: brightness(2.2);
    }
    100% {
      transform: rotateX(-1080deg);
      filter: brightness(1);
    }
  }

  /* Money fireworks: launch from the bottom, hang, drift down spinning. */
  .sale-firework {
    position: absolute;
    bottom: -48px;
    line-height: 1;
    animation-name: saleLaunch;
    animation-timing-function: cubic-bezier(0.18, 0.7, 0.4, 1);
    animation-fill-mode: both;
    will-change: transform, opacity;
  }

  @keyframes saleLaunch {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(0.5);
      opacity: 0;
    }
    8% {
      opacity: 1;
    }
    55% {
      transform: translate3d(calc(var(--drift) * 0.6), -68vh, 0)
        rotate(var(--spin)) scale(1.15);
      opacity: 1;
    }
    100% {
      transform: translate3d(var(--drift), -34vh, 0)
        rotate(calc(var(--spin) * 1.8)) scale(0.85);
      opacity: 0;
    }
  }

  /* Sale-day bio: the pitch in bargain-flyer colours. */
  .sale-bio p {
    color: #d9f99d !important;
  }

  .sale-lede {
    font-size: 1rem !important;
    line-height: 1.6 !important;
    color: #fde047 !important;
    font-weight: 800;
    border-left: 3px solid #facc15;
    padding-left: 0.85rem;
    background: linear-gradient(
      90deg,
      rgba(250, 204, 21, 0.14),
      transparent 65%
    );
    border-radius: 0 8px 8px 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    letter-spacing: 0.06em;
  }

  .sale-bio :global(b.sale-em-shout) {
    color: #000;
    font-weight: 900;
    font-size: 1.05em;
    background: linear-gradient(90deg, #fde047, #fbbf24);
    border-radius: 4px;
    padding: 0.08em 0.3em;
    white-space: normal;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    animation: alarmGlow 2.4s ease-in-out infinite;
  }

  .sale-bio :global(b.sale-em-money) {
    color: #4ade80;
    background: rgba(34, 197, 94, 0.14);
    box-shadow: inset 0 -0.42em 0 rgba(34, 197, 94, 0.2);
    padding: 0 0.18em;
    border-radius: 3px;
    white-space: nowrap;
  }

  .sale-bio :global(b.sale-em-deadline) {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.3);
    border-bottom: 1.5px solid rgba(248, 113, 113, 0.85);
    padding: 0 0.18em;
    border-radius: 3px;
    animation: critPulse 2.2s ease-in-out infinite;
  }

  .sale-bio :global(b.sale-em-key) {
    color: #fef9c3;
    background: linear-gradient(
      180deg,
      transparent 58%,
      rgba(253, 224, 71, 0.28) 58%
    );
    white-space: normal;
  }

  /* ---------------------------------------------------------------- */
  /* BUT BE WARNED — act two, in police red & blue                      */
  /* ---------------------------------------------------------------- */

  /* The banner: a light bar. The gradient sweeps like a rack of rollers
     and the glow strobes red-left / blue-right like a traffic stop. */
  .warn-banner {
    margin-top: 0.75rem;
    padding: 0.55rem 0.8rem;
    text-align: center;
    font-family: ui-monospace, monospace;
    font-size: 1.02rem !important;
    font-weight: 900 !important;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #fff !important;
    background: linear-gradient(
      90deg,
      #dc2626 0%,
      #7f1d1d 30%,
      #0b1233 50%,
      #1e3a8a 70%,
      #2563eb 100%
    );
    background-size: 200% 100%;
    border-radius: 8px;
    border-top: 2px solid rgba(255, 255, 255, 0.4);
    border-bottom: 2px solid rgba(255, 255, 255, 0.4);
    animation:
      copSweep 3.2s linear infinite,
      copGlow 1.4s ease-in-out infinite;
  }

  @keyframes copSweep {
    from {
      background-position: 0% 0;
    }
    to {
      background-position: 200% 0;
    }
  }

  @keyframes copGlow {
    0%,
    45% {
      box-shadow:
        -16px 0 28px rgba(239, 68, 68, 0.55),
        16px 0 28px rgba(59, 130, 246, 0.12);
    }
    55%,
    100% {
      box-shadow:
        16px 0 28px rgba(59, 130, 246, 0.55),
        -16px 0 28px rgba(239, 68, 68, 0.12);
    }
  }

  /* The warning paragraphs: cell-block panels, alternating red and blue
     like the lights going past the window. */
  .sale-bio p.warn-para {
    color: #e2e8f0 !important;
    padding: 0.55rem 0.75rem;
    border-radius: 0 8px 8px 0;
  }

  /* A blank line in the markdown would otherwise render as a tiny empty
     red or blue pill. */
  .sale-bio p.warn-para:empty {
    display: none;
  }

  .warn-red {
    border-left: 3px solid #ef4444;
    background: linear-gradient(
      90deg,
      rgba(153, 27, 27, 0.28),
      rgba(2, 6, 23, 0.45) 70%
    );
  }

  .warn-blue {
    border-left: 3px solid #3b82f6;
    background: linear-gradient(
      90deg,
      rgba(30, 58, 138, 0.32),
      rgba(2, 6, 23, 0.45) 70%
    );
  }

  /* The charges — red. */
  .sale-bio :global(b.warn-em-crime) {
    color: #fecaca;
    background: rgba(220, 38, 38, 0.32);
    border-bottom: 1.5px solid rgba(248, 113, 113, 0.8);
    padding: 0 0.18em;
    border-radius: 3px;
    font-weight: 900;
    white-space: normal;
  }

  /* The sentences and fines — deep red, pulsing like a cell light. */
  .sale-bio :global(b.warn-em-sentence) {
    color: #fff;
    background: rgba(153, 27, 27, 0.55);
    padding: 0 0.2em;
    border-radius: 3px;
    font-weight: 900;
    white-space: normal;
    animation: critPulse 2.2s ease-in-out infinite;
  }

  /* The law itself — blue. */
  .sale-bio :global(b.warn-em-cop) {
    color: #bfdbfe;
    background: rgba(37, 99, 235, 0.28);
    border-bottom: 1.5px solid rgba(96, 165, 250, 0.7);
    padding: 0 0.18em;
    border-radius: 3px;
    font-weight: 800;
    white-space: normal;
  }

  /* The hinge between legal and illegal — half red, half blue. */
  .sale-bio :global(b.warn-em-key) {
    color: #fff;
    background: linear-gradient(
      90deg,
      rgba(239, 68, 68, 0.4),
      rgba(59, 130, 246, 0.4)
    );
    padding: 0 0.2em;
    border-radius: 3px;
    font-weight: 900;
    white-space: normal;
  }

  /* ---------------------------------------------------------------- */
  /* COP MODE — the whole page goes red & blue while the warning is on  */
  /* screen. Declared after the sale styles so it wins while both are   */
  /* active; the existing 2s+ transitions animate the swap both ways.   */
  /* ---------------------------------------------------------------- */

  .cop-workspace {
    background-color: rgba(10, 14, 42, 0.5);
  }

  /* Static red-left / blue-right wash — parked cruiser, engine off. The
     lights are present without flashing at the reader. */
  .detail-panel.cop-panel {
    background-color: rgba(9, 12, 36, 0.72) !important;
    border-color: rgba(129, 140, 248, 0.6) !important;
    box-shadow:
      -18px 0 40px rgba(239, 68, 68, 0.16),
      18px 0 40px rgba(59, 130, 246, 0.16);
  }

  /* Gold hands the title over to the lights. */
  .cop-panel .sale-title {
    color: #e0e7ff;
    text-shadow:
      -6px 0 18px rgba(239, 68, 68, 0.6),
      6px 0 18px rgba(59, 130, 246, 0.6);
  }

  @media (prefers-reduced-motion: reduce) {
    .critical-bio :global(b.em-deadline),
    .critical-bio :global(b.em-alarm),
    .sale-bio :global(b.sale-em-shout),
    .sale-bio :global(b.sale-em-deadline),
    .sale-bio :global(b.warn-em-sentence),
    .warn-banner,
    .jump-arrow,
    .email-flash,
    .sale-title,
    .sale-widget,
    .sale-coin,
    .sale-marquee span,
    .clock-wind,
    .sale-firework {
      animation: none;
    }
  }
</style>
