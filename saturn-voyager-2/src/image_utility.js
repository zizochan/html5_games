export default class {
        constructor(dir, images) {
                this.images = images;
                this.dir    = dir;
        }

        addHiddenImages() {
                for (var i = 0; i < this.images.length; i ++) {
                        var image = this.images[i];
                        this.addHiddenImage(image);
                }
        }

        addHiddenImage(image) {
                var imageId = this.getImageId(image);
                var src     = this.dir + "/" + image;
                return this.appendHideImageToBody(src, imageId);
        }

        getImageId(image) {
                return "img-" + image.replace(/\.[^.]+$/, "");
        }

        appendHideImageToBody(src, id) {
                return $("<img>").attr({src: src, id: id}).hide().appendTo("body");
        }
}
