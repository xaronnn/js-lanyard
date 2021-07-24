const Lanyard = require("../dist/js-lanyard")
const LanyardClass = new Lanyard("450421563267874817")

describe("Server-Sided Testing", function() {
    describe(".fetch()", function() {
        it("should return some data on the user", function() {
            return LanyardClass.fetch()
        })
    }),
    describe(".on()", function () {
        it("should create and interact with a web-socket", function () {
            LanyardClass.on("ALL", () => {
                done()
            })
        })
    })
})
