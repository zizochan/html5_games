"use strict;"

var gc;
var map;
var px, py; // プレイヤー位置座標
var squareSize = 40;
var clearFlag;
var currentStage = 1;

/*
空白  : 0 => 0000
ゴール: 1 => 0001
荷物  : 2 => 0010
壁    : 6 => 0110
*/
var mapDatas = [
[], // stage0は存在しない
[ // 1
        [4, 3], // プレイヤー開始位置X,Y
        [
                "666666666",
                "600000616",
                "600020606",
                "600000006",
                "606020006",
                "616000006",
                "666666666",
        ]
],
[ // 2
        [6, 3], // プレイヤー開始位置X,Y
        [
                "66666666666",
                "66000000016",
                "60026666606",
                "60002101206",
                "60026666606",
                "66100000006",
                "66666666666",
        ]
],
[ // 3
        [12, 8], // プレイヤー開始位置X,Y
        [
                "66666666666666666666",
                "66666000666666666666",
                "66666200666666666666",
                "66666002666666666666",
                "66600200206666666666",
                "66606066606666666666",
                "60006066606666001166",
                "60200200000000001166",
                "66666066660606001166",
                "66666000000666666666",
                "66666666666666666666",
        ]
],
];

function init() {
        var canvas = document.getElementById("canvas");
        gc = canvas.getContext("2d");
        onkeydown = myKeyDown;

        initGame();
}

function initGame() {
        clearFlag = false;

        setMapData();
        setCanvasSize(canvas);
        drawMap();
        setH1GameLabel();
}

function setMapData() {
        map = [];
        var playerPosition = mapDatas[currentStage][0];
        var mapData        = mapDatas[currentStage][1];

        px = playerPosition[0];
        py = playerPosition[1];

        for (var y = 0; y < mapData.length; y ++) {
                var data = mapData[y];
                map[y] = [];

                // 文字列を1文字ずつ分解して格納
                for (var x = 0; x < data.length; x ++) {
                        map[y][x] = parseInt(data[x]);
                }
        }
}

function drawMap() {
        gc.clearRect(0, 0, 800, 400); // TODO: ベタ書き修正

        for (var y = 0; y < map.length; y ++) {
                for (var x = 0; x < map[y].length; x ++) {
                        var image = null;
                        var data  = map[y][x];

                        if ((data & 0x1) == 1) {
                                drawImage(imgGoal, x, y);
                        }
                        if ((data & 0x6) == 2) {
                                drawImage(imgLuggage, x, y);
                        }
                        if ((data & 0x6) == 6) {
                                drawImage(imgWall, x, y);
                        }
                }
        }
        drawImage(imgWorker, px, py);
}

function setCanvasSize(canvas) {
        canvas.width  = map[0].length * squareSize;
        canvas.height = map.length * squareSize;
}

function drawImage(image, x, y) {
        gc.drawImage(image, x * squareSize, y * squareSize, squareSize, squareSize);
}

function u() {
        myKeyDown({keyCode: 38});
}
function l() {
        myKeyDown({keyCode: 37});
}
function r() {
        myKeyDown({keyCode: 39});
}
function d() {
        myKeyDown({keyCode: 40});
}
function myKeyDown(e) {
        if (clearFlag) {
                return;
        }

        if (!move(e.keyCode)) {
                return;
        }

        drawMap();

        if (clearFlag) {
                gameClear();
        }
}
function move(keyCode) {
        var x1 = px; y1 = py; // 移動先座標
        var x2 = px; y2 = py; // 移動先の一つ向こうの座標
        switch (keyCode) {
                case 37:
                        x1 --; x2 -= 2;
                        break;
                case 38:
                        y1 --; y2 -= 2;
                        break;
                case 39:
                        x1 ++; x2 += 2;
                        break;
                case 40:
                        y1 ++; y2 += 2;
                        break;
                default:
                        return false;
        }

        var canMove = false;
        var data1   = map[y1][x1]; // 移動先の配置物
        if ((data1 & 0x2) == 0) {
                canMove = true;
        } else if ((data1 & 0x6) == 2) {
                if ((map[y2][x2] & 0x2) == 0) {
                        map[y2][x2] |= 2; // 荷物を配置
                        map[y1][x1] ^= 2; // 荷物をどける
                        canMove = true;
                }
                // ゴールに荷物を置いたらクリアチェック
                if ((map[y2][x2] & 0x3) == 3) {
                        checkClear();
                }
        }
        if (canMove) {
                px = x1; py = y1;
                return true;
        }
}

function reset() {
        if (!confirm("try again?")) {
                return;
        }
        initGame();
}

function checkClear() {
        if (isClear()) {
                clearFlag = true;
        }
}
function isClear() {
        for (var y = 0; y < map.length; y ++) {
                for (var x = 0; x < map[y].length; x ++) {
                        if ((map[y][x] & 0x7) == 2) {
                                // 荷物が残ってたらNG
                                return false;
                        }
                }
        }
        return true;
}
function gameClear() {
        if (currentStage + 1 >= mapDatas.length) {
                alert("CONGRATULATIONS!\nALL STAGE CLEAR!");
        } else {
                currentStage ++;
                alert("STAGE CLEAR!\nCHALLENGE NEXT STAGE!");
                initGame();
        }
}
function setH1GameLabel() {
        var gameLabel = "Carry It Game : stage" + currentStage;
        document.getElementById("game-label").textContent = gameLabel;
}
