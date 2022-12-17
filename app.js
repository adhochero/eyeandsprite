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

let target;
let puppy;
let puppy2;
let puppy3;

window.onload = init;

function init(){
    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    puppy = new AnimateSprite(document.getElementById("puppy"), 8, 200, 150, 5, 3, 3, 2, 12);
    puppy2 = new AnimateSprite(document.getElementById("puppy"), 8, 300, 150, 5, 3, 3, 2, 12);
    puppy3 = new AnimateSprite(document.getElementById("puppy"), 8, 400, 150, 5, 3, 3, 2, 12);
    target = puppy;

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
    //drawSprite();
    puppy.drawSprite(context);
    puppy2.drawSprite(context);
    puppy3.drawSprite(context);
}

// _______________SWITCH ANIMATIONS___________________

//change animation on key down
document.onkeydown = function (e) {
    if (e.key == "1"){
        target = puppy;
    }
    if (e.key == "2"){
        target = puppy2;
    }
    if (e.key == "3"){
        target = puppy3;
    }

    if (e.key.toLowerCase() == "r"){
        target.currentFrame = 0;
        target.chosenRow = 2;
        target.framesOnRow = 5;
        target.frameInterval = 8;
    }
    if (e.key.toLowerCase() == "s"){
        target.currentFrame = 0;
        target.chosenRow = 3;
        target.framesOnRow = 2;
        target.frameInterval = 12;
    }
};

// _______________ANIMATE SPRITE CLASS___________________

class AnimateSprite{
    constructor(spriteSheet, scale, x, y, totalColumns, totalRows, chosenRow, framesOnRow, frameInterval){
        this.spriteSheet = spriteSheet;
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.totalColumns = totalColumns;
        this.totalRows = totalRows;
        
        this.chosenRow = chosenRow;
        this.framesOnRow = framesOnRow;
        this.currentFrame = 0;
        
        this.frameTimer = 0;
        this.frameInterval = frameInterval;
    }

    drawSprite(context){
        //get frames size based on spritesheet
        let sheetWidth = this.spriteSheet.naturalWidth;
        let sheetHeigth = this.spriteSheet.naturalHeight;
        let frameWidth = sheetWidth / this.totalColumns;
        let frameHeight = sheetHeigth / this.totalRows;
    
        this.frameTimer++;
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
    
            //loop through frames on row
            if(this.currentFrame < this.framesOnRow - 1) this.currentFrame++;
            else this.currentFrame = 0;
        }
    
        context.imageSmoothingEnabled = false;
        context.drawImage(
            this.spriteSheet, //img
            this.currentFrame * frameWidth, //sx
            (this.chosenRow - 1) * frameHeight, //sy
            frameWidth, //swidth
            frameHeight, //sheight
            this.x - frameWidth * 0.5 * this.scale, //x
            this.y - frameHeight * 0.5 * this.scale, //y
            frameWidth * this.scale, //width
            frameHeight * this.scale //height
        );
    }

}