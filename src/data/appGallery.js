/**
 * appGallery.js
 * The DOGS apps shown in the gallery on the landing's second page (src/components/AppGallery.svelte).
 *
 * Every capture comes from the app's public demo with its sample data. Media lives in public/media/apps/
 * for now; moving it to the data host later only means changing MEDIA_BASE.
 *
 * Each app's slides are its features: the slide picker doubles as the feature list, so a phone shows one
 * feature at a time and a desktop shows them all beside the picture.
 */

const MEDIA_BASE = "/media/apps/";

/**
 * @typedef {{ title: string, text: string, image: string }} GallerySlide
 * @typedef {{
 *   id: string, name: string, tagline: string, summary: string, status: string,
 *   url: string, demo: string, demoLabel: string, video: string, poster: string,
 *   slides: GallerySlide[]
 * }} GalleryApp
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
    demo: "https://castle.dogs.red/demo/",
    demoLabel: "Try the demo",
    video: `${MEDIA_BASE}castle.mp4`,
    poster: `${MEDIA_BASE}castle-home.webp`,
    slides: [
      { title: "Storage", text: "A drive like the big clouds, on your own disks. Each person in the house gets their own private, encrypted space.", image: `${MEDIA_BASE}castle-storage.webp` },
      { title: "Security", text: "Store security cam / dashcam footage, passwords, tax records, and search through it all with AI.", image: `${MEDIA_BASE}castle-security.webp` },
      { title: "Devices", text: "Automated recording and backups of phone calls, texts, emails, and more. Encrypted and locked, or shareable.", image: `${MEDIA_BASE}castle-network.webp` },
      { title: "Automation", text: "Run VMs, containers, and emulators, with automations that drive them. Automate data entry work, or spin up secure anonymous boxes for dev instantly.", image: `${MEDIA_BASE}castle-home.webp` },
    ],
  },
  {
    id: "wordsmith",
    name: "Wordsmith",
    tagline: "Make it happen.",
    summary: "Project management for the agentic AI world. Notes become tickets, AI agents pick them up, and you review what ships. One shared space for the whole idea.",
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
    url: "https://money24.dogs.red/",
    demo: "https://money24.dogs.red/home.html",
    demoLabel: "Open the demo",
    video: "",
    poster: `${MEDIA_BASE}money24.webp`,
    slides: [
      { title: "Markets", text: "Stocks, crypto, metals and more on one ticker, with paper positions and their exits.", image: `${MEDIA_BASE}money24.webp` },
      { title: "News", text: "Stories gathered from many outlets, tagged by topic and mood, and matched to the tickers they move.", image: `${MEDIA_BASE}money24-news.webp` },
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
      { title: "Private first", text: "No real name needed. What you track is yours unless you choose to share it.", image: `${MEDIA_BASE}forty.webp` },
    ],
  },
];
