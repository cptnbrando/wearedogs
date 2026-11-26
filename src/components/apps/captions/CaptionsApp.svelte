<script>
  /**
   * Captions: time captions and lyrics to any audio or video, word by word.
   *
   * Two jobs in one editor: captions for a file of your own (exported as .srt
   * and friends for a video editor), and timed lyrics for the songs in the
   * music player. The media and its clock live in captionsMedia.svelte.js, the
   * captions and every edit in captionsProject.svelte.js; this file lays the
   * panels out and owns the keyboard.
   */
  import { onDestroy } from "svelte";
  import { ListMusic, Hand, AudioLines, FolderOpen, X } from "lucide-svelte";
  import { CaptionsMedia } from "./captionsMedia.svelte.js";
  import { CaptionsProject } from "./captionsProject.svelte.js";
  import { KIND_FILE, KIND_TRACK } from "./captionsStore.js";
  import { admin } from "../../../lib/admin.svelte.js";
  import CaptionsStart from "./CaptionsStart.svelte";
  import CaptionsPreview from "./CaptionsPreview.svelte";
  import CaptionsTransport from "./CaptionsTransport.svelte";
  import CaptionsLines from "./CaptionsLines.svelte";
  import CaptionsTap from "./CaptionsTap.svelte";
  import CaptionsTranscribe from "./CaptionsTranscribe.svelte";
  import CaptionsOutput from "./CaptionsOutput.svelte";
  import "./captions.scss";

  const TAB_LINES = "lines";
  const TAB_TAP = "tap";
  const TAB_TRANSCRIBE = "transcribe";
  const TAB_FILES = "files";
  /** The tools shown beside the lines. On small screens the lines are a tab too. */
  const TOOLS = [
    { id: TAB_TAP, label: "Tap along", icon: Hand },
    { id: TAB_TRANSCRIBE, label: "Transcribe", icon: AudioLines },
    { id: TAB_FILES, label: "Files", icon: FolderOpen },
  ];
  const NUDGE_S = 0.01;
  const BIG_NUDGE_S = 0.05;
  const TYPING_TAGS = ["INPUT", "TEXTAREA", "SELECT"];
  const BUTTON_TAG = "BUTTON";
  const NAV_BUTTON = "cap-nav-btn flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0 py-1 text-[0.625rem] sm:flex-row sm:gap-1 sm:text-xs md:flex-none md:flex-col md:px-3 md:py-3 xl:text-sm 2xl:px-5 2xl:py-5 2xl:text-lg";

  const media = new CaptionsMedia();
  const project = new CaptionsProject();

  let tab = $state(TAB_LINES);
  let tool = $state(TAB_TAP);
  let opening = $state(false);

  function showTab(id) {
    tab = id;
    if (id !== TAB_LINES) tool = id;
  }

  async function openFile(file) {
    opening = true;
    const opened = await media.openBlob(file, file.name);
    opening = false;
    if (opened) project.open({ kind: KIND_FILE, id: file.name, name: file.name });
  }

  /** A song from the player: the owner's job only (CaptionsStart shows it only to them). */
  async function openTrack(track) {
    if (!admin.unlocked) return;
    opening = true;
    const opened = await media.openTrack(track);
    opening = false;
    if (opened) project.open({ kind: KIND_TRACK, id: track.id, name: track.title, trackId: track.id });
  }

  function closeProject() {
    project.flush();
    project.stopTap();
    media.close();
  }

  /**
   * The editor's keys. They are left alone while typing in a field (the
   * toolbox leaves fields alone too). Outside one, the keys that would close
   * the app in the toolbox (Backspace, Escape) always stop here, so work in
   * progress is never thrown out by a stray key.
   */
  function onKeydown(event) {
    if (!media.kind || event.altKey || event.metaKey) return;
    const tag = event.target && event.target.tagName;
    if (TYPING_TAGS.includes(tag) || (event.target && event.target.isContentEditable)) return;
    const handled = keyAction(event, tag);
    if (!handled) return;
    event.preventDefault();
    // The toolbox closes an app on Backspace: a key used here stops with us
    event.stopImmediatePropagation();
  }

  /** @returns {boolean} whether the key did something here */
  function keyAction(event, tag) {
    if (event.ctrlKey) {
      if (event.key.toLowerCase() !== "z") return false;
      project.undo();
      return true;
    }
    switch (event.key) {
      case " ":
        if (event.repeat) return true;
        if (project.tapping) project.tap(media.now());
        else media.toggle();
        return true;
      case "Backspace":
      case "Delete":
        // Tap along: back one tap. Otherwise: the selected word goes (Undo brings it back)
        if (project.tapping) {
          if (event.key === "Backspace") project.tapBack();
        } else if (project.sel) {
          project.removeWord();
        }
        return true;
      case "+":
      case "Insert":
        // A word after the selected one, ready to be typed into the bar
        if (!project.tapping) project.addWord();
        return true;
      case "Escape":
        project.select(null);
        return true;
      case "ArrowLeft":
        project.step(-1);
        return true;
      case "ArrowRight":
        project.step(1);
        return true;
      case ",":
        project.nudge(-NUDGE_S);
        return true;
      case ".":
        project.nudge(NUDGE_S);
        return true;
      case "<":
        project.nudge(-BIG_NUDGE_S);
        return true;
      case ">":
        project.nudge(BIG_NUDGE_S);
        return true;
      case "t":
      case "T":
        project.setTime(media.now());
        return true;
      case "Enter":
        // On a button, Enter presses the button
        if (tag === BUTTON_TAG || !project.selected || project.selected.t === null) return false;
        media.playFrom(project.selected.t);
        return true;
      default:
        return false;
    }
  }

  /** Space belongs to play and tap: it never presses whichever button was clicked last. */
  function onKeyup(event) {
    if (media.kind && event.key === " " && event.target && event.target.tagName === BUTTON_TAG) event.preventDefault();
  }

  window.addEventListener("keydown", onKeydown, true);
  window.addEventListener("keyup", onKeyup, true);
  window.addEventListener("pagehide", closeProject);

  onDestroy(() => {
    window.removeEventListener("keydown", onKeydown, true);
    window.removeEventListener("keyup", onKeyup, true);
    window.removeEventListener("pagehide", closeProject);
    closeProject();
  });
</script>

<div class="cap-app h-full min-h-0 w-full">
  {#if !media.kind}
    <CaptionsStart onFile={openFile} onTrack={openTrack} loading={opening || media.loading} error={media.error} />
  {:else}
    <div class="cap-editor h-full min-h-0 gap-2 p-2 md:gap-3 md:p-3 xl:mx-auto xl:max-w-7xl 2xl:max-w-none 2xl:gap-5 2xl:p-5" class:is-lines={tab === TAB_LINES}>
      <nav class="cap-nav flex flex-row gap-1 md:flex-col md:gap-2 2xl:gap-3" aria-label="Captions">
        <button type="button" class="{NAV_BUTTON} cap-nav-lines" class:is-on={tab === TAB_LINES} aria-pressed={tab === TAB_LINES} onclick={() => showTab(TAB_LINES)}>
          <ListMusic size={18} /> Lines
        </button>
        {#each TOOLS as item (item.id)}
          {@const Icon = item.icon}
          <button type="button" class={NAV_BUTTON} class:is-on={tab === item.id} class:is-tool={tool === item.id} aria-pressed={tab === item.id} onclick={() => showTab(item.id)}>
            <Icon size={18} /> {item.label}
          </button>
        {/each}
        <button type="button" class="{NAV_BUTTON} md:mt-auto" title="Close this and open something else. Your work stays saved on this device." onclick={closeProject}>
          <X size={18} /> Close
        </button>
      </nav>

      <section class="cap-stage flex min-h-0 min-w-0 flex-col gap-2 md:gap-3 2xl:gap-5">
        <h2 class="cap-name hidden truncate text-sm md:block xl:text-base 2xl:text-2xl">{project.name}</h2>
        <CaptionsPreview {media} {project} />
        <CaptionsTransport {media} {project} />
      </section>

      <section class="cap-tools min-h-0 min-w-0 p-2 md:p-3 2xl:p-5">
        {#if tool === TAB_TAP}
          <CaptionsTap {media} {project} />
        {:else if tool === TAB_TRANSCRIBE}
          <CaptionsTranscribe {media} {project} />
        {:else}
          <CaptionsOutput {project} />
        {/if}
      </section>

      <section class="cap-lines min-h-0 min-w-0">
        <CaptionsLines {media} {project} />
      </section>
    </div>
  {/if}
</div>
