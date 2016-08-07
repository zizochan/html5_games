import * as CONFIG from "./config"

import Star from "./star"
import Ship from "./ship"
import Operate from "./operate"
import Flag from  "./flag"
import Paint from "./paint"

import ImageUtility from "./image_utility"
import CanvasUtility from "./canvas_utility"

var stars, ship, operate, flag, paint;
var image_utility, canvas_utility;
var score, speed;
var timer;
var canvasWidth, canvasHeight;

var init = () => {
        image_utility  = new ImageUtility(CONFIG.IMAGE_DIR, CONFIG.HIDDEN_IMAGES);
        canvas_utility = new CanvasUtility(CONFIG.CANVAS_ID);

        image_utility.addHiddenImages();
        createCanvas();
        operate = new Operate(canvasWidth, canvasHeight, CONFIG.KEY_CODE);
        flag  = new Flag();
        paint = new Paint(CONFIG.CANVAS_ID, canvasWidth, canvasHeight);

        initGame();

        $("#startButton").get(0).onclick = go;
}

var initGame = () => {
        score = 0;
        speed = CONFIG.DEFAULT_ADVANCE_SPEED;
        createStars();
        ship  = new Ship(0, 0, CONFIG.SIDE_SPEED, canvasWidth, canvasHeight, CONFIG.KEY_CODE);
        operate.resetKeymap();
        flag.reset();
        repaint();
}

var go = () => {
        setButtonEvent();

        $("<body>").get(0).addEventListener("touchmove", function(event) {
                event.preventDefault();
        }, false);

        timer = setInterval(tick, CONFIG.TIMER_INTERVAL);

        $("#startButton").hide();

        flag.changePlay();
}

var createCanvas = () => {
        canvas_utility.addFullscreenCanvas();
        canvasWidth  = canvas_utility.getWidth();
        canvasHeight = canvas_utility.getHeight();
}

var createStars = () => {
        stars = [];
        for (var i = 0; i < CONFIG.STAR_NUMBER; i ++) {
                stars.push(new Star(canvasWidth, canvasHeight, CONFIG.STAR, "img-rock"));
        }
}

var setButtonEvent = () => {
        onkeydown = myKeyDown;
        onkeyup   = myKeyUp;

        var canvas = $("#" + CONFIG.CANVAS_ID).get(0);
        canvas.onmousedown = myMouseDown;
        canvas.onmouseup   = myMouseUp;
        canvas.oncontextmenu = function(e) { e.preventDefault(); }
        canvas.addEventListener("touchstart", myMouseDown);
        canvas.addEventListener("touchend",   myMouseUp);
}

var myKeyDown = (e) => {
        operate.keyDown(e);
}

var myKeyUp = (e) => {
        operate.keyUp(e);
}

var myMouseDown = (e) => {
        operate.mouseDown(e);
}

var myMouseUp = (e) => {
        operate.mouseUp(e);
}

var repaint = () => {
        paint.background();
        drawStars();
        paint.front(score);
        if (flag.isGameover()) {
                paint.gameOver();
        }
}

// 奥から順に並べる
var sortStars = () => {
        stars.sort(function(a, b) {
                return b.z - a.z;
        });
}

var drawStars = () => {
        sortStars();
        for (var i = 0; i < CONFIG.STAR_NUMBER; i ++) {
                var star = stars[i];
                if (star.shouldDraw()) {
                        paint.star(star, ship);
                }
        }
}

var tick = () => {
        for (var i = 0; i < CONFIG.STAR_NUMBER; i ++) {
                var star = stars[i];
                if (!star.move(ship, speed)) {
                        doGameover();
                        break;
                }
        }

        if (score ++ % 10 == 0) {
                speed ++;
        }

        ship.move(operate.keymap);
        repaint();
}

var doGameover = () => {
        clearInterval(timer);
        timer = NaN;
        flag.changeGameover();
}

window.onload = init;

