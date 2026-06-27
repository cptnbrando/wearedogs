<script>
  import { onMount } from "svelte";
  import {
    BookOpen,
    Calendar,
    User,
    Clock,
    Share2,
    ArrowLeft,
    ChevronRight,
    Loader2,
    Check,
    AlertCircle,
  } from "lucide-svelte";
  import { getPosts, getPostContent } from "../../lib/blogApi.js";

  // Constants
  const SHARE_COOLDOWN_MS = 2000;

  // Props
  let { initialSlug = $bindable(null), isReading = $bindable(false), depth = $bindable(0) } = $props();

  // App state
  let posts = $state([]);
  let activePost = $state(null);
  let activeContent = $state(null);
  let isLoadingList = $state(true);
  let isLoadingPost = $state(false);
  let loadError = $state(null);
  let showCopiedAlert = $state(false);

  // Copy timeout reference
  let copyTimeout = null;

  /**
   * Helper to format ISO date string into friendly weekday, date, and time.
   * @param {string} dateStr - ISO date string
   * @returns {string}
   */
  function formatBlogDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const hasTime = dateStr.includes("T");
    const optionsDate = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", optionsDate);

    if (!hasTime) {
      return formattedDate;
    }

    const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
    const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
    return `${formattedDate} at ${formattedTime}`;
  }

  // Sync isReading state with activePost selection
  $effect(() => {
    isReading = activePost !== null;
  });

  // Watch for isReading forced deselect from parent
  $effect(() => {
    if (!isReading && activePost !== null) {
      deselectPost();
    }
  });

  // Sync initial slug selection
  $effect(() => {
    if (initialSlug && posts.length > 0) {
      const matchingPost = posts.find((p) => p.slug === initialSlug);
      if (matchingPost && (!activePost || activePost.slug !== initialSlug)) {
        selectPost(matchingPost);
      }
    } else if (!initialSlug && activePost !== null) {
      deselectPost();
    }
  });

  // Load posts list manifest
  onMount(async () => {
    try {
      posts = await getPosts();
      isLoadingList = false;

      // Handle deep link slug if passed
      if (initialSlug) {
        const matchingPost = posts.find((p) => p.slug === initialSlug);
        if (matchingPost) {
          selectPost(matchingPost);
        }
      }
    } catch (err) {
      loadError = "Failed to load articles. Please verify database sync.";
      isLoadingList = false;
    }
  });

  /**
   * Action to select a blog post and load its body content.
   * @param {import('../../lib/blogApi.js').BlogPost} post
   */
  async function selectPost(post) {
    activePost = post;
    isLoadingPost = true;
    activeContent = null;
    initialSlug = post.slug;

    try {
      const data = await getPostContent(post.slug);
      if (data) {
        activeContent = data;
        // Dynamically update URL deep link state without triggering browser reload
        const canonicalUrl = `/apps/blog/${post.slug}`;
        depth = 3;
        history.pushState(
          { view: "toolbox", app: "blog", slug: post.slug, depth: 3 },
          "",
          canonicalUrl,
        );
      } else {
        loadError = "Article body content was not found.";
      }
    } catch (err) {
      loadError = "Network error loading post content.";
    } finally {
      isLoadingPost = false;
    }
  }

  /**
   * Clear active post and reset pathname URL to /apps/blog.
   */
  function deselectPost() {
    activePost = null;
    activeContent = null;
    initialSlug = null;
    isReading = false;

    if (history.state?.slug) {
      history.back();
    } else if (window.location.pathname.includes("/apps/blog/")) {
      history.replaceState(
        { view: "toolbox", app: "blog", depth: 2 },
        "",
        "/apps/blog",
      );
      depth = 2;
    }
  }

  /**
   * Copy the shareable post hyperlink to clipboard and trigger animation feedback.
   */
  function handleShare(e) {
    e.stopPropagation();
    if (!activePost) return;

    const shareUrl = `${window.location.origin}/apps/blog/${activePost.slug}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        showCopiedAlert = true;
        if (copyTimeout) clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          showCopiedAlert = false;
        }, SHARE_COOLDOWN_MS);
      })
      .catch(() => {
        console.error("Failed to copy share link.");
      });
  }
</script>

<svelte:head>
  {#if activePost}
    <title>{activePost.title} | DOG BLOG</title>
    <meta name="description" content={activePost.description} />
    <meta property="og:title" content={activePost.title} />
    <meta property="og:description" content={activePost.description} />
    <meta
      property="og:url"
      content="{window.location.origin}/apps/blog/{activePost.slug}"
    />
    <meta property="twitter:title" content={activePost.title} />
    <meta property="twitter:description" content={activePost.description} />
  {:else}
    <title>DOG BLOG</title>
  {/if}
</svelte:head>

<div
  class="blog-app-container w-full h-full text-white flex flex-col font-sans select-none overflow-hidden relative"
>
  <!-- Master Layout Header -->
  <div
    class="blog-header shrink-0 px-4 py-3 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between z-10"
  >
    <div class="flex items-center gap-2">
      <BookOpen class="text-[#b455ff] w-5 h-5 md:w-6 md:h-6" />
      <span class="font-bold text-sm md:text-base tracking-wider uppercase"
        >DOG BLOG</span
      >
    </div>
    {#if activePost}
      <button
        type="button"
        onclick={deselectPost}
        class="text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
      >
        <ArrowLeft size={12} class="text-[#b455ff]" />
        <span class="font-mono">BACK_TO_LOGS</span>
      </button>
    {/if}
  </div>

  <!-- Content Pane (Conditional Render for Dedicated Full Pages) -->
  <div class="blog-content-pane flex-grow min-h-0 relative w-full h-full">
    {#if activePost === null}
      <!-- ── Posts List Index Page (Full Width) ── -->
      <div
        class="posts-list-pane w-full h-full overflow-y-auto p-4 md:p-6 flex flex-col gap-3 md:gap-4 max-w-4xl mx-auto"
      >
        <h2
          class="text-xs font-bold text-white/40 tracking-widest uppercase mb-1 px-1"
        >
          LATEST_LOGS_MANIFEST
        </h2>

        {#if isLoadingList}
          <div
            class="flex-1 flex flex-col items-center justify-center gap-2 py-12"
          >
            <Loader2 class="animate-spin text-[#b455ff] w-8 h-8" />
            <span class="text-xs text-white/40 font-mono">SCANNING_DIR...</span>
          </div>
        {:else if loadError && posts.length === 0}
          <div
            class="border border-red-500/20 bg-red-950/10 p-4 rounded-xl flex items-start gap-2.5"
          >
            <AlertCircle class="text-red-500 shrink-0 w-5 h-5" />
            <div class="text-xs text-red-400 font-mono leading-relaxed">
              {loadError}
            </div>
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each posts as post}
              <button
                type="button"
                onclick={() => selectPost(post)}
                class="post-card text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3.5 relative group overflow-hidden bg-white/[0.01] border-white/5 hover:border-[#b455ff]/40 hover:bg-white/[0.03] cursor-pointer"
              >
                <!-- Card Header -->
                <div class="flex justify-between items-start gap-2 w-full">
                  <span
                    class="text-[10px] font-mono text-[#b455ff] font-semibold"
                    >{formatBlogDate(post.date)}</span
                  >
                  <span
                    class="text-[9px] font-mono text-white/30 tracking-wider"
                    >BY: {post.author.toUpperCase()}</span
                  >
                </div>

                <!-- Card Title -->
                <h3
                  class="text-base font-bold leading-snug text-white/90 group-hover:text-white transition-colors"
                >
                  {post.title}
                </h3>

                <!-- Card Description -->
                <p class="text-xs text-white/50 leading-relaxed line-clamp-3">
                  {post.description}
                </p>

                <!-- Bottom Indicator -->
                <div
                  class="flex justify-end items-center text-[10px] text-[#b455ff] font-semibold opacity-0 group-hover:opacity-100 transition-opacity gap-1 font-mono pt-1"
                >
                  <span>READ_LOG_ENTRY</span>
                  <ChevronRight size={10} />
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <!-- ── Post Reader Page (Full Width) ── -->
      <div
        class="reading-detail-pane w-full h-full overflow-y-auto bg-black/10"
      >
        {#if isLoadingPost}
          <div
            class="w-full h-full flex flex-col items-center justify-center gap-2"
          >
            <Loader2 class="animate-spin text-[#b455ff] w-10 h-10" />
            <span class="text-xs text-white/40 font-mono"
              >PARSING_MARKDOWN...</span
            >
          </div>
        {:else if activeContent}
          <article
            class="w-full max-w-3xl mx-auto px-4 py-6 md:px-8 md:py-10 flex flex-col gap-6 relative select-text"
          >
            <!-- Detail Header -->
            <div class="flex flex-col gap-3 border-b border-white/5 pb-5">
              <div
                class="flex items-center gap-4 text-xs text-white/40 font-mono"
              >
                <span class="flex items-center gap-1"
                  ><Calendar size={12} /> {formatBlogDate(activePost.date)}</span
                >
                <span class="flex items-center gap-1"
                  ><User size={12} /> {activePost.author}</span
                >
              </div>

              <h1
                class="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight"
              >
                {activePost.title}
              </h1>

              <p
                class="text-sm text-white/60 leading-relaxed italic border-l-2 border-[#b455ff]/40 pl-3 py-0.5"
              >
                {activePost.description}
              </p>

              <!-- Actions row -->
              <div class="flex items-center justify-between mt-3 z-20">
                <button
                  type="button"
                  onclick={handleShare}
                  class="share-btn text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors border border-white/10 px-3 py-1.5 rounded-lg bg-white/[0.04] cursor-pointer hover:bg-white/[0.08]"
                  aria-label="Share this article"
                >
                  {#if showCopiedAlert}
                    <Check size={14} class="text-[#00d75f]" />
                    <span class="text-[#00d75f] font-mono">LINK_COPIED</span>
                  {:else}
                    <Share2 size={14} class="text-[#b455ff]" />
                    <span>Share Log</span>
                  {/if}
                </button>
              </div>
            </div>

            <!-- Parsed Markdown Body -->
            <div
              class="markdown-body text-sm md:text-base leading-relaxed text-white/80 pb-16"
            >
              {@html activeContent.bodyHtml}
            </div>
          </article>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* TV / 2XL Scales */
  @media (min-width: 1920px) {
    .posts-list-pane {
      max-width: 6xl !important;
      padding: 24px !important;
    }
    .post-card {
      padding: 24px !important;
      gap: 16px !important;
    }
    .post-card h3 {
      font-size: 1.3rem !important;
    }
    .post-card p {
      font-size: 1rem !important;
    }
    .reading-detail-pane article {
      max-width: 1000px !important;
      padding: 48px 60px !important;
    }
    .reading-detail-pane article h1 {
      font-size: 3rem !important;
    }
    .reading-detail-pane article p {
      font-size: 1.15rem !important;
    }
    .reading-detail-pane :global(.markdown-body p) {
      font-size: 1.2rem !important;
      margin-bottom: 24px !important;
    }
    .reading-detail-pane :global(.markdown-body h2) {
      font-size: 1.8rem !important;
      margin-top: 32px !important;
    }
  }
</style>
