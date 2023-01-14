const express = require("express");
router = express.Router();
var db = require('./connectMysql');

function getPumpOrder(callback){
    let sql = `SELECT * FROM pumpOrder ORDER BY idx`
    db.query(sql, function(err, results){
          if (err) throw err
          return callback(results);
  })
}

router.get('/', (req, res) =>{
    let sql = `SELECT * FROM pumpOrder ORDER BY idx`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})
router.post('/pumps', (req, res) =>{
    let msg = req.body
    pumps = msg.pumps
    let sql = `INSERT INTO pumpOrder (id,idx,name) VALUES `

    pumps.forEach((pump, index) => {
        sql+= `(${pump.id}, ${index}, '${pump.name}')`
        sql += ','
    });
    sql = sql.substring(0, sql.length - 1);
    sql+= ` ON DUPLICATE KEY UPDATE idx=VALUES(idx),name=VALUES(name);`

    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

module.exports = { router, getPumpOrder };