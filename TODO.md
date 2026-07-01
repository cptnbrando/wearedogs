# WEAREDOGS Master Sprint Backlog

## Core Orchestration Instructions
- **Target Engine**: For every top-level category or task, the `Swarm-Coordinator` must execute `git checkout -b swarm/[task-name]` from a clean master branch.
- **Transpilation Guard**: Every file edited must adhere to the Potato Target (Chrome 40+ compatibility via transpile steps).

# 7/1/2026

- Refactor the StatsPanel.svelte component. Separate out the tabs into separate files.
- Refactor styles out of entire app. Replace default purple colors and gradiants everywhere in the app with a custom, themable color profile. Incorporate the new theme into all components and .svelte files everywhere, and standardize these components. Make a default theme (which leaves the website EXACTLY AS IT CURRENTLY IS), an iOS 'Liquid Glass' Theme, a Batman Beyond theme, a Matrix theme, a Windows XP theme, a Cyberpunk 2077 Theme, and a Scooby Doo theme, and a Random theme (will randomly select one of these every time the site loads). These should all be stored in a .json or .yml file somewhere (whichever is easiest to parse). Changing this file manually should change the themes all over the app, in every panel and app. The selected theme should be stored in local storage and loaded in when the site loads.
- Create a SETTINGS app. Add a way to change site-wide themes in this app.
- Create an Info Panel, open it when the dog logo is clicked in the header. It should detail basic information about DOGS, tech company, with our projects castle, wax, and 40.
- Make a mobile-responsive design for the GoPro app.
- Create unit tests for the following scenarios:
- - The user taps the logo on the landing page -> The stats corner widget appears, along with the runes
- - The user swipes right on the landing page -> The language changes forward
- - The user swipes left on the landing page -> Nothing happens
- - The user swipes right, then swipes left on the landing page -> The language moves forward once, then returns to the default language
- Currently, if I'm in Poland, the website displays the default English language "We Are Dogs". It should use the i18n library to autoswap to the Polish translation of We Are Dogs, and this should become the default. Same for all the languages in the world. Use the i18n library to change the translation dynamically according to what the browser demands


- Snake app must be restyled and resized for mobile and tablet viewports
- must add ai mode to snake app, where it runs infinitely, automatically. When on this mode, progressively, the controls fade to the background, and then the border fades to the background, and then it's just a snake chasing a dot around a black space

- Sketch canvas app must be restyled and resized for mobile and tablet viewports
- must add ai mode to sketch app, where it runs infinitely, automatically. When on this mode, progressively, the controls fade to the background, and then the border fades to the background, and then it's just brushes swiping and erasing and swiping and painting and changing their size and changing their color and changing their style and just painting inside the canvas forever