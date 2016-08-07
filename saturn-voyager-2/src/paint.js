export default class {
        constructor(canvasId, canvasWidth, canvasHeight) {
                this.ctx = this.getCtx(canvasId);
                this.canvasWidth  = canvasWidth;
                this.canvasHeight = canvasHeight;
	        this.scopeImage = $("#img-scope").get(0);
        }

	getCtx(canvasId) {
	        var canvas = $("#" + canvasId);
	        var ctx  = canvas.get(0).getContext("2d");
	        ctx.font = "20pt Arial";
                return ctx;
	}


	background() {
	        this.ctx.fillStyle = "black";
	        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
	}

	front(score) {
                // scope image
	        this.ctx.drawImage(this.scopeImage, 0, 0, this.canvasWidth, this.canvasHeight);

                // score
	        this.ctx.fillStyle = "green";
	        this.ctx.fillText(this.roundDigit(7, score), (this.canvasWidth * 0.90) - 50, this.canvasHeight * 0.1 - 7); // 中央寄せ
	}

        roundDigit(digit, value) {
                var result;
                var valueDigit = String(value).length;

                if (valueDigit > digit) {
                        // MAXスコアで丸め込む
                        result = Array(digit + 1).join("9");
                } else {
                        result = (Array(digit + 1).join("0") + value).slice(digit * -1);
                }
                return result;
        }

	gameOver() {
	        this.ctx.fillText("GAME OVER", this.canvasWidth * 0.5 - 85, this.canvasHeight * 0.5 - 10 - 20);
	}

        star(star, ship) {
                var z = star.z;
                var x = ((star.x - ship.x) << 9) / z + star.canvasWidth  / 2; // それっぽく見える位置に調整
                var y = ((star.y - ship.y) << 9) / z + star.canvasHeight / 2; // それっぽく見える位置に調整
                var size = (star.config.HIT_SIZE << 9) / z;

                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.globalAlpha = 1 - (z / 4096);
                this.ctx.rotate(star.r * Math.PI / 180);
                this.ctx.drawImage(star.image, -size / 2, -size / 2, size, size);
                this.ctx.restore();
        }
}
