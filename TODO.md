# BATTLE

- a way to record, upload, and vote on freestyles on the music in the music player
- For this app, it is anonymous, with anonymous voting and uploading (can write in a rap tag)
- No user accounts here, but there will be a bigger site if this works out
- 

# QR Flash

- We're going to enhance the app, make it bettah
- Rename to Data Train
- QR Flash is going to be one data transfer option
- The goal is any two machines, from fridge to telephone to toaster to jacuzzi to washing machine to (computer to phone - the main two), if they can get to my site, and their nearby (DOGS secure transfer) or apart (relatively close, like outside the building) or lightyears away (im in china), encrypted, fast, optimal transfers
- Really like im outside, have an mp3 on my phone, no wifi on the laptop, dont wanna use hotspot, my phone has data but maybe it doesnt, i can easily move the mp3

- QR Flash can utilize the entire device's screen. so the bitrate on my laptop (4k, maybe a foot wide), is faster data out compared to my phone.
- Info about the device's specs must be displayed upon opening the qr flash transfer part of data train app
- Need to give user the option to "adjust clarity" of the transfers. so the qr code is easier to capture on lower quality cameras
- We also need bluetooth file transfer
- usb file transfer
- nearby quick share file transfer
- add as many protocols as needed for the above scenarios



# Performance, Standardization, Organization

- We need to lazy load this website. The QRFlash .svelte component should not be fetched in the network if I am not opening the QRFlash app. same for everything else. right now when opening any part of the site, all the apps and components get fetched. this can't happen.
- Lazy load npm modules and imports. We shouldn't be fetching the tessaract library until the user clicks on the ocr app. if they dont use the ocr app, it shouldnt enter the user's browser. we need to greatly improbe efficiency.
- The Header that says TOOLBOX in all apps should reflect the app's name

- BUG FIX: Music panel instrumental/vocals toggle button doesnt work. it just shakes, only vocals are accessible right now. also, if vocal mix can be fetched correctly, but instrumental fails the network, it must allow vocal play back and shake on toggling to instrumental. and vice versa. currently if one fails, the whole track is unplayable

# Music App

- Multi-browser / window / device support. Something clever here. When I'm playing music in one tab, and i open wearedogs or localhost or 192.168.x.x etc, across all the music player should be synced up. one music auditory playback. changing the song on one tab changes it on the others. this should be synced across devices too... for now start with tabs and upon completing the task, give me some ideas on how we could do cross device sync without user accounts securely (maybe a bluetooth connection between the devices...?)


# GoPro App

- The interface is too busy. Too many buttons. Way too much going on. I want the user to feel the same way as when they first open the app. The clean, simple, remote control feeling.
- Make sure there's only one playback scrubber slider, right now there's two. and the episodes tab makes no sense, remove that tab episodes should be in the top left of the overlay
- the key configure button in the video overlay covers too much of the screen and interface. remove it. it should be underneath the video
- yeah something went wrong when vibecoding this component a lightyear ago.
- i been to jail and i want more somedays im a bad man (ignore this line)


# Arcade modifications

- Mobile portrait and landscape better layouts
- Bigger buttons on the controller layouts, up, down, left, right, a, b, all of them should be 25% bigger
- Arrow keys dont work
- need to override tap-and-hold text selecting/vibrate phone when holding a controller button
- must fix sega genesis, the sega.gge file and many of the files in that cores folder have never worked in years, since i cloned this bitch in 2023. they all must be documented, modified with zero regression, somehow decompiled? anyways, the sega genesis for mj moonwalker must be fixed somehow. console logs will point in the right direction
- must fix gba
- must fix psx



# Missing Creatures - new app

- We're going to create a hub for notices and posts regarding missing people, and pets.
- Need to be map based, so i can see and compare hotspots worldwide, compare the missing dogs in france with the missing girls in dubai
- Needs to use federal, national, state, world databases to fetch up to date information
- Needs to view stats- Mexico has 490,000 missing men and women since 1990, or 240,000 men and 250,000 women
- Pictures for the victims. Really every listing should be openable into an investigator style case board, last known location, associates, facts, police reports, bodycam footage, social media clips, everything
- ...

