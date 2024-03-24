const loki = require("lokijs");
const db = new loki("db.json", {
    autoupdate: true,
    autoload: true,
    autosave: true,
    autosaveInterval: 4000,
});

module.exports = db;
