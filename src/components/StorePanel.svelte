<script>
  import { onMount, untrack } from "svelte";
  import BasePanel from "./BasePanel.svelte";
  import ThreeDShirtCanvas from "./apps/ThreeDShirtCanvas.svelte";
  import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, Check, X } from "lucide-svelte";

  let { isClosing = false, onClose } = $props();

  let products = $state([]);
  let cart = $state([]);
  let isCartOpen = $state(false);
  let selectedProduct = $state(null);
  let selectedSize = $state("M");
  let sizes = ["6XS", "5XS", "4XS", "3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

  // Load products on mount
  onMount(async () => {
    try {
      const res = await fetch("/data/products.json");
      if (res.ok) {
        products = await res.json();
      }
    } catch (e) {
      console.error("Error loading products:", e);
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
      const dbProduct = products.find(p => p.id === item.id);
      if (dbProduct && dbProduct.inStock) {
        updatedCart.push(item);
      } else {
        removedItems.push(item.title);
      }
    }

    cart = updatedCart;
    saveCart();

    if (removedItems.length > 0) {
      alert(`The following items in your cart are no longer in stock and have been removed:\n- ${removedItems.join("\n- ")}`);
    }
  }

  function saveCart() {
    if (typeof window !== "undefined") {
      localStorage.setItem("wearedogs_cart", JSON.stringify(cart));
    }
  }

  function addToCart(product, size) {
    if (!product.inStock) return;
    
    const existingIndex = cart.findIndex(item => item.id === product.id && item.size === size);
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
        quantity: 1
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
    cart.forEach(item => {
      window.open(item.checkoutUrl, '_blank');
    });
    // Clear cart after checkout
    cart = [];
    saveCart();
    isCartOpen = false;
  }
</script>

<BasePanel title="DOGS SHOP" {isClosing} {onClose}>
  <div class="store-container w-full h-full relative font-mono text-zinc-100 flex flex-col">
    <!-- Header Controls -->
    <div class="flex justify-between items-center px-4 py-3 bg-zinc-950/20 border-b border-zinc-800">
      <div>
        {#if selectedProduct}
          <button 
            class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-semibold"
            onclick={() => selectedProduct = null}
          >
            <ArrowLeft size={16} /> BACK TO CATALOG
          </button>
        {:else}
          <span class="text-xs text-zinc-500 uppercase tracking-widest">SHENANIGANS EXCLUSIVE CATALOG</span>
        {/if}
      </div>
      <button 
        class="cart-toggle-btn relative p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-500 hover:text-white transition-all duration-200"
        onclick={() => isCartOpen = true}
      >
        <ShoppingCart size={20} />
        {#if cart.length > 0}
          <span class="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {cart.reduce((a, b) => a + b.quantity, 0)}
          </span>
        {/if}
      </button>
    </div>

    <!-- Main Workspace -->
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      {#if !selectedProduct}
        <!-- GRID VIEW -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {#each products as product}
            <div 
              class="relative flex flex-col justify-between overflow-hidden bg-zinc-900/40 border border-zinc-800 rounded-xl transition-all duration-300 group hover:border-zinc-700"
            >
              <!-- Caution tape for sold-out items -->
              {#if !product.inStock}
                <div class="absolute inset-0 bg-black/60 z-10 flex items-center justify-center pointer-events-none">
                  <div class="caution-tape text-center py-2 w-[150%] rotate-12 bg-yellow-400 text-black font-black text-sm tracking-widest uppercase border-y-2 border-black select-none shadow-lg">
                    SOLD OUT
                  </div>
                </div>
              {/if}

              <!-- Product Graphic Box -->
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div 
                class="aspect-square bg-black/20 border-b border-zinc-800/60 flex flex-col items-center justify-center relative cursor-pointer"
                onclick={() => product.inStock && (selectedProduct = product)}
              >
                <!-- SVG Icon/Logo Placeholder representation -->
                <div class="w-24 h-24 text-zinc-700 group-hover:text-zinc-500 transition-colors duration-300 flex items-center justify-center">
                  {#if product.title.includes("T-SHIRT")}
                    <svg viewBox="0 0 24 24" class="w-16 h-16 fill-none stroke-current" stroke-width="1.5">
                      <path d="M4 8.5V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5M4 8.5L8 5m-4 3.5l-2-1.5L4 4m16 4.5l-4-3.5m4 3.5l2-1.5L20 4M8 5a4 4 0 0 1 8 0" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  {:else if product.title.includes("HOODIE")}
                    <svg viewBox="0 0 24 24" class="w-16 h-16 fill-none stroke-current" stroke-width="1.5">
                      <path d="M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9m-14 0l3-5m11 5l-3-5m-8 0h6m-3 0v4m0 0a2 2 0 1 0 0 4 2 2 0 1 0 0-4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  {:else if product.title.includes("HAT")}
                    <svg viewBox="0 0 24 24" class="w-16 h-16 fill-none stroke-current" stroke-width="1.5">
                      <path d="M2 17h20M6 17v-4a6 6 0 0 1 12 0v4M12 7V4m0 0l-2 1m2-1l2 1" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  {:else}
                    <svg viewBox="0 0 24 24" class="w-16 h-16 fill-none stroke-current" stroke-width="1.5">
                      <path d="M7 4h10v12a4 4 0 0 1-8 0V4zM7 8h10M9 16h6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  {/if}
                </div>
                <span class="absolute bottom-3 text-[10px] text-zinc-500 font-bold tracking-widest">WEAREDOGS LABS</span>
              </div>

              <!-- Product Details -->
              <div class="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 class="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors duration-200">{product.title}</h3>
                  <p class="text-xs text-zinc-500 line-clamp-2 mt-1">{product.description}</p>
                </div>
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/40">
                  <span class="font-bold text-sm text-red-500">{product.price}</span>
                  <button 
                    class="px-3 py-1 bg-white text-black font-bold text-xs rounded hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!product.inStock}
                    onclick={() => selectedProduct = product}
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
        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <!-- Left: 3D Shirt Canvas -->
          <div class="w-full aspect-square bg-black/40 border border-zinc-800 rounded-2xl flex items-center justify-center p-4 min-h-[300px] md:min-h-[400px] relative overflow-hidden">
            <ThreeDShirtCanvas productTitle={selectedProduct.title} />
          </div>

          <!-- Right: Details -->
          <div class="flex flex-col justify-between h-full bg-zinc-900/20 border border-zinc-800/60 p-6 rounded-2xl">
            <div>
              <div class="flex justify-between items-start gap-4">
                <h1 class="text-2xl md:text-3xl font-extrabold tracking-wider">{selectedProduct.title}</h1>
                <span class="text-xl md:text-2xl text-red-500 font-black shrink-0">{selectedProduct.price}</span>
              </div>

              <div class="mt-4 pb-4 border-b border-zinc-800/80">
                <p class="text-zinc-400 text-sm md:text-base leading-relaxed">{selectedProduct.description}</p>
              </div>

              <!-- Size selector -->
              {#if selectedProduct.sizes && selectedProduct.sizes.length > 0 && selectedProduct.sizes[0] !== "One Size"}
                <div class="mt-6">
                  <span class="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-3">SELECT SIZE</span>
                  <div class="flex flex-wrap gap-2">
                    {#each selectedProduct.sizes as size}
                      <button 
                        class="px-3 py-1.5 border border-zinc-800 rounded text-xs font-bold hover:border-zinc-500 transition-all duration-200"
                        class:active-size={selectedSize === size}
                        onclick={() => selectedSize = size}
                      >
                        {size}
                      </button>
                    {/each}
                  </div>
                </div>
              {:else}
                <div class="mt-6">
                  <span class="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">SIZE</span>
                  <span class="text-sm font-bold text-zinc-400">ONE SIZE</span>
                </div>
              {/if}
            </div>

            <div class="mt-8 pt-6 border-t border-zinc-800/80">
              <button 
                class="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-900/30"
                onclick={() => addToCart(selectedProduct, selectedProduct.sizes[0] === "One Size" ? "One Size" : selectedSize)}
              >
                <ShoppingCart size={18} /> ADD TO CART
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <!-- CART DRAWER -->
    {#if isCartOpen}
      <!-- Backdrop -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onclick={() => isCartOpen = false}></div>

      <!-- Drawer Content -->
      <div class="fixed top-0 right-0 w-full sm:w-[450px] h-full bg-zinc-950/95 border-l border-zinc-800 z-50 flex flex-col justify-between shadow-2xl transition-all duration-300">
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b border-zinc-900 bg-zinc-900/20">
          <span class="text-sm font-bold flex items-center gap-2">
            <ShoppingCart size={16} /> SHOPPING CART
          </span>
          <button 
            class="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
            onclick={() => isCartOpen = false}
          >
            <X size={18} />
          </button>
        </div>

        <!-- Body / Items List -->
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {#if cart.length === 0}
            <div class="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
              <ShoppingCart size={48} class="opacity-30" />
              <span class="text-xs font-bold uppercase tracking-widest">Your cart is empty</span>
            </div>
          {:else}
            {#each cart as item, index}
              <div class="flex items-center gap-4 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80">
                <!-- Mini thumbnail -->
                <div class="w-12 h-12 bg-black/20 rounded border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <svg viewBox="0 0 24 24" class="w-6 h-6 fill-none stroke-current" stroke-width="1.5">
                    <path d="M4 8.5V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5M4 8.5L8 5m-4 3.5l-2-1.5L4 4m16 4.5l-4-3.5m4 3.5l2-1.5L20 4M8 5a4 4 0 0 1 8 0" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-xs font-bold text-zinc-200 truncate uppercase">{item.title}</h4>
                  <div class="text-[10px] text-zinc-500 mt-0.5">
                    SIZE: {item.size} • <span class="text-red-400 font-semibold">{item.price}</span>
                  </div>

                  <!-- Qty Controls -->
                  <div class="flex items-center gap-2 mt-2">
                    <button 
                      class="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                      onclick={() => updateQuantity(index, -1)}
                    >
                      <Minus size={10} />
                    </button>
                    <span class="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      class="w-5 h-5 bg-white/5 hover:bg-white/10 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                      onclick={() => updateQuantity(index, 1)}
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>

                <!-- Delete -->
                <button 
                  class="text-zinc-600 hover:text-red-400 p-1.5 transition-colors"
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
          <div class="p-4 border-t border-zinc-900 bg-zinc-900/20 flex flex-col gap-4">
            <div class="flex justify-between items-center text-sm font-bold">
              <span class="text-zinc-500">TOTAL:</span>
              <span class="text-red-500 text-base">{totalPrice()}</span>
            </div>
            <button 
              class="w-full py-3 bg-green-600 hover:bg-green-500 text-black font-black rounded-xl text-xs tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5"
              onclick={handleCheckout}
            >
              <Check size={14} /> SECURE CHECKOUT
            </button>
          </div>
        {/if}
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
</style>
