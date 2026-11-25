<script>
  /**
   * The owner's cloud shelf: save the captions being worked on, and bring a
   * saved set back on any device (captionsCloud.js). Shown only while the
   * owner's session is unlocked.
   */
  import { CloudUpload, CloudDownload, Trash2 } from "lucide-svelte";
  import { admin } from "../../../lib/admin.svelte.js";
  import { saveCloudProject, listCloudProjects, loadCloudProject, deleteCloudProject } from "./captionsCloud.js";

  const DATE_FORMAT = { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
  const ROW_BUTTON = "cap-btn cap-btn-row px-3 py-2 text-xs md:text-sm 2xl:px-5 2xl:py-3 2xl:text-lg";

  /** @type {{ project: import("./captionsProject.svelte.js").CaptionsProject, say: (text: string, isError?: boolean) => void }} */
  let { project, say } = $props();

  /** @type {{ id: string, name: string, updatedAt: number }[]} */
  let shelf = $state([]);
  let busy = $state(false);

  async function refresh() {
    const answer = await listCloudProjects(admin.token);
    if (answer.ok) shelf = answer.projects;
    else say(answer.error, true);
  }

  refresh();

  /** One request at a time, with what came of it said out loud. */
  async function work(job) {
    if (busy) return;
    busy = true;
    await job();
    busy = false;
  }

  const save = () => work(async () => {
    const answer = await saveCloudProject(project.snapshot(), admin.token);
    say(answer.ok ? "Saved to the cloud." : answer.error, !answer.ok);
    if (answer.ok) await refresh();
  });

  const load = (entry) => work(async () => {
    const answer = await loadCloudProject(entry.id, admin.token);
    if (!answer.ok) return say(answer.error, true);
    project.useStoredLines(answer.lines);
    say(`Loaded "${entry.name}" from the cloud. Undo brings back what was here.`);
  });

  const remove = (entry) => work(async () => {
    const answer = await deleteCloudProject(entry.id, admin.token);
    say(answer.ok ? `Deleted "${entry.name}" from the cloud.` : answer.error, !answer.ok);
    if (answer.ok) await refresh();
  });

  const when = (entry) => new Date(entry.updatedAt).toLocaleString([], DATE_FORMAT);
</script>

<section class="flex flex-col gap-2 md:gap-3">
  <h3 class="cap-heading text-xs md:text-sm 2xl:text-lg">Cloud projects</h3>
  <button type="button" class="{ROW_BUTTON} cap-btn-main self-start" disabled={busy} onclick={save}>
    <CloudUpload size={16} /> Save this to the cloud
  </button>
  {#if shelf.length}
    <ul class="cap-songs grid grid-cols-1 gap-2 sm:grid-cols-1 md:gap-3 lg:grid-cols-1 xl:grid-cols-1 2xl:gap-4">
      {#each shelf as entry (entry.id)}
        <li class="flex flex-row items-center gap-2">
          <button type="button" class="{ROW_BUTTON} min-w-0 flex-1" disabled={busy} title="Load these captions into the editor" onclick={() => load(entry)}>
            <CloudDownload size={16} />
            <span class="truncate">{entry.name}</span>
            <span class="cap-muted ml-auto shrink-0 font-normal">{when(entry)}</span>
          </button>
          <button type="button" class="cap-btn p-2 2xl:p-3" disabled={busy} aria-label="Delete {entry.name} from the cloud" onclick={() => remove(entry)}>
            <Trash2 size={16} />
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</section>
