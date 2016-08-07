import Paint from "../src/paint"

describe("Paint", () => {
        var canvasId = "paint-canvas";
        var canvasWidth  = 200;
        var canvasHeight = 100;
        var paint;
        var canvas;

        beforeEach( () => {
                canvas = $("<canvas>").attr({id: canvasId}).appendTo("body");
        	paint = new Paint(canvasId, canvasWidth, canvasHeight);
        });
        afterEach( () => {
                canvas.remove();
        });

        describe("roundDigit", () => {
                function subject(digit, value, expectedValue) {
                        expect(paint.roundDigit(digit, value)).toBe(expectedValue);
                }
                describe("when argument digit > value digit", () => {
                        it("digit are rounded", () => {
                                subject(5, 3000, "03000");
                        });
                });
                describe("when argument digit == value digit", () => {
                        it("value is not change", () => {
                                subject(4, 3000, "3000");
                        });
                });
                describe("when argument digit < value digit", () => {
                        it("value are rounded", () => {
                                subject(3, 3000, "999");
                        });
                });
        });
});
