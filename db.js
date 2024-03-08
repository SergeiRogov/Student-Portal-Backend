const loki = require("lokijs");
const db = new loki("db.json", {
    autoupdate: true,
    autoload: true,
    autosave: true,
    autosaveInterval: 4000,
});

db.addCollection("courses");
db.addCollection("users");
db.addCollection("cart");

// db.getCollection("users").insert({username: "ser", password: "$2a$10$zDgb6nHZ2CN9KBUEQQ9wE.hJHfoMcIGQtTv5nNzGOOpTGunb6tQRy" })

module.exports = db;
