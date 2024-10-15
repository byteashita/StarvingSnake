let inputDir = {x: 0, y: 0};  // Initialize to zero
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 10;  // Initial speed
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{x: 13, y: 15}];
let food = {x: 6, y: 7};
let highScore = localStorage.getItem('highScore') || 0;  // Retrieve high score from localStorage

// Display initial score and high score
document.getElementById('scoreBox').innerHTML = `Score: 0`;
document.getElementById('highScoreBox').innerHTML = `High Score: ${highScore}`;

// Function to increase the speed every 2 seconds
function increaseSpeed() {
    speed += 1;  // Increase the speed by 1
    console.log("Speed increased to:", speed);  // Optional: log the speed increase for debugging
}

// Set the interval to increase speed every 2 seconds (2000 milliseconds)
setInterval(increaseSpeed, 2000);

// Game functions
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime) / 1000 < 1 / speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake){
    // If you bump into yourself 
    for (let i = 1; i < snake.length; i++){
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0){
        return true;
    }
    return false;  // Return false if no collision
}

function gameEngine(){
    // Part 1: Updating the snake array and food
    
    // If the snake collides with itself or the wall
    if (isCollide(snakeArr)){
        if (gameOverSound.paused) {  // Ensure sound plays only once
            gameOverSound.play();
        }
        musicSound.pause();  // Uncomment if you have background music
        inputDir = {x: 0, y: 0};  // Reset movement direction
        alert("Game Over. Press any key to play again!");
        
        // Check and update high score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);  // Store new high score
        }
        
        // Update both score and high score displays
        document.getElementById('scoreBox').innerHTML = `Score: ${score}`;
        document.getElementById('highScoreBox').innerHTML = `High Score: ${highScore}`;
        
        snakeArr = [{x: 13, y: 15}];  // Reset the snake to initial state
        musicSound.play();  // Uncomment if you have background music
        score = 0;  // Reset the score
        speed = 10;  // Reset the speed when the game restarts
        scoreBox.innerHTML = `Score: ${score}`;
    }

    // If the snake has eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play();  // Play food sound
        score += 1;  // Increment score only when eating food
        document.getElementById('scoreBox').innerHTML = `Score: ${score}`;  // Update score display
        document.getElementById('highScoreBox').innerHTML = `High Score: ${highScore}`;  // Update high score display
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });  // Grow the snake
        
        // Generate new food position
        let a = 2;
        let b = 16;
        food = { 
            x: Math.round(a + (b - a) * Math.random()), 
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and the food
    
    // Clear the board before displaying the snake and food
    board.innerHTML = '';

    // Display the snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = {x: 0, y: 1};  // Start moving the snake upon keydown
    moveSound.play();
    switch(e.key){
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
        break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
        break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
        break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
        break;

        default:
            break;
    }
});
