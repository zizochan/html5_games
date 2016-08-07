import CanvasUtility from "../src/canvas_utility"

describe("CanvasUtility", () => {
        var canvasId = "canvas";
        var canvas_utility = new CanvasUtility(canvasId);

        describe("constructor", () => {
                it("When wrapperId isn't specified", () => {
                        expect(canvas_utility.wrapperId).toBe("canvas-wrapper");
                });
                it("When wrapperId is specified", () => {
                        var canvas_utility = new CanvasUtility(canvasId, "myWrapperId");
                        expect(canvas_utility.wrapperId).toBe("myWrapperId");
                });
        });

        describe("getDefaultWrapperId", () => {
                it("default wrapperId is canvasId + '-wrapper'", () => {
                        expect(canvas_utility.getDefaultWrapperId()).toBe(canvasId + "-wrapper");
                });
        });

        describe("CanvasTest", () => {
                var wrapper;
                var canvas;

                beforeEach( () => {
                        canvas_utility.addFullscreenCanvas();
                        wrapper = $("#" + canvas_utility.getDefaultWrapperId());
                        canvas  = wrapper.find("#" + canvasId);
                });
                afterEach( () => {
                        wrapper.remove();
                });

                describe("addFullscreenCanvas", () => {
                        it("wrapper style is fullscreen", () => {
                                expect(wrapper.get(0).style.width).toBe("100%");
                                expect(wrapper.get(0).style.height).toBe("100%");
                        });

                        it("canvas is fullscreen", () => {
                                expect(parseInt(canvas.attr("width"))).toBe(wrapper.width());
                                expect(parseInt(canvas.attr("height"))).toBe(wrapper.height() - 4); // FIXME: 余白を消す方法不明
                        });

                        it("canvas touch-action is none", () => {
                                expect(canvas.get(0).style.touchAction).toBe("none");
                        });
                });

                describe("getWidth", () => {
                        it("return canvas width", () => {
                                expect(canvas_utility.getWidth()).toBe(canvas.width());
                        });
                });

                describe("getHeight", () => {
                        it("return canvas test", () => {
                                expect(canvas_utility.getHeight()).toBe(canvas.height());
                        });
                });
        });
});
