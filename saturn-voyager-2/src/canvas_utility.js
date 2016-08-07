export default class {
        constructor(canvasId, wrapperId = null) {
                this.canvasId  = canvasId;

                if (wrapperId == null) {
                        wrapperId = this.getDefaultWrapperId();
                }
                this.wrapperId = wrapperId;
        }

        getDefaultWrapperId() {
                return this.canvasId + "-wrapper";
        }

        addFullscreenCanvas() {
                var wrapper = this.addWrapper();
                this.addCanvas(wrapper);
        }

        addWrapper() {
                var wrapper = $("<div>").attr({id: this.wrapperId}).appendTo("body");
                wrapper.css({width: "100%", height: "100%"});
                return wrapper;
        }

        addCanvas(wrapper) {
                var canvas = $("<canvas>").attr({id: this.canvasId}).appendTo(wrapper);
                canvas.attr("width",  wrapper.width()).attr("height", wrapper.height());
                canvas.css({"touch-action": "none"});
        }

        getWidth() {
                return $("#" + this.canvasId).width();
        }

        getHeight() {
                return $("#" + this.canvasId).height();
        }
}
