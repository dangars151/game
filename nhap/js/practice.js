function startGame() {
    myGameArea.start();
    myGamePiece = new component(30, 30, "red", 10, 120);
}

let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        // Tạo cannas và add vào trang html
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        // Update
        this.interval = setInterval(updateGameArea, 20);

        // Tích hợp các phím mũi tên với chuyển động
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function () {myGameArea.key = false;})
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    this.update = function(){
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -2; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 2; }
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -2; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 2; }
    myGamePiece.newPos();
    myGamePiece.update();
}