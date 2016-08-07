import Operate from "../src/operate"

describe("Operate", () => {
        var canvasWidth  = 800;
        var canvasHeight = 600;
        var keyCode = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
        var operate;

        beforeEach( () => {
                operate = new Operate(canvasWidth, canvasHeight, keyCode);
        });

        var pressRightKey = () => {
                operate.keymap[keyCode.RIGHT] = true;
        }

        describe("resetKeymap", () => {
                it("keymap to be empty", () => {
                        pressRightKey();
                        operate.resetKeymap();
                        expect(Object.keys(operate.keymap).length).toBe(0);
                });
        });

        describe("keyDown", () => {
                it("keymap to be true", () => {
                        operate.keyDown({keyCode: keyCode.RIGHT});
                        expect(operate.keymap[keyCode.RIGHT]).toBe(true);
                });
        });

        describe("keyUp", () => {
                it("keymap to be false", () => {
                        pressRightKey();
                        operate.keyUp({keyCode: keyCode.RIGHT});
                        expect(operate.keymap[keyCode.RIGHT]).toBe(false);
                });
        });

        describe("mouseUp", () => {
                it("keymap to be empty", () => {
                        pressRightKey();
                        operate.mouseUp({keyCode: keyCode.RIGHT});
                        expect(Object.keys(operate.keymap).length).toBe(0);
                });
        });

        describe("keyPressByMousePosition", () => {
                var x, y;
                var subject = (x, y, expectedValue) => {
                        var pressedKey = operate.keyPressByMousePosition(x, y);
                        expect(pressedKey).toBe(expectedValue);
                }

                it("when abs(x) > abs(y) and x > 0", () => {
                        subject(10, 5, keyCode.RIGHT);
                });

                it("when abs(x) > abs(y) and x < 0", () => {
                        subject(-10, 5, keyCode.LEFT);
                });

                it("when abs(x) < abs(y) and y > 0", () => {
                        subject(5, 10, keyCode.DOWN);
                });

                it("when abs(x) < abs(y) and y < 0", () => {
                        subject(5, -10, keyCode.UP);
                });
        });
});
