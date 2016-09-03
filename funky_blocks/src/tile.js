export default class {
        constructor(x, y, moveSpeed) {
                this.x = x;
                this.y = y;
                this.moveX = x;
                this.moveY = y;
                this.count = 0;
                this.moveSpeed = moveSpeed;
                this.moving = false;
        }

        getX() {
                return this.x + (this.moveX - this.x) * (this.count) / this.moveSpeed;
        }

        getY() {
                return this.y + (this.moveY - this.y) * (this.count) / this.moveSpeed;
        }

        move(moveX, moveY, color) {
                this.moveX = moveX;
                this.moveY = moveY;
                this.color = color;
                this.count = this.moveSpeed;
                this.moving = true;
        }

        update() {
                if (--this.count <= 0) {
                        this.moving = false;
                }
        }
}
