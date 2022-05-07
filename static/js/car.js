const score=document.querySelector('.score');
const startScreen=document.querySelector('.startScreen');
const gameArea=document.querySelector('.gameArea');
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let imgindex = 1
let isVideo = false;
let model = null;
let videoInterval = 100
const cx = 320
const cy = 240
/*console.log(gameArea);*/
startScreen.addEventListener('click',start);
let player={speed:5,score:0};
let keys ={ArrowUp:false,ArrowDown:false,ArrowLeft:false,ArrowRight:false}

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

function keyDown(e){
    e.preventDefault();
    keys[e.key]=true;
    /*console.log(e.key);
    console.log(keys);*/
}
function keyUp(e){
    e.preventDefault();
    keys[e.key]=false;
    /*console.log(e.key);
    console.log(keys);*/
}

function isCollide(a,b){
    aRect=a.getBoundingClientRect();
    bRect=b.getBoundingClientRect();
    return !((aRect.bottom<bRect.top)||(aRect.top>bRect.bottom)||(aRect.right<bRect.left)||(aRect.left>bRect.right))
}

function moveLines(){
    let lines=document.querySelectorAll('.lines');
    lines.forEach(function(item){
        if(item.y >=650){
            item.y-=740;
        }
        item.y+=player.speed;
        item.style.top=item.y+"px";
    })
}
function endGame(){
    player.start=false;
    startScreen.classList.remove('hide');
    gameOver();
}
function moveEnemy(car){
    let enemy=document.querySelectorAll('.enemy');
    enemy.forEach(function(item){

        if(isCollide(car,item)){
            console.log("Bang!");
            endGame();
        }
        if(item.y >=750){
            item.y=-300;
            item.style.left=Math.floor(Math.random()*350)+"px";
        }
        item.y+=player.speed;
        item.style.top=item.y+"px";
    })
}
function gamePlay(){
    // console.log("here we go");
    let car=document.querySelector('.car');
    let road=gameArea.getBoundingClientRect();
    /*console.log(road);*/
    if(player.start){
        moveLines();
        moveEnemy(car);

        if(keys.ArrowUp && player.y>(road.top+70)){
            player.y-=player.speed
        }
        if(keys.ArrowDown && player.y<(road.bottom-85)){
            player.y+=player.speed
        }
        if(keys.ArrowLeft && player.x>0 ){
            player.x-=player.speed
        }
        if(keys.ArrowRight && player.x<(road.width-50)){
            player.x+=player.speed
        }
        car.style.top=player.y+"px";
        car.style.left=player.x+"px";
        window.requestAnimationFrame(gamePlay);
        updateScoreBox(1)
    }
}

function start(){
    //gameArea.classList.remove('hide');
    startScreen.classList.add('hide');
    gameArea.innerHTML="";
    player.start=true;
    player.score=0;
    window.requestAnimationFrame(gamePlay);

    for(x=0;x<5;x++){
        let roadLine=document.createElement('div');
        roadLine.setAttribute('class','lines');
        roadLine.y=(x*150);
        roadLine.style.top=roadLine.y+"px";
        gameArea.appendChild(roadLine);
    }

    let car=document.createElement('div');
    car.setAttribute('class','car');
    /*car.innerText="Hey I am car";*/
    gameArea.appendChild(car);

    player.x=car.offsetLeft;
    player.y=car.offsetTop;


   /* console.log(car.offsetTop);
    console.log(car.offsetLeft);*/

    for(x=0;x<3;x++){
        let enemyCar=document.createElement('div');
        enemyCar.setAttribute('class','enemy');
        enemyCar.y=((x+1)*350)*-1;
        enemyCar.style.top=enemyCar.y+"px";
        enemyCar.style.backgroundColor=randomColor();
        enemyCar.style.left=Math.floor(Math.random()*350)+"px";
        gameArea.appendChild(enemyCar);
    }


}
function randomColor(){
    function c(){
        let hex=Math.floor(Math.random()*256).toString(16);
        return ("0"+String(hex)).substr(-2);
    }
    return "#"+c()+c()+c();
}


$(".pauseoverlay").show()
// $(".overlaycenter").text("Game Paused")
$(".overlaycenter").animate({
    opacity: 1,
    fontSize: "4vw"
}, pauseGameAnimationDuration, function () {});

const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}



function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



trackButton.addEventListener("click", function () {
    toggleVideo();
});


function checkrange(x,y){
    let dx=30
    let dy=20
    if((320+dx<x) || (320-dx>x))return true;
    if((240+dy<y) || (240-dy>y))return true;
    return false;
}



function move(x,y){
    let ax = Math.abs(x-cx)
    let ay = Math.abs(y-cy)
    let road=gameArea.getBoundingClientRect();
    if(ax>ay){
        if(x>cx){
            console.log("right")
            if(player.x<(road.width-50)){
                let position = player.x+8*player.speed
                if(position>road.width)
                    player.x=road.width-100
                else
                    player.x+=8*player.speed
            }
        }
        else{
            console.log("left")
            if(player.x>0 ){
                player.x-=8*player.speed
            }
        }
    }
    else{
        if(y>cy)
        {
            console.log("down")
            if(keys.ArrowDown && player.y<(road.bottom-85)){
                player.y+=player.speed
            }
        }
        else{
            console.log("up")
            if(keys.ArrowUp && player.y>(road.top+70)){
                player.y-=player.speed
            }
        }
    }

}

function runDetection() {
    model.detect(video).then(predictions => {
        model.renderPredictions(predictions, canvas, context, video);   
        if (predictions[0]) {
            let midvalx = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
            let midvaly = predictions[0].bbox[1] + (predictions[0].bbox[3] / 2)
            console.log(midvalx,midvaly)
            console.log(video.width/2,video.height/2);

            if(checkrange(midvalx,midvaly))
                move(midvalx,midvaly)
            else
                console.log("no move")
        }
        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            }, videoInterval);
        }
    });
}



// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    toggleVideo()
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
    $(".overlaycenter").animate({
        opacity: 0,
        fontSize: "0vw"
    }, pauseGameAnimationDuration, function () {
        $(".pauseoverlay").hide()
    });
});









var enableAudio = false;
var pauseGame = false;
var gameover = false;
var pauseGameAnimationDuration = 500;
var gameOverAninmationDuration = 100;
$("input#sound").click(function () {
    enableAudio = $(this).is(':checked')
    soundtext = enableAudio ? "sound on" : "sound off";
    $(".soundofftext").text(soundtext)
});

runDetection();






    function updateScoreBox(points) {
        if(points==0)
        {
            gameOver();
        }
        if (!pauseGame && !gameover) {
            player.score += points;
            $(".scorevalue").text(player.score)
            pointsAdded = points > 0 ? "+" + points : points
            $(".scoreadded").text(pointsAdded)
            $(".scoreadded").show().animate({
                opacity: 0,
                fontSize: "4vw",
                color: "#ff8800"
            }, 500, function () {
                $(this).css({
                    fontSize: "2vw",
                    opacity: 1
                }).hide()
            });
        }
    }

    function pauseGamePlay() {
        pauseGame = !pauseGame
        if (pauseGame) {
            $(".pauseoverlay").show()
            $(".overlaycenter").text("Game Paused")
            $(".overlaycenter").animate({
                opacity: 1,
                fontSize: "4vw"
            }, pauseGameAnimationDuration, function () {});
        } else {

            $(".overlaycenter").animate({
                opacity: 0,
                fontSize: "0vw"
            }, pauseGameAnimationDuration, function () {
                $(".pauseoverlay").hide()
            });
        }

    }

    
    document.onkeyup = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 32) {
            console.log("spacebar pressed")
            pauseGamePlay()
        }
        if (key == 83) {
            $("input#sound").click()
        }
        if(key == 82)
        {
            console.log("restart game")
            restartGame();
        }
    }

    function gameOver() {
            gameover=true;
            $(".pauseoverlay").show()
            $(".overlaycenter").text("Game Over!")
            $(".overlaycenter").animate({
                opacity: 1,
                fontSize: "4vw"
            }, gameOverAninmationDuration, function () {});

            updateNote.innerText = "Stopping video"
            handTrack.stopVideo(video)
            isVideo = false;
            updateNote.innerText = "Video stopped"

            $.ajax(
                {
                    type:"POST",
                    url: "/updatescore/",
                    data:{
                             Score:player.score,
                             game:"car"
                    },
                    success: function( data ) 
                    {
                        console.log(data);
                    }
                 });

    }

    function restartGame()
    {
        score=0;
        toggleVideo()
        $(".overlaycenter").animate({
            opacity: 0,
            fontSize: "0vw"
        }, gameOverAninmationDuration, function () {
            $(".pauseoverlay").hide()
        });
        gameover=false;
    }
