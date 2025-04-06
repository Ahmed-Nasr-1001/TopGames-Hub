
      
        const boardWidth = 500;
        const boardHeight = 500;
        const playerHeight = 10;
        const playerVelocityX = 10;
        const ballWidth = 10;
        const ballHeight = 10;
        const blockWidth = 50;
        const blockHeight = 10;
        const blockColumns = 8;
        const blockRowsStart = 3;
        const blockMaxRows = 5;
        const maxLevel = 5;

        // Difficulty Settings
        const difficultySettings = {
            easy: { ballSpeed: 3, paddleWidth: 100 },
            medium: { ballSpeed: 5, paddleWidth: 80 },
            hard: { ballSpeed: 7, paddleWidth: 60 }
        };

        // Game Variables
        let board, context;
        let player, ball, blocks;
        let score = 0;
        let lives = 3;
        let currentLevel = 1;
        let gameOver = true;
        let isPaused = false;
        let moveLeft = false, moveRight = false;
        let difficulty = 'easy';

        // DOM Elements
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const scoreElement = document.getElementById('score');
        const livesElement = document.getElementById('lives');
        const levelElement = document.getElementById('level');
        const levelSelect = document.getElementById('levelSelect');
        const gameOverOverlay = document.getElementById('gameOverOverlay');
        const gameOverText = document.getElementById('gameOverText');
        const finalScore = document.getElementById('finalScore');
        const finalLevel = document.getElementById('finalLevel');
        const restartBtn = document.getElementById('restartBtn');


        // Initialize Game
        window.onload = initialize;

        function initialize() {
            board = document.getElementById("board");
            board.width = boardWidth;
            board.height = boardHeight;
            context = board.getContext("2d");

            const audio = document.getElementById("myAudio");
    audio.volume = 0.5; // Adjust volume if needed
    audio.play().catch(error => {
        console.log("Autoplay blocked: User interaction required.");
    });



            // Event Listeners
            startBtn.addEventListener('click', startGame);
            pauseBtn.addEventListener('click', togglePause);
            levelSelect.addEventListener('change', updateDifficulty);
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);
            document.addEventListener("touchstart", handleTouchStart);
            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("touchend", handleTouchEnd);
            restartBtn.addEventListener('click', () => {
                gameOverOverlay.style.display = 'none';
                startGame();
            });

            resetGame();
            draw();
        }

        function startGame() {
            if (gameOver) {
                resetGame();
                gameOver = false;
            }
            isPaused = false;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            pauseBtn.textContent = "Pause";
            applyDifficultySettings();
            requestAnimationFrame(gameLoop);
        }

        function togglePause() {
            isPaused = !isPaused;
            pauseBtn.textContent = isPaused ? "Resume" : "Pause";
            if (!isPaused && !gameOver) {
                gameLoop();
            }
        }

        function updateDifficulty() {
            difficulty = levelSelect.value;
            if (!gameOver) {
                applyDifficultySettings();
            } else {
                resetGame();
                draw();
            }
        }

        function applyDifficultySettings() {
            player.width = difficultySettings[difficulty].paddleWidth;
            player.x = boardWidth / 2 - player.width / 2;

            const dirX = Math.sign(ball.velocityX);
            const dirY = Math.sign(ball.velocityY);
            ball.velocityX = dirX * difficultySettings[difficulty].ballSpeed;
            ball.velocityY = dirY * difficultySettings[difficulty].ballSpeed;
        }

        function resetGame() {
            score = 0;
            lives = 3;
            currentLevel = 1;
            gameOver = true;

            player = {
                x: boardWidth / 2 - difficultySettings[difficulty].paddleWidth / 2,
                y: boardHeight - playerHeight - 5,
                width: difficultySettings[difficulty].paddleWidth,
                height: playerHeight
            };

            resetBall();
            createBlocks();
            updateUI();
        }

        function resetBall() {
            ball = {
                x: boardWidth / 2,
                y: boardHeight / 2,
                width: ballWidth,
                height: ballHeight,
                velocityX: difficultySettings[difficulty].ballSpeed * (Math.random() < 0.5 ? -1 : 1),
                velocityY: difficultySettings[difficulty].ballSpeed * -1
            };
        }

        function gameLoop() {
            if (gameOver || isPaused) return;

            context.clearRect(0, 0, board.width, board.height);

            updatePlayer();
            updateBall();
            checkCollisions();
            checkGameState();
            draw();

            requestAnimationFrame(gameLoop);
        }

        function updatePlayer() {
            if (moveLeft && player.x > 0) player.x -= playerVelocityX;
            if (moveRight && player.x + player.width < boardWidth) player.x += playerVelocityX;
        }

        function updateBall() {
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
        }

        function checkCollisions() {
            // Wall collisions
            if (ball.y <= 0) ball.velocityY *= -1;
            if (ball.x <= 0 || ball.x + ballWidth >= boardWidth) ball.velocityX *= -1;

            // Player collision
            if (isColliding(ball, player)) ball.velocityY *= -1;

            // Block collisions
            blocks.forEach(block => {
                if (!block.broken && isColliding(ball, block)) {
                    block.broken = true;
                    ball.velocityY *= -1;
                    score += 100;
                    updateUI();
                }
            });

            // Bottom boundary
            if (ball.y + ballHeight >= boardHeight) handleLifeLoss();
        }

        function checkGameState() {
            const remainingBlocks = blocks.filter(b => !b.broken).length;

            if (remainingBlocks === 0) {
                if (currentLevel >= maxLevel) {
                    showGameOver(true);
                } else {
                    currentLevel++;
                    createBlocks();
                    resetBall();
                    updateUI();
                }
            }
        }

        function handleLifeLoss() {
            lives--;
            updateUI();

            if (lives <= 0) {
                showGameOver(false);
            } else {
                resetBall();
            }
        }

        function showGameOver(won) {
            gameOver = true;
            startBtn.disabled = false;
            pauseBtn.disabled = true;

            gameOverText.textContent = won ? '🎉 You Won! 🎉' : 'Game Over';
            finalScore.textContent = score;
            finalLevel.textContent = currentLevel;
            gameOverOverlay.style.display = 'block';
        }

        function createBlocks() {
            const rows = blockRowsStart + (currentLevel - 1);
            blocks = [];

            for (let c = 0; c < blockColumns; c++) {
                for (let r = 0; r < rows; r++) {
                    blocks.push({
                        x: 15 + c * (blockWidth + 10),
                        y: 45 + r * (blockHeight + 10),
                        width: blockWidth,
                        height: blockHeight,
                        broken: false
                    });
                }
            }
        }

        function isColliding(a, b) {
            return a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y;
        }

        function draw() {
            // Player
            context.fillStyle = "#4CAF50";
            context.fillRect(player.x, player.y, player.width, player.height);

            // Ball
            context.fillStyle = "#FFFFFF";
            context.fillRect(ball.x, ball.y, ball.width, ball.height);

            // Blocks
            context.fillStyle = "#2196F3";
            blocks.forEach(block => {
                if (!block.broken) {
                    context.fillRect(block.x, block.y, block.width, block.height);
                }
            });

            // Pause overlay
            if (isPaused) {
                context.fillStyle = "rgba(0, 0, 0, 0.7)";
                context.fillRect(0, 0, boardWidth, boardHeight);
                context.fillStyle = "#FFFFFF";
                context.font = "40px Arial";
                context.textAlign = "center";
                context.fillText("PAUSED", boardWidth / 2, boardHeight / 2);
            }
        }

        function handleKeyDown(e) {
            if (e.code === "ArrowLeft") moveLeft = true;
            if (e.code === "ArrowRight") moveRight = true;
        }

        function handleKeyUp(e) {
            if (e.code === "ArrowLeft") moveLeft = false;
            if (e.code === "ArrowRight") moveRight = false;
        }

        function handleTouchStart(e) {
            const touchX = e.touches[0].clientX;
            moveLeft = touchX < boardWidth / 2;
            moveRight = !moveLeft;
        }

        function handleTouchMove(e) {
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            moveLeft = touchX < boardWidth / 2;
            moveRight = !moveLeft;
        }

        function handleTouchEnd() {
            moveLeft = false;
            moveRight = false;
        }

        function updateUI() {
            scoreElement.textContent = score;
            livesElement.textContent = lives;
            levelElement.textContent = currentLevel;
        }





        function toggleAudio() {
            const audio = document.getElementById("myAudio");
            const toggleBtn = document.getElementById("toggleAudioBtn");

            if (audio.paused) {
                audio.play();
                toggleBtn.textContent = "⏸"; // Change button to pause icon
            } else {
                audio.pause();
                toggleBtn.textContent = "▶"; // Change button to play icon
            }

         
        }

        document.addEventListener("click", function playAudio() {
    const audio = document.getElementById("myAudio");
    audio.play();
    document.removeEventListener("click", playAudio); // Remove event after first click
});