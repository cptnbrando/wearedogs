# WEAREDOGS Master Sprint Backlog

## Core Orchestration Instructions
- **Target Engine**: For every top-level category or task, the `Swarm-Coordinator` must execute `git checkout -b swarm/[task-name]` from a clean master branch.
- **Transpilation Guard**: Every file edited must adhere to the Potato Target (Chrome 40+ compatibility via transpile steps).

---

## 0. Global Site-Wide (mild) Refactoring and Modularizing [Branch: `swarm/core-refactor`]
- [ ] **Global Values**: Ensure constant values are hoisted up to the top of all svelte/js files for easy modification later. Ensure large json arrays are modularized into their own files and imported.
- [ ] **TailwindCSS and SCSS**: Following the AGENTS.md instructions, incorporate a larger dependence on tailwindCSS styles for better device compatibility, but ensure all styles are EXACTLY as they currently are. Do not add any new styles. Do not remove any existing styles. Just make sure that tailwindCSS is used more often instead of inline styles. Extrapolate color values into .scss files with comments indicating their uses.
- [ ] **Componentize Common UI Elements**: Following the AGENTS.md instructions, break down recurring UI elements like buttons, navigation bars, and cards into reusable Svelte components, improving maintainability and consistency. Apps, Panels, and headers should all have the same standardized styling, similar data, and same functionality throughout.
- [ ] **Documentation and Copy**: Documentation is to be as up to date as possible and should match the current state of the codebase.

## 1. Global & Architectural Adjustments [Branch: `swarm/core-navigation`]
- [ ] **Architecture**: Ensure entire codebase transpiles/builds down to support Chrome 40+ compatibility (Potato Target optimization for legacy devices/fridges).
- [ ] **Navigation Flow**: Refactor the "X" close navigation buttons site-wide. Ensure they strictly pop the navigation stack exactly one level up, leading sequentially back to the title page rather than breaking history or jumping randomly.
- [ ] **Layout Stability**: Debug the apps panel closure. Eliminate the physical text/layout jump on the main title page when closing the panel. Ensure elements remain entirely static like an oil painting (`@Stylist`, `@Documenter-Tester`).
- [ ] **UI Component**: Build a universal swipeable Tab Navigation layout framework (`@Stylist`):
  - 2-4 tabs: Evenly spaced across the viewport.
  - 5+ tabs: Auto-convert to a fluid scrolling tabset.
  - Interaction: Fully swipeable (left/right gestures). The active tab must glow, and the top header must auto-scroll to center the active selection dynamically.

## 2. Stats Panel Updates [Branch: `swarm/stats-panel`]
- [ ] **Map UI**: Implement a lightweight, stylish interactive world map supporting Chrome 42+ (official long-term supported npm package allowed, `@Modularizer` to vet bundle size).
  - Responsive across Mobile Portrait, Mobile Landscape, Web, and accessible on a Chrome 65 TV.
  - Must display text labels for continents and oceans.
- [ ] **Map Key**: Create an openable/closeable map key overlay, toggled via a "Show Map Key" button outside the canvas bounds.
- [ ] **Interactivity**: Selecting a language must smoothly pan and zoom into the targeted countries, highlighting/shading the regions natively.
- [ ] **Data Extrapolation**: Separate the stats map logic structurally from the forthcoming larger `/map` (`MapPanel`) infrastructure. Keep this one lightweight (`@Modularizer`).
- [ ] **Documentation & Copy**: Add an expandable information section detailing data metrics:
  - Explicitly define statistics as L1 language learners (native birth languages, learning "mother/father" first, localized regional canine mapping).
  - Clarify that calculations represent a 1-to-1 reflection of current physical residents within that country (e.g., Polish stats reflect who lives in Poland right now, not global speakers).
  - Explicitly emphasize: "Population is people and this is a people world worldwide dogs."

## 3. MapPanel Application [Branch: `swarm/feature-mappanel`]
- [ ] **Architecture**: Establish the standalone `/map` (`MapPanel`) route and layout structure. Extrapolate all favorited spots, ratings, and city coordinates into modular, easily editable `.json` data dictionaries (`@Modularizer`).
- [ ] **Interactive Views**: Implement a clickable global map mapped to an explicit list of cities. Clicking a city zooms the map directly into the coordinate bounds.
- [ ] **Directory Structure**: Build a categorized local explorer listing: Restaurants, Concert Halls, Free Shit.
  - Sub-categorize restaurants (e.g., Coffee Shops, Bars, Italian, Mexican).
  - Embed direct click-through hyperlinks matching their official Google Maps listings.
- [ ] **Content Injection**: Inject Brando's custom order listings and an explicit `2.5 / 5 stars` custom visual rating component for every point of interest.

## 4. Music Player Refactor [Branch: `swarm/music-player-overhaul`]
- [ ] **UI Interaction**: Replace the "Instrumental / Regular" text button with a realistic, animated digital crossfader (`@Stylist`).
  - Slide action transitions quickly between a Singing Symbol and an Instrumental Symbol.
  - *Fallback Rule*: If a track lacks an instrumental file or vocal file alternative, lock the crossfader in place and trigger a resistance bounce animation when a user attempts to slide it.
- [ ] **Mobile Tracklist**: Hide the tracklist on mobile by default. Toggle its visibility directly over the spinning vinyl record when the record is tapped. Provide an explicit close button to return back to the clean vinyl layout. Bottom screen bounds must fill neatly with controls and the vinyl footprint.
- [ ] **Sorting Engine**: Expand tracklist filtering. Allow users to sort and view files dynamically by Artist, Album, Year, Filename, Genre, and Season (derived from winter/fall/summer upload file timestamps).
- [ ] **Global Web Audio API Sync**: Connect global playback tracking into the main layout:
  - The main title page must display an animated volume icon containing reactive music notes and sound wave bars whenever audio is playing anywhere on the site.
  - Cross-component audio ducking/killing: If music is playing (e.g., Michael Jackson) and the user navigates into the GoPro app and boots an episode, cleanly kill the music channel and hand over the audio context to the video layer. If they exit the video, the video audio keeps playing, the main title page icon updates to a video camera animation, until a new music file overrides it.
  - *Soundboard Override*: Audio from the Dog Soundboard component must play concurrently *over* existing background tracks without cutting off external music channels.
- [ ] **UI Runes**: Actively animate the heiroglyphic rune navigation elements when their specific downstream components are outputting active audio streams (`@Stylist`).
- [ ] **OS Mobile Controls Integration**: Implement native lock-screen, background playback, and system Bluetooth hooks using official media session packages.
  - Sync album art, skip, seek, shuffle, and repeat triggers natively.
  - Handle system audio interrupts: If another device application captures audio focus (e.g., Spotify), gracefully pause playback and update UI controls instantly. Ensure background audio continues uninterrupted when minimized or phone screen is locked.
  - Display a persistent system notification during active sessions.

## 5. Dog Sitter Idle Game [Branch: `swarm/app-dog-sitter`]
- [ ] **Core Engine**: Build a responsive Tomagotchi-style browser idle game sub-panel.
- [ ] **Assets & Animation**: Implement frame-by-frame digital pixel-art flipbook animations displaying clean, rapid, nostalgic cycles for 5 distinct chooseable, nameable dog breeds.
- [ ] **Game Loop**:
  - Implement a decaying Hunger Bar. When the bar drops, trigger a sad animation cycle. If left un-fed regularly, execute a permanent death state and allow the user to hatch/adopt a new pet.
  - Implement a Feed Action button: Playing a digital cartoon "om nom nom" audio cue and refilling the hunger metric.
  - Bark Trigger: System barks must play using localized Japanese canine voice clips.
- [ ] **Economy**: Clicking/tapping directly on the active dog generates Site-Wide Currency Coins. Implement an integrated Item Store component allowing users to spend accrued coins on custom aesthetic neck collars.

## 6. Snake App Enhancements [Branch: `swarm/app-snake-updates`]
- [ ] **Automation Logic**: Build an alternate "Auto Mode" execution script for the Snake mini-game.
- [ ] **Reward Hook**: Grant site-wide game currency coins when Auto Mode completely clears a game board flawlessly (leaving exactly 1 single tile space free).
- [ ] **Progression Matrix**: Design an upgrade store interface mapping to three distinct attributes: Speed, Accuracy (preventing occasional automated deaths), and Fruit Power (+2 or +3 snake length modifiers).
- [ ] **Mathematical Scaling**: Apply strict logarithmic cost formulas to attribute upgrades so prices scale aggressively as levels rise. Sync wallet currency perfectly with the Dog Sitter coin balance.

## 7. WEAREDOGS Predictive Stats [Branch: `swarm/stats-countdown`]
- [ ] **Algorithm**: Build a predictive statistical computation script mapping from a permanent constant start date to simulate ongoing global canine births and deaths dynamically over time.
- [ ] **The 69 Countdown Tab**: Create a dedicated tracking tab inside the language section of the Stats Panel. 
  - Code an algorithmic prediction tracker that anticipates exactly when an aggregate population counter will end with the string `69`.
  - Format output as a live real-time ticking countdown ticker (e.g., "USA dogs will reach 637267369 in 10.83 minutes").

## 8. GoPro App Player Upgrades [Branch: `swarm/app-gopro-player`]
- [ ] **Automation Controls**: Add a checkbox toggle for "Auto Skip Intro & Auto Skip Outro". 
  - Works natively in full-screen configurations.
  - When checked, rolling credits trigger an automatic jump directly past the intro segment of the subsequent chronological episode (respecting active repeat/shuffle states).
  - Ensure the player control UI overlay remains completely hidden during full-screen automated skips.
- [ ] **UX Controls**: Enforce automatic mouse cursor hiding when the video elements go into active fullscreen mode.
- [ ] **Keyboard Interaction**: Add dedicated keyboard shortcuts binding to Skip Intro and Skip Outro commands.
  - Flash a brief visual confirmation glow on the UI buttons when triggered correctly during active intro/outro video timestamps, then fade out cleanly.
- [ ] **Key Binding Remapper**: Design a dedicated administration sub-page allowing manual adjustments of the keyboard number row (0-9) to custom video playback timestamps.
  - Include an incremental step adjuster (nudge left/right arrows) that updates the active frame layout on change for precision tuning.
  - Persist configurations seamlessly per episode, per show within browser `localStorage`.
  - Provide an option to Import and Export these bindings cleanly to a local `.json` file, along with a complete structural default "Reset" button.
- [ ] **Metadata Correction**: Hardcode episode naming properties for `s03e07` and `s03e08` to display explicitly as `"The Call (1/2)"` and `"The Call (2/2)"`.

## 9. Changelog System [Branch: `swarm/app-changelog`]
- [ ] **Visual Style**: Style the interface layout utilizing an ultra-stylized, glowing green l33t/Matrix-style aesthetic with responsive pagination.
- [ ] **Data Model**: Establish a local `public/changelog.json` containing an array of structured objects tracking Change Name, Version Number, Date, Timestamp, and an indented list array of raw GitHub commit hashes mapping directly to their live online web URLs.
- [ ] **Automation Tasks (`AGENTS.md` Integration)**: Code an internal CLI script command accessible to the swarm. Running `"add all our new changes to the changelog"` must prompt Anti-Gravity to programmatically query local Git logs, compile unreleased commit hashes/data, and write a fresh append block entry into `changelog.json` safely without generating an upstream git push.
- [ ] **Metrics Dashboard**: Calculate and display statistical data modules inside the interface:
  - Total elapsed time since project inception (Hardcode base tracking start date to exactly 5 days ago from today).
  - Timestamp of the very first repository commit.
  - Gross average completion duration computed per commit block.
  - "Average Inner Time" module: Computes the standard duration pace between commits *only* if the block spacing registers under 60 minutes (filtering out sleep/non-coding blocks completely).
  - Average quantity of physical code lines altered per commit iteration.

## 10. Shenanigans Store [Branch: `swarm/app-merch-store`]
- [ ] **Data Architecture**: Isolate all clothing product listings, images, titles, pricing values, sizing availability matrices (`6XS` to `6XL`), and product descriptions into an external, modular static configuration data file.
- [ ] **Grid UI**: Build a responsive tile-based catalog structure utilizing monochrome font elements. Tapping a product tile smoothly zooms into an expanded 3D item dashboard.
- [ ] **3D Interaction**: Implement a touch/click-and-drag interactive 3D shirt canvas component, enabling smooth, fluid 360-degree rotation previews on swipe-and-hold gestures (`@Stylist`).
- [ ] **Cart & Stock Validation Engine**: Build a local state-driven Shopping Cart checkout ecosystem.
  - Read active inventory parameters: If a product item block is toggled to a sold-out state inside the backend source files, overlay a bold yellow-and-black diagonal caution tape graphic over the tile element.
  - Formidably disable and short-circuit all purchase navigation links or cart addition handlers if a product is flagged as sold out.
  - Re-verify inventory levels on cart page load execution: Remove checkout availability dynamically if an item goes out of stock prior to final hand-off.
- [ ] **External Checkout Pipeline**: Establish seamless linking structures routing external purchasing actions out to processing layers like Teespring, Shopify, or Link endpoints.