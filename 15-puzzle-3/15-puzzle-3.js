"use strict";

var tiles;
var xSize;
var ySize;
var gameClearFlag;
var startTime;
var timerId;
var updateInterval = 200;

function init() {
        refresh();
}
function refresh() {
        gameClearFlag = false;

        var table = document.getElementById("table");
        while (table.firstChild) table.removeChild(table.firstChild);

        getInputValues();
        tiles = new Array();
        createTiles();
        shuffle();

        setGameTitle();
        startTimer();
}
function getInputValues() {
        var x = document.getElementById("x-size").value;
        var y = document.getElementById("y-size").value;

        if (x < 2 || y < 2) {
                alert("x-sizeかy-sizeが小さすぎます");
                return;
        }
        xSize = x; ySize = y;
}

function createTiles() {
        var table = document.getElementById("table");
        for (var y = 0; y < ySize; y ++) {
                tiles[y] = new Array();
                var tr = document.createElement("tr");
                for (var x = 0; x < xSize; x ++) {
                        var td = document.createElement("td");
                        td.onclick = click;

                        var index = y * xSize + x;
                        td.value = index;
                        td.x = x;
                        td.y = y;

                        tr.appendChild(td);
                        tiles[y][x] = td;
                        setTileView(x, y);
                }
                table.appendChild(tr);
        }
}

function shuffle() {
        var zeroTileX = 0;
        var zeroTileY = 0;
        var direction;
        var beforeDirection;

        for (var i = 0; i < xSize * ySize * 10; i ++) {
                do {
                        var clickX = zeroTileX;
                        var clickY = zeroTileY;
                        var isChange = false;

                        // よく混ざるように同じ方向に動きやすくする
                        if (beforeDirection && Math.floor(Math.random() * 100) < 80) {
                                direction = beforeDirection;
                        } else {
                                // 少し右下に到達しやすくする
                                do {
                                        direction = null;
                                        var directionTmp = Math.floor(Math.random() * 100);
                                        if (directionTmp < 20) {
                                                if (beforeDirection != 1) {
                                                        direction = 0;
                                                }
                                        } else if (directionTmp < 30) {
                                                if (beforeDirection != 0) {
                                                        direction = 1;
                                                }
                                        } else if (directionTmp < 50) {
                                                if (beforeDirection != 3) {
                                                        direction = 2;
                                                }
                                        } else if (directionTmp < 60) {
                                                if (beforeDirection != 2) {
                                                        direction = 3;
                                                }
                                        } else if (directionTmp < 70) {
                                                if (beforeDirection != 7) {
                                                        direction = 4;
                                                }
                                        } else if (directionTmp < 80) {
                                                if (beforeDirection != 6) {
                                                        direction = 5;
                                                }
                                        } else if (directionTmp < 90) {
                                                if (beforeDirection != 5) {
                                                        direction = 6;
                                                }
                                        } else {
                                                if (beforeDirection != 4) {
                                                        direction = 7;
                                                }
                                        }
                                } while(direction == null); // 一手戻すのは無し
                        }

                        switch(direction) {
                                case 0:
                                        clickX += 1;
                                        break;
                                case 1:
                                        clickX -= 1;
                                        break;
                                case 2:
                                        clickY += 1;
                                        break;
                                case 3:
                                        clickY -= 1;
                                        break;
                                case 4:
                                        clickX += 1;
                                        clickY += 1;
                                        break;
                                case 5:
                                        clickX += 1;
                                        clickY -= 1;
                                        break;
                                case 6:
                                        clickX -= 1;
                                        clickY += 1;
                                        break;
                                case 7:
                                        clickX -= 1;
                                        clickY -= 1;
                                        break;
                        }

                        if (isTileExists(clickX, clickY)) {
                                isChange = tileClick(clickX, clickY);
                        }
                } while(!isChange);

                zeroTileX = clickX;
                zeroTileY = clickY;
                beforeDirection = direction;
        }
}

function click(e) {
        // クリア済みの場合はもう操作出来ない
        if (gameClearFlag) {
                return;
        }

        var src = e.srcElement || e.target;
        if (tileClick(src.x, src.y)) {
                checkGameClear();
        }
}

function tileClick(x, y) {
        var checkPositions = [
                [x - 1, y],
                [x + 1, y],
                [x, y + 1],
                [x, y - 1],
                [x - 1, y - 1],
                [x - 1, y + 1],
                [x + 1, y - 1],
                [x + 1, y + 1],
        ];
        for (var i = 0; i < checkPositions.length; i ++) {
                var checkPosition = checkPositions[i];
                if (swapTileIfCan(x, y, checkPosition[0], checkPosition[1])) {
                        return true;
                }
        }
        return false;
}

function isTileExists(x, y) {
        if (x < 0 || x >= xSize || y < 0 || y >= ySize) {
                return false;
        }
        return true;
}
function isEmptyTile(x, y) {
        if (!isTileExists(x, y)) {
                return false;
        }
        return tiles[y][x].value == 0;
}
function swapTileIfCan(currentX, currentY, newX, newY) {
        if (!isEmptyTile(newX, newY)) {
                return false;
        }

        swapTile(currentX, currentY, newX, newY);
        return true;
}

function swapTile(x1, y1, x2, y2) {
        var tmp = tiles[y1][x1].value;
        tiles[y1][x1].value = tiles[y2][x2].value;
        tiles[y2][x2].value = tmp;

        setTileView(x1, y1);
        setTileView(x2, y2);
}
function setTileView(x, y) {
        var td = tiles[y][x];
        setTileTextContent(td);
        setTileClassName(td);
        setTileFontSize(td);
}
function setTileTextContent(td) {
        var textContent = td.value == 0 ? "" : td.value;
        td.textContent  = textContent;
}
function setTileClassName(td) {
        var className = td.value == 0 ? "empty" : "tile";
        td.className  = className;
}
function setTileFontSize(td) {
        var fontSize = "25px";
        var value = td.value;

        if (value == null) {
                // nooe
        } else if (value < 10) {
                fontSize = "48px";
        } else if (value < 100) {
                fontSize = "40px";
        } else if (value < 1000) {
                fontSize = "30px";
        } else {
                fontSize = "25px";
        }
        td.style.fontSize = fontSize;
}
function getGameTitle() {
        return (xSize * ySize - 1) + " puzzle2";
}
function setGameTitle() {
        var gameTitle = getGameTitle();
        document.getElementById("title").textContent = gameTitle;
        document.getElementById("game-title-h1").textContent = gameTitle;
}
function checkGameClear() {
        if (!isGameClear()) {
                return;
        }

        gameClearFlag = true;
        viewTime();
        stopTimer();

        var clearText = "Puzzle Completed!\nclear time : " + getClearTimeString();
        alert(clearText);
}
function isGameClear() {
        for (var y = 0; y < ySize; y ++) {
                for (var x = 0; x < xSize; x ++) {
                        var index = y * xSize + x;
                        if (tiles[y][x].value != index) {
                                return false;
                        }
                }
        }
        return true;
}
function startTimer() {
        stopTimer();
        timerId = setInterval(tick, updateInterval);

        startTime = new Date().getTime();
        viewTime();
}
function stopTimer() {
        clearInterval(timerId);
}
function tick() {
        viewTime();
}
function getElapsedTime(){
        var now = new Date().getTime();
        return now - startTime;
}
function getClearTimeString() {
        var elapsedTime = getElapsedTime();
        elapsedTime = Math.floor(elapsedTime / 1000);
        var min = Math.floor(elapsedTime / 60);
        var sec = elapsedTime % 60;

        var timeString = sec + " sec";
        if (min > 0) {
                timeString = min + " min " + timeString;
        }
        return timeString;
}
function viewTime() {
        document.getElementById("time").textContent = getClearTimeString();
}
