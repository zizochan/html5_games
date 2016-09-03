export default class {
        getXPosition(e) {
                return !isNaN(e.offsetX) ? e.offsetX : e.touches[0].clientX;
        }

        getYPosition(e) {
                return !isNaN(e.offsetY) ? e.offsetY : e.touches[0].clientY;
        }
}
