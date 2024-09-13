let board;
let boardWidth = 800;
let boardHeight = 400;
let context;

//ตั้งค่าตัวละครเกม
let playerWidth = 85;
let playerHeight = 65;
let playerX = 50;
let playerY = boardHeight - playerHeight;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};
let gameOver = false;
let score = 0;
let time = 0;

//อุปสรรค
let boxImg;
let boxWidth = 100; // กำหนดขนาดของกล่อง
let boxHeight = 50; // กำหนดขนาดของกล่อง
let boxX = boardWidth;
let boxY = boardHeight - boxHeight;

let boxesArray = [];
let boxSpeed = -6;

let CoupImg;
let lifeIMG;

//gravity & velocity
let velocityY = 0;
let gravity = 0.25;

// นับจำนวนครั้งที่เล่นใหม่
let restartCount = 0;
const maxRestarts = 2;

// Audio variables
let gameOverAudio = new Audio('TH.mp3');
gameOverAudio.loop = true; // Enable looping

console.log(player);

//กำหนดเหตุการเริ่มเกม
window.onload = function() {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //player
    playerImg = new Image();
    playerImg.src = "ym.png";
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    } 

    //request animation frame
    requestAnimationFrame(update);

    //ดักจับกระโดด
    document.addEventListener("keydown", movePlayer);
    
    //สร้าง box
    boxImg = new Image();
    boxImg.src = "tm.png";
    scheduleNextBox(); // เริ่มการสร้างกล่องที่สุ่มเวลา

    CoupImg = new Image();
    CoupImg.src = "Coup.jpg";

    lifeIMG = new Image();
    lifeIMG.src = "Flag.png";
    if(restartCount <=  maxRestarts+1){
        for(let j = maxRestarts ; j >0 ; j--){
        for(let i = restartCount+(3-j) ; i <=  maxRestarts+1 ; i++){

            context.drawImage(lifeIMG,((20+((50+10)*i))-50),60,50,50);

        }}
    }
}

// ฟังก์ชันสุ่มเวลาสำหรับการสร้างกล่องใหม่
function scheduleNextBox() {
    if (gameOver) {
        return;
    }

    let randomTime = Math.random() * 3000 + 2000; 
    setTimeout(function() {
        createBox();
        scheduleNextBox(); // สร้างกล่องใหม่และกำหนดเวลาสำหรับกล่องถัดไป
    }, randomTime);
}

//fun update
function update() {
    requestAnimationFrame(update); // update anime ตลอดเวลา

    if (gameOver) { // ตรวจสอบว่าเกม over หรือไม่
        if (!gameOverAudio.paused) {
            gameOverAudio.play(); // Play the game over audio if it's not already playing
        }
        return;
    }

    context.clearRect(0, 0, board.width, board.height); // เคลียร์ภาพซ้อน
    velocityY += gravity;

    // Update player position
    player.y = Math.min(player.y + velocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    
    // Update and draw boxes
    for (let i = 0; i < boxesArray.length; i++) {
        let box = boxesArray[i];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        // ตรวจสอบการชน
        if (onCollision(player, box)) {
            gameOver = true;
            restartCount+=1;
            gameOverAudio.play(); // Play the game over audio when collision happens

            // แจ้งเตือน ผล.
            if(restartCount <= maxRestarts){
                context.textAlign = "center";
            context.font = "normal bold 20px Arial";
            context.fillText("Press R to restart", boardWidth / 2, boardHeight / 2 + 100);
            }else if(restartCount>maxRestarts){
                context.drawImage(CoupImg,0,0,800,400);
                context.textAlign = "center";
                context.font = "normal bold 20px Arial";
                context.fillStyle  = "RED";
                context.fillText("Can't reform the democracy, We have to do the military coup.", boardWidth / 2, boardHeight / 2 + 100);
            }
            context.font = "normal bold 40px Arial";
            context.textAlign = "center";
            context.fillText("Game Over!", boardWidth / 2, boardHeight / 2);
            context.font = "normal bold 40px Arial";
            context.fillText("Score : " + score, boardWidth / 2, boardHeight / 2 + 50);
            return; // หยุดการอัปเดตเพิ่มเติมเมื่อเกมจบ
        }
    }

    if(restartCount <=  maxRestarts+1){
        for(let j = maxRestarts ; j >0 ; j--){
        for(let i = restartCount+(3-j) ; i <=  maxRestarts+1 ; i++){

            context.drawImage(lifeIMG,((20+((50+10)*i))-50),60,50,50);

        }}
    }

    // นับคะแนน
    score++;
    context.font = "normal bold 40px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 10, 34);

    // นับเวลา
    time += 0.01;
    context.font = "normal bold 20px Arial";
    context.textAlign = "right";
    context.fillText("Time : " + (time.toFixed()), boardWidth - 10, 30);
    
    if (time >= 60) {
        gameOver = true;
        gameOverAudio.play(); // Play the game over audio when time limit is reached
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillStyle  = "White";
        context.fillText("Victory!", boardWidth / 2, boardHeight / 2);
        context.font = "normal bold 40px Arial";
        context.fillStyle  = "White";
        context.fillText("Score : " + score, boardWidth / 2, boardHeight / 2 + 50);
        context.font = "normal bold 20px Arial";
        context.fillStyle  = "White";
        context.fillText("We got a true democracy.", boardWidth / 2, boardHeight / 2 + 100);
    }
}

//fun เคลื่อนตัวละคร
function movePlayer(e) {
    if (e.code === "KeyR" && restartCount <= maxRestarts && gameOver == true && time < 60) {
        boxesArray = [];
        score = 0;
        time = 0;
        player.y = playerY;
        gameOverAudio.pause();
        gameOverAudio.currentTime = 0;
        gameOver = false;
        scheduleNextBox()
    }
    if (gameOver) {
        return;
    }

    // เคลื่อนตัวละครด้วยการกด Space
    if (e.code === "Space" && player.y === playerY) {
        velocityY = -10;
    }
}

function createBox() {
    if (gameOver) {
        return;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    };
    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift(); // แก้ไขการลบกล่อง
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) &&
           (obj1.x + obj1.width) > obj2.x && // ชนกันในแนวนอน
           obj1.y < (obj2.y + obj2.height) &&
           (obj1.y + obj1.height) > obj2.y; // ชนกันในแนวตั้ง
}

//re game
function restartGame() {
    if (restartCount > maxRestarts && gameOver == true || time >= 60)  {
       location.reload();
    }
}
