const STATUS = {TITLE: 1, PLAY: 2, GAMEOVER: 3}
export default class {
        constructor() {
                this.reset();
        }

        getStatus() {
                return STATUS;
        }

        reset() {
                this.state = STATUS.TITLE;
        }

        isTitle() {
                return this.state == STATUS.TITLE;
        }

        changePlay() {
                this.state = STATUS.PLAY;
        }

        isPlay() {
                return this.state == STATUS.PLAY;
        }

        changeGameover() {
                this.state = STATUS.GAMEOVER;
        }

        isGameover() {
                return this.state == STATUS.GAMEOVER;
        }
}
