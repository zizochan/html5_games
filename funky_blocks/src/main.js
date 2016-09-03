import * as CONFIG from "./config"

import Tile from "./tile"
import Flag from "./flag"

import MouseUtility from "./mouse_utility"
var mouse_utility  = new MouseUtility();

var flag;
var ctx, tiles, moves = [], mIndex = 0, mCount = 0, times;
var timer = NaN, startTime = NaN, elapsed = 0, score, bgimage, bgm, sound;
var mouseDownX = null, mouseDownY = null, mouseUpX = null, mouseUpY = null;

var message = ["", "good", "very good", "super", "wonderful!", "great!", "amazing!", "brilliant!", "excelllent!"];

var init = () => {
        flag  = new Flag();

        createTiles();
        createTimeImages();

        bgimage = $("#bgimage").get(0);
        sound   = $("#sound").get(0);
        var canvas = $("#canvas");
        ctx = canvas.get(0).getContext("2d");
        ctx.textAlign = "center";

        $("#START").get(0).onclick = go;

        initGame();
        repaint();
}

var initGame = () => {
        score = 0;
        flag.reset();
}

var go = () => {
        addMouseEvent();
        startTime = new Date();
        timer = setInterval(tick, CONFIG.INTERVAL_NUMBER);

        $("body").get(0).addEventListener("touchmove", (event) => {
                event.preventDeafult();
        }, false);

        $("#START").hide();
        bgmStart();

        flag.changePlay();
}

var addMouseEvent = () => {
        var canvas = $("#canvas").get(0);
        canvas.onmousedown = mymousedown;
        canvas.onmouseup   = mymouseup;
        canvas.addEventListener("touchstart", mymousedown);
        canvas.addEventListener("touchmove",  mymousemove);
        canvas.addEventListener("touchend",   mymouseup);
}

var bgmStart = () => {
        bgm = $("#bgm").get(0);
        bgm.volume = CONFIG.BGM_VOLUME;
        bgm.loop = true;
        bgm.play();
}

var createTiles = () => {
        tiles = [];

        for (var x = 0; x < CONFIG.TILE_WIDTH; x ++) {
                tiles[x] = [];
                for (var y = 0; y < CONFIG.TILE_HEIGHT; y ++) {
                        tiles[x][y] = new Tile(x, y, CONFIG.TILE_MOVE_SPEED);
                }
        }

        // 連続しないように初期色の配置
        iterate( (x, y, t) => {
                while(true) {
                        var r = rand(CONFIG.COLOR_NUMBER);
                        if (setColor(x, y, r)) {
                                t.color = r;
                                break;
                        }
                }
        })
}

var createTimeImages = () => {
        times = [];
        for (var i = 0; i <= CONFIG.TIMER_IMAGE_NUMBER; i ++) {
                var t = $("<img>").attr({src: "images/time" + i + ".png"});
                times.push(t);
        }
}

var rand = (v) => {
        return Math.floor(Math.random() * v);
}

var iterate = (f) => {
        for (var x = 0; x < CONFIG.TILE_WIDTH; x ++) {
                for (var y = 0; y < CONFIG.TILE_HEIGHT; y ++) {
                        f(x, y, tiles[x][y]);
                }
        }
}

var tick = () => {
        tickMove();

        elapsed = ((new Date()).getTime() - startTime) / 1000;
        if (elapsed > CONFIG.TIME_LIMIT) {
                doGameOver();
        }

        repaint();
}

var tickMove = () => {
        mCount = Math.max(0, mCount - 1);
        if (mCount == 0) {
                mIndex = 0;
        }

        if (moves.length <= 0) {
                return;
        }

        for (var i = 0; i < moves.length; i ++) {
                moves[i].update();
        }
        moves = moves.filter( (t) => {return t.count != 0});
        if (moves.length == 0) {
                var removeCount = removeTile();
                if (removeCount > 0) {
                        mIndex = Math.min(message.length - 1, mIndex + 1);
                        mCount = CONFIG.MOVE_COUNT;
                        score += removeCount * mIndex;
                        sound.pause();
                        sound.currentTime = 0;
                        sound.play();
                }
                fall();
        }
}

var doGameOver = () => {
        clearInterval(timer);
        timer = NaN;
        flag.changeGameover();
        bgm.pause();
}

var setColor = (x, y, c) => {
        var chainColor = false;
        if (1 < x) { // 左
                chainColor |= isChainColor(c, x-1, y, x-2, y);
        }
        if (x < CONFIG.TILE_WIDTH - 4) { // 右
                chainColor |= isChainColor(c, x+1, y, x+2, y);
        }
        if (1 < y) { // 上
                chainColor |= isChainColor(c, x, y-1, x, y-2);
        }
        if (y < CONFIG.TILE_HEIGHT - 4) { // 下
                chainColor |= isChainColor(c, x, y+1, x, y+2);
        }
        return !chainColor;
}

var isChainColor = (color1, x2, y2, x3, y3) => {
        var color2 = tiles[x2][y2].color;
        var color3 = tiles[x3][y3].color;
        return (color2 == color3 && color3 == color1);
}

var mymousedown = (e) => {
        mouseDownX = mouse_utility.getXPosition(e);
        mouseDownY = mouse_utility.getYPosition(e);
}

var mymousemove = (e) => {
        mouseUpX = mouse_utility.getXPosition(e);
        mouseUpY = mouse_utility.getYPosition(e);
}

var mymouseup = (e) => {
        var startX = Math.floor((mouseDownX - CONFIG.BACK_IMAGE_LEFT_MARGIN) / CONFIG.TILE_IMAGE_SIZE);
        var startY = Math.floor((mouseDownY - CONFIG.BACK_IMAGE_TOP_MARGIN)  / CONFIG.TILE_IMAGE_SIZE);
        var nowX = startX, nowY = startY;
        var mouseNowX = !isNaN(e.offsetX) ? e.offsetX : mouseUpX;
        var mouseNowY = !isNaN(e.offsetY) ? e.offsetY : mouseUpY;

        if (Math.abs(mouseNowX - mouseDownX) > Math.abs(mouseNowY - mouseDownY)) {
                nowX += (mouseNowX - mouseDownX > 0) ? 1 : -1;
        } else{
                nowY += (mouseNowY - mouseDownY > 0) ? 1 : -1;
        }

        tileChange(startX, startY, nowX, nowY);
        repaint();
}

var tileChange = (beforeX, beforeY, afterX, afterY) => {
        if (tileCanNotMove(beforeX, beforeY) || tileCanNotMove(afterX, afterY)) {
                return;
        }

        var beforeTileColor = tiles[beforeX][beforeY].color;
        tiles[beforeX][beforeY].move(afterX, afterY, tiles[afterX][afterY].color);
        tiles[afterX][afterY].move(beforeX, beforeY, beforeTileColor);
        moves.push(tiles[beforeX][beforeY]);
        moves.push(tiles[afterX][afterY]);
}

var tileCanNotMove = (x, y) => {
        return (x >= CONFIG.TILE_WIDTH || y >= CONFIG.TILE_HEIGHT || x < 0 || y < 0 || tiles[x][y].moving);
}

var removeTile = () => {
        // 縦横3つ以上連続するタイルにremoveフラグをセット

        for (var y = 0; y < CONFIG.TILE_HEIGHT; y ++) { // 横方向
                var c0 = tiles[0][y].color;
                var count = 1;
                for (var x = 1; x < CONFIG.TILE_WIDTH; x ++) {
                        var c1 = tiles[x][y].color;
                        if (c0 != c1) {
                                c0 = c1;
                                count = 1;
                        } else {
                                if (++count >= CONFIG.TILE_CHAIN) {
                                        for (var i = 0; i < CONFIG.TILE_CHAIN; i ++) {
                                                tiles[x - i][y].remove = true;
                                        }
                                }
                        }

                }
        }

        for (var x = 0; x < CONFIG.TILE_WIDTH; x ++) { // 縦方向
                var c0 = tiles[x][0].color;
                var count = 1;
                for (var y = 1; y < CONFIG.TILE_HEIGHT; y ++) {
                        var c1 = tiles[x][y].color;
                        if (c0 != c1) {
                                c0 = c1;
                                count = 1;
                        } else {
                                if (++count >= CONFIG.TILE_CHAIN) {
                                        for (var i = 0; i < CONFIG.TILE_CHAIN; i ++) {
                                                tiles[x][y - i].remove = true;
                                        }
                                }
                        }

                }
        }

        var removeCount = 0;
        iterate( (x, y, t) => { if (t.remove) { removeCount ++ } });
        return removeCount;
}

var fall = () => {
        for (var x = 0; x < CONFIG.TILE_WIDTH; x ++) {
                for (var y = CONFIG.TILE_HEIGHT - 1, sp = CONFIG.TILE_HEIGHT - 1; y >= 0; y --, sp --) {
                        while(sp >= 0) {
                                if (tiles[x][sp].remove) {
                                        sp --;
                                } else {
                                        break;
                                }
                        }

                        if (y != sp) {
                                var c = (sp >= 0) ? tiles[x][sp].color : rand(CONFIG.COLOR_NUMBER);
                                var tile = tiles[x][y];
                                tile.move(x, sp, c);
                                moves.push(tile);
                        }
                }
        }
        iterate( (x, y, t) => { t.remove = false; });
}

var repaint = () => {
        ctx.drawImage(bgimage, 0, 0);

        var images = [block0, block1, block2, block3, block4];
        iterate( (x, y, t) => {
                if (!t.remove) {
                        ctx.drawImage(images[t.color], t.getX() * CONFIG.TILE_IMAGE_SIZE + CONFIG.BACK_IMAGE_LEFT_MARGIN, t.getY() * CONFIG.TILE_IMAGE_SIZE + CONFIG.BACK_IMAGE_LEFT_MARGIN, CONFIG.TILE_IMAGE_SIZE - 2, CONFIG.TILE_IMAGE_SIZE - 2);
                }
        });

        ctx.font = "bold 80px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, " + (mCount / CONFIG.MOVE_COUNT) + ")";
        ctx.fillText(message[mIndex], 300, 300);
        ctx.fillStyle = "white";

        if (flag.isGameover()) {
                ctx.fillText("FINISH", 350, 350);
        }

        // score
        ctx.fillStyle = "rgba(220, 133, 30, 50)";
        ctx.font = "bold 50px sans-serif";
        ctx.fillText(("0000000" + score).slice(-7), 680, 170);

        // rest time
        var index = Math.min(CONFIG.TIMER_IMAGE_NUMBER, Math.floor(elapsed / (CONFIG.TIME_LIMIT / CONFIG.TIMER_IMAGE_NUMBER)));
        ctx.drawImage(times[index].get(0), 615, 327);
}

window.onload = init;
