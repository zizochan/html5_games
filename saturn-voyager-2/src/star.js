export default class {
        // config kyes = [MAX_WHEEL_SPEED, INVISIBLE_DISTANCE, HIT_SIZE, HIT_DISTANCE]
        constructor(canvasWidth, canvasHeight, config, imageId) {
                this.config = config;
                this.canvasWidth  = canvasWidth;
                this.canvasHeight = canvasHeight;

                this.setNewCoordinates();
                this.z = this.random(0, this.canvasWidth * 5);
                this.r = this.random(0, 360);

                var maxWheelSpeed = this.config.MAX_WHEEL_SPEED;
                this.w = this.random(maxWheelSpeed * -1, maxWheelSpeed); // 回転スピード
                this.image = $("#" + imageId).get(0);
        }

        random(min, max) {
                if (max < min) {
                        throw new Error("max must be greater than min");
                }
                return Math.floor(Math.random() * (max - min)) + min;
        }

        setNewCoordinates() {
                this.x = this.random(this.canvasWidth * -2, this.canvasWidth  * 2);
                this.y = this.random(this.canvasWidth * -2, this.canvasHeight * 2);
        }

        shouldDraw() {
                return this.z <= this.config.INVISIBLE_DISTANCE;
        }

        move(ship, speed) {
                this.drawNear(speed);
                return this.checkOvertake(ship);
        }

        drawNear(speed) {
                this.z -= speed;
                this.r += this.w;
        }

        checkOvertake(ship) {
                if (this.z >= this.config.HIT_DISTANCE) {
                        return true;
                }

                if (this.isHit(ship)) {
                        // GAMEOVER
                        return false;
                } else {
                        this.regenerate();
                        return true;
                }

        }

        isHit(ship) {
                return Math.abs(this.x - ship.x) < this.config.HIT_SIZE && Math.abs(this.y - ship.y) < this.config.HIT_SIZE;
        }

        regenerate() {
                this.setNewCoordinates();
                this.z = this.canvasWidth * 5;
        }
}
