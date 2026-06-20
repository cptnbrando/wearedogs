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

  function initSnake() {
    snake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
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
    while (!newFood || snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      };
    }
    return newFood;
  }

  function moveSnake() {
    if (snakeGameOver || snakeDir.x === 0 && snakeDir.y === 0) return;

    const head = snake[0];
    const newHead = {
      x: (head.x + snakeDir.x + 20) % 20,
      y: (head.y + snakeDir.y + 20) % 20
    };

    // Collision with self
    if (snake.slice(1).some(s => s.x === newHead.x && s.y === newHead.y)) {
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
    
    if (e.key === "ArrowUp" && snakeDir.y === 0) {
      snakeDir = { x: 0, y: -1 };
      e.preventDefault();
    } else if (e.key === "ArrowDown" && snakeDir.y === 0) {
      snakeDir = { x: 0, y: 1 };
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && snakeDir.x === 0) {
      snakeDir = { x: -1, y: 0 };
      e.preventDefault();
    } else if (e.key === "ArrowRight" && snakeDir.x === 0) {
      snakeDir = { x: 1, y: 0 };
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
              class:is-snake={snake.some(s => s.x === x && s.y === y)}
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
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 20px;
    height: 100%;
    align-items: center;
    padding: 20px;
  }

  .game-sidebar {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .game-sidebar h3 {
    margin: 0 0 12px 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: white;
    letter-spacing: 0.1em;
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

  .controls-info {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.4;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .game-over-alert {
    margin-top: auto;
    background: rgba(255, 51, 68, 0.1);
    border: 1px solid rgba(255, 51, 68, 0.25);
    border-radius: 10px;
    padding: 10px;
    text-align: center;
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
    height: 100%;
  }

  .snake-board {
    display: grid;
    grid-template-rows: repeat(20, 1fr);
    width: 320px;
    height: 320px;
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid rgba(0, 191, 255, 0.3);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 30px rgba(0, 191, 255, 0.15);
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
    0% { transform: scale(0.7); }
    100% { transform: scale(0.9); }
  }

  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
  }

  @keyframes paneFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
</style>
