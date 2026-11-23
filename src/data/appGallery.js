/**
 * appGallery.js
 * The DOGS apps shown in the gallery on the landing's second page (src/components/AppGallery.svelte).
 *
 * Every capture comes from the app's public demo with its sample data. Media lives in public/media/apps/
 * for now; moving it to the data host later only means changing MEDIA_BASE.
 *
 * Each app's slides are its features: the slide picker doubles as the feature list, so a phone shows one
 * feature at a time and a desktop shows them all beside the picture.
 *
 * DOGS HOME is this website. Its slides are tools built into it, so they open in place over the page
 * (lib/openDogsPage.js) instead of in a new tab; each slide says which panel or toolbox app it opens.
 */

const MEDIA_BASE = "/media/apps/";

/**
 * @typedef {{ panel?: string, app?: string }} GalleryTarget A panel ("map", "toolbox") or a toolbox app id
 * @typedef {{ title: string, text: string, image: string, open?: GalleryTarget }} GallerySlide
 * @typedef {{
 *   id: string, name: string, tagline: string, summary: string, status: string,
 *   url: string, demo: string, demoLabel: string, video: string, poster: string,
 *   slides: GallerySlide[],
 *   inPlace?: boolean, urlLabel?: string, captureLabel?: string
 * }} GalleryApp
 *   inPlace: part of this site; its links open in place, and the main button opens the slide on show.
 *   urlLabel: what the address link reads when it isn't the url itself. captureLabel: replaces "sample data".
 */

/** @type {GalleryApp[]} */
export const APP_GALLERY = [
  {
    id: "castle",
    name: "Castle",
    tagline: "Your cloud, in your house.",
    summary: "One expandable, modular box for the whole family's files. Your network, your rules.",
    status: "Interactive demo · in development",
    url: "https://castle.dogs.red/",
    demo: "https://castle.dogs.red/",
    demoLabel: "Try the demo",
    video: `${MEDIA_BASE}castle.mp4`,
    poster: `${MEDIA_BASE}castle-home.webp`,
    slides: [
      { title: "Storage", text: "A drive like the big clouds, on your own disks. Each person in the house gets their own private space. Encrypted and locked, or shareable. Searchable with AI.", image: `${MEDIA_BASE}castle-storage.webp` },
      { title: "Security", text: "Monitor security cam / dashcam footage, standardize firewall deployments, scan for vulnerabilities with AI.", image: `${MEDIA_BASE}castle-security.webp` },
      { title: "Devices", text: "Automated backups of Windows, iOS, or Android devices, including phone calls, texts, emails, pictures, videos, and more.", image: `${MEDIA_BASE}castle-network.webp` },
      { title: "Automation", text: "Run VMs, containers, and emulators, with automations that drive them. Automate data entry work, or spin up secure, ethereal boxes for dev instantly.", image: `${MEDIA_BASE}castle-home.webp` },
    ],
  },
  {
    id: "wordsmith",
    name: "Wordsmith",
    tagline: "Make it happen.",
    summary: "Project management for the agentic AI world. SCRUM with an MCP server.",
    status: "Available today",
    url: "https://wordsmith.dogs.red/",
    demo: "https://wordsmith.dogs.red/",
    demoLabel: "Free to start",
    video: `${MEDIA_BASE}wordsmith.mp4`,
    poster: `${MEDIA_BASE}wordsmith.webp`,
    slides: [
      { title: "Capture", text: "Type a note or say it out loud. Labels and projects keep it findable.", image: `${MEDIA_BASE}wordsmith.webp` },
      { title: "Plan", text: "Feature requests line up on a board: requested, in progress, complete.", image: `${MEDIA_BASE}wordsmith-board.webp` },
      { title: "Ship", text: "Agents claim a ticket, report status, and link the pull request. Every step lands on its timeline.", image: `${MEDIA_BASE}wordsmith-ticket.webp` },
    ],
  },
  {
    id: "money24",
    name: "Money 24",
    tagline: "Make your money make money.",
    summary: "Hands off algorithmic quant trading across 6 markets, driven by AI.",
    status: "Interactive demo · in development",
    url: "https://money24.dogs.red/",
    demo: "https://money24.dogs.red/",
    demoLabel: "Open the demo",
    video: "",
    poster: `${MEDIA_BASE}money24.webp`,
    slides: [
      { title: "Markets", text: "Trade Stocks, Options, Crypto, FOREX, Futures, and Prediction Markets in one place, with AI.", image: `${MEDIA_BASE}money24.webp` },
      { title: "Customize", text: "Customize trading rules (stop losses, exit ladders, MA or volume requirements, etc.) and integrate with all your AI subscriptions", image: `${MEDIA_BASE}money24.webp` },
      { title: "News", text: "Stories gathered from many outlets, tagged by topic and mood, and matched to the tickers they move.", image: `${MEDIA_BASE}money24-news.webp` },
      { title: "Plays", text: "Organize trades as Plays, and monitor progress as your AI determines the best contracts, positions, constraints, and makes the trades for you automatically, tuned to strategies that work.", image: `${MEDIA_BASE}money24-news.webp` },
    ],
  },
  {
    id: "forty",
    name: "40",
    tagline: "Live forever, speak today.",
    summary: "A social media that deletes itself every forty days.",
    status: "Closed Beta · free account",
    url: "https://40.dogs.red/",
    demo: "https://40.dogs.red/",
    demoLabel: "Start tracking",
    video: "",
    poster: `${MEDIA_BASE}forty.webp`,
    slides: [
      { title: "Post", text: "Follow your favorite creators, and make new friends.", image: `${MEDIA_BASE}forty.webp` },
      { title: "Chat", text: "Random text and video chat with other users.", image: `${MEDIA_BASE}forty.webp` },
      { title: "Express Yourself", text: "Since everything is gone at the end of the month, post anything. Say anything. No stress.", image: `${MEDIA_BASE}forty.webp` },
      { title: "Track", text: "Anonymously track and share excercise routines, habits, experiences and more.", image: `${MEDIA_BASE}forty.webp` },
    ],
  },
  {
    id: "home",
    name: "DOGS HOME",
    tagline: "This website.",
    summary: "/util: everyday tools for creation, free and one tap away.",
    status: "Free · built into this site",
    url: "/apps",
    urlLabel: "/util",
    demo: "/apps",
    demoLabel: "Open the toolbox",
    video: "",
    poster: `${MEDIA_BASE}home-datatrain.webp`,
    inPlace: true,
    captureLabel: "live capture · this site",
    slides: [
      { title: "Data Train", text: "Send files and text between your devices: pair with a QR code, or use AirDrop and Quick Share.", image: `${MEDIA_BASE}home-datatrain.webp`, open: { app: "dataflash" } },
      { title: "Catalytic Converter", text: "Turn images, audio, video, documents and data files into the format you need. In browser local conversions, so nothing leaves your device.", image: `${MEDIA_BASE}home-converter.webp`, open: { app: "converter" } },
      { title: "Maps", text: "Where to go, and where not to go: the spots the DOGS love and hate from around the world.", image: `${MEDIA_BASE}home-map.webp`, open: { panel: "map" } },
      { title: "QR Generator", text: "Resizable QR codes with an optional logo in the middle, ready to copy or download. Direct links embedded, forever. Never get blindsided by a paid QR middleware website again. Use this instead.", image: `${MEDIA_BASE}home-qr.webp`, open: { app: "qrgenerator" } },
    ],
  },
];
