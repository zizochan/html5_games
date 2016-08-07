import ImageUtility from "../src/image_utility"

describe("ImageUtility", () => {
        var dir    = "./images";
        var images = ["cat.png", "dog.jpg"];
        var image_utility = new ImageUtility(dir, images);

        describe("getImageId", () => {
                it("id is changed", () => {
                        expect(image_utility.getImageId("cat.png")).toBe("img-cat");
                });
        });

        describe("addHiddenImage", () => {
                var img
                var fileName = "cat.png";

                beforeEach( () => {
                        img = image_utility.addHiddenImage(fileName);
                });
                afterEach( () => {
                        img.remove();
                });

                it("src = dir + src", () => {
                        expect(img.eq(0).attr("src")).toBe(dir + "/" + fileName);
                });
                it("id is changed", () => {
                        expect(img.get(0).id).toBe(image_utility.getImageId(fileName));
                });
        });

        describe("appendHideImageToBody", () => {
                var img
                var imageId  = "img-cat";
                var fileName = "cat.png";

                beforeAll( () => {
                        img = image_utility.appendHideImageToBody(fileName, imageId);
                });
                afterEach( () => {
                        img.remove();
                });

                it("src", () => {
                        expect(img.eq(0).attr("src")).toBe(fileName);
                });
                it("hidden", () => {
                        expect(img.get(0).style.display).toBe("none");
                });
        });
});
