<script>

  // Svelte 5 props
  let { onUnlock } = $props();

  // State management (Runes)
  let displayValue = $state("0");
  let equationDisplay = $state("");
  let keywordBuffer = $state([]);
  let isChecking = $state(false);
  let errorFlash = $state(false);

  // Key to keyword mapping
  const keyMappings = {
    "0": { word: "Taco", type: "number" },
    "1": { word: "Leopard", type: "number" },
    "2": { word: "Foxtrot", type: "number" },
    "3": { word: "Bicycle", type: "number" },
    "4": { word: "Boobs", type: "number" },
    "5": { word: "Pizza", type: "number" },
    "6": { word: "PlayStation", type: "number" },
    "7": { word: "Nirvana", type: "number" },
    "8": { word: "Laser", type: "number" },
    "9": { word: "Whiskey", type: "number" },
    "+": { word: "Cheetah", type: "operator" },
    "-": { word: "Doom", type: "operator" },
    "*": { word: "Lingerie", type: "operator" },
    "/": { word: "Cyberpunk", type: "operator" },
    ".": { word: "Radical", type: "special" },
    "√": { word: "Exotic", type: "special" },
    "^": { word: "Apex", type: "operator" },
    "!": { word: "Wild", type: "special" }
  };

  function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  function safeEvaluate(str) {
    try {
      // Replace symbols with standard JS Math functions
      let sanitized = str
        .replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)")
        .replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, "Math.pow($1,$3)");

      // Parse factorial
      sanitized = sanitized.replace(/(\d+)!/g, (match, num) => {
        return factorial(parseInt(num, 10));
      });

      // Security check: only allow digits, mathematical operators, spaces, and Math.*
      if (!/^[0-9.+\-*/%()\s,]|Math\.[a-z0-9]+$/i.test(sanitized)) {
        throw new Error("Invalid Expression");
      }

      const evalResult = new Function(`return (${sanitized})`)();
      if (isNaN(evalResult) || !isFinite(evalResult)) {
        return "Error";
      }
      return Number(evalResult.toFixed(8)).toString();
    } catch (e) {
      return "Error";
    }
  }

  function handleKeyPress(key) {
    if (errorFlash) {
      errorFlash = false;
      displayValue = "0";
      equationDisplay = "";
      keywordBuffer = [];
    }

    const mapping = keyMappings[key];
    if (mapping) {
      keywordBuffer.push(mapping.word);
    }

    if (key === "C") {
      displayValue = "0";
      equationDisplay = "";
      keywordBuffer = [];
      return;
    }

    if (key === "=") {
      const expr = displayValue;
      const result = safeEvaluate(expr);
      equationDisplay = expr + " =";
      displayValue = result;

      // Check passcode
      verifyPasscode();
      return;
    }

    // Unary operators (applied immediately)
    if (key === "√") {
      if (displayValue === "0") {
        displayValue = "√";
      } else {
        // If there's an operator at the end, append √, otherwise wrap the last number
        const lastChar = displayValue.slice(-1);
        if (["+", "-", "*", "/", "^"].includes(lastChar)) {
          displayValue += "√";
        } else {
          displayValue = "√(" + displayValue + ")";
        }
      }
      return;
    }

    if (key === "!") {
      displayValue += "!";
      return;
    }

    if (displayValue === "0" && !["+", "-", "*", "/", "^", "."].includes(key)) {
      displayValue = key;
    } else {
      displayValue += key;
    }
  }

  async function verifyPasscode() {
    if (keywordBuffer.length === 0) return;
    const concatenated = keywordBuffer.join("");
    isChecking = true;

    try {
      const response = await fetch("https://data.wearedogs.net/vid/check.txt", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "radical": `password=${concatenated}`
        }
      });

      if (response.ok) {
        localStorage.setItem("gopro_password", concatenated);
        onUnlock(concatenated);
      } else {
        errorFlash = true;
        displayValue = "ACCESS DENIED";
      }
    } catch (e) {
      console.warn("Passcode verification check failed or offline:", e);
      errorFlash = true;
      displayValue = "ACCESS DENIED";
    } finally {
      isChecking = false;
    }
  }

  function handleKeydown(e) {
    if (isChecking) return;
    let keyChar = e.key;

    if (keyChar >= "0" && keyChar <= "9") {
      handleKeyPress(keyChar);
    } else if (keyChar === "+") {
      handleKeyPress("+");
    } else if (keyChar === "-") {
      handleKeyPress("-");
    } else if (keyChar === "*") {
      handleKeyPress("*");
    } else if (keyChar === "/") {
      handleKeyPress("/");
    } else if (keyChar === ".") {
      handleKeyPress(".");
    } else if (keyChar === "Enter" || keyChar === "=") {
      e.preventDefault();
      handleKeyPress("=");
    } else if (keyChar === "Escape" || keyChar === "c" || keyChar === "C") {
      handleKeyPress("C");
    } else if (keyChar === "Backspace") {
      if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
      } else {
        displayValue = "0";
      }
      keywordBuffer.pop();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="calculator-screen-wrapper flex items-center justify-center w-full h-full p-4 font-sans select-none">
  <div class="calculator-card relative w-full max-w-sm rounded-3xl p-6 flex flex-col gap-5 border border-white/10 shadow-2xl backdrop-blur-xl">
    <!-- Calculator Header -->
    <div class="flex items-center justify-between border-b border-white/5 pb-3">
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-red-500/80 animate-pulse"></span>
        <span class="text-[9px] uppercase tracking-widest text-white/40 font-bold font-mono">SECURE CALC TI-75</span>
      </div>
      <span class="text-[9px] uppercase tracking-widest text-cyan-400 font-bold font-mono">RADICAL INTERFACE</span>
    </div>

    <!-- LCD Display -->
    <div class="lcd-display relative w-full rounded-2xl p-4 flex flex-col items-end justify-center gap-1 overflow-hidden min-h-[90px] border border-black/40">
      <div class="lcd-overlay pointer-events-none"></div>
      {#if equationDisplay}
        <span class="equation-text text-xs font-mono text-cyan-300/40 select-none">{equationDisplay}</span>
      {/if}
      <span class="display-text text-2xl font-bold font-mono text-cyan-400 tracking-tight leading-none overflow-x-auto w-full text-right whitespace-nowrap">
        {displayValue}
      </span>
      <!-- Subtle keyword helper list -->
      <div class="w-full flex flex-wrap gap-1 justify-start mt-2 border-t border-cyan-400/5 pt-1.5 min-h-[14px]">
        {#each keywordBuffer.slice(-4) as word}
          <span class="text-[7px] font-mono bg-cyan-950/40 text-cyan-400/60 border border-cyan-400/10 px-1 py-0.2 rounded uppercase tracking-wider">{word}</span>
        {/each}
        {#if keywordBuffer.length > 4}
          <span class="text-[7px] font-mono text-cyan-400/40 px-1 py-0.2 font-bold">+{keywordBuffer.length - 4}</span>
        {/if}
      </div>
    </div>

    <!-- Keyboard Grid -->
    <div class="grid grid-cols-4 gap-3">
      <!-- Row 1 -->
      <button onclick={() => handleKeyPress("C")} class="calc-btn clear-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">C</span>
        <span class="btn-sub">RESET</span>
      </button>
      <button onclick={() => handleKeyPress("√")} class="calc-btn func-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">√</span>
        <span class="btn-sub">{keyMappings["√"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("^")} class="calc-btn func-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">^</span>
        <span class="btn-sub">{keyMappings["^"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("!")} class="calc-btn func-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">!</span>
        <span class="btn-sub">{keyMappings["!"].word}</span>
      </button>

      <!-- Row 2 -->
      <button onclick={() => handleKeyPress("7")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">7</span>
        <span class="btn-sub">{keyMappings["7"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("8")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">8</span>
        <span class="btn-sub">{keyMappings["8"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("9")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">9</span>
        <span class="btn-sub">{keyMappings["9"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("/")} class="calc-btn op-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">/</span>
        <span class="btn-sub">{keyMappings["/"].word}</span>
      </button>

      <!-- Row 3 -->
      <button onclick={() => handleKeyPress("4")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">4</span>
        <span class="btn-sub">{keyMappings["4"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("5")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">5</span>
        <span class="btn-sub">{keyMappings["5"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("6")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">6</span>
        <span class="btn-sub">{keyMappings["6"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("*")} class="calc-btn op-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">*</span>
        <span class="btn-sub">{keyMappings["*"].word}</span>
      </button>

      <!-- Row 4 -->
      <button onclick={() => handleKeyPress("1")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">1</span>
        <span class="btn-sub">{keyMappings["1"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("2")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">2</span>
        <span class="btn-sub">{keyMappings["2"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("3")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">3</span>
        <span class="btn-sub">{keyMappings["3"].word}</span>
      </button>
      <button onclick={() => handleKeyPress("-")} class="calc-btn op-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">-</span>
        <span class="btn-sub">{keyMappings["-"].word}</span>
      </button>

      <!-- Row 5 -->
      <button onclick={() => handleKeyPress("0")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">0</span>
        <span class="btn-sub">{keyMappings["0"].word}</span>
      </button>
      <button onclick={() => handleKeyPress(".")} class="calc-btn num-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">.</span>
        <span class="btn-sub">{keyMappings["."].word}</span>
      </button>
      <button onclick={() => handleKeyPress("=")} class="calc-btn equal-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">{isChecking ? "..." : "="}</span>
        <span class="btn-sub">CHECK</span>
      </button>
      <button onclick={() => handleKeyPress("+")} class="calc-btn op-btn flex flex-col items-center justify-center p-3 rounded-2xl font-bold font-mono transition-all duration-150">
        <span class="text-sm">+</span>
        <span class="btn-sub">{keyMappings["+"].word}</span>
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  .calculator-card {
    background: rgba(10, 12, 18, 0.7);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .lcd-display {
    background: radial-gradient(circle at center, #051a1e 0%, #02090b 100%);
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.8);
  }

  .lcd-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 4px;
    z-index: 10;
  }

  .calc-btn {
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.03);
    cursor: pointer;
    overflow: hidden;
    user-select: none;
    box-shadow: 
      0 4px 6px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }
  }

  .btn-sub {
    font-size: 6px;
    opacity: 0.4;
    letter-spacing: 0.05em;
    margin-top: 2px;
    text-transform: uppercase;
    font-weight: 800;
  }

  .num-btn {
    background: rgba(255, 255, 255, 0.03);
    color: rgba(255, 255, 255, 0.85);

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: white;
    }
  }

  .op-btn {
    background: rgba(255, 140, 0, 0.05);
    color: #ff9d42;
    border-color: rgba(255, 140, 0, 0.1);

    &:hover {
      background: rgba(255, 140, 0, 0.1);
    }
  }

  .func-btn {
    background: rgba(255, 85, 187, 0.05);
    color: #ff55bb;
    border-color: rgba(255, 85, 187, 0.1);

    &:hover {
      background: rgba(255, 85, 187, 0.1);
    }
  }

  .clear-btn {
    background: rgba(239, 68, 68, 0.07);
    color: #fca5a5;
    border-color: rgba(239, 68, 68, 0.15);

    &:hover {
      background: rgba(239, 68, 68, 0.15);
    }
  }

  .equal-btn {
    background: linear-gradient(135deg, #00b4d8 0%, #0077b6 100%);
    color: white;
    border: none;
    box-shadow: 
      0 4px 15px rgba(0, 180, 216, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    &:hover {
      background: linear-gradient(135deg, #00c4e8 0%, #0087c6 100%);
      box-shadow: 0 6px 20px rgba(0, 180, 216, 0.45);
    }
  }
</style>
