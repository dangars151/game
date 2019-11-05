let myGamePiece;
let myObstacles = [];
let myScore;
document.querySelector('.high-score span').innerHTML = localStorage.getItem('highScore') || 0;

function startGame() {
    myGamePiece = new component(40, 40, "images/smiley.gif", 250, 180, "image");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

function accelerate1(n) {
    myGamePiece.image.src = "images/smiley.gif";
    myGamePiece.gravity = n;
}

function accelerate2(n) {
    myGamePiece.image.src = "images/angry.gif";
    myGamePiece.gravity = n;
}
  
let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 750;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.1;
    this.gravitySpeed = 0;
    this.bounce = 0.6;
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function() {
        let rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }
    this.hitTop = function() {
        if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }
    this.crashWith = function(otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    let x;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            if (localStorage.highScore === undefined) localStorage.setItem('highScore', 0);
            if (myGameArea.frameNo > parseInt(localStorage.highScore)) localStorage.setItem('highScore', myGameArea.frameNo);
            document.querySelector('.high-score span').innerHTML = localStorage.getItem('highScore');
            return;
        }
    }
    
    myGameArea.clear();
    myGameArea.frameNo += 1;
    //framNo(khung hình thứ mấy) = 1 hoặc bội 150 thì tạo myObstacle
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        height = Math.floor(Math.random() * 400); //chiều dài của obstacle
        gap = Math.floor(Math.random() * 200 + 70); // khoảng cách giữa 2 cột
        myObstacles.push(new component(22, height, "green", x, 0));
        myObstacles.push(new component(22, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

