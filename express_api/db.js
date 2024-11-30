// load sqlite3, provide extra info for debugging
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    else {
        console.log(`connected to sqlite database`);

        // create table/ throws error if already exists
        db.run(`CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, oid text, name text, comment text)`, (err) => {
            if (err) {
                console.error(`table comments already exists`);
            }
            else {
                console.error(`table comments created`);

                // insert test data
                const insert = `INSERT INTO comments (oid, name, comment) VALUES (?, ?, ?)`;

                db.run(insert, ['object1', 'Marcus', 'this is a comment']);
                db.run(insert, ['object2', 'Marcus', 'another comment']);
                
            }
        });

    }
})


module.exports = db