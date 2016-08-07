export default class {
        constructor(x, y, sideSpeed, canvasWidth, canvasHeight, keyCode) {
                this.x = x;
                this.y = y;
                this.sideSpeed = sideSpeed;
                this.canvasWidth  = canvasWidth;
                this.canvasHeight = canvasHeight;
                this.keyCode = keyCode;
        }

        move(keymap) {
                this.moveByKeymap(keymap);
                this.roundInCanvas();
        }

        moveByKeymap(keymap) {
                if (keymap[this.keyCode.RIGHT]) {
                        this.x += this.sideSpeed;
                } else if (keymap[this.keyCode.LEFT]) {
                        this.x -= this.sideSpeed;
                }

                if (keymap[this.keyCode.DOWN]) {
                        this.y += this.sideSpeed;
                } else if (keymap[this.keyCode.UP]) {
                        this.y -= this.sideSpeed;
                }
        }

        // 丸め込み
        round(min, max, value) {
                if (value < min) {
                        value = min;
                }
                if (value > max) {
                        value = max;
                }
                return value;
        }

        roundInCanvas() {
                this.x = this.round(this.canvasWidth  * -1, this.canvasWidth,  this.x);
                this.y = this.round(this.canvasHeight * -1, this.canvasHeight, this.y);
        }
}
