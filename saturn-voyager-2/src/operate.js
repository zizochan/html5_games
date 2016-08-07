import MouseUtility from "./mouse_utility"
var mouse_utility  = new MouseUtility();

export default class {
        constructor(canvasWidth, canvasHeight, keyCode) {
                this.resetKeymap();
                this.canvasWidth  = canvasWidth;
                this.canvasHeight = canvasHeight;
                this.keyCode = keyCode;
        }

	resetKeymap() {
	        this.keymap = {};
	}

	keyDown(e) {
	        this.keymap[e.keyCode] = true;
	}

	keyUp(e) {
	        this.keymap[e.keyCode] = false;
	}

	mouseDown(e) {
	        var mouseX = mouse_utility.getXPosition(e) - Math.floor(this.canvasWidth  / 2);
	        var mouseY = mouse_utility.getYPosition(e) - Math.floor(this.canvasHeight / 2);
                var pressedKey = this.keyPressByMousePosition(mouseX, mouseY);
	        this.keymap[pressedKey] = true;
	}

        keyPressByMousePosition(x, y) {
                var pressedKey;
	        if (Math.abs(x) > Math.abs(y)) {
	                pressedKey = x > 0 ? this.keyCode.RIGHT : this.keyCode.LEFT;
	        } else {
	                pressedKey = y > 0 ? this.keyCode.DOWN : this.keyCode.UP;
	        }
                return pressedKey;
        }

	mouseUp(e) {
	        this.resetKeymap();
	}
}
