// _______________EYE FOLLOWS MOUSE___________________

const fallOffMultiplier = 45 //lower value = more range.

const eyesOpen = document.getElementById('base__eyes-open');
const eyesClosed = document.getElementById('base__eyes-closed');
const pupils = document.querySelectorAll('.pupil');

let rect = eyesOpen.getBoundingClientRect();
let eyesOpenX = rect.left + rect.width / 2;
let eyesOpenY = rect.top + rect.height / 2;

window.addEventListener('resize', (e) =>{
    rect = eyesOpen.getBoundingClientRect();
    eyesOpenX = rect.left + rect.width / 2;
    eyesOpenY = rect.top + rect.height / 2;
});

document.addEventListener('mousemove', (e) =>{
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distanceX = eyesOpenX - mouseX;
    const distanceY = eyesOpenY - mouseY;

    const norm = Math.sqrt(distanceX **2 + distanceY **2)
    const scaledValue = norm / window.innerHeight;
    const fallOff = (scaledValue * fallOffMultiplier * (window.innerHeight / 700)) + 1;

    const x = distanceX / fallOff;
    const y = distanceY / fallOff;

    pupils.forEach(pupil => {
        pupil.style.transform = `translateX(${-x}px) translateY(${-y}px)`;
    });
});

document.addEventListener('mousedown', (e) =>{
    closeEye();
    setTimeout(openEye, 200);
});

const closeEye = () => {
    eyesClosed.classList.toggle('hidden')//.remove('hidden');
    eyesOpen.classList.toggle('hidden')//.add('hidden');
    pupils.forEach(pupil => {
        pupil.classList.toggle('hidden')//.add('hidden');
    })
};

const openEye = () => {
    eyesClosed.classList.toggle('hidden')//.add('hidden');
    eyesOpen.classList.toggle('hidden')//.remove('hidden');
    pupils.forEach(pupil => {
        pupil.classList.toggle('hidden')//.remove('hidden');
    })
};

// _______________HOW TO CANVAS___________________

let canvas;
let context;

let secondsPassed;
let oldTimeStamp;
let fps;

window.onload = init;

function init(){
    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);
    if(fps) console.log("FPS: " + fps);

    update(secondsPassed);
    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
    
}

function draw(){
    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //draw below
    drawSprite();
}

// _______________ANIMATE SPRITE___________________

let idle = {
    row: 1,
    frames: 2,
    interval: 12
}
let run = {
    row: 2,
    frames: 5,
    interval: 8
}
let rest = {
    row: 3,
    frames: 2,
    interval: 12
}

function stateManage(){
    if(true){
        chosenRow = idle.row;
        framesOnRow = idle.frames;
        frameInterval = idle.interval;
    }
}

//animate per row test
const spriteSheet = document.getElementById("puppy");
const scale = 8;
const totalColumns = 5;
const totalRows = 3;

let chosenRow = 3;
let framesOnRow = 2;
let currentFrame = 0;

let frameTimer = 0;
let frameInterval = 12;

function drawSprite(){
    //get frames size based on spritesheet
    let sheetWidth = spriteSheet.naturalWidth;
    let sheetHeigth = spriteSheet.naturalHeight;
    let frameWidth = sheetWidth / totalColumns;
    let frameHeight = sheetHeigth / totalRows;

    frameTimer++;
    if(frameTimer > frameInterval){
        frameTimer = 0;

        //loop through frames on row
        if(currentFrame < framesOnRow - 1) currentFrame++;
        else currentFrame = 0;
    }

    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
        spriteSheet, //img
        currentFrame * frameWidth, //sx
        (chosenRow - 1) * frameHeight, //sy
        frameWidth, //swidth
        frameHeight, //sheight
        300 - frameWidth * 0.5 * scale, //x
        150 - frameHeight * 0.5 * scale, //y
        frameWidth * scale, //width
        frameHeight * scale //height
    );
}

//change animation on key down
document.onkeydown = function (e) {
    if (e.key.toLowerCase() == "r"){
        currentFrame = 0;
        chosenRow = 2;
        framesOnRow = 5;
        frameInterval = 8;
    }
    if (e.key.toLowerCase() == "s"){
        currentFrame = 0;
        chosenRow = 3;
        framesOnRow = 2;
        frameInterval = 12;
    }
};
