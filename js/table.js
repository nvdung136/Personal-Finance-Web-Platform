const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('../DB/PersonalFinance.db',sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

db.run(sql);