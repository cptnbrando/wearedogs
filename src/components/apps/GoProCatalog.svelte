<script>
    import { Play } from "lucide-svelte";

    // Destructure runes props
    let {
        catalog = $bindable(),
        activeShowKey = $bindable(),
        currentEpisodeIndex = $bindable(),
        selectedSeasons = $bindable(),
        playEpisode
    } = $props();

    // Derived states
    let activeShow = $derived(
        catalog[activeShowKey] || {
            episodes: [],
            meta: { actors: [], facts: "" },
        },
    );
    let currentEpisode = $derived(
        activeShow.episodes[currentEpisodeIndex] || { title: "", file: "" },
    );

    function getEpisodeSeason(ep) {
        if (!ep || !ep.file) return 1;
        const match = ep.file.match(/S([0-9]+)/i);
        return match ? parseInt(match[1], 10) : 1;
    }

    function getSeasonsForShow(showKey) {
        const show = catalog[showKey];
        if (!show || !show.episodes) return [1];
        const seasons = new Set();
        show.episodes.forEach((ep) => {
            seasons.add(getEpisodeSeason(ep));
        });
        return Array.from(seasons).sort((a, b) => a - b);
    }
</script>

<div class="catalog-container">
    <!-- Cinematic Hero Spotlight Banner -->
    <div
        class="hero-spotlight {activeShowKey
            .replace(/\s+/g, '-')
            .toLowerCase()}"
    >
        <div class="hero-content">
            <span class="hero-show-tag">{activeShowKey}</span>
            <h1 class="hero-title">
                S01E{(currentEpisodeIndex + 1)
                    .toString()
                    .padStart(2, "0")}: {currentEpisode.title}
            </h1>

            <p class="hero-fact">
                <strong>Trivia:</strong>
                {activeShow.meta.facts}
            </p>

            <!-- Meta details grid -->
            <div class="hero-meta-badges">
                <span class="badge score">{activeShow.meta.score}</span>
                <span class="badge rating"
                    >{activeShow.meta.rating}</span
                >
                <span class="badge runtime"
                    >{activeShow.meta.runtime}</span
                >
                <span class="badge release"
                    >{activeShow.meta.release}</span
                >
                <span class="badge viewers"
                    >{activeShow.meta.viewers} Viewers</span
                >
                <span class="badge budget"
                    >{activeShow.meta.budget} Budget</span
                >
            </div>

            <!-- Cast List -->
            <div class="hero-cast">
                <span class="meta-label">Cast:</span>
                <div class="cast-tags">
                    {#each activeShow.meta.actors as actor}
                        <span class="hero-cast-tag">{actor}</span>
                    {/each}
                </div>
            </div>

            <div class="hero-actions">
                <button
                    class="hero-play-btn"
                    onclick={() =>
                        playEpisode(activeShowKey, currentEpisodeIndex)}
                >
                    <Play size={18} fill="currentColor" /> Play Episode
                </button>

                <div class="hero-external-links">
                    <a
                        href={activeShow.meta.wiki}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hero-link-btn">Wikipedia</a
                    >
                    <a
                        href={activeShow.meta.imdb}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hero-link-btn">IMDb</a
                    >
                    <a
                        href={activeShow.meta.tomatoes}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hero-link-btn">Rotten Tomatoes</a
                    >
                </div>
            </div>
        </div>
    </div>

    <!-- Show Shelves / Rows -->
    <div class="catalog-shelves">
        {#each Object.keys(catalog) as showKey}
            {@const seasons = getSeasonsForShow(showKey)}
            {@const activeSeason =
                selectedSeasons[showKey] || seasons[0] || 1}
            <div class="shelf-container">
                <div class="shelf-header">
                    <h2 class="shelf-title">
                        {showKey}
                    </h2>
                    {#if seasons.length > 1}
                        <div class="season-selector-tabs">
                            {#each seasons as s}
                                <button
                                    class="season-tab-btn"
                                    class:active={activeSeason === s}
                                    onclick={() =>
                                        (selectedSeasons[showKey] = s)}
                                >
                                    Season {s}
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>

                <div class="cards-row">
                    {#each catalog[showKey].episodes.filter((ep) => getEpisodeSeason(ep) === activeSeason) as ep, seasonIdx}
                        {@const actualIndex =
                            catalog[showKey].episodes.indexOf(ep)}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                            class="episode-card"
                            class:active={activeShowKey === showKey &&
                                currentEpisodeIndex === actualIndex}
                            onclick={() =>
                                playEpisode(showKey, actualIndex)}
                        >
                            <div class="card-thumbnail">
                                <span class="thumbnail-number"
                                    >{(seasonIdx + 1)
                                        .toString()
                                        .padStart(2, "0")}</span
                                >
                                <div class="thumbnail-overlay">
                                    <div class="play-icon-glow">
                                        <Play
                                            size={16}
                                            fill="currentColor"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="card-info">
                                <span class="card-episode-num"
                                    >Episode {seasonIdx + 1}</span
                                >
                                <span class="card-title-text"
                                    >{ep.title}</span
                                >
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
  @import "../../styles/gopro.scss";
</style>
