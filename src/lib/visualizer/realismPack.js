/**
 * realismPack.js
 * The "real" MilkDrop pack: 47 presets hand-picked from the converted
 * presets butterchurn-presets ships but leaves out of its four packs.
 * Every one of the 1,360 left out was rendered against a beat, and only the
 * ones that look like a real place or a real material made it: Martin's
 * raymarched seas, lakes, forests and fractal metals, Flexi's glass under open
 * sky, Geiss's chrome clouds, fire, bokeh and a sun's face. Each was watched
 * through a full auto-advance (30 s) at HD and none goes dark or breaks up.
 *
 * Same shape as a butterchurn-presets pack (getPresets), so MilkdropEngine
 * loads it as one of its PACKS, in its own chunk, only once MilkDrop is on.
 */
import preset00 from "butterchurn-presets/presets/converted/Eo.S. - nematodes E daemon.json";
import preset01 from "butterchurn-presets/presets/converted/Eo.S. + Phat - chasers 11 sentinel C_poltergeist_mix response daemon.json";
import preset02 from "butterchurn-presets/presets/converted/flexi - 3d mosaic glass test - mash0000 - 9d tuscan slop ram.json";
import preset03 from "butterchurn-presets/presets/converted/flexi - alien canvas.json";
import preset04 from "butterchurn-presets/presets/converted/flexi - black holes [sucking fractals for breakfast].json";
import preset05 from "butterchurn-presets/presets/converted/Flexi - dawn has broken.json";
import preset06 from "butterchurn-presets/presets/converted/Flexi - gold plated maelstrom of chaos.json";
import preset07 from "butterchurn-presets/presets/converted/flexi - moebius transformation [random texture mix].json";
import preset08 from "butterchurn-presets/presets/converted/Flexi - multiverse.json";
import preset09 from "butterchurn-presets/presets/converted/Flexi - oldschool tree.json";
import preset10 from "butterchurn-presets/presets/converted/flexi - what to do with the inside of a torus [easily customizable moebius spiral template].json";
import preset11 from "butterchurn-presets/presets/converted/Flexi - when monopolies were the future [simple warp + non-reactive moebius].json";
import preset12 from "butterchurn-presets/presets/converted/flexi + cope - i blew you a soap bubble now what - feel the projection you are, connected to it all nz+.json";
import preset13 from "butterchurn-presets/presets/converted/flexi + stahlregen - a car crash you can′t defocus_2.json";
import preset14 from "butterchurn-presets/presets/converted/Geiss - Artifact Plasma.json";
import preset15 from "butterchurn-presets/presets/converted/Geiss - Chromatexture Paint-In 2.json";
import preset16 from "butterchurn-presets/presets/converted/Geiss - Chrome.json";
import preset17 from "butterchurn-presets/presets/converted/Geiss - Motion Blur 2 (Relief Mix).json";
import preset18 from "butterchurn-presets/presets/converted/geiss + martin - mandelbox explorer - high speed demo version (fire mix).json";
import preset19 from "butterchurn-presets/presets/converted/martin - blue mountains.json";
import preset20 from "butterchurn-presets/presets/converted/martin - golden mirror.json";
import preset21 from "butterchurn-presets/presets/converted/martin - hardcore mix 1.json";
import preset22 from "butterchurn-presets/presets/converted/martin - invasion.json";
import preset23 from "butterchurn-presets/presets/converted/martin - jellyfish dance.json";
import preset24 from "butterchurn-presets/presets/converted/martin - mandelbulb slideshow.json";
import preset25 from "butterchurn-presets/presets/converted/martin - moonlight splash.json";
import preset26 from "butterchurn-presets/presets/converted/martin - night in the forest.json";
import preset27 from "butterchurn-presets/presets/converted/martin - on silent paths.json";
import preset28 from "butterchurn-presets/presets/converted/martin - orbit trap playground.json";
import preset29 from "butterchurn-presets/presets/converted/martin - pendulum in brass ps3.json";
import preset30 from "butterchurn-presets/presets/converted/Martin - QBikal - Surface Turbulence.json";
import preset31 from "butterchurn-presets/presets/converted/Martin - QBikal - Surface Turbulence II.json";
import preset32 from "butterchurn-presets/presets/converted/martin - rogue wave -ps3.json";
import preset33 from "butterchurn-presets/presets/converted/martin - royal waterfall.json";
import preset34 from "butterchurn-presets/presets/converted/martin - silversmith.json";
import preset35 from "butterchurn-presets/presets/converted/martin - stormy sea.json";
import preset36 from "butterchurn-presets/presets/converted/martin - the Dome ps3.json";
import preset37 from "butterchurn-presets/presets/converted/martin - this beautiful planet.json";
import preset38 from "butterchurn-presets/presets/converted/martin - tiling the tube.json";
import preset39 from "butterchurn-presets/presets/converted/martin - timeless.json";
import preset40 from "butterchurn-presets/presets/converted/martin + stahlregen - martin in da mash 11.json";
import preset41 from "butterchurn-presets/presets/converted/shifter - glassworms flare.json";
import preset42 from "butterchurn-presets/presets/converted/shifter - liquid circuitry.json";
import preset43 from "butterchurn-presets/presets/converted/shifter + Eo.S + Phat - Blob.json";
import preset44 from "butterchurn-presets/presets/converted/Stahlregen & bdrv + fiSHbRAiN + flexi + Geiss + shifter - Starcraft (Distorted).json";
import preset45 from "butterchurn-presets/presets/converted/Stahlregen + Geiss + Martin - Ouboros (Metal Finish 2).json";
import preset46 from "butterchurn-presets/presets/converted/suksma - sick star bloat.json";

const PRESETS = {
  "Eo.S. - nematodes E daemon": preset00,
  "Eo.S. + Phat - chasers 11 sentinel C_poltergeist_mix response daemon": preset01,
  "flexi - 3d mosaic glass test - mash0000 - 9d tuscan slop ram": preset02,
  "flexi - alien canvas": preset03,
  "flexi - black holes [sucking fractals for breakfast]": preset04,
  "Flexi - dawn has broken": preset05,
  "Flexi - gold plated maelstrom of chaos": preset06,
  "flexi - moebius transformation [random texture mix]": preset07,
  "Flexi - multiverse": preset08,
  "Flexi - oldschool tree": preset09,
  "flexi - what to do with the inside of a torus [easily customizable moebius spiral template]": preset10,
  "Flexi - when monopolies were the future [simple warp + non-reactive moebius]": preset11,
  "flexi + cope - i blew you a soap bubble now what - feel the projection you are, connected to it all nz+": preset12,
  "flexi + stahlregen - a car crash you can′t defocus_2": preset13,
  "Geiss - Artifact Plasma": preset14,
  "Geiss - Chromatexture Paint-In 2": preset15,
  "Geiss - Chrome": preset16,
  "Geiss - Motion Blur 2 (Relief Mix)": preset17,
  "geiss + martin - mandelbox explorer - high speed demo version (fire mix)": preset18,
  "martin - blue mountains": preset19,
  "martin - golden mirror": preset20,
  "martin - hardcore mix 1": preset21,
  "martin - invasion": preset22,
  "martin - jellyfish dance": preset23,
  "martin - mandelbulb slideshow": preset24,
  "martin - moonlight splash": preset25,
  "martin - night in the forest": preset26,
  "martin - on silent paths": preset27,
  "martin - orbit trap playground": preset28,
  "martin - pendulum in brass ps3": preset29,
  "Martin - QBikal - Surface Turbulence": preset30,
  "Martin - QBikal - Surface Turbulence II": preset31,
  "martin - rogue wave -ps3": preset32,
  "martin - royal waterfall": preset33,
  "martin - silversmith": preset34,
  "martin - stormy sea": preset35,
  "martin - the Dome ps3": preset36,
  "martin - this beautiful planet": preset37,
  "martin - tiling the tube": preset38,
  "martin - timeless": preset39,
  "martin + stahlregen - martin in da mash 11": preset40,
  "shifter - glassworms flare": preset41,
  "shifter - liquid circuitry": preset42,
  "shifter + Eo.S + Phat - Blob": preset43,
  "Stahlregen & bdrv + fiSHbRAiN + flexi + Geiss + shifter - Starcraft (Distorted)": preset44,
  "Stahlregen + Geiss + Martin - Ouboros (Metal Finish 2)": preset45,
  "suksma - sick star bloat": preset46,
};

/** @returns {Record<string, object>} preset name -> Butterchurn preset */
export function getPresets() {
  return PRESETS;
}
