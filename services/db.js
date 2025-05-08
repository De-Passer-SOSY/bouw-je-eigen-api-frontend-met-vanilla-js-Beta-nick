const knex = require("knex");
const db = knex({
    client: "mysql2",
    connection: {
        host: "web0164.zxcs.be",
        user: "adb_nick",
        password: "kQ4XeWDXVQtN6pnRn8Zm",
        database: "adb_project_nick"
    }
});
module.exports = db;