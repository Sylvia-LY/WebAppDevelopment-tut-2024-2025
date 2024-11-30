// imports
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
const port = 3000;

app.get('/', (req, res) => {
    res.json({'message': 'ok'})
})

app.get('/express_api', async (req, res) => {
    const {status, data} = await getComments(req);
    res.status(status);
    if (data) {
        res.json(data);
    }
    else {
        res.end();
    }
})

app.post('/express_api', async (req, res) => {
    const {status, data} = await postComments(req);
    res.status(status);
    if (data) {
        res.json(data);
    }
    else {
        res.end();
    }
})

// return 405 method not allowed for put and delete requests
app.put('/express_api', async (req, res) => {
    res.status(405);
    res.end();
})

app.delete('/express_api', async (req, res) => {
    res.status(405);
    res.end();
})

async function getComments(req) {
    // 500 (internal server error)
    let status = 500, data = null;

    try {
        const oid = req.query.oid;

        if ( oid && oid.length>0 && oid.length<=32 && oid.match(/^[a-z0-9]+$/i) ) {
            await new Promise((resolve, reject) => {
                const sql = `SELECT name, comment FROM comments WHERE oid=?`;
                db.all(sql, [oid], (err, rows) => {
                    if (!err) {
                        if (rows.length>0) {
                            status = 200;
                            data = {'oid': oid, 'comments': rows};
                        }
                        else {
                            status = 204;
                        }
                    }
                    resolve();
                });
            });
        }
        else {
            // 400 (bad request) - the issue originates from user input
            status = 400;
        }
    }
    catch (e) {
        console.error(e);
    }

    return {status, data};
}


async function postComments(req) {
    let status = 500, data = null;
    try {
        const oid = req.body.oid, name = req.body.name, comment = req.body.comment;
        
        const isValidOid = oid && oid.length>0 && oid.length<=32 && /^[a-z0-9]+$/i.test(oid);
        const isValidName = name && name.length>0 && name.length<=64;
        const isValidComment = comment && comment.length>0;

        if (isValidOid && isValidName && isValidComment) {
            await new Promise((resolve, reject) => {
                const sql = `INSERT INTO comments (oid, name, comment) VALUES (?, ?, ?)`;

                db.run(sql, [oid, name, comment], function (err, result) {
                    if (!err) {
                        status = 201;
                        data = {'id': this.lastID};
                    }
                    resolve();
                });


            });
        }
        else {
            status = 400;
        }
    }
    catch (e) {
        console.error(e);
    }
    return {status, data};
}


app.listen(port, () => {
    console.log(`running at http://localhost:${port}`)
})