// Game Configuration
const CONFIG = {
    rodLength: 60,
    rodSpeed: 0.03, // Rads per frame
    maxAngle: Math.PI / 2.5,
    minAngle: -Math.PI / 2.5,
    hookSpeed: 10,
    retractSpeed: 15,
    fishBaseSpeed: 2
};

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.isRunning = false;

        this.hook = new Hook(this.width / 2, 100);
        this.fishes = [];
        this.lastTime = 0;

        // ONLY Doruk's pool
        this.championPool = [];
        if (typeof CHAMPION_POOLS !== 'undefined' && CHAMPION_POOLS.doruk) {
            this.championPool = CHAMPION_POOLS.doruk;
        } else {
            // Fallback
            this.championPool = [{ name: 'Fish', color: 'orange' }];
        }

        this.bindEvents();
        this.resize();
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        const shoot = () => {
            if (this.isRunning && this.hook.state === 'IDLE') {
                this.hook.shoot();
            }
        };

        window.addEventListener('mousedown', shoot);
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') shoot();
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            document.getElementById('start-screen').style.display = 'none';
            this.start();
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('victory-screen').style.display = 'none';
            this.start();
        });
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.hook.originX = this.width / 2;
    }

    start() {
        this.isRunning = true;
        this.hook.reset();
        this.spawnAll(); // Spawn exactly one of each
        this.gameLoop(0);
    }

    spawnAll() {
        this.fishes = [];
        // Spread them out vertically
        const startY = 200;
        const availableHeight = this.height - 250;

        this.championPool.forEach((champ, index) => {
            const y = startY + Math.random() * availableHeight;
            // Randomize side
            const fromLeft = Math.random() > 0.5;
            // Randomize initial X so they don't all appear at edge at once
            const x = Math.random() * this.width;
            const speed = (Math.random() * 2 + CONFIG.fishBaseSpeed) * (fromLeft ? 1 : -1);

            this.fishes.push(new Fish(x, y, speed, champ));
        });
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update();
        this.draw();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update() {
        this.hook.update(this.width, this.height);

        // Update fishes (Wrap around logic)
        this.fishes.forEach(fish => {
            fish.update();
            // Wrapping
            if (fish.speed > 0 && fish.x > this.width + 100) {
                fish.x = -100;
                fish.y = Math.random() * (this.height - 250) + 200; // New random depth on loop
            } else if (fish.speed < 0 && fish.x < -100) {
                fish.x = this.width + 100;
                fish.y = Math.random() * (this.height - 250) + 200;
            }
        });

        // Collision detection
        if (this.hook.state === 'SHOOTING' && !this.hook.caughtFish) {
            for (let fish of this.fishes) {
                if (this.checkCollision(this.hook, fish)) {
                    this.hook.catch(fish);
                    break;
                }
            }
        }

        // Check if hook returned with fish
        if (this.hook.state === 'IDLE' && this.hook.caughtFish) {
            this.endGame(this.hook.caughtFish);
        }
    }

    endGame(caughtFish) {
        this.isRunning = false; // Stop loop
        // Ensure the frame is drawn one last time to show catch? 
        // Or just show overlay

        const victoryScreen = document.getElementById('victory-screen');
        const victoryText = document.getElementById('victory-text');
        victoryText.innerHTML = `YOU PICKED<br>${caughtFish.name.toUpperCase()}!`;
        victoryScreen.style.display = 'flex';
    }

    checkCollision(hook, fish) {
        // Simple circle collision
        const dx = hook.x - fish.x;
        const dy = hook.y - fish.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (hook.radius + fish.radius);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw Fisherman (Simple Stick Figure)
        this.drawFisherman();

        // Draw Fishes
        this.fishes.forEach(fish => fish.draw(this.ctx));

        // Draw Hook
        this.hook.draw(this.ctx);
    }

    drawFisherman() {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const boatY = 150;

        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#4a3c31';
        ctx.lineWidth = 3;

        // Boat
        ctx.beginPath();
        ctx.moveTo(centerX - 50, boatY);
        ctx.lineTo(centerX + 50, boatY);
        ctx.lineTo(centerX + 30, boatY + 30);
        ctx.lineTo(centerX - 30, boatY + 30);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Stickman
        ctx.lineWidth = 2;
        // Body
        ctx.beginPath();
        ctx.moveTo(centerX, boatY);
        ctx.lineTo(centerX, boatY - 40);
        ctx.stroke();
        // Head
        ctx.beginPath();
        ctx.arc(centerX, boatY - 50, 10, 0, Math.PI * 2);
        ctx.stroke();
        // Arms holding rod
        ctx.beginPath();
        ctx.moveTo(centerX, boatY - 30);
        ctx.lineTo(centerX + 15, boatY - 20); // Arm
        ctx.stroke();

        // Hat
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.rect(centerX - 15, boatY - 60, 30, 5);
        ctx.rect(centerX - 10, boatY - 70, 20, 10);
        ctx.fill();
    }
}

class Hook {
    constructor(originX, originY) {
        this.originX = originX;
        this.originY = originY;
        this.reset();
    }

    reset() {
        this.angle = 0;
        this.length = CONFIG.rodLength;
        this.state = 'IDLE';
        this.angleSpeed = CONFIG.rodSpeed;
        this.x = this.originX;
        this.y = this.originY;
        this.radius = 10;
        this.caughtFish = null;
    }

    update(width, height) {
        if (this.state === 'IDLE') {
            this.angle += this.angleSpeed;
            if (this.angle > CONFIG.maxAngle || this.angle < CONFIG.minAngle) {
                this.angleSpeed = -this.angleSpeed;
            }
            this.length = CONFIG.rodLength;
        } else if (this.state === 'SHOOTING') {
            this.length += CONFIG.hookSpeed;
            // Bounds check
            if (this.x < 0 || this.x > width || this.y > height) {
                this.state = 'RETRACTING';
            }
        } else if (this.state === 'RETRACTING') {
            this.length -= CONFIG.retractSpeed;
            if (this.length <= CONFIG.rodLength) {
                this.length = CONFIG.rodLength;
                this.state = 'IDLE';
                // if caught fish logic handled in Game
            }
        }

        this.x = this.originX + Math.sin(this.angle) * this.length;
        this.y = this.originY + Math.cos(this.angle) * this.length;

        if (this.caughtFish) {
            this.caughtFish.x = this.x;
            this.caughtFish.y = this.y + 20; // Hang below hook
        }
    }

    shoot() {
        this.state = 'SHOOTING';
    }

    catch(fish) {
        this.state = 'RETRACTING';
        this.caughtFish = fish;
        fish.isCaught = true;
    }

    draw(ctx) {
        // Line
        ctx.beginPath();
        ctx.moveTo(this.originX, this.originY); // Tip of rod static pos roughly
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Hook
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#999';
        ctx.fill();
        ctx.stroke();
    }
}

class Fish {
    constructor(x, y, speed, champInfo) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.name = champInfo.name;
        this.color = champInfo.color;
        this.active = true;
        this.isCaught = false;
        this.radius = 25; // Hitbox radius
    }

    update() {
        if (!this.isCaught) {
            this.x += this.speed;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.speed < 0 && !this.isCaught) ctx.scale(-1, 1); // Flip if swimming left

        // Fish Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-40, -15);
        ctx.lineTo(-40, 15);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(15, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(17, -5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Name Tag
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.restore();

        if (!this.isCaught) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px sans-serif';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 2;
            ctx.fillText(this.name, this.x, this.y - 30);
            ctx.shadowBlur = 0;
        }
    }
}

// Start Game
window.onload = () => {
    new Game();
};
