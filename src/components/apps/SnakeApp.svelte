<script>
  import { onMount, onDestroy } from "svelte";

  let snake = $state([{ x: 10, y: 10 }]);
  let food = $state({ x: 5, y: 5 });
  let snakeDir = $state({ x: 0, y: 0 }); // Idle initially
  let snakeScore = $state(0);
  let snakeHighScore = $state(0);
  let snakeGameOver = $state(false);
  let snakeGameStarted = $state(false);
  let snakeInterval = null;

  // AI Autoplay Mode (toggled ON by default)
  let isAIMode = $state(true);

  function initSnake() {
    snake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    food = getRandomFoodPos();
    snakeDir = { x: 0, y: -1 }; // Move up initially
    snakeScore = 0;
    snakeGameOver = false;
    snakeGameStarted = true;

    clearInterval(snakeInterval);
    snakeInterval = setInterval(moveSnake, 130);
  }

  function getRandomFoodPos() {
    let newFood;
    while (
      !newFood ||
      snake.some((s) => s.x === newFood.x && s.y === newFood.y)
    ) {
      newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };
    }
    return newFood;
  }

  /**
   * Calculates the next move for the snake using BFS pathfinding.
   * Accounts for torus wrap-around grid boundaries and falls back
   * to Manhattan distance heuristics if trapped.
   * @returns {{x: number, y: number}} The next direction offset.
   */
  function getAIMove() {
    const head = snake[0];
    const target = food;

    // BFS queue: store [position, path_taken_so_far]
    const queue = [[head, []]];
    const visited = new Set();
    visited.add(`${head.x},${head.y}`);

    // Avoid current body parts
    const bodySet = new Set();
    for (const segment of snake) {
      bodySet.add(`${segment.x},${segment.y}`);
    }

    let path = null;
    while (queue.length > 0) {
      const [curr, currPath] = queue.shift();

      if (curr.x === target.x && curr.y === target.y) {
        path = currPath;
        break;
      }

      const neighbors = [
        { dir: { x: 0, y: -1 }, pos: { x: curr.x, y: (curr.y - 1 + 20) % 20 } }, // Up
        { dir: { x: 0, y: 1 }, pos: { x: curr.x, y: (curr.y + 1) % 20 } }, // Down
        { dir: { x: -1, y: 0 }, pos: { x: (curr.x - 1 + 20) % 20, y: curr.y } }, // Left
        { dir: { x: 1, y: 0 }, pos: { x: (curr.x + 1) % 20, y: curr.y } }, // Right
      ];

      for (const n of neighbors) {
        const posKey = `${n.pos.x},${n.pos.y}`;
        if (!visited.has(posKey) && !bodySet.has(posKey)) {
          visited.add(posKey);
          queue.push([n.pos, [...currPath, n.dir]]);
        }
      }
    }

    if (path && path.length > 0) {
      return path[0];
    }

    // Heuristic Fallback: select safe neighbor closest to food using torus Manhattan distance
    const moves = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    let bestMove = null;
    let minDistance = Infinity;

    for (const m of moves) {
      const nextHead = {
        x: (head.x + m.x + 20) % 20,
        y: (head.y + m.y + 20) % 20,
      };

      const nextKey = `${nextHead.x},${nextHead.y}`;
      if (!bodySet.has(nextKey)) {
        const dx = Math.min(
          Math.abs(nextHead.x - target.x),
          20 - Math.abs(nextHead.x - target.x),
        );
        const dy = Math.min(
          Math.abs(nextHead.y - target.y),
          20 - Math.abs(nextHead.y - target.y),
        );
        const dist = dx + dy;

        if (dist < minDistance) {
          minDistance = dist;
          bestMove = m;
        }
      }
    }

    return bestMove || snakeDir;
  }

  function moveSnake() {
    if (snakeGameOver) return;

    // Apply AI decision if enabled
    if (isAIMode) {
      const aiDir = getAIMove();
      if (aiDir) {
        snakeDir = aiDir;
      }
    }

    if (snakeDir.x === 0 && snakeDir.y === 0) return;

    const head = snake[0];
    const newHead = {
      x: (head.x + snakeDir.x + 20) % 20,
      y: (head.y + snakeDir.y + 20) % 20,
    };

    // Collision with self
    if (snake.slice(1).some((s) => s.x === newHead.x && s.y === newHead.y)) {
      snakeGameOver = true;
      snakeGameStarted = false;
      clearInterval(snakeInterval);
      if (snakeScore > snakeHighScore) {
        snakeHighScore = snakeScore;
      }
      return;
    }

    snake.unshift(newHead);

    // Collision with food
    if (newHead.x === food.x && newHead.y === food.y) {
      snakeScore += 10;
      food = getRandomFoodPos();
    } else {
      snake.pop();
    }
  }

  function handleSnakeKey(e) {
    if (!snakeGameStarted || snakeGameOver) return;

    let newDir = null;
    if (e.key === "ArrowUp" && snakeDir.y === 0) {
      newDir = { x: 0, y: -1 };
    } else if (e.key === "ArrowDown" && snakeDir.y === 0) {
      newDir = { x: 0, y: 1 };
    } else if (e.key === "ArrowLeft" && snakeDir.x === 0) {
      newDir = { x: -1, y: 0 };
    } else if (e.key === "ArrowRight" && snakeDir.x === 0) {
      newDir = { x: 1, y: 0 };
    }

    if (newDir) {
      // Direct user input turns OFF AI Autoplay mode
      isAIMode = false;
      snakeDir = newDir;
      e.preventDefault();
    }
  }

  onMount(() => {
    initSnake();
  });

  onDestroy(() => {
    clearInterval(snakeInterval);
  });
</script>

<svelte:window onkeydown={handleSnakeKey} />

<div class="snake-layout animated-pane">
  <div class="game-sidebar">
    <h3>SNAKE</h3>

    <div class="score-card ai-toggle-card">
      <span class="lbl">AI AUTO</span>
      <label class="switch" for="snake-ai-checkbox">
        <input id="snake-ai-checkbox" type="checkbox" bind:checked={isAIMode} />
        <span class="slider round"></span>
      </label>
    </div>

    <div class="score-card">
      <span class="lbl">SCORE</span>
      <span class="val">{snakeScore}</span>
    </div>
    <div class="score-card">
      <span class="lbl">HIGH SCORE</span>
      <span class="val">{snakeHighScore}</span>
    </div>
    <div class="controls-info">
      <p>🟢 Use <strong>Arrow Keys</strong> to direct the snake.</p>
      <p>🟢 Avoid crashing into your tail.</p>
      <p>🟢 AI mode will automatically guide the snake.</p>
    </div>

    {#if snakeGameOver}
      <div class="game-over-alert">
        <h4>GAME OVER</h4>
        <button class="retry-btn" onclick={initSnake}>PLAY AGAIN</button>
      </div>
    {/if}
  </div>

  <div class="snake-board-container">
    <div class="snake-board">
      {#each Array(20) as _, y}
        <div class="board-row">
          {#each Array(20) as _, x}
            <div
              class="board-cell"
              class:is-snake={snake.some((s) => s.x === x && s.y === y)}
              class:is-head={snake[0]?.x === x && snake[0]?.y === y}
              class:is-food={food.x === x && food.y === y}
            ></div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .snake-layout {
    display: flex;
    flex-direction: row;
    gap: 20px;
    height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .snake-layout {
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      justify-content: start;
    }
  }

  .game-sidebar {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  @media (max-width: 767px) and (orientation: landscape) {
    .game-sidebar {
      width: 140px;
      padding: 10px;
      gap: 8px;
    }
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .game-sidebar {
      width: 100%;
      height: auto;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 12px;
      gap: 8px;
      order: 2;
      justify-content: space-between;
    }
  }

  .game-sidebar h3 {
    margin: 0 0 12px 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: white;
    letter-spacing: 0.1em;
  }

  @media (max-width: 767px) {
    .game-sidebar h3 {
      display: none;
    }
  }

  .score-card {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    padding: 8px 12px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .score-card {
      margin-bottom: 0;
      flex: 1 1 30%;
      min-width: 90px;
      padding: 6px 10px;
    }
  }

  .score-card .lbl {
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
  }

  .score-card .val {
    font-size: 1.1rem;
    font-weight: 800;
    color: #00ff66;
    font-family: monospace;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .score-card .val {
      font-size: 0.9rem;
    }
  }

  .controls-info {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.4;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  @media (max-width: 767px) {
    .controls-info {
      display: none;
    }
  }

  .game-over-alert {
    margin-top: auto;
    background: rgba(255, 51, 68, 0.1);
    border: 1px solid rgba(255, 51, 68, 0.25);
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .game-over-alert {
      margin-top: 4px;
      flex: 1 1 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
    }

    .game-over-alert h4 {
      margin: 0;
    }

    .game-over-alert .retry-btn {
      width: auto;
      padding: 6px 14px;
    }
  }

  .game-over-alert h4 {
    margin: 0 0 6px 0;
    color: #ff3344;
    font-weight: 800;
    font-size: 0.9rem;
  }

  .retry-btn {
    background: #ff3344;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px;
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s ease;
  }

  .retry-btn:hover {
    background: #ff5566;
    box-shadow: 0 0 10px rgba(255, 51, 68, 0.3);
  }

  .snake-board-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    order: 2;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .snake-board-container {
      order: 1;
    }
  }

  .snake-board {
    display: grid;
    grid-template-rows: repeat(20, 1fr);
    width: 100%;
    max-width: min(340px, 80vmin);
    aspect-ratio: 1 / 1;
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid rgba(0, 191, 255, 0.3);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 30px rgba(0, 191, 255, 0.15);
  }

  @media (max-width: 767px) and (orientation: landscape) {
    .snake-board {
      max-width: min(240px, 75vh);
    }
  }

  .board-row {
    display: grid;
    grid-template-columns: repeat(20, 1fr);
  }

  .board-cell {
    border: 0.5px solid rgba(255, 255, 255, 0.01);
  }

  .board-cell.is-snake {
    background: rgba(0, 255, 102, 0.55);
    box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.3);
  }

  .board-cell.is-head {
    background: #00ff66;
    box-shadow: 0 0 8px #00ff66;
    border-radius: 2px;
  }

  .board-cell.is-food {
    background: #ff3344;
    box-shadow: 0 0 10px #ff3344;
    border-radius: 50%;
    transform: scale(0.8);
    animation: pulseFood 0.8s infinite alternate;
  }

  @keyframes pulseFood {
    0% {
      transform: scale(0.7);
    }
    100% {
      transform: scale(0.9);
    }
  }

  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
  }

  @keyframes paneFadeIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Toggle Switch Styles */
  .switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
    flex-shrink: 0;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.1);
    transition: 0.3s;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: rgba(255, 255, 255, 0.6);
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: rgba(0, 255, 102, 0.2);
    border-color: #00ff66;
  }

  input:checked + .slider:before {
    transform: translateX(14px);
    background-color: #00ff66;
  }
</style>
