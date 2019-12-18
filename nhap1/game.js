// SELECT CVS
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI/180;

// LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = "img/sprite.png";

// LOAD SOUNDS
const BG_SOUND = new Audio();
BG_SOUND.src = 'audio/gametheme.mp3';
var bgSound = true;

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// START BUTTON COORD
const startBtn = {
    x : 120,
    y : 200,
    w : 83,
    h : 29
}

// CONTROL THE GAME
cvs.addEventListener("click", function(evt){
    if (bgSound) {
        bgSound = false;
        BG_SOUND.play();
    }

    switch(state.current){
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            if(bird.y - bird.radius <= 0) return;
            bird.flap();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;

            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
                bgSound = true;
            }
            break;
    }
});

// FOREGROUND
const fg = {
    w: 350,
    h: 112,
    x: 0,
    y: cvs.height - 112,
  
    draw : function(){
        ctx.fillStyle = '#631616';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

// BIRD
const bird = {
    animation : [
        {sX: 276, sY : 112},
        {sX: 276, sY : 139},
        {sX: 276, sY : 164},
        {sX: 276, sY : 139}
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,
    
    radius : 12,
    
    frame : 0,
    
    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,
    
    draw : function(){
        let bird = this.animation[this.frame];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);
        
        ctx.restore();
    },
    
    flap : function(){
        this.speed = - this.jump;
    },
    
    update: function(){
        // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;
        
        if(state.current == state.getReady){
            this.y = 150; // RESET POSITION OF THE BIRD AFTER GAME OVER
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    DIE.play();
                }
            }
            
            // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRD IS FALLING DOWN
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }
        
    },
    speedReset : function(){
        this.speed = 0;
    }
}

// GET READY MESSAGE
const getReady = {
    draw: function(){
        if(state.current == state.getReady){
            ctx.font="30px Comic Sans MS";
            ctx.fillStyle = "blue";
            ctx.textAlign = "center";
            ctx.fillText("Tap to Start", cvs.width/2, cvs.height/2);
        }
    }
}

// GAME OVER MESSAGE
const gameOver = {
    sX : 175,
    sY : 395,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 195,
    
    draw: function(){
        if(state.current == state.over){
            BG_SOUND.pause();
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

// PIPES
const pipes = {
    position : [],
    
    w : 45,
    h : 400,
    gap : 85,
    maxYPos : -150,
    dx : 2,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            ctx.fillStyle = 'green';
            ctx.fillRect(p.x, topYPos, this.w, this.h);
            ctx.fillRect(p.x, bottomYPos, this.w, this.h);
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let bottomPipeYPos = p.y + this.h + this.gap;
            
            // COLLISION DETECTION
            // TOP PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            // BOTTOM PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }
            
            // MOVE THE PIPES TO THE LEFT
            p.x -= this.dx;
            
            // if the pipes go beyond canvas, we delete them from the array
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}

// SCORE
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "25px Comic Sans MS";
            ctx.fillText(this.value, cvs.width * 0.93, 35);
            ctx.strokeText(this.value, cvs.width * 0.93, 35);

            ctx.fillText('BEST:', 45, 35);
            ctx.strokeText('BEST:', 45, 35); 
            ctx.fillText(this.best, 100, 35);
            ctx.strokeText(this.best, 100, 35);   
        }else if(state.current == state.over){ // score
            ctx.font = "20px Comic Sans MS";
            ctx.fillText(this.value, 202, 190);
            ctx.strokeText(this.value, 202, 190);
            ctx.fillText('SCORE :', 152, 190);
            ctx.strokeText('SCORE :', 152, 190);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}

// DRAW
function draw(){
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

// UPDATE
function update(){
    bird.update();
    pipes.update();
}

// LOOP
function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();
