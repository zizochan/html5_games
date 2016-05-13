"use strict;"

var cards;
var xSize = 4;
var ySize = 3;
var sameCardNumber = 2;
var startTime;
var timerId;
var score;
var flippedCards;
var playFlag; // 操作可能フラグ

function init() {
        setInputDefaultValues();
        resetGame();
}
function refresh() {
        var table = document.getElementById("table");
        while (table.firstChild) table.removeChild(table.firstChild);

        getInputValues();
        resetGame();
}
function resetGame() {
        createCards();
        setCards();

        startTimer();

        playFlag = true;
        flippedCards = [];
        score = 0;
}

Array.prototype.shuffle = function shuffle() {
        var i = this.length;
        while (i) {
                var j = Math.floor(Math.random() * i);
                var tmp = this[--i];
                this[i] = this[j];
                this[j] = tmp;
        }
        return true;
}

function createCards() {
        var cardNumber = getMaxCardNumber();
        cards = [];

        for (i = 1; i <= cardNumber; i ++) {
                for (var j = 0; j < sameCardNumber; j ++) {
                        cards.push(i);
                }
        }

        cards.shuffle();
}
function getMaxCardNumber() {
        return Math.floor(xSize * ySize / sameCardNumber);
}
function setCards() {
        var table = document.getElementById("table");
        for (var y = 0; y < ySize; y ++) {
                var tr = document.createElement("tr");
                for (var x = 0; x < xSize; x ++) {
                        var index = y * xSize + x;

                        // カードが足りない場合は作らない
                        if (index >= cards.length) {
                                break;
                        }
                        var td = document.createElement("td");
                        td.onclick = flip;
                        td.number  = cards[index];
                        returnCard(td);
                        tr.appendChild(td);
                }
                table.appendChild(tr);
        }
}

function flip(e) {
        if (!playFlag) {
                return false;
        }

        var src = e.srcElement || e.target;
        if (src.flipped) {
                return false;
        }

        flipCard(src);
        flippedCards.push(src);

        if (isFrippedCardsMatched()) {
                if (flippedCards.length == sameCardNumber) {
                        frippedCardsMatched();
                }
        } else {
                frippedCardsMissmatched();
        }

        return true;
}

function flipCard(card) {
        card.flipped     = true;
        card.className   = "card";
        card.textContent = card.number;
}
function returnCard(card) {
        card.flipped     = false;
        card.className   = "card back";
        card.textContent = "";
}
function frippedCardsMatched() {
        score ++;
        flippedCards = [];
        if (score >= getMaxCardNumber()) {
                gameClear();
        }
}
function frippedCardsMissmatched() {
        playFlag = false;
        setTimeout(returnAllFrippedCards, 1000);
}
function returnAllFrippedCards() {
        for (var i = 0; i < flippedCards.length; i ++) {
                returnCard(flippedCards[i]);
        }
        flippedCards = [];
        playFlag = true;
}

function isFrippedCardsMatched() {
        var cardNumbers = flippedCards.map(function(card) {
                return card.number;
        });
        return cardNumbers.every(function(number) {
                return number == cardNumbers[0];
        });
}

function startTimer() {
        stopTimer();
        startTime = new Date().getTime();
        timerId = setInterval(tick, 500);

        viewElapsedTime();
}

function stopTimer() {
        clearInterval(timerId);
}

function tick() {
        viewElapsedTime();
}

function getElapsedTime() {
        now = new Date().getTime();
        return now - startTime;
}

function getElapsedTimeText() {
        var elapsedTime = Math.floor(getElapsedTime() / 1000);
        var min = Math.floor(elapsedTime / 60);
        var sec = elapsedTime % 60;
        var text = sec + " sec";
        if (min > 0) {
                text = min + " min " + text;
        }
        return text;
}
function viewElapsedTime() {
        document.getElementById("time").textContent = getElapsedTimeText();
}
function gameClear() {
        stopTimer();
        viewElapsedTime();

        var text = "GAME CLEAR!\nclear time: " + getElapsedTimeText();
        alert(text);
}
function setInputDefaultValues() {
        document.getElementById("x-size").value = xSize;
        document.getElementById("y-size").value = ySize;
        document.getElementById("same-card-number").value = sameCardNumber;
}
function getInputValues() {
        x = parseInt(document.getElementById("x-size").value);
        y = parseInt(document.getElementById("y-size").value);

        if (x < 2 || y < 2) {
                alert("x-sizeかy-sizeが小さすぎます");
                return;
        }

        var same = parseInt(document.getElementById("same-card-number").value);
        if (same < 2 ) {
                alert("same-card-numberが小さすぎます");
                return;
        }
        if (x * y / same < 2) {
                alert("same-card-numberが大きすぎます");
                return;
        }

        xSize = x; ySize = y; sameCardNumber = same;
}

