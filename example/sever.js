const Lanyard = require("js-lanyard")
const LanyardClass = new Lanyard("450421563267874817")

LanyardClass.fetch().then(data => {
    console.log(data)
})

LanyardClass.on("ALL", (data) => {
    console.log(data);
})
