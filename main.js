const bird = document.querySelector("#bird");
const container = document.querySelector(".container");
const scoreDiv = document.querySelector("h2");

let posY = 48.0;
const gravity = 0.2;
let velocity = 0;
let colliding = false;
let gap = 150;
let pipesArray = [];
let pipeX = [window.innerWidth * 0.8, window.innerWidth * 1.1, window.innerWidth * 1.4, window.innerWidth*1.7];
let score = 0;
let gameRunning = false;
let jumpMag = -2;
let movSpeed = window.innerWidth/200;
let fflag=false;
let pipeGap=0.3;
let pipeCount=5;
let gameFinished=false;

document.addEventListener("DOMContentLoaded", (e) => {


    //generating the pipes based on screenwidth
    let p=0.8;
    if(window.innerWidth>1000)
        {pipeGap=0.2;pipeCount=7}
    for(let i=0;i<pipeCount;i++)
    {
        generatePipes(window.innerWidth*p + "px")
        pipeX[i]=window.innerWidth*p;
        p+=pipeGap;
    }
    
    //gameLoop
    setInterval(() => {
        if (gameRunning) {
            velocity += gravity;
            if (posY < 95 && posY > 0)
                posY += velocity;
            else {
                colliding = true;
            }
            bird.style.top = posY + "%";
            //checking collision with upper and lower bdrys
            if (colliding) {
                gameOver();
                gameRunning = false;
                gameFinished=true;
            }

            movePipes();
            scoreUpdate();

            //checking collisions with pipes
            if (chkCollisions()) {
                gameOver();
                gameRunning = false;
                gameFinished=true;
            }
            //making game progressively difficult
            if(score%5==0)
            {
                if(fflag)
                {   
                    if(jumpMag>-3.5) 
                        jumpMag-=0.15;
                    movSpeed+=1;
                    fflag=false;
                }
            }
            else
            {
                fflag=true;
            }
        }
    }, 25);





    //Jumping function
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && !gameFinished) {
            velocity = jumpMag;
            gameRunning = true;
        }
        if (e.code === "KeyR" && gameFinished) {
            location.reload();
            console.log("asd");
        }
    })
})

function scoreUpdate()
{
    scoreDiv.innerText = `Score : ${score}`;
}

function gameOver() {
    let gameOver = document.createElement("div");
    gameOver.id = "gameOver";
    gameOver.className = "gameOverContainer";
    let text = document.createElement("h1");
    let retext = document.createElement("h3");
    retext.innerText = "Press R to play Again";
    text.innerText = "Game Over!!!";
    gameOver.appendChild(text);
    gameOver.appendChild(retext);
    container.appendChild(gameOver);
}

function generatePipes(left) {
    let pipes = document.createElement("div");
    let pipeTop = document.createElement("div");
    let pipeBot = document.createElement("div");
    pipesArray.push(pipes);

    pipes.className = "pipe-set";
    pipeTop.className = "pipe upper";
    pipeBot.className = "pipe lower";

    container.appendChild(pipes);
    pipes.appendChild(pipeTop);
    pipes.appendChild(pipeBot);

    pipeBot.style.left = left;
    pipeTop.style.left = left;
    const upperHeight = Math.floor(Math.random() * (280 - 50 + 1)) + 50;
    const lowerHeight = 500 - upperHeight - gap;
    pipeTop.style.height = upperHeight + "px";
    pipeBot.style.height = lowerHeight + "px";

}

function movePipes() {

    let flag = false;
    for (let i = 0; i < pipesArray.length; i++) {
        if (pipeX[i] >= -100) 
            {
                pipeX[i] -= movSpeed; 
                flag = false;
            }
        else {
            pipeX[i] = window.innerWidth*1.3;
            flag = true;
        }
        if (pipeX[i] <= window.innerWidth*0.8/2 + movSpeed/2 && pipeX[i]>window.innerWidth*0.8/2 - movSpeed/2) {
            score++;
            console.log(score);
        }

        pipesArray[i].children[0].style.left = pipeX[i] + "px";
        pipesArray[i].children[1].style.left = pipeX[i] + "px";
    }

}

function chkCollisions() {
    for (let i = 0; i < pipesArray.length; i++) {
        let topRect = pipesArray[i].children[0].getBoundingClientRect();
        let botRect = pipesArray[i].children[1].getBoundingClientRect();
        if (chkCollision(topRect))
            return true;
        if (chkCollision(botRect))
            return true;
    }
}

function chkCollision(rect) {
    const birdRect = bird.getBoundingClientRect();
    if (rect.top < birdRect.bottom &&
        rect.bottom > birdRect.top &&
        rect.right > birdRect.left &&
        rect.left < birdRect.right
    )
        return true;
    else
        return false;
}