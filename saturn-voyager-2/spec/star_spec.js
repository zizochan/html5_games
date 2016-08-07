import Star from "../src/star"

describe("Star", () => {
        var canvasWidth  = 200;
        var canvasHeight = 100;
        var config  = {MAX_WHEEL_SPEED: 5, INVISIBLE_DISTANCE: 3000, HIT_SIZE: 50, HIT_DISTANCE: 64};
        var imageId = "img-rock";
        var star;

        beforeEach( () => {
        	star = new Star(canvasWidth, canvasHeight, config, imageId);
        });

        describe("random", () => {
                var loopCount = 10;

                var subject = (min, max) => {
                        // ランダムテストのやり方がわからないので、とりあえず繰り返しておく
                        for (var i = 0; i < loopCount; i ++) {
                                var value = star.random(min, max);
                                expect(value >= min && value <= max).toBeTruthy();
                        }
                }

                describe("results fit in a random range", () => {

                        it("when min >= 0 and max >= 0", () => {
                                subject(5, 10);
                        });
                        it("when min < 0 and max >= 0", () => {
                                subject(-5, 5);
                        });
                        it("when min < 0 and max < 0", () => {
                                subject(-10, -5);
                        });
                        it("when min > max", () => {
                                expect(function(){star.random(15, 5)}).toThrow();
                        });
                });
        });

        describe("shouldDraw", () => {
                var subject = (starZ, expectedValue) => {
                        star.z = starZ;
                        expect(star.shouldDraw()).toBe(expectedValue);
                }
                describe("when z < invisible_distance", () => {
                        it("return true", () => {
                                subject(2999, true);
                        });
                });
                describe("when z == invisible_distance", () => {
                        it("return true", () => {
                                subject(3000, true);
                        });
                });
                describe("when z > invisible_distance", () => {
                        it("return false", () => {
                                subject(3001, false);
                        });
                });
        });

        describe("drawNear", () => {
                it("z -= speed", () => {
                        star.z = 100;
                        star.drawNear(50);
                        expect(star.z).toBe(50);
                });
                it("r += w", () => {
                        star.r = 10;
                        star.w = 10;
                        star.drawNear(50);
                        expect(star.r).toBe(20);
                });
        });

        describe("checkOvertake", () => {
                var ship = {x: 50, y: 100};
                var shipHit;

                function mockStarIsHit() {
                        star.isHit = function(ship) { return shipHit };
                }

                var testResultValue = (expectedValue) => {
                        mockStarIsHit();
                        expect(star.checkOvertake(ship)).toBe(expectedValue);
                }
                var testZisChange = (expectedValue) => {
                        mockStarIsHit();
                        var beforeStarZ = star.z;
                        star.checkOvertake(ship);
                        expect(star.z != beforeStarZ).toBe(expectedValue);
                }

                describe("when z >= hit_distance", () => {
                        beforeEach( () => {
                                star.z = 64;
                                shipHit = true;
                        });
                        beforeEach( () => {
                        });
                        it("return true", () => {
                                testResultValue(true);
                        });
                        it("z is not change", () => {
                                testZisChange(false);
                        });
                });
                describe("when z < hit_distance", () => {
                        beforeEach( () => {
                                star.z = 63;
                        });
                        describe("and ship is not hit", () => {
                                beforeEach( () => {
                                        shipHit = false;
                                });
                                it("return true", () => {
                                        testResultValue(true);
                                });
                                it("z is regenerated", () => {
                                        testZisChange(true);
                                });
                        });
                        describe("and ship is hit", () => {
                                beforeEach( () => {
                                        shipHit = true;
                                });
                                it("return false", () => {
                                        testResultValue(false);
                                });
                                it("z is not change", () => {
                                        testZisChange(false);
                                });
                        });
                });
        });

        describe("isHit", () => {
                var ship = {x: 100, y: 200};
                var subject = (starX, starY, expectedValue) => {
                        star.x = starX;
                        star.y = starY;
                        expect(star.isHit(ship)).toBe(expectedValue);
                }

                describe("when abs(star.x - ship.x) < hit_size && abs(star.y - ship.y) < hit_size", () => {
                        it("return true", () => {
                                subject(149, 249, true);
                        });
                        it("return true", () => {
                                subject(51, 151, true);
                        });
                });
                describe("when abs(star.x - ship.x) >= hit_size", () => {
                        it("return false", () => {
                                subject(150, 249, false);
                        });
                        it("return false", () => {
                                subject(50, 151, false);
                        });
                });
                describe("when abs(star.y - ship.y) >= hit_size", () => {
                        it("return false", () => {
                                subject(149, 250, false);
                        });
                        it("return false", () => {
                                subject(51, 150, false);
                        });
                });
        });
});
