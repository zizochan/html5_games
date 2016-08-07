import Ship from "../src/ship"

describe("Ship", () => {
        var x = 400;
        var y = 300;
        var sideSpeed = 10;
        var canvasWidth  = 800;
        var canvasHeight = 600;
        var keyCode = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
        var ship;

        beforeEach( () => {
                ship = new Ship(x, y, sideSpeed, canvasWidth, canvasHeight, keyCode);
        });

        describe("moveByKeymap", () => {
                var subject = (pressedKeyCode, expectedX, expectedY) => {
                        var keymap = {};
                        keymap[pressedKeyCode] = true;
                        ship.moveByKeymap(keymap);
                        expect(ship.x).toBe(expectedX);
                        expect(ship.y).toBe(expectedY);
                }

                it("when right key pressed", () => {
                        subject(keyCode.RIGHT, 410, 300);
                });
                it("when left key pressed", () => {
                        subject(keyCode.LEFT, 390, 300);
                });
                it("when up key pressed", () => {
                        subject(keyCode.UP, 400, 290);
                });
                it("when down key pressed", () => {
                        subject(keyCode.DOWN, 400, 310);
                });
        });

        describe("round", () => {
                it("when value between min and max", () => {
                        expect(ship.round(10, 20, 15)).toBe(15);
                });
                it("when value < min", () => {
                        expect(ship.round(10, 20, 5)).toBe(10);
                });
                it("when value < max", () => {
                        expect(ship.round(10, 20, 25)).toBe(20);
                });
        });

        describe("roundInCanvas", () => {
                describe("ship.x", () => {
                        var subject = (expectedValue) => {
                                ship.roundInCanvas();
                                expect(ship.x).toBe(expectedValue);
                        }

                        it("when x between canvasWidth * -1 and canvasWidth", () => {
                                subject(ship.x);
                        });
                        it("when x > canvasWidth", () => {
                                ship.x = 1000;
                                subject(canvasWidth);
                        });
                        it("when x < canvasWidth * -1", () => {
                                ship.x = -1000;
                                subject(canvasWidth * -1);
                        });
                });

                describe("ship.y", () => {
                        var subject = (expectedValue) => {
                                ship.roundInCanvas();
                                expect(ship.y).toBe(expectedValue);
                        }

                        it("when y between canvasHeight * -1 and canvasHeight", () => {
                                subject(ship.y);
                        });
                        it("when y > canvasHeight", () => {
                                ship.y = 1000;
                                subject(canvasHeight);
                        });
                        it("when y < canvasHeight * -1", () => {
                                ship.y = -1000;
                                subject(canvasHeight * -1);
                        });
                });
        });
});
