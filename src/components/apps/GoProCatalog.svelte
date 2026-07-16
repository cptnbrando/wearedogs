<script>
    import { Play, Film, Users } from "lucide-svelte";

    // Props
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
    
    let seasons = $derived(getSeasonsForShow(activeShowKey));
    let activeSeason = $derived(selectedSeasons[activeShowKey] || seasons[0] || 1);
    
    // Active season episodes
    let activeSeasonEpisodes = $derived(
        activeShow.episodes.filter((ep) => getEpisodeSeason(ep) === activeSeason)
    );

    // Selected episode details
    let currentEpisode = $derived(
        activeShow.episodes[currentEpisodeIndex] || { title: "", file: "" }
    );

    function getEpisodeSeason(ep) {
        if (!ep || !ep.file) return 1;
        const match = ep.file.match(/S([0-9]+)/i);
        return match ? parseInt(match[1], 10) : 1;
    }

    function getSeasonsForShow(showKey) {
        const show = catalog[showKey];
        if (!show || !show.episodes) return [1];
        const seasonsSet = new Set();
        show.episodes.forEach((ep) => {
            seasonsSet.add(getEpisodeSeason(ep));
        });
        return Array.from(seasonsSet).sort((a, b) => a - b);
    }

    function switchShow(showKey) {
        activeShowKey = showKey;
        currentEpisodeIndex = 0;
    }

    // Page-wide scrolling support
    import { onMount } from "svelte";
    let episodesSwipeWrapperRef = $state();

    onMount(() => {
        const handleGlobalWheel = (e) => {
            if (episodesSwipeWrapperRef) {
                episodesSwipeWrapperRef.scrollTop += e.deltaY;
            }
        };
        window.addEventListener("wheel", handleGlobalWheel, { passive: true });
        return () => {
            window.removeEventListener("wheel", handleGlobalWheel);
        };
    });

    // Season Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSeasonSwipe();
    }


    function handleSeasonSwipe() {
        const threshold = 50;
        const currentIdx = seasons.indexOf(activeSeason);
        if (currentIdx === -1) return;

        if (touchStartX - touchEndX > threshold) {
            // Swiped Left -> Next season
            if (currentIdx < seasons.length - 1) {
                selectedSeasons[activeShowKey] = seasons[currentIdx + 1];
            }
        } else if (touchEndX - touchStartX > threshold) {
            // Swiped Right -> Previous season
            if (currentIdx > 0) {
                selectedSeasons[activeShowKey] = seasons[currentIdx - 1];
            }
        }
    }
</script>

<div class="catalog-container">
    <!-- Show & Episode Info Panel at the Top -->
    <div class="info-panel-billboard">
        <div class="show-info-section">
            <span class="info-tag"><Film size={12} /> Active Show</span>
            <h1 class="info-show-title">{activeShowKey}</h1>
            <p class="info-show-desc">{activeShow.meta.facts}</p>
            <div class="info-cast">
                <span class="cast-label"><Users size={12} /> Cast:</span>
                <span class="cast-text-list">{activeShow.meta.actors.join(", ")}</span>
            </div>
        </div>
        
        <div class="episode-info-section">
            <span class="info-tag"><Play size={12} /> Selected Episode</span>
            <span class="info-ep-number">Season {getEpisodeSeason(currentEpisode)} - Episode {activeShow.episodes.indexOf(currentEpisode) + 1}</span>
            <h2 class="info-ep-title">{currentEpisode.title}</h2>
            <div class="info-ep-stats">
                <span class="stat-pill">★ {activeShow.meta.score}</span>
                <span class="stat-pill">{activeShow.meta.rating}</span>
                <span class="stat-pill">{activeShow.meta.runtime}</span>
            </div>
        </div>
    </div>

    <!-- Main Selector Deck: Split columns on desktop, stacked on mobile -->
    <div class="selector-columns-deck">
        <!-- Shows Sidebar -->
        <div class="shows-sidebar-container">
            <span class="sidebar-header-title">Browse Shows</span>
            <div class="shows-list-flow">
                {#each Object.keys(catalog) as showKey}
                    <button
                        class="show-card-item"
                        class:active={activeShowKey === showKey}
                        class:batman={showKey === "Batman Beyond"}
                        class:bean={showKey === "Mr. Bean"}
                        onclick={() => switchShow(showKey)}
                    >
                        <span class="show-card-icon">{catalog[showKey].symbol || "📺"}</span>
                        <div class="show-card-info">
                            <span class="show-card-name">{showKey}</span>
                            <span class="show-card-count">{catalog[showKey].episodes.length} Episodes</span>
                        </div>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Episodes Selector -->
        <div class="episodes-main-container">
            <div class="episodes-selector-header">
                <span class="sidebar-header-title">Episodes List</span>
                
                {#if seasons.length > 1}
                    <div class="season-swiper-indicator">
                        <span class="swipe-hint">Swipe to change season</span>
                        <div class="season-pills">
                            {#each seasons as s}
                                <button
                                    class="season-pill-btn"
                                    class:active={activeSeason === s}
                                    onclick={() => (selectedSeasons[activeShowKey] = s)}
                                >
                                    S{s}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Episodes scrollable grid container with Swipe listener -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                bind:this={episodesSwipeWrapperRef}
                class="episodes-swipe-wrapper"
                ontouchstart={handleTouchStart}
                ontouchend={handleTouchEnd}
            >
                <div class="episodes-grid">
                    {#each activeSeasonEpisodes as ep, seasonIdx}
                        {@const actualIndex = activeShow.episodes.indexOf(ep)}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                            class="episode-grid-card"
                            class:active={currentEpisodeIndex === actualIndex}
                            onclick={() => playEpisode(activeShowKey, actualIndex)}
                        >
                            <div class="card-thumbnail-box">
                                <span class="card-number">{(seasonIdx + 1).toString().padStart(2, "0")}</span>
                                <div class="card-play-overlay">
                                    <Play size={20} fill="currentColor" />
                                </div>
                            </div>
                            <div class="card-details">
                                <span class="card-ep-label">Episode {seasonIdx + 1}</span>
                                <h3 class="card-title">{ep.title}</h3>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

