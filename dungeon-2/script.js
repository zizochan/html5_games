
const GAME_IMAGES = [
        "alien0.png", "alien1.png", "alien2.png", "alien3.png",
        "hero0.png",  "hero1.png", "hero2.png", "hero3.png",
        "door.png", "door-open.png", "key.png",
        "arrows.png"
];

const KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39; KEY_DOWN = 40;
const LEFT = 2, UP = 0, RIGHT = 3, DOWN = 1;
const PLAYING = 0, GAME_CLEAR = 1, GAME_OVER = 2; // game status
const EMPTY = 0, WALL = 1;

// MAXE_X, MAZE_Y, KEY_NUMBER, ALIEN_NUMBER, ALIEN_WAIT
const CONFIGS = [
  ["EASY",   15, 15, 2, 1, 15],
  ["NORMAL", 31, 25, 4, 2, 12],
  ["HARD",   31, 41, 8, 3, 10]
]

const TIMER_INTERVAL = 45, scrollCount = 5;
const ALIEN_WAIT_MIN = 5, ALIEN_REVERSE_MIN = 4;
const CANVAS_WIDTH = 900, CANVAS_HEIGHT = 600;
const MINI_MAP_PIC_SIZE = 7, MINI_MAP_X = 650;
const KEY_MAP_X = 670, KEY_MAP_Y = 70, KEY_MAP_WIDTH = 200, KEY_MAP_HEIGHT = 200;
const picWidth = 50, picHeight = 50;

var DIFFICULTY, CONFIG;
var KEY_NUMBER;
var ALIEN_NUMBER, ALIEN_WAIT_BASE;
var MAZE_X, MAZE_Y;
var PLAY_BGM;
var CANVAS_CENTER;
var MINI_MAP_WIDTH;
var KEY_MAP_X_CENTER, KEY_MAP_Y_CENTER;
var COLLISION_X, COLLISION_Y;

var ctx;
var maze;
var player;
var keyCode;
var timer;
var aliens;
var keys, door;
var restKey;
var gameStatus;

function Scroller() {
        this.dx = 0;
        this.dy = 0;
        this.moving = false;
        this.scrollStep  = 0;
        this.scrollCount = scrollCount;

        this.choiceDirection = function() {
                var directions = [UP, DOWN, LEFT, RIGHT];
                return directions[Math.floor(Math.random() * directions.length)];
        }
        this.d = this.choiceDirection();

        this.startScroll = function(dx, dy) {
                this.dx = dx;
                this.dy = dy;
                this.moving = true;
                this.scrollStep = 0;
        }

        this.endScroll = function() {
                this.moving = false;
                this.scrollStep = 0;
                this.x += this.dx;
                this.y += this.dy;
                this.dx = 0;
                this.dy = 0;
        }

        this.doScroll = function() {
                this.scrollStep += 1;
                if (this.scrollStep >= this.scrollCount) {
                        this.endScroll();
                }
        }

        this.paint = function(gc) {
                var image = $("#" + this.getImageId()).get(0);
                gc.drawImage(image, this.getX(), this.getY(), this.w, this.h);
        }

        this.getX = function() {
                return this.x * this.w + this.dx * Math.floor(this.scrollStep * this.w / this.scrollCount);
        }
        this.getY = function() {
                return this.y * this.h + this.dy * Math.floor(this.scrollStep * this.h / this.scrollCount);
        }
}

function Player(startX, startY, width, height) {
        this.x = startX;
        this.y = startY;
        this.w = width;
        this.h = height;

        this.getImageId = function() {
                return "img-hero" + this.d;
        }

        this.update = function() {
                if (this.moving) {
                        this.doScroll();
                        return;
                }

                if (keyCode == 0) {
                        return;
                }

                var dx = 0;
                var dy = 0;
                var td = null;
                switch (keyCode) {
                        case KEY_LEFT:
                                dx = -1; td = LEFT;  break;
                        case KEY_RIGHT:
                                dx = 1;  td = RIGHT; break;
                        case KEY_UP:
                                dy = -1; td = UP;    break;
                        case KEY_DOWN:
                                dy = 1;  td = DOWN;  break;
                }
                if (td == null) {
                        return;
                }
                this.d = td;

                if (maze[this.x + dx][this.y + dy] == EMPTY) {
                        this.startScroll(dx, dy);
                        this.doScroll();
                }
        }
}

function Alien(startX, startY, width, height) {
        // 個体差を付ける
        this.choiceWait = function() {
                var wait = ALIEN_WAIT_BASE;
                wait += Math.floor(Math.random() * ALIEN_WAIT_MIN * 2) - ALIEN_WAIT_MIN;
                if (wait < ALIEN_WAIT_MIN) {
                        wait = ALIEN_WAIT_MIN;
                }
                return wait;
        }
        this.choiceReverse = function() {
                return Math.floor(Math.random() * ALIEN_REVERSE_MIN) + ALIEN_REVERSE_MIN;
        }

        this.x = startX;
        this.y = startY;
        this.w = width;
        this.h = height;
        this.wait = this.choiceWait();
        this.reverse = this.choiceReverse(); // 反転しやすさ

        this.getImageId = function() {
                return "img-alien" + this.d;
        }

        this.update = function() {
                if (this.moving) {
                        this.doScroll();
                        return;
                }

                if (this.checkHit()) {
                        this.hit();
                        return;
                }

                // 動くかどうか判定
                var isMove = Math.floor(Math.random() * this.wait);
                if (isMove != 0) {
                        return;
                }

                // 近づく
                var gapx = player.x - this.x;
                var gapy = player.y - this.y;
                var dx = 0;
                var dy = 0;
                if (gapx > 0) { dx = 1 } else if(gapx < 0) { dx = -1 }
                if (gapy > 0) { dy = 1 } else if(gapy < 0) { dy = -1 }

                // たまにはランダムで反転する
                var isReverse = Math.floor(Math.random() * this.reverse);
                if (isReverse == 0) {
                        dx *= -1;
                        dy *= -1;
                }

                if (dx > 0) { this.d = RIGHT } else if(dx < 0) { this.d = LEFT } else if (dy > 0) { this.d = DOWN } else if(dy < 0) { this.d = UP }

                this.startScroll(dx, dy);
                this.doScroll();
        }

        this.checkHit = function() {
                var diffX = Math.abs(player.getX() - this.getX());
                var diffY = Math.abs(player.getY() - this.getY());
                if (diffX <= COLLISION_X && diffY <= COLLISION_Y) {
                        return true;
                } else {
                        return false;
                }
        }

        this.hit = function() {
                gameStatus = GAME_OVER;
        }
}

function MapObject() {
        this.checkHit = function() {
                if (player.x == this.x && player.y == this.y) {
                        return true;
                } else {
                        return false;
                }
        }

        this.drawImage = function(gc) {
                var image = $("#" + this.getImageId()).get(0);
                gc.drawImage(image, this.getX(), this.getY(), this.w, this.h);
        }

        this.getX = function() {
                return this.x * this.w;
        }
        this.getY = function() {
                return this.y * this.h;
        }
}

function Key(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.got = false;

        this.getImageId = function() {
                return "img-key";
        }

        this.update = function() {
                if (this.got) {
                        return;
                }

                if (this.checkHit()) {
                        this.getKey();
                }
        }

        this.getKey = function() {
                this.got = true;
                restKey --;
        }

        this.paint = function(gc) {
                if (this.got) {
                        return;
                }
                this.drawImage(gc);
        }
}

function Door(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;

        this.getImageId = function() {
                var imageId;
                if (this.isOpen()) {
                        imageId = "img-door-open";
                } else {
                        imageId = "img-door";
                }
                return imageId;
        }

        this.paint = function(gc) {
                this.drawImage(gc);
        }

        this.isOpen = function() {
                return restKey == 0;
        }

        this.isGoal = function() {
                if (this.isOpen() && this.checkHit()) {
                        return true;
                } else {
                        return false;
                }
        }

}

var scroller = new Scroller();
Player.prototype = scroller;
Alien.prototype  = scroller;
var mapObject  = new MapObject();
Key.prototype  = mapObject;
Door.prototype = mapObject;

function init() {
        loadImages();
        createDifficultyRadios();
}

function go() {
        getConfigValues();
        setConstant();

        initGame();
        createDoor();
        createMaze();
        createKeys();
        repaint();

        $("#canvas").show();

        addKeyEvent();
        hiddenGameTitle();

        timer = setInterval(tick, TIMER_INTERVAL);
        if (PLAY_BGM) {
                $("#bgm").get(0).play();
        }
}

function getConfigValues() {
        DIFFICULTY = parseInt($("[name=difficulty]:checked").val());
        CONFIG = CONFIGS[DIFFICULTY];
        if (CONFIG == null) {
                error();
        }

        PLAY_BGM = $("#play-bgm").prop("checked");
}

function initGame() {
        ctx = $("#canvas").get(0).getContext("2d");
        keyCode = null;

        player = new Player(1, 1, picWidth, picHeight);
        createAliens();

        gameStatus = PLAYING;
        restKey = KEY_NUMBER;
}

function hiddenGameTitle() {
        $("#game-title").hide();
        $("#game-description").hide();
        $("#config-menu").hide();
}

function showConfigMenu() {
        $("#config-menu").show();
}

function addKeyEvent() {
        window.onkeydown = mykeydown;
        window.onkeyup   = mykeyup;

        var canvas = $("#canvas").get(0);
        canvas.onmousedown   = mymousedown;
        canvas.onmouseup     = mykeyup;
        canvas.oncontextmenu = function(e) { e.preventDefault(); };
        canvas.addEventListener("touchstart", mymousedown);
        canvas.addEventListener("touchedn",   mykeyup);
}

function loadImages() {
        $.each(GAME_IMAGES,
                        function(index, elem) {
                                var imgId = "img-" + elem.replace(/.png/, "");
                                $("<img>").attr({src: elem, id: imgId}).hide().appendTo("body");
                        }
        );
}

function setConstant() {
        MAZE_X = CONFIG[1];
        MAZE_Y = CONFIG[2];
        KEY_NUMBER      = CONFIG[3];
        ALIEN_NUMBER    = CONFIG[4];
        ALIEN_WAIT_BASE = CONFIG[5];

        CANVAS_CENTER    = Math.floor(Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2);
        MINI_MAP_WIDTH   = CANVAS_WIDTH - MINI_MAP_X, MINI_MAP_Y = KEY_MAP_Y + KEY_MAP_HEIGHT, MINI_MAP_HEIGHT = CANVAS_HEIGHT - MINI_MAP_Y;
        KEY_MAP_X_CENTER = KEY_MAP_X + Math.floor(KEY_MAP_WIDTH  / 2);
        KEY_MAP_Y_CENTER = KEY_MAP_Y + Math.floor(KEY_MAP_HEIGHT / 2);
        COLLISION_X = Math.floor(picWidth  * 0.7);
        COLLISION_Y = Math.floor(picHeight * 0.7);
}

function createAliens() {
        aliens = [];
        var marginX = Math.floor(MAZE_X / 5);
        var marginY = Math.floor(MAZE_Y / 5);

        for (var i = 0; i < ALIEN_NUMBER; i ++) {
                var position = choiceEvenPosition(i, marginX, marginY);
                aliens[i] = new Alien(position[0], position[1], picWidth, picHeight);
        }
}

function createDoor() {
        var goalX = MAZE_X - 2;
        var goalY = MAZE_Y - 2;
        door = new Door(goalX, goalY, picWidth, picHeight);
}

function createKeys() {
        keys = [];
        var marginX = Math.floor(MAZE_X / 4);
        var marginY = Math.floor(MAZE_Y / 4);
        var i = 0;
        while (i < KEY_NUMBER) {
                var position = choiceEvenPosition(i, marginX, marginY);
                var x = position[0];
                var y = position[1];

                if (maze[x][y] != EMPTY) {
                        continue;
                }
                if (door.x == x && door.y == y) {
                        continue;
                }

                // 位置重複防止
                var positionDuplicated = false;
                for (var j = 0; j < i; j ++) {
                        var tKey = keys[j];
                        if (tKey.x == x && tKey.y == y) {
                                positionDuplicated = true;
                        }
                }
                if (positionDuplicated) {
                        continue;
                }

                keys[i] = new Key(x, y, picWidth, picHeight);
                i ++;
        }
}

// 満遍なく配置する
function choiceEvenPosition(i, marginX, marginY) {
        var x = MAZE_X - marginX - 1;
        var y = MAZE_Y - marginY - 1;

        // 敵を満遍なく配置する
        switch (i % 4) {
                case 0:
                        break;
                case 1:
                        x = marginX + 1; break;
                case 2:
                        y = marginY + 1; break;
                case 3:
                        x = marginX + 1; y = marginY + 1; break;
        }
        x += Math.floor(Math.random() * marginX * 2) - marginX;
        y += Math.floor(Math.random() * marginY * 2) - marginY;

        return [x, y];
}


function createMaze() {
        maze = [];

        // 一旦外枠だけ覆う
        for (var x = 0; x < MAZE_X; x ++) {
                maze[x] = [];
                for (var y = 0; y < MAZE_Y; y ++) {
                        var v = EMPTY;
                        if (x == 0 || x == MAZE_X - 1 || y == 0 || y == MAZE_Y - 1) {
                                v = WALL;
                        }
                        maze[x][y] = v;
                }
        }

        // 棒倒し法で迷路作成
        for (var x = 2; x < MAZE_X - 2; x += 2) {
                for (var y = 2; y < MAZE_Y - 2; y += 2) {
                        maze[x][y] = WALL;

                        var dx = x;
                        var dy = y;
                        var directions = y == 2 ? [UP, DOWN, LEFT, RIGHT] : [DOWN, LEFT, RIGHT]; // 同じ方向に柱が倒れないようにする
                        var direction  = directions[Math.floor(Math.random() * directions.length)];
                        switch (direction) {
                                case UP:    dy -= 1; break;
                                case DOWN:  dy += 1; break;
                                case LEFT:  dx -= 1; break;
                                case RIGHT: dx += 1; break;
                        }
                        maze[dx][dy] = WALL;
                }
        }

        // ゴールは強制的に空ける
        maze[door.x][door.y] = EMPTY;
}

function repaint() {
        paintMainMap();
        paintMiniMap();
        paintArrowMap();
}

function paintMainMap() {
        ctx.save();
        ctx.beginPath();

        // 背景を塗りつぶす
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 視界を遮る円
        ctx.arc(CANVAS_CENTER, CANVAS_CENTER, CANVAS_CENTER, 0, Math.PI * 2);
        ctx.clip();

        // 視点移動
        ctx.translate(CANVAS_CENTER - player.getX(), CANVAS_CENTER - player.getY());

        // 壁の描画
        paintWalls(picWidth, picHeight);

        // キャラクターの描画
        door.paint(ctx);
        player.paint(ctx);
        for (var i = 0; i < ALIEN_NUMBER; i ++) {
                aliens[i].paint(ctx);
        }
        for (var i = 0; i < KEY_NUMBER; i ++) {
                keys[i].paint(ctx);
        }

        ctx.restore();
}

function paintMiniMap() {
        // 塗りつぶし
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(MINI_MAP_X, 0, CANVAS_WIDTH - MINI_MAP_X, CANVAS_HEIGHT);

        ctx.save();
        var xPosition = Math.floor(MINI_MAP_WIDTH / 2)  - Math.floor(MAZE_X * MINI_MAP_PIC_SIZE / 2);
        var yPosition = Math.floor(MINI_MAP_HEIGHT / 2) - Math.floor(MAZE_Y * MINI_MAP_PIC_SIZE / 2);
        ctx.translate(MINI_MAP_X + xPosition, MINI_MAP_Y + yPosition);

        // 壁の描画
        paintWalls(MINI_MAP_PIC_SIZE, MINI_MAP_PIC_SIZE);

        // キャラクターの描画
        drawMiniMapCircle(door.x, door.y, "gray");
        drawMiniMapCircle(player.x, player.y, "red");
        for (var i = 0; i < ALIEN_NUMBER; i ++) {
                var alien = aliens[i];
                drawMiniMapCircle(alien.x, alien.y, "purple");
        }
        for (var i = 0; i < KEY_NUMBER; i ++) {
                var key = keys[i];
                if (!key.got) {
                        drawMiniMapCircle(key.x, key.y, "#ffa500");
                }
        }

        ctx.restore();
}

function drawCircle(x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
}

function drawMiniMapCircle(x, y, color) {
        drawCircle(x * MINI_MAP_PIC_SIZE + 3, y * MINI_MAP_PIC_SIZE + 3, 3, color);
}

function paintArrowMap() {
        var image = $("#img-arrows").get(0);
        ctx.drawImage(image, KEY_MAP_X, KEY_MAP_Y, KEY_MAP_WIDTH, KEY_MAP_HEIGHT);

        var ax = -200; ay = -200;
        var circleSize = 30;
        switch (keyCode) {
                case KEY_LEFT:
                        ax = KEY_MAP_X_CENTER - circleSize * 2; ay = KEY_MAP_Y_CENTER; break;
                case KEY_RIGHT:
                        ax = KEY_MAP_X_CENTER + circleSize * 2; ay = KEY_MAP_Y_CENTER; break;
                case KEY_UP:
                        ax = KEY_MAP_X_CENTER; ay = KEY_MAP_Y_CENTER - circleSize * 2; break;
                case KEY_DOWN:
                        ax = KEY_MAP_X_CENTER; ay = KEY_MAP_Y_CENTER + circleSize * 2; break;
        }
        drawCircle(ax, ay, circleSize, "yellow");
}

function paintWalls(xWidth, yHeight) {
        ctx.fillStyle = "brown";
        for (var x = 0; x < MAZE_X; x ++) {
                for (var y = 0; y < MAZE_Y; y ++) {
                        if (maze[x][y] == WALL) {
                                ctx.fillRect(x * xWidth, y * yHeight, xWidth, yHeight);
                        }
                }
        }
}

function mykeydown(e) {
        keyCode = e.keyCode;
}

function mykeyup(e) {
        keyCode = 0;
}

function tick() {
        player.update();
        for (var i = 0; i < ALIEN_NUMBER; i ++) {
                aliens[i].update();
        }
        for (var i = 0; i < KEY_NUMBER; i ++) {
                keys[i].update();
        }
        checkGameClear(player.x, player.y);
        repaint();

        if (gameStatus == GAME_CLEAR) {
                doGameClear();
        } else if (gameStatus == GAME_OVER) {
                doGameOver();
        }
}

function checkGameClear(playerX, playerY) {
        if (!door.isGoal()) {
                return;
        }
        gameStatus = GAME_CLEAR;
}

function doGameClear() {
        gameEnd();
        viewText("GAME CLEAR");
}

function doGameOver() {
        gameEnd();
        viewText("GAME OVER");
}

function gameEnd() {
        clearInterval(timer);
        $("#bgm").get(0).pause();
        showConfigMenu();
}

function viewText(text) {
        ctx.fillStyle = "yellor";
        ctx.font = "bold 48px sans-serif";
        ctx.fillText(text, 150, 200);
}

function mymousedown(e) {
        var mouseX = !isNaN(e.offsetX) ? e.offsetX : e.touches[0].clientX;
        var mouseY = !isNaN(e.offsetY) ? e.offsetY : e.touches[0].clientY;

        if (mouseX < KEY_MAP_X || mouseX > KEY_MAP_X + KEY_MAP_WIDTH || mouseY < KEY_MAP_Y || KEY_MAP_Y > KEY_MAP_Y + KEY_MAP_HEIGHT) {
                return;
        }

        keyCode = getKeyMapPosition(KEY_MAP_X_CENTER - mouseX, KEY_MAP_Y_CENTER - mouseY);
}

function getKeyMapPosition(gapX, gapY) {
        var key = null;
        if (Math.abs(gapX) > Math.abs(gapY)) {
                gapX > 0 ? key = KEY_LEFT : key = KEY_RIGHT;
        } else {
                gapY > 0 ? key = KEY_UP : key = KEY_DOWN;
        }
        return key;
}

function error() {
        var errMessage = "ERROR!\nリロードしてやり直して下さい";
        alert(errMessage);
}

function createDifficultyRadios() {
        var span = $("#difficulty-radio");
        $.each(CONFIGS,
                        function(i, config) {
                                var radioId = "difficulty-" + i;
                                var checked = i == 0 ? "checked" : null;
                                $("<input>").attr({type: "radio", id: radioId, name: "difficulty", value: i, checked: checked}).appendTo(span);
                                $("<label>").attr({for: radioId}).text(config[0]).appendTo(span);
                        }
              );
}
