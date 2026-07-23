<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<script>
  import { onMount, onDestroy, untrack } from "svelte";
  import { fade, scale, fly } from "svelte/transition";
  import BasePanel from "./BasePanel.svelte";
  import ProductImageSlideshow from "./apps/ProductImageSlideshow.svelte";
  import ThreeDShirtCanvas from "./apps/ThreeDShirtCanvas.svelte";
  import {
    ShoppingCart,
    ArrowLeft,
    Trash2,
    Plus,
    Minus,
    Check,
    X,
    Share2,
  } from "lucide-svelte";

  let {
    isClosing = false,
    onClose,
    initialCampaignId = $bindable(null),
    initialProductId = $bindable(null),
    depth = $bindable(0),
  } = $props();

  let products = $state([]);
  let campaigns = $state([]);
  let cart = $state([]);
  let isCartOpen = $state(false);
  let cartHistoryPushed = $state(false);
  let selectedProduct = $state(null);
  let lastSelectedProductId = $state("");
  let selectedCampaign = $state(null);
  let campaignBioText = $state("");
  let currentStoreMode = $state("fundraising"); // Default to "fundraising" per user requirement
  let activeImageIdx = $state(0);
  let scrollDirection = $state(1);
  let isVideoPlaying = $state(false);
  let selectedSize = $state("M");
  let sizes = [
    "6XS",
    "5XS",
    "4XS",
    "3XS",
    "2XS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
    "5XL",
    "6XL",
  ];

  $effect(() => {
    if (selectedProduct) {
      lastSelectedProductId = selectedProduct.id;
    }
  });

  // Resolve initial deep links on mount after data is loaded
  $effect(() => {
    if (products.length > 0 && initialProductId) {
      const matched = products.find((p) => p.id === initialProductId);
      if (
        matched &&
        (!selectedProduct || selectedProduct.id !== initialProductId)
      ) {
        selectedProduct = matched;
        currentStoreMode = "merch";
      }
    } else if (!initialProductId && selectedProduct !== null) {
      selectedProduct = null;
    }
  });

  $effect(() => {
    if (campaigns.length > 0 && initialCampaignId) {
      let resolvedId = initialCampaignId;
      if (resolvedId === "police-injustice") {
        resolvedId = "justice-for-rusty";
        initialCampaignId = "justice-for-rusty";
        history.replaceState(
          { view: "store", campaignId: resolvedId, depth: 2 },
          "",
          `/store/campaign/${resolvedId}`,
        );
      }
      const matched = campaigns.find((c) => c.id === resolvedId);
      if (
        matched &&
        (!selectedCampaign || selectedCampaign.id !== resolvedId)
      ) {
        selectedCampaign = matched;
        currentStoreMode = "fundraising";
        activeImageIdx = 0;
      }
    } else if (!initialCampaignId && selectedCampaign !== null) {
      selectedCampaign = null;
    }
  });

  $effect(() => {
    const camp = selectedCampaign;
    if (camp && camp.bioUrl) {
      fetch(camp.bioUrl)
        .then((res) => (res.ok ? res.text() : ""))
        .then((text) => {
          campaignBioText = text;
        })
        .catch((e) => {
          console.error("Error loading campaign bio:", e);
          campaignBioText = "";
        });
    } else {
      campaignBioText = "";
    }
  });

  /**
   * Helper to format a plain text bio into paragraphs with HTML links.
   * @param {string} text - The raw plaintext bio.
   * @returns {string[]} An array of formatted HTML paragraph strings.
   */
  function formatBioText(text) {
    if (!text) return [];
    const paragraphs = text.split(/\r?\n\r?\n/);
    return paragraphs.map((para) => {
      // Escape HTML characters
      const escaped = para
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      // Replace custom anchor tags like &lt;a href=&quot;url&quot;&gt;phrase&lt;/a&gt;
      const customAnchorRegex =
        /&lt;a href=&quot;(.+?)&quot;&gt;([\s\S]+?)&lt;\/a&gt;/g;
      const processed = escaped.replace(
        customAnchorRegex,
        (match, url, phrase) => {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-red-500 hover:text-red-400 underline decoration-red-500/30 hover:decoration-red-400 transition-colors duration-200">${phrase}</a>`;
        },
      );

      // Replace URL formats like &lt;https://...&gt; with clickable anchor tags
      const urlRegex = /&lt;(https?:\/\/[^&]+)&gt;/g;
      return processed.replace(urlRegex, (match, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-red-500 hover:text-red-400 underline decoration-red-500/30 hover:decoration-red-400 transition-colors duration-200 break-all">${url}</a>`;
      });
    });
  }

  $effect(() => {
    // Reset video playing state when active slide index changes
    const _idx = activeImageIdx;
    const _camp = selectedCampaign;
    untrack(() => {
      isVideoPlaying = false;
    });
  });

  // Navigation handlers that update URL history
  function selectProduct(product) {
    selectedProduct = product;
    initialProductId = product.id;
    currentStoreMode = "merch";
    depth = 2;
    history.pushState(
      { view: "store", productId: product.id, depth: 2 },
      "",
      `/store/product/${product.id}`,
    );
  }

  function deselectProduct() {
    selectedProduct = null;
    initialProductId = null;
    if (history.state?.productId) {
      history.back();
    } else if (window.location.pathname.includes("/store/product/")) {
      history.replaceState({ view: "store", depth: 1 }, "", "/store");
      depth = 1;
    }
  }

  function selectCampaign(campaign) {
    selectedCampaign = campaign;
    initialCampaignId = campaign.id;
    currentStoreMode = "fundraising";
    activeImageIdx = 0;
    scrollDirection = 1;
    depth = 2;
    history.pushState(
      { view: "store", campaignId: campaign.id, depth: 2 },
      "",
      `/store/campaign/${campaign.id}`,
    );
  }

  function slideIn(node, { duration = 300, direction = 1 }) {
    return {
      duration,
      css: (t) =>
        `transform: translate3d(${(1 - t) * 100 * direction}%, 0, 0);`,
    };
  }

  function slideOut(node, { duration = 300, direction = 1 }) {
    return {
      duration,
      css: (t) =>
        `transform: translate3d(${(1 - t) * -100 * direction}%, 0, 0);`,
    };
  }

  function terminalGlitchIn(node, { duration = 300 } = {}) {
    return {
      duration,
      css: (t, u) => {
        if (u === 0) return `opacity: 1; transform: none; filter: none;`;
        const randomSkew = (Math.random() * 30 - 15).toFixed(2);
        const randomShiftX = (Math.random() * 30 - 15).toFixed(1);
        const randomShiftY = (Math.random() * 8 - 4).toFixed(1);
        const randomRed = (Math.random() * 6 - 3).toFixed(0);
        const randomCyan = -randomRed;

        return `
          opacity: ${t > 0.15 ? 0.8 + Math.random() * 0.2 : t};
          transform: translate3d(${randomShiftX}px, ${randomShiftY}px, 0) skewX(${randomSkew}deg);
          filter: drop-shadow(${randomRed}px 0 0 rgba(239, 68, 68, 0.6)) drop-shadow(${randomCyan}px 0 0 rgba(16, 185, 129, 0.6));
        `;
      },
    };
  }

  function terminalGlitchOut(node, { duration = 250 } = {}) {
    return {
      duration,
      css: (t, u) => {
        if (t === 0) return `opacity: 0; transform: none; filter: none;`;
        const randomSkew = (Math.random() * 35 - 17.5).toFixed(2);
        const randomShiftX = (Math.random() * 35 - 17.5).toFixed(1);
        const randomShiftY = (Math.random() * 8 - 4).toFixed(1);
        const randomRed = (Math.random() * 6 - 3).toFixed(0);
        const randomCyan = -randomRed;

        return `
          opacity: ${t};
          transform: translate3d(${randomShiftX}px, ${randomShiftY}px, 0) skewX(${randomSkew}deg);
          filter: drop-shadow(${randomRed}px 0 0 rgba(239, 68, 68, 0.6)) drop-shadow(${randomCyan}px 0 0 rgba(16, 185, 129, 0.6));
        `;
      },
    };
  }

  function conditionalGlitchIn(node, options) {
    if (selectedProduct && selectedProduct.id === "fight-the-ceo") {
      return terminalGlitchIn(node, { duration: 300 });
    }
    return fade(node, { duration: 120 });
  }

  function conditionalGlitchOut(node, options) {
    if (lastSelectedProductId === "fight-the-ceo") {
      return terminalGlitchOut(node, { duration: 250 });
    }
    return fade(node, { duration: 80 });
  }

  // Workspace Swiping System
  let swipeStartX = 0;
  let swipeStartY = 0;
  let isSwiping = false;

  function handleWorkspacePointerDown(e) {
    if (e.button !== 0) return;
    isSwiping = true;
    swipeStartX = e.clientX;
    swipeStartY = e.clientY;
  }

  function handleWorkspacePointerUp(e) {
    if (!isSwiping) return;
    isSwiping = false;
    const deltaX = e.clientX - swipeStartX;
    const deltaY = e.clientY - swipeStartY;
    handleSwipeGesture(deltaX, deltaY);
  }

  function handleWorkspaceTouchStart(e) {
    if (e.touches.length === 1) {
      isSwiping = true;
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
    }
  }

  function handleWorkspaceTouchEnd(e) {
    if (!isSwiping) return;
    isSwiping = false;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = touch.clientY - swipeStartY;
    handleSwipeGesture(deltaX, deltaY);
  }

  function handleSwipeGesture(deltaX, deltaY) {
    if (selectedProduct || selectedCampaign) return;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        if (currentStoreMode === "merch") {
          currentStoreMode = "fundraising";
          deselectCampaign();
        }
      } else {
        if (currentStoreMode === "fundraising") {
          currentStoreMode = "merch";
          deselectProduct();
        }
      }
    }
  }

  function deselectCampaign() {
    selectedCampaign = null;
    initialCampaignId = null;
    if (history.state?.campaignId) {
      history.back();
    } else if (window.location.pathname.includes("/store/campaign/")) {
      history.replaceState({ view: "store", depth: 1 }, "", "/store");
      depth = 1;
    }
  }

  // Share system
  let showCopiedAlert = $state(false);
  let copyTimeout = null;

  function handleShare(type, id, e) {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/store/${type}/${id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        showCopiedAlert = true;
        if (copyTimeout) clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
          showCopiedAlert = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  }

  // Texas Representatives Geolocation & Metadata Mapping
  const TEXAS_REPS_META = [
    {
      email: "dan.patrick@ltgov.texas.gov",
      name: "Lt. Gov. Dan Patrick",
      title: "President of the Senate",
      region: "Statewide / Austin Capitol",
      lat: 30.2747,
      lng: -97.7404,
    },
    {
      email: "speaker@house.texas.gov",
      name: "Speaker of the House",
      title: "House Speaker",
      region: "Statewide / Austin Capitol",
      lat: 30.2747,
      lng: -97.7404,
    },
    {
      email: "senator.johnson@senate.texas.gov",
      name: "Sen. Nathan Johnson",
      title: "District 16",
      region: "Dallas City / DFW Metro",
      lat: 32.7767,
      lng: -96.797,
    },
    {
      email: "senator.west@senate.texas.gov",
      name: "Sen. Royce West",
      title: "District 23",
      region: "Dallas County / DFW Metro",
      lat: 32.73,
      lng: -96.82,
    },
    {
      email: "senator.hall@senate.texas.gov",
      name: "Sen. Bob Hall",
      title: "District 2",
      region: "Dallas Suburbs / Rockwall",
      lat: 32.9312,
      lng: -96.4597,
    },
    {
      email: "senator.bettencourt@senate.texas.gov",
      name: "Sen. Paul Bettencourt",
      title: "District 7",
      region: "Houston Metro",
      lat: 29.7604,
      lng: -95.3698,
    },
    {
      email: "senator.huffman@senate.texas.gov",
      name: "Sen. Joan Huffman",
      title: "District 17",
      region: "Houston / Fort Bend",
      lat: 29.5636,
      lng: -95.275,
    },
    {
      email: "senator.creighton@senate.texas.gov",
      name: "Sen. Brandon Creighton",
      title: "District 4",
      region: "North Houston / The Woodlands",
      lat: 30.3119,
      lng: -95.456,
    },
    {
      email: "senator.schwertner@senate.texas.gov",
      name: "Sen. Charles Schwertner",
      title: "District 5",
      region: "Austin Metro / Georgetown",
      lat: 30.6333,
      lng: -97.6772,
    },
    {
      email: "senator.zaffirini@senate.texas.gov",
      name: "Sen. Judith Zaffirini",
      title: "District 21",
      region: "San Antonio / Laredo",
      lat: 27.5306,
      lng: -99.4803,
    },
    {
      email: "senator.perry@senate.texas.gov",
      name: "Sen. Charles Perry",
      title: "District 28",
      region: "Lubbock / West TX",
      lat: 33.5779,
      lng: -101.8552,
    },
    {
      email: "senator.hughes@senate.texas.gov",
      name: "Sen. Bryan Hughes",
      title: "District 1",
      region: "Tyler / Longview / East TX",
      lat: 32.3513,
      lng: -95.3011,
    },
    {
      email: "senator.middleton@senate.texas.gov",
      name: "Sen. Mayes Middleton",
      title: "District 11",
      region: "Galveston / Gulf Coast",
      lat: 29.3013,
      lng: -94.7977,
    },
    {
      email: "senator.kolkhorst@senate.texas.gov",
      name: "Sen. Lois Kolkhorst",
      title: "District 18",
      region: "Brenham / Victoria",
      lat: 30.1669,
      lng: -96.3977,
    },
  ];

  // Email Lawmakers Action System
  let showEmailCopiedAlert = $state(false);
  let showSortMailPanel = $state(false);
  let selectedReps = $state([]);
  let isLocating = $state(false);
  let locationStatusText = $state("");
  let emailCopyTimeout = null;

  // Sync selected reps when campaign changes
  $effect(() => {
    if (selectedCampaign?.contactReps?.emails) {
      selectedReps = [...selectedCampaign.contactReps.emails];
      locationStatusText = "";
    }
  });

  function getRepInfo(email) {
    const meta = TEXAS_REPS_META.find((r) => r.email === email);
    if (meta) return meta;
    const namePart = email
      .split("@")[0]
      .replace("senator.", "")
      .replace(".", " ");
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    return {
      email,
      name: formattedName,
      title: "Representative",
      region: "Texas",
    };
  }

  function handleBlastEm(contactReps) {
    if (!contactReps || !contactReps.emails) return;
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(contactReps.emails.join(","))}&subject=${encodeURIComponent(contactReps.subject)}&body=${encodeURIComponent(contactReps.body)}`;
    window.location.href = mailtoUrl;
  }

  function handleEmailSelected(contactReps) {
    if (!contactReps || selectedReps.length === 0) return;
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(selectedReps.join(","))}&subject=${encodeURIComponent(contactReps.subject)}&body=${encodeURIComponent(contactReps.body)}`;
    window.location.href = mailtoUrl;
  }

  function handleToggleRep(email) {
    if (selectedReps.includes(email)) {
      selectedReps = selectedReps.filter((e) => e !== email);
    } else {
      selectedReps = [...selectedReps, email];
    }
  }

  function handleSelectAllReps(emails) {
    selectedReps = [...emails];
  }

  function handleDeselectAllReps() {
    selectedReps = [];
  }

  function handleUseLocation(allEmails) {
    if (!navigator.geolocation) {
      locationStatusText = "Geolocation is not supported by your browser.";
      return;
    }
    isLocating = true;
    locationStatusText = "Locating nearby Texas representatives...";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        isLocating = false;
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        // Calculate distance to each rep
        const sorted = TEXAS_REPS_META.map((rep) => {
          const dist = Math.hypot(rep.lat - userLat, rep.lng - userLng);
          return { email: rep.email, dist, name: rep.name };
        }).sort((a, b) => a.dist - b.dist);

        // Pick closest 4 reps
        const closestEmails = sorted.slice(0, 4).map((r) => r.email);

        // Filter by emails present in current campaign
        const validClosest = closestEmails.filter((e) => allEmails.includes(e));
        selectedReps =
          validClosest.length > 0 ? validClosest : allEmails.slice(0, 3);

        const topNames = validClosest
          .map((e) => getRepInfo(e).name)
          .slice(0, 2)
          .join(", ");
        locationStatusText = `📍 Selected closest reps (${topNames})`;
      },
      (err) => {
        isLocating = false;
        // Fallback: auto-select top central leadership reps
        selectedReps = allEmails.slice(0, 3);
        locationStatusText =
          "📍 Location access unavailable. Auto-selected key leadership reps.";
      },
      { timeout: 8000 },
    );
  }

  function handleCopyRepsEmails(emails) {
    if (!emails || emails.length === 0) return;
    navigator.clipboard
      .writeText(emails.join(", "))
      .then(() => {
        showEmailCopiedAlert = true;
        if (emailCopyTimeout) clearTimeout(emailCopyTimeout);
        emailCopyTimeout = setTimeout(() => {
          showEmailCopiedAlert = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy emails:", err);
      });
  }

  // Load products and campaigns on mount
  onMount(async () => {
    try {
      const res = await fetch("/data/products.json");
      if (res.ok) {
        products = await res.json();
      }
    } catch (e) {
      console.error("Error loading products:", e);
    }
    try {
      const res = await fetch("/data/campaigns.json");
      if (res.ok) {
        campaigns = await res.json();
      }
    } catch (e) {
      console.error("Error loading campaigns:", e);
    }
    loadCart();
  });

  // Load cart from localStorage and re-verify stock
  function loadCart() {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("wearedogs_cart");
    if (saved) {
      try {
        const parsedCart = JSON.parse(saved);
        // Verify stock immediately
        verifyCartStock(parsedCart);
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
  }

  // Stock verification engine
  function verifyCartStock(currentCart) {
    if (products.length === 0) {
      // If products haven't loaded yet, just set cart for now
      cart = currentCart;
      return;
    }

    let updatedCart = [];
    let removedItems = [];

    for (const item of currentCart) {
      const dbProduct = products.find((p) => p.id === item.id);
      if (dbProduct && dbProduct.inStock) {
        updatedCart.push(item);
      } else {
        removedItems.push(item.title);
      }
    }

    cart = updatedCart;
    saveCart();

    if (removedItems.length > 0) {
      alert(
        `The following items in your cart are no longer in stock and have been removed:\n- ${removedItems.join("\n- ")}`,
      );
    }
  }

  function saveCart() {
    if (typeof window !== "undefined") {
      localStorage.setItem("wearedogs_cart", JSON.stringify(cart));
    }
  }

  function addToCart(product, size) {
    if (!product.inStock) return;

    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size,
    );
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        size: size,
        image: product.image,
        checkoutUrl: product.checkoutUrl,
        quantity: 1,
      });
    }
    saveCart();
    isCartOpen = true;
  }

  function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
  }

  // Total price calculator
  let totalPrice = $derived(() => {
    let total = 0;
    for (const item of cart) {
      const priceNum = parseFloat(item.price.replace("$", ""));
      total += priceNum * item.quantity;
    }
    return `$${total.toFixed(2)}`;
  });

  // Re-verify stock when cart is opened
  $effect(() => {
    if (isCartOpen) {
      untrack(() => {
        verifyCartStock(cart);
      });
    }
  });

  function handleCheckout() {
    if (cart.length === 0) return;
    // Route to external checkout pipelines
    cart.forEach((item) => {
      window.open(item.checkoutUrl, "_blank");
    });
    // Clear cart after checkout
    cart = [];
    saveCart();
    isCartOpen = false;
  }

  // Sync cart drawer state with browser history (back button closes cart)
  $effect(() => {
    if (isCartOpen) {
      if (!history.state?.cartOpen && !cartHistoryPushed) {
        const nextDepth = depth + 1;
        history.pushState(
          {
            view: "store",
            cartOpen: true,
            productId: selectedProduct?.id || null,
            campaignId: selectedCampaign?.id || null,
            depth: nextDepth,
          },
          "",
        );
        cartHistoryPushed = true;
        depth = nextDepth;
      }
    } else {
      if (cartHistoryPushed) {
        history.back();
        cartHistoryPushed = false;
        depth = Math.max(1, depth - 1);
      }
    }
  });

  onDestroy(() => {
    if (cartHistoryPushed) {
      history.back();
      cartHistoryPushed = false;
    }
  });

  // Touch swipe handling for fundraising carousel
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  function handleTouchStart(e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }
  }

  function handleTouchEnd(e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      const swipeThreshold = 50;
      if (
        Math.abs(diffX) > swipeThreshold &&
        Math.abs(diffX) > Math.abs(diffY)
      ) {
        if (diffX > 0) {
          // Swipe left -> Next image/video
          scrollDirection = 1;
          activeImageIdx = (activeImageIdx + 1) % campaignMedia.length;
        } else {
          // Swipe right -> Previous image/video
          scrollDirection = -1;
          activeImageIdx =
            (activeImageIdx - 1 + campaignMedia.length) % campaignMedia.length;
        }
      }
    }
  }

  // Reactive/derived values for campaign media (support video & images)
  let campaignMedia = $derived(
    selectedCampaign?.media?.length > 0
      ? selectedCampaign.media
      : selectedCampaign?.images?.map((img) => ({ type: "image", url: img })) ||
          [],
  );

  let currentMediaItem = $derived(campaignMedia[activeImageIdx] || null);

  function handlePopState(e) {
    if (!e.state?.cartOpen && isCartOpen) {
      isCartOpen = false;
      cartHistoryPushed = false;
      if (e.state?.depth !== undefined) {
        depth = e.state.depth;
      }
    } else if (e.state?.cartOpen && !isCartOpen) {
      isCartOpen = true;
      cartHistoryPushed = true;
      if (e.state?.depth !== undefined) {
        depth = e.state.depth;
      }
    }
  }
</script>

<svelte:window onpopstate={handlePopState} />

<BasePanel title="DOGS SHOP" {isClosing} {onClose}>
  <div
    class="store-container w-full h-full relative font-mono text-zinc-100 flex flex-col"
  >
    <!-- Header Controls -->
    <div
      class="flex justify-between items-center px-4 h-14 bg-zinc-950/20 border-b border-zinc-800 shrink-0"
    >
      <div class="flex items-center h-full">
        {#if currentStoreMode === "merch" && selectedProduct}
          <button
            class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-semibold cursor-pointer py-1 px-2.5 hover:bg-zinc-900/60 rounded-lg"
            onclick={deselectProduct}
          >
            <ArrowLeft size={16} /> BACK TO CATALOG
          </button>
        {:else if currentStoreMode === "fundraising" && selectedCampaign}
          <button
            class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-semibold cursor-pointer py-1 px-2.5 hover:bg-zinc-900/60 rounded-lg"
            onclick={deselectCampaign}
          >
            <ArrowLeft size={16} /> BACK TO CAMPAIGNS
          </button>
        {:else}
          <!-- Mode Toggle Switch -->
          <div
            class="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 gap-1"
          >
            <button
              class="px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 cursor-pointer"
              class:bg-white={currentStoreMode === "merch"}
              class:text-black={currentStoreMode === "merch"}
              class:text-zinc-400={currentStoreMode !== "merch"}
              onclick={() => {
                currentStoreMode = "merch";
                deselectProduct();
              }}
            >
              <span class="hidden sm:inline">MERCHANDISE</span>
              <span class="inline sm:hidden text-sm">👕</span>
            </button>
            <button
              class="px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all duration-200 cursor-pointer"
              class:bg-white={currentStoreMode === "fundraising"}
              class:text-black={currentStoreMode === "fundraising"}
              class:text-zinc-400={currentStoreMode !== "fundraising"}
              onclick={() => {
                currentStoreMode = "fundraising";
                deselectCampaign();
              }}
            >
              <span class="hidden sm:inline">FUNDRAISERS</span>
              <span class="inline sm:hidden text-sm">🎡</span>
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Main Workspace -->
    <div
      class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 grid-rows-1"
      onpointerdown={handleWorkspacePointerDown}
      onpointerup={handleWorkspacePointerUp}
      ontouchstart={handleWorkspaceTouchStart}
      ontouchend={handleWorkspaceTouchEnd}
      role="region"
      aria-label="Store Catalog Panel"
    >
      {#if currentStoreMode === "merch"}
        <div
          class="w-full col-start-1 row-start-1"
          transition:fade={{ duration: 200 }}
        >
          {#if !selectedProduct}
            <!-- WARNING NOTICE BANNER -->
            {#if !products.some((p) => p.inStock)}
              <div
                class="max-w-7xl mx-auto mb-6 p-4 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 font-mono text-xs flex items-center gap-3 shadow-lg"
              >
                <span class="text-xl select-none">⚠️</span>
                <div>
                  <span
                    class="font-bold text-red-400 uppercase tracking-wider block text-xs sm:text-sm"
                  >
                    NOTHING FOR SALE RIGHT NOW
                  </span>
                  <span
                    class="text-[11px] text-zinc-400 font-sans mt-0.5 block"
                  >
                    All official merchandise is currently out of stock or
                    unavailable. Please check back later or visit our active
                    Fundraisers tab!
                  </span>
                </div>
              </div>
            {/if}

            <!-- MERCHANDISE GRID VIEW -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
              in:fade={{ duration: 120 }}
              out:fade={{ duration: 80 }}
            >
              {#each products as product}
                <div
                  class="relative flex flex-col justify-between overflow-hidden bg-zinc-900/40 border border-zinc-800 rounded-xl transition-all duration-300 group hover:border-zinc-700"
                >
                  <!-- Caution tape for sold-out items -->
                  {#if !product.inStock}
                    <div
                      class="absolute inset-0 bg-black/60 z-10 flex items-center justify-center pointer-events-none"
                    >
                      <div
                        class="caution-tape text-center py-2 w-[150%] rotate-12 bg-yellow-400 text-black font-black text-sm tracking-widest uppercase border-y-2 border-black select-none shadow-lg"
                      >
                        SOLD OUT
                      </div>
                    </div>
                  {/if}

                  <!-- Product Graphic Box -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="aspect-square bg-black/20 border-b border-zinc-800/60 flex flex-col items-center justify-center relative cursor-pointer overflow-hidden"
                    onclick={() => product.inStock && selectProduct(product)}
                  >
                    {#if product.image && product.image.startsWith("http")}
                      <img
                        src={product.image}
                        alt={product.title}
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    {:else}
                      <div
                        class="w-24 h-24 text-zinc-700 group-hover:text-zinc-500 transition-colors duration-300 flex items-center justify-center"
                      >
                        {#if product.title.includes("FIGHT") || product.title.includes("CEO")}
                          <span class="text-5xl select-none">🥊</span>
                        {:else if product.title.includes("T-SHIRT")}
                          <svg
                            viewBox="0 0 24 24"
                            class="w-16 h-16 fill-none stroke-current"
                            stroke-width="1.5"
                          >
                            <path
                              d="M4 8.5V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5M4 8.5L8 5m-4 3.5l-2-1.5L4 4m16 4.5l-4-3.5m4 3.5l2-1.5L20 4M8 5a4 4 0 0 1 8 0"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        {:else if product.title.includes("HOODIE")}
                          <svg
                            viewBox="0 0 24 24"
                            class="w-16 h-16 fill-none stroke-current"
                            stroke-width="1.5"
                          >
                            <path
                              d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9m-14 0l3-5m11 5l-3-5m-8 0h6m-3 0v4m0 0a2 2 0 1 0 0 4 2 2 0 1 0 0-4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        {:else if product.title.includes("HAT")}
                          <svg
                            viewBox="0 0 24 24"
                            class="w-16 h-16 fill-none stroke-current"
                            stroke-width="1.5"
                          >
                            <path
                              d="M2 17h20M6 17v-4a6 6 0 0 1 12 0v4M12 7V4m0 0l-2 1m2-1l2 1"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        {:else}
                          <svg
                            viewBox="0 0 24 24"
                            class="w-16 h-16 fill-none stroke-current"
                            stroke-width="1.5"
                          >
                            <path
                              d="M7 4h10v12a4 4 0 0 1-8 0V4zM7 8h10M9 16h6"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        {/if}
                      </div>
                    {/if}
                  </div>

                  <!-- Product Details -->
                  <div class="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3
                        class="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors duration-200"
                      >
                        {product.title}
                      </h3>
                      <p class="text-xs text-zinc-500 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>
                    <div
                      class="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/40"
                    >
                      <span class="font-bold text-sm text-red-500"
                        >{product.price}</span
                      >
                      <button
                        class="px-3 py-1 bg-white text-black font-bold text-xs rounded hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer disabled:cursor-not-allowed"
                        disabled={!product.inStock}
                        onclick={() => selectProduct(product)}
                      >
                        VIEW
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <!-- DETAIL VIEW -->
            <div
              class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch"
              in:conditionalGlitchIn
              out:conditionalGlitchOut
            >
              <!-- Left: Product Picture Slideshow -->
              <div
                class="w-full bg-black/40 border border-zinc-800 rounded-2xl flex flex-col items-center justify-between p-3 relative overflow-hidden mx-auto h-full max-h-[380px] lg:max-h-[460px] xl:max-h-[500px]"
              >
                <ProductImageSlideshow
                  images={selectedProduct.images ||
                    (selectedProduct.image ? [selectedProduct.image] : [])}
                  productTitle={selectedProduct.title}
                />
              </div>

              <!-- Right: Details -->
              <div
                class="flex flex-col justify-between h-full bg-zinc-900/20 border border-zinc-800/60 p-4 sm:p-5 rounded-2xl max-h-[380px] lg:max-h-[460px] xl:max-h-[500px] overflow-y-auto custom-scrollbar"
              >
                <div>
                  <div class="flex justify-between items-start gap-3">
                    <h1
                      class="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-wider"
                    >
                      {selectedProduct.title}
                    </h1>
                    <div class="flex items-center gap-2 shrink-0">
                      <span
                        class="text-base sm:text-lg lg:text-xl text-red-500 font-black"
                        >{selectedProduct.price}</span
                      >
                      <button
                        onclick={(e) =>
                          handleShare("product", selectedProduct.id, e)}
                        class="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                        title="Copy Share Link"
                      >
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div class="mt-2 sm:mt-3 pb-3 border-b border-zinc-800/80">
                    <p
                      class="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans"
                    >
                      {selectedProduct.description}
                    </p>
                  </div>

                  <!-- Size selector -->
                  {#if selectedProduct.id === "fight-the-ceo" || (selectedProduct.checkoutUrl && (!selectedProduct.sizes || selectedProduct.sizes.length === 0))}
                    <!-- No size selector for FIGHT THE CEO or direct Cash App checkout items -->
                  {:else if selectedProduct.sizes && selectedProduct.sizes.length > 0 && selectedProduct.sizes[0] !== "One Size"}
                    <div class="mt-3 sm:mt-4">
                      <span
                        class="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-2"
                        >SELECT SIZE</span
                      >
                      <div class="flex flex-wrap gap-2">
                        {#each selectedProduct.sizes as size}
                          <button
                            class="px-3 py-1.5 border border-zinc-800 rounded text-xs font-bold hover:border-zinc-500 transition-all duration-200 cursor-pointer"
                            class:active-size={selectedSize === size}
                            onclick={() => (selectedSize = size)}
                          >
                            {size}
                          </button>
                        {/each}
                      </div>
                    </div>
                  {:else}
                    <div class="mt-3 sm:mt-4">
                      <span
                        class="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1"
                        >SIZE</span
                      >
                      <span class="text-sm font-bold text-zinc-400"
                        >ONE SIZE</span
                      >
                    </div>
                  {/if}
                </div>

                <div
                  class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-zinc-800/80 shrink-0"
                >
                  {#if selectedProduct.id === "fight-the-ceo" || selectedProduct.checkoutUrl}
                    <a
                      href={selectedProduct.checkoutUrl ||
                        "https://cash.app/$cptnbrando"}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/30 cursor-pointer text-center"
                    >
                      🟢 PAY & CHALLENGE VIA CASH APP ($cptnbrando)
                    </a>
                  {:else}
                    <button
                      class="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/30 cursor-pointer"
                      onclick={() =>
                        window.open("https://cash.app/$cptnbrando", "_blank")}
                    >
                      <ShoppingCart size={18} /> ADD TO CART
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <!-- FUNDRAISING MODE -->
        <div
          class="w-full col-start-1 row-start-1"
          transition:fade={{ duration: 200 }}
        >
          {#if !selectedCampaign}
            <!-- CAMPAIGNS CATALOG -->
            <div class="max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in">
              <!-- Active Campaigns Section -->
              <div>
                <h2
                  class="text-sm font-bold text-white tracking-widest uppercase mb-4 border-b border-zinc-850 pb-2"
                >
                  ⚡ ACTIVE CAMPAIGNS
                </h2>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {#each campaigns.filter((c) => c.status === "active") as campaign}
                    {@const raisedVal = parseFloat(
                      campaign.raised.replace(/[^0-9.]/g, ""),
                    )}
                    {@const goalVal = parseFloat(
                      campaign.goal.replace(/[^0-9.]/g, ""),
                    )}
                    {@const progressVal = Math.min(
                      100,
                      Math.round((raisedVal / goalVal) * 100),
                    )}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                      class="bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 group"
                      onclick={() => selectCampaign(campaign)}
                    >
                      <div>
                        <div
                          class="aspect-video w-full rounded-lg overflow-hidden bg-black/40 border border-zinc-800/60 mb-3 relative"
                        >
                          <img
                            src={campaign.images[0]}
                            alt={campaign.title}
                            class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                          />
                          <span
                            class="absolute top-2 left-2 px-1.5 py-0.5 bg-emerald-600 text-white font-bold font-mono text-[9px] tracking-widest uppercase rounded"
                            >ACTIVE</span
                          >
                        </div>
                        <h3
                          class="font-bold text-sm text-zinc-100 group-hover:text-white uppercase transition-colors"
                        >
                          {campaign.title}
                        </h3>
                        <p class="text-xs text-zinc-500 line-clamp-2 mt-1.5">
                          {campaign.description}
                        </p>
                      </div>

                      {#if campaign.id !== "save-texas-hemp"}
                        <div class="mt-4 pt-3 border-t border-zinc-800/40">
                          <div
                            class="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1.5"
                          >
                            <span>
                              {#if campaign.id === "sidewalk-chalk-defense" || campaign.id === "browser-age-api"}
                                Signatures: {progressVal}%
                              {:else}
                                Progress: {progressVal}%
                              {/if}
                            </span>
                            <span class="text-red-500 font-bold">
                              {#if campaign.id === "sidewalk-chalk-defense" || campaign.id === "browser-age-api"}
                                {campaign.raised.replace('$', '')} / {campaign.goal.replace('$', '')}
                              {:else}
                                {campaign.raised} / {campaign.goal}
                              {/if}
                            </span>
                          </div>
                          <div
                            class="w-full h-1.5 bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden"
                          >
                            <div
                              class="h-full bg-red-500"
                              style="width: {progressVal}%"
                            ></div>
                          </div>
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Completed Campaigns Section -->
              {#if campaigns.some((c) => c.status === "completed")}
                <div>
                  <h2
                    class="text-sm font-bold text-zinc-500 tracking-widest uppercase mb-4 border-b border-zinc-850 pb-2"
                  >
                    ✓ COMPLETED CAMPAIGNS
                  </h2>
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-opacity duration-200"
                  >
                    {#each campaigns.filter((c) => c.status === "completed") as campaign}
                      <!-- svelte-ignore a11y_click_events_have_key_events -->
                      <!-- svelte-ignore a11y_no_static_element_interactions -->
                      <div
                        class="bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 group"
                        onclick={() => selectCampaign(campaign)}
                      >
                        <div>
                          <div
                            class="aspect-video w-full rounded-lg overflow-hidden bg-black/45 border border-zinc-900 mb-3 relative grayscale"
                          >
                            <img
                              src={campaign.images[0]}
                              alt={campaign.title}
                              class="w-full h-full object-cover"
                            />
                            <span
                              class="absolute top-2 left-2 px-1.5 py-0.5 bg-orange-600 text-white font-bold font-mono text-[9px] tracking-widest uppercase rounded"
                              >COMPLETED</span
                            >
                          </div>
                          <h3
                            class="font-bold text-sm text-zinc-400 group-hover:text-white uppercase transition-colors"
                          >
                            {campaign.title}
                          </h3>
                          <p class="text-xs text-zinc-650 line-clamp-2 mt-1.5">
                            {campaign.description}
                          </p>
                        </div>

                        <div class="mt-4 pt-3 border-t border-zinc-900">
                          <div
                            class="flex justify-between items-center text-[10px] font-mono text-zinc-500"
                          >
                            <span>Funded: 100%+</span>
                            <span class="text-emerald-500 font-bold"
                              >{campaign.raised} raised</span
                            >
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            {@const raisedNum = parseFloat(
              selectedCampaign.raised.replace(/[^0-9.]/g, ""),
            )}
            {@const goalNum = parseFloat(
              selectedCampaign.goal.replace(/[^0-9.]/g, ""),
            )}
            {@const progressPct = Math.min(
              100,
              Math.round((raisedNum / goalNum) * 100),
            )}
            <!-- STEAM-STYLE CAMPAIGN VIEW -->
            <div
              class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start animate-fade-in"
            >
              <!-- Left Side: Media Carousel (Col 7) -->
              <div
                class="sm:col-span-7 flex flex-col gap-3 sm:gap-4 sm:sticky sm:top-4 md:top-6 lg:top-8"
              >
                <!-- Big Image Showcase -->
                <div
                  class="relative w-full aspect-video bg-black/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg group max-h-[200px] sm:max-h-[260px] md:max-h-[320px] lg:max-h-[360px] xl:max-h-[400px] touch-pan-y"
                  ontouchstart={handleTouchStart}
                  ontouchend={handleTouchEnd}
                  role="region"
                  aria-label="Campaign Media Showcase"
                >
                  {#key activeImageIdx}
                    {#if currentMediaItem}
                      {#if currentMediaItem.type === "video"}
                        {#if isVideoPlaying}
                          {#if currentMediaItem.url.includes("youtube.com") || currentMediaItem.url.includes("youtu.be")}
                            <iframe
                              in:slideIn={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              out:slideOut={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              src={currentMediaItem.url +
                                (currentMediaItem.url.includes("?")
                                  ? "&autoplay=1"
                                  : "?autoplay=1")}
                              title="Fundraiser video player"
                              class="absolute inset-0 w-full h-full"
                              style="border: none;"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerpolicy="strict-origin-when-cross-origin"
                              allowfullscreen
                            ></iframe>
                          {:else}
                            <video
                              in:slideIn={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              out:slideOut={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              src={currentMediaItem.url}
                              class="absolute inset-0 w-full h-full object-cover"
                              controls
                              autoplay
                              muted
                              loop
                              playsinline
                            ></video>
                          {/if}
                        {:else}
                          <!-- svelte-ignore a11y_click_events_have_key_events -->
                          <!-- svelte-ignore a11y_no_static_element_interactions -->
                          <div
                            class="absolute inset-0 w-full h-full cursor-pointer"
                            onclick={() => (isVideoPlaying = true)}
                          >
                            <img
                              in:slideIn={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              out:slideOut={{
                                duration: 300,
                                direction: scrollDirection,
                              }}
                              src={currentMediaItem.thumbnail ||
                                (selectedCampaign.images &&
                                  selectedCampaign.images[0])}
                              alt={selectedCampaign.title}
                              class="absolute inset-0 w-full h-full object-cover"
                            />
                            <div
                              class="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/45 transition-colors duration-200"
                            >
                              <div
                                class="w-16 h-16 rounded-full bg-black/70 hover:bg-red-600 border border-white/10 flex items-center justify-center transition-all duration-300 shadow-2xl scale-95 hover:scale-105"
                              >
                                <span
                                  class="text-white text-2xl ml-1 select-none"
                                  >▶</span
                                >
                              </div>
                            </div>
                          </div>
                        {/if}
                      {:else}
                        <img
                          in:slideIn={{
                            duration: 300,
                            direction: scrollDirection,
                          }}
                          out:slideOut={{
                            duration: 300,
                            direction: scrollDirection,
                          }}
                          src={currentMediaItem.url}
                          alt={selectedCampaign.title}
                          class="absolute inset-0 w-full h-full object-cover"
                        />
                      {/if}
                    {/if}
                  {/key}

                  <!-- Navigation Chevrons -->
                  {#if campaignMedia.length > 1}
                    <button
                      class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/85 border border-zinc-800 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                      onclick={() => {
                        scrollDirection = -1;
                        activeImageIdx =
                          (activeImageIdx - 1 + campaignMedia.length) %
                          campaignMedia.length;
                      }}
                    >
                      ◀
                    </button>
                    <button
                      class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/85 border border-zinc-800 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-20"
                      onclick={() => {
                        scrollDirection = 1;
                        activeImageIdx =
                          (activeImageIdx + 1) % campaignMedia.length;
                      }}
                    >
                      ▶
                    </button>
                  {/if}

                  <!-- Indicator dots -->
                  <div
                    class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none"
                  >
                    {#each campaignMedia as _, idx}
                      <span
                        class="w-1.5 h-1.5 rounded-full transition-all duration-200 {activeImageIdx ===
                        idx
                          ? 'bg-white'
                          : 'bg-white/30'}"
                      ></span>
                    {/each}
                  </div>
                </div>

                <!-- Thumbnails row -->
                <div class="flex gap-3 overflow-x-auto pb-1">
                  {#each campaignMedia as mediaItem, idx}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
                    <div
                      role="button"
                      tabindex="0"
                      onclick={() => {
                        scrollDirection = idx > activeImageIdx ? 1 : -1;
                        activeImageIdx = idx;
                      }}
                      class="relative w-20 aspect-video rounded-lg border overflow-hidden cursor-pointer hover:border-zinc-400 transition-all duration-200 bg-zinc-950 shrink-0"
                      class:border-red-500={activeImageIdx === idx}
                      class:border-zinc-800={activeImageIdx !== idx}
                    >
                      {#if mediaItem.type === "video"}
                        <img
                          src={mediaItem.thumbnail || mediaItem.url}
                          alt="Video Thumbnail"
                          class="w-full h-full object-cover opacity-80"
                        />
                        <div
                          class="absolute inset-0 flex items-center justify-center bg-black/40"
                        >
                          <span class="text-white text-xs select-none">▶</span>
                        </div>
                      {:else}
                        <img
                          src={mediaItem.url}
                          alt="Thumbnail"
                          class="w-full h-full object-cover"
                        />
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Right Side: Details & Milestone Progression (Col 5) -->
              <div
                class="sm:col-span-5 flex flex-col justify-between bg-zinc-900/20 border border-zinc-800/60 p-4 sm:p-5 lg:p-6 rounded-2xl"
              >
                <div>
                  <div
                    class="flex justify-between items-start gap-3 border-b border-zinc-850 pb-4"
                  >
                    <div>
                      {#if selectedCampaign.status === "active"}
                        <span
                          class="px-2 py-0.5 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono text-[9px] tracking-widest uppercase rounded"
                        >
                          ACTIVE
                        </span>
                      {:else}
                        <span
                          class="px-2 py-0.5 bg-orange-600/10 border border-orange-500/30 text-orange-400 font-bold font-mono text-[9px] tracking-widest uppercase rounded"
                        >
                          COMPLETED
                        </span>
                      {/if}
                      <h1
                        class="text-xl sm:text-2xl font-extrabold tracking-wider mt-2 uppercase"
                      >
                        {selectedCampaign.title}
                      </h1>
                    </div>
                    <button
                      onclick={(e) =>
                        handleShare("campaign", selectedCampaign.id, e)}
                      class="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer mt-2 shrink-0"
                      title="Copy Share Link"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>

                  {#if selectedCampaign.id === "justice-for-rusty"}
                    <!-- Full scroll bio, no max-height scrollbar constraint -->
                    <div
                      class="mt-3 sm:mt-4 pb-4 flex flex-col gap-4 selectable-bio"
                    >
                      {#if campaignBioText}
                        {#each formatBioText(campaignBioText) as paragraph}
                          <p
                            class="text-zinc-400 text-sm leading-relaxed font-sans"
                          >
                            {@html paragraph}
                          </p>
                        {/each}
                      {:else}
                        <p
                          class="text-zinc-400 text-sm leading-relaxed font-sans"
                        >
                          {selectedCampaign.description}
                        </p>
                      {/if}
                    </div>

                    <hr class="border-zinc-850 my-2" />

                    <!-- Donation & Social Link Buttons -->
                    {#if selectedCampaign.goFundMeUrl}
                      <div class="mb-3 mt-3">
                        <a
                          href={selectedCampaign.goFundMeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-900/20 cursor-pointer text-center"
                        >
                          🧡 SECURE DONATE VIA GOFUNDME
                        </a>
                      </div>
                    {/if}

                    {#if selectedCampaign.venmoUrl}
                      <div class="mb-3">
                        <a
                          href={selectedCampaign.venmoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-[#008CFF] hover:bg-[#0074D9] text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-900/20 cursor-pointer text-center"
                        >
                          💙 SECURE DONATE VIA VENMO (@{selectedCampaign.venmoUrl.substring(
                            selectedCampaign.venmoUrl.lastIndexOf("/") + 1,
                          )})
                        </a>
                      </div>
                    {/if}

                    {#if selectedCampaign.cashAppUrl}
                      <div class="mb-3">
                        <a
                          href={selectedCampaign.cashAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/25 cursor-pointer text-center"
                        >
                          🟢 SECURE DONATE VIA CASH APP ({selectedCampaign.cashAppUrl.substring(
                            selectedCampaign.cashAppUrl.lastIndexOf("/") + 1,
                          )})
                        </a>
                      </div>
                    {/if}

                    {#if selectedCampaign.petitionUrl}
                      <div class="mb-3">
                        <a
                          href={selectedCampaign.petitionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-[#EC2C22] hover:bg-[#D61E15] text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/20 cursor-pointer text-center"
                        >
                          ✍️ SIGN THE CHANGE.ORG PETITION
                        </a>
                      </div>
                    {/if}

                    {#if selectedCampaign.instagramUrl}
                      <div class="mb-4">
                        <a
                          href={selectedCampaign.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="w-full py-3.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-95 text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-pink-900/20 cursor-pointer text-center"
                        >
                          📸 FOLLOW ON INSTAGRAM (@{selectedCampaign.instagramUrl
                            .replace(/\/$/, "")
                            .substring(
                              selectedCampaign.instagramUrl
                                .replace(/\/$/, "")
                                .lastIndexOf("/") + 1,
                            )})
                        </a>
                      </div>
                    {/if}
                  {:else}
                    <!-- Legacy/Standard layout for other campaigns with milestones/progress -->
                    <div
                      class="mt-3 sm:mt-4 pb-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar selectable-bio"
                    >
                      {#if campaignBioText}
                        {#each formatBioText(campaignBioText) as paragraph}
                          <p
                            class="text-zinc-400 text-sm leading-relaxed font-sans"
                          >
                            {@html paragraph}
                          </p>
                        {/each}
                      {:else}
                        <p
                          class="text-zinc-400 text-sm leading-relaxed font-sans"
                        >
                          {selectedCampaign.description}
                        </p>
                      {/if}
                    </div>

                    <hr class="border-zinc-850 my-2" />

                    <div class="milestones-section mt-3 sm:mt-4">
                      {#if selectedCampaign.id !== "save-texas-hemp"}
                        <div
                          class="flex justify-between items-center mb-2 font-bold font-mono text-xs"
                        >
                          <span class="text-zinc-500 uppercase tracking-widest">
                            {#if selectedCampaign.id === "sidewalk-chalk-defense" || selectedCampaign.id === "browser-age-api"}
                              PETITION SIGNATURES
                            {:else}
                              FUNDING PERCENTAGE
                            {/if}
                          </span>
                          <span class="text-red-500 text-sm">
                            {#if selectedCampaign.id === "sidewalk-chalk-defense" || selectedCampaign.id === "browser-age-api"}
                              {selectedCampaign.raised.replace('$', '')} / {selectedCampaign.goal.replace('$', '')} Signatures ({progressPct}%)
                            {:else}
                              {selectedCampaign.raised} / {selectedCampaign.goal} ({progressPct}%)
                            {/if}
                          </span>
                        </div>

                        <div
                          class="w-full h-3 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden relative mb-4"
                        >
                          <div
                            class="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                            style="width: {progressPct}%"
                          ></div>
                        </div>
                      {/if}

                      <!-- Representative Contact Tool (if available) -->
                      {#if selectedCampaign.contactReps}
                        <div class="mb-4 flex flex-col gap-2.5">
                          <!-- BLAST 'EM / SEND MAIL Primary Action Button -->
                          {#if !showSortMailPanel}
                            <button
                              onclick={() =>
                                handleBlastEm(selectedCampaign.contactReps)}
                              class="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-black rounded-xl text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
                            >
                              💌
                              {#if selectedCampaign.id === "browser-age-api"}
                                SEND PETITION EMAIL (CONTACT ALL)
                              {:else}
                                BLAST 'EM (EMAIL ALL LAWMAKERS)
                              {/if}
                            </button>
                          {:else}
                            <button
                              onclick={() =>
                                handleEmailSelected(
                                  selectedCampaign.contactReps,
                                )}
                              disabled={selectedReps.length === 0}
                              class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-black rounded-xl text-xs sm:text-sm tracking-widest uppercase transition-all duration-200 flex flex-col items-center justify-center gap-0.5 shadow-xl shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span class="flex items-center gap-1.5">
                                💌
                                {#if selectedCampaign.id === "browser-age-api"}
                                  SEND PETITION ({selectedReps.length})
                                {:else}
                                  SEND MAIL ({selectedReps.length})
                                {/if}
                              </span>
                              <span
                                class="text-[10px] font-mono text-zinc-950/80 font-semibold normal-case tracking-normal truncate max-w-full px-2"
                              >
                                {selectedReps.length > 0
                                  ? selectedReps.join(", ")
                                  : "No emails selected"}
                              </span>
                            </button>
                          {/if}

                          <!-- Secondary Tool Buttons -->
                          <div class="flex gap-2">
                            <button
                              onclick={() =>
                                (showSortMailPanel = !showSortMailPanel)}
                              class="flex-1 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-emerald-400 hover:text-emerald-300 font-bold rounded-xl text-[11px] tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                            >
                              {#if selectedCampaign.id === "browser-age-api"}
                                📬 SELECT RECIPIENTS {showSortMailPanel
                                  ? "▲"
                                  : "▼"}
                              {:else}
                                📬 SORT THE MAIL FOR 'EM {showSortMailPanel
                                  ? "▲"
                                  : "▼"}
                              {/if}
                            </button>
                            <button
                              onclick={() =>
                                handleCopyRepsEmails(
                                  selectedCampaign.contactReps.emails,
                                )}
                              class="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-bold rounded-xl text-[11px] tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                              title="Copy all email addresses"
                            >
                              📋 COPY ALL
                            </button>
                          </div>

                          <!-- SORT THE MAIL Interactive Selection Dropdown Panel -->
                          {#if showSortMailPanel}
                            <div
                              transition:fade={{ duration: 150 }}
                              class="p-3.5 bg-zinc-950/95 border border-zinc-800 rounded-xl flex flex-col gap-3 shadow-2xl animate-fade-in"
                            >
                              <!-- Geolocation & Region Selector -->
                              <div
                                class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-850"
                              >
                                <button
                                  onclick={() =>
                                    handleUseLocation(
                                      selectedCampaign.contactReps.emails,
                                    )}
                                  disabled={isLocating}
                                  class="py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                >
                                  📍 {isLocating
                                    ? "LOCATING..."
                                    : "USE LOCATION (AUTO-SELECT CLOSEST)"}
                                </button>

                                <div
                                  class="flex items-center gap-2 text-[10px] font-mono text-zinc-400 self-end sm:self-auto"
                                >
                                  <button
                                    onclick={() =>
                                      handleSelectAllReps(
                                        selectedCampaign.contactReps.emails,
                                      )}
                                    class="text-emerald-400 hover:underline cursor-pointer"
                                  >
                                    Select All
                                  </button>
                                  <span>•</span>
                                  <button
                                    onclick={handleDeselectAllReps}
                                    class="text-zinc-500 hover:text-zinc-300 hover:underline cursor-pointer"
                                  >
                                    Deselect All
                                  </button>
                                </div>
                              </div>

                              {#if locationStatusText}
                                <div
                                  class="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-500/20"
                                >
                                  {locationStatusText}
                                </div>
                              {/if}

                              <!-- Checked Counter & List -->
                              <div
                                class="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex justify-between items-center"
                              >
                                <span>SELECT SPECIFIC REPRESENTATIVES:</span>
                                <span class="text-emerald-400"
                                  >{selectedReps.length} / {selectedCampaign
                                    .contactReps.emails.length} Selected</span
                                >
                              </div>

                              <div
                                class="max-h-44 overflow-y-auto custom-scrollbar flex flex-col gap-1.5 pr-1"
                              >
                                {#each selectedCampaign.contactReps.emails as email}
                                  {@const meta = getRepInfo(email)}
                                  {@const isChecked =
                                    selectedReps.includes(email)}
                                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                                  <div
                                    onclick={() => handleToggleRep(email)}
                                    class="flex items-center gap-2.5 p-2 rounded-lg border transition-all cursor-pointer select-none text-[11px] {isChecked
                                      ? 'bg-emerald-950/30 border-emerald-500/40 text-zinc-100'
                                      : 'bg-zinc-900/40 border-zinc-850 text-zinc-400'}"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onchange={() => handleToggleRep(email)}
                                      class="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                                    />
                                    <div class="flex-1 min-w-0 flex flex-col">
                                      <div
                                        class="font-bold flex items-center justify-between gap-1"
                                      >
                                        <span class="truncate">{meta.name}</span
                                        >
                                        <span
                                          class="text-[9px] font-mono text-zinc-500 shrink-0"
                                          >{meta.region}</span
                                        >
                                      </div>
                                      <div
                                        class="text-[10px] font-mono text-zinc-500 truncate"
                                      >
                                        {email}
                                      </div>
                                    </div>
                                  </div>
                                {/each}
                              </div>

                              <!-- Action for Selected -->
                              <div
                                class="pt-2 border-t border-zinc-850 flex gap-2"
                              >
                                <button
                                  onclick={() =>
                                    handleEmailSelected(
                                      selectedCampaign.contactReps,
                                    )}
                                  disabled={selectedReps.length === 0}
                                  class="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-lg text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  📩 EMAIL SELECTED REPS ({selectedReps.length})
                                </button>
                                <button
                                  onclick={() =>
                                    handleCopyRepsEmails(selectedReps)}
                                  disabled={selectedReps.length === 0}
                                  class="px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-lg text-[11px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  📋 COPY
                                </button>
                              </div>
                            </div>
                          {/if}
                        </div>
                      {/if}

                      <!-- Donations Status / Pending Notice -->
                      {#if selectedCampaign.donationsStatus === "coming_soon"}
                        <div
                          class="mb-4 p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl text-amber-300 font-mono text-xs flex flex-col gap-1.5 shadow-lg"
                        >
                          <div
                            class="flex items-center gap-2 font-bold text-amber-400"
                          >
                            <span class="text-base">💳</span> DONATIONS CURRENTLY
                            INACTIVE
                          </div>
                          <p
                            class="text-[11px] text-amber-200/80 leading-relaxed font-sans"
                          >
                            Stripe payment gateway integration is currently
                            being configured for this campaign. Direct financial
                            contributions are not active yet. In the meantime,
                            please use the button above to email Texas lawmakers
                            directly!
                          </p>
                        </div>
                      {/if}

                      <!-- GoFundMe Link button (if exists) -->
                      {#if selectedCampaign.goFundMeUrl}
                        <div class="mb-3">
                          <a
                            href={selectedCampaign.goFundMeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-900/20 cursor-pointer text-center"
                          >
                            🧡 SECURE DONATE VIA GOFUNDME
                          </a>
                        </div>
                      {/if}

                      {#if selectedCampaign.venmoUrl}
                        <div class="mb-3">
                          <a
                            href={selectedCampaign.venmoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-[#008CFF] hover:bg-[#0074D9] text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-900/20 cursor-pointer text-center"
                          >
                            💙 SECURE DONATE VIA VENMO (@{selectedCampaign.venmoUrl.substring(
                              selectedCampaign.venmoUrl.lastIndexOf("/") + 1,
                            )})
                          </a>
                        </div>
                      {/if}

                      <!-- Cash App Link button -->
                      {#if selectedCampaign.cashAppUrl}
                        <div class="mb-3">
                          <a
                            href={selectedCampaign.cashAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-900/25 cursor-pointer text-center"
                          >
                            🟢 SECURE DONATE VIA CASH APP ({selectedCampaign.cashAppUrl.substring(
                              selectedCampaign.cashAppUrl.lastIndexOf("/") + 1,
                            )})
                          </a>
                        </div>
                      {/if}

                      {#if selectedCampaign.petitionUrl}
                        <div class="mb-3">
                          <a
                            href={selectedCampaign.petitionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-[#EC2C22] hover:bg-[#D61E15] text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/20 cursor-pointer text-center"
                          >
                            ✍️ SIGN THE CHANGE.ORG PETITION
                          </a>
                        </div>
                      {/if}

                      {#if selectedCampaign.instagramUrl}
                        <div class="mb-4">
                          <a
                            href={selectedCampaign.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-95 text-white font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-pink-900/20 cursor-pointer text-center"
                          >
                            📸 FOLLOW ON INSTAGRAM (@{selectedCampaign.instagramUrl
                              .replace(/\/$/, "")
                              .substring(
                                selectedCampaign.instagramUrl
                                  .replace(/\/$/, "")
                                  .lastIndexOf("/") + 1,
                              )})
                          </a>
                        </div>
                      {/if}

                      <div class="mt-2 flex flex-col gap-2">
                        <span
                          class="text-[9px] text-zinc-500 tracking-widest uppercase font-bold"
                          >MILESTONE TARGETS</span
                        >
                        <div class="flex flex-col gap-2 pb-4">
                          {#each selectedCampaign.milestones as milestone}
                            {@const isAchieved =
                              progressPct >= milestone.percentage}
                            <div
                              class="flex items-center gap-3 bg-zinc-950/40 border border-zinc-850 p-2.5 rounded-xl"
                            >
                              <div
                                class="w-5 h-5 rounded border flex items-center justify-center font-bold font-mono text-[9px] transition-colors"
                                class:bg-emerald-500={isAchieved}
                                class:border-emerald-400={isAchieved}
                                class:text-black={isAchieved}
                                class:border-zinc-800={!isAchieved}
                                class:text-zinc-600={!isAchieved}
                              >
                                {#if isAchieved}✓{:else}-{/if}
                              </div>
                              <div class="flex-grow">
                                <div
                                  class="text-[11px] font-bold"
                                  class:text-white={isAchieved}
                                  class:text-zinc-400={!isAchieved}
                                >
                                  {milestone.label}
                                </div>
                                <div class="text-[9px] text-zinc-500 font-mono">
                                  Target: {milestone.percentage}%
                                </div>
                              </div>
                            </div>
                          {/each}
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- CART DRAWER -->
    {#if isCartOpen}
      <!-- Backdrop -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onclick={() => (isCartOpen = false)}
      ></div>

      <!-- Drawer Content -->
      <div
        transition:fly={{ x: 500, duration: 300 }}
        class="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-zinc-950/95 border-l border-zinc-800 z-50 flex flex-col justify-between shadow-2xl"
      >
        <!-- Header -->
        <div
          class="flex justify-between items-center p-4 border-b border-zinc-900 bg-zinc-900/20"
        >
          <span class="text-sm font-bold flex items-center gap-2">
            <ShoppingCart size={16} /> SHOPPING CART
          </span>
          <button
            class="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            onclick={() => (isCartOpen = false)}
          >
            <X size={18} />
          </button>
        </div>

        <!-- Body / Items List -->
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {#if cart.length === 0}
            <div
              class="flex flex-col items-center justify-center h-full text-zinc-600 gap-2"
            >
              <ShoppingCart size={48} class="opacity-30" />
              <span class="text-xs font-bold uppercase tracking-widest"
                >Your cart is empty</span
              >
            </div>
          {:else}
            {#each cart as item, index}
              <div
                class="flex items-center gap-4 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80"
              >
                <!-- Mini thumbnail -->
                <div
                  class="w-12 h-12 bg-black/20 rounded border border-zinc-800 flex items-center justify-center text-zinc-600"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="w-6 h-6 fill-none stroke-current"
                    stroke-width="1.5"
                  >
                    <path
                      d="M4 8.5V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5M4 8.5L8 5m-4 3.5l-2-1.5L4 4m16 4.5l-4-3.5m4 3.5l2-1.5L20 4M8 5a4 4 0 0 1 8 0"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h4
                    class="text-xs font-bold text-zinc-200 truncate uppercase"
                  >
                    {item.title}
                  </h4>
                  <div class="text-[10px] text-zinc-500 mt-0.5">
                    SIZE: {item.size} •
                    <span class="text-red-400 font-semibold">{item.price}</span>
                  </div>

                  <!-- Qty Controls -->
                  <div class="flex items-center gap-2 mt-2">
                    <button
                      class="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      onclick={() => updateQuantity(index, -1)}
                    >
                      <Minus size={10} />
                    </button>
                    <span class="text-xs font-mono font-bold w-4 text-center"
                      >{item.quantity}</span
                    >
                    <button
                      class="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      onclick={() => updateQuantity(index, 1)}
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                <!-- Delete -->
                <button
                  class="text-zinc-600 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                  onclick={() => removeFromCart(index)}
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            {/each}
          {/if}
        </div>

        <!-- Footer -->
        {#if cart.length > 0}
          <div
            class="p-4 border-t border-zinc-900 bg-zinc-900/20 flex flex-col gap-4"
          >
            <div class="flex justify-between items-center text-sm font-bold">
              <span class="text-zinc-500">TOTAL:</span>
              <span class="text-red-500 text-base">{totalPrice()}</span>
            </div>
            <button
              class="w-full py-3 bg-green-600 hover:bg-green-500 text-black font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              onclick={handleCheckout}
            >
              <Check size={14} /> SECURE CHECKOUT
            </button>
          </div>
        {/if}
      </div>
    {/if}

    <!-- TOAST NOTIFICATION -->
    {#if showCopiedAlert}
      <div
        transition:fade={{ duration: 150 }}
        class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-red-500 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-2xl border border-red-500/40 z-50 flex items-center gap-2"
      >
        <span>✓ SHARE LINK COPIED</span>
      </div>
    {/if}

    {#if showEmailCopiedAlert}
      <div
        transition:fade={{ duration: 150 }}
        class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-950/90 text-emerald-400 font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500/40 z-50 flex items-center gap-2"
      >
        <span>✓ LAWMAKER EMAILS COPIED</span>
      </div>
    {/if}
  </div>
</BasePanel>

<style>
  /* Custom styles that can't be easily done in tailwind */
  .caution-tape {
    background: repeating-linear-gradient(
      -45deg,
      #eab308,
      #eab308 10px,
      #000000 10px,
      #000000 20px
    );
  }

  .active-size {
    background-color: #f4f4f5 !important; /* zinc-100 */
    color: #09090b !important; /* zinc-950 */
    border-color: #f4f4f5 !important;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .selectable-bio {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }
  .selectable-bio p {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }
  .selectable-bio :global(a) {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }
</style>
