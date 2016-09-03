import Flag from "../src/flag"

describe("Flag", () => {
        var flag;
        var status;

        beforeEach( () => {
                flag = new Flag();
                status = flag.getStatus();
        });

        describe("state change test", () => {
                function subject(expectedValue) {
                        expect(flag.state).toBe(expectedValue);
                }

                describe("reset", () => {
                        it("state change PLAY", () => {
                                flag.reset();
                                subject(status.TITLE);
                        });
                });

                describe("changePlay", () => {
                        it("state change PLAY", () => {
                                flag.changePlay();
                                subject(status.PLAY);
                        });
                });

                describe("changeGameover", () => {
                        it("state change GAMEOVER", () => {
                                flag.changeGameover();
                                subject(status.GAMEOVER);
                        });
                });
        });

        describe("state check test", () => {
                function setFlagState(state) {
                        flag.state = state;
                }

                describe("isTile", () => {
                        it("state == Title", () => {
                                setFlagState(status.TITLE);
                                expect(flag.isTitle()).toBeTruthy();
                        });
                });

                describe("isPlay", () => {
                        it("state == PLAY", () => {
                                setFlagState(status.PLAY);
                                expect(flag.isPlay()).toBeTruthy();
                        });
                });

                describe("isGameover", () => {
                        it("state == GAMEOVER", () => {
                                setFlagState(status.GAMEOVER);
                                expect(flag.isGameover()).toBeTruthy();
                        });
                });
        });

});
