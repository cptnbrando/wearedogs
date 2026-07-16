# BATTLE
branch: ai/battle-mods

- a way to record, upload, and vote on freestyles on the music in the music player
- For this app, it is anonymous, with anonymous voting and uploading (can write in a rap tag)
- No user accounts here, but there will be a bigger site if this works out

# Music App
branch: ai/music-mods

- Multi-browser / window / device support. Something clever here. When I'm playing music in one tab, and i open wearedogs or localhost or 192.168.x.x etc, across all the music player should be synced up. one music auditory playback. changing the song on one tab changes it on the others. this should be synced across devices too... for now start with tabs and upon completing the task, give me some ideas on how we could do cross device sync without user accounts securely (maybe a bluetooth connection between the devices...?)
- Cassette visual for music player. toggleable between vinyl and cassette model
- Music player: Waveform slider for seek bar, instead of blank seeker slider
- Music player - shuffle play should keep track of what's played and not played, play tracks, not repeat tracks until the list is over. Then stop playing if repeat is off. Create a new shuffled list and continue if repeat is on.
- Music player, smoke is positioned incorrectly right now
- Music player - swiping on the tabs should not change tabs. It should just scroll the tabs
- If on mobile and kaleidoscope is turned on while tracks page is active, slide up and toggle out  the tracks page


# GoPro App
branch: ai/gopro-mods

- The interface is too busy. Too many buttons. Way too much going on. I want the user to feel the same way as when they first open the app. The clean, simple, remote control feeling.
- Make sure there's only one playback scrubber slider, right now there's two. and the episodes tab makes no sense, remove that tab episodes should be in the top left of the overlay
- the key configure button in the video overlay covers too much of the screen and interface. remove it. it should be underneath the video
- remove the corner arrows, blinking red dot, and episode info from a permanent video overlay. move them to the one that appears on hover.
- fullscreen toggle, pause/play, next and last, volume should all be on the main video hover overlay
- put dogs logo and DOGS in the bottom right on permanent overlay, very greyed out white washed. yes it must animate if the music panel is playing also
- the number keys still do not work at all anymore. they should quickly shift and move through the video Like they did before, Ressembling YouTube playback controls, like when I push the number key on a YouTube video, I quickly skip to it This must also adhere to the BPM rule that we once set before. If I hold the button, it will slowly correspond to the BPM, how long it stutters, shows a re-loop, re-play stutter effect. 
- The episodes list should be scrollable page wide. Meaning if my mouse cursor if outside the panel and I scroll, the episodes list should scroll too. This will allow me to scroll and select a show on my tv.





# Missing Creatures - new app
branch: ai/missing-creatures

- We're going to create a hub for notices and posts regarding missing people, and pets.
- Need to be map based, so i can see and compare hotspots worldwide, compare the missing dogs in france with the missing girls in dubai
- Needs to use federal, national, state, world databases to fetch up to date information
- Needs to view stats- Mexico has 490,000 missing men and women since 1990, or 240,000 men and 250,000 women
- Pictures for the victims. Really every listing should be openable into an investigator style case board, last known location, associates, facts, police reports, bodycam footage, social media clips, everything


# Shop - fundraising
branch: ai/shop-mods branched off of swarm/app-merch-store

- Shop must have two modes, Merchandise and Fundraising 

- i want to collect funds, and have shareable information pages for people to anonymously, or personally, donate money for projects of DOGS
- we need a beautiful sundial in harvard st, tulsa, park
- eventually, a small fenced area dog park? proper waste management?
- Easily add and modify "Campaigns" with .md files
- Need a list of campaigns: active, completed, archived
- Every campaign opens into it's own page, resembling a Steam game page. Dates of when the campaign was listed, how long fundraising has been ongoing
- Campaign page has image carousel, description, fundraising goals (a list of targets, $100 for lumber, $500 for waste bins, $1000 for concrete, etc)
- The page should show a visualization of funds raised on a slider, corresponding to the targets
- For now, the "Donate" button should link to a cash app page. Eventually, we will integrate a proper donation system.


# Memes
branch: ai/memes

- Canine Memes app renamed to just "MEMES" in all caps
- Offers a place to view memes and also generate memes with tenmplate generators.
- For the meme generator, begin with the /public/memes/template/friendship.png image. This is a popular meme called "Friendship Ended" . Google how it works, and then create a way to quickly type in the data for new memes, for this one, name 1 and name 2. So I can make it say something like "Friendship ended with Ron Weasley, now Harry is my friend" etc. Use canvas and text to position new text onto the image and spit out a downloadable image


# Map
branch: ai/map-mod branched off of swarm/feature-mappanel

- Continue creating the map panel.
- There will eventually be hundreds of cities available, modify accordingly for scale
- For now the only cities are: Tulsa OK, Dallas TX, and Rochester NY
- The map looks and functions excellently
- Ensure mobile portrait and landscape responsivity
- Reviews should open up into their own pages. Like a full on review page, like the blog posts are. URL Path accessible too, so the reviews are shareable.
- Image carousel for every place, based on Google Maps photos available.
- Addresses for every place and clickable link to directions (google maps and apple maps links)
- Begin with Chicken and the Wolf in Tulsa, OK. 1124 S Lewis Ave, Tulsa, OK 74104 .
- Report the Google Maps review score, the Yelp review score, and the DOGS score. For chicken and the wolf, 5/5.
- Add Oppa House - Korean BBQ. All reviews will mainly be hosted and sourced from my Google Maps. https://maps.app.goo.gl/kbwKMzdc5qWFuR6V8 . This links to my review.
- Every restaurant needs best dishes, best times to eat, more information


# Little things
branch: ai/little-things

- Add swipe controls to snake on mobile
- Soundboard multi touch. Can hit multiple sounds at once
- Soundboard when the app is opened, all samples must be loaded in immediately with a little loading animation on each.
- Soundboard weird overloading glitch? Hitting around 100 sounds will overload something, making the audio output get very very glitchy until finally the audio cuts out entirely and nothing is played
- Soundboard - The wave form display needs to show actual waveforms now

