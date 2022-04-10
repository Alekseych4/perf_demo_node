const mysql = require("mysql");
const mysqlConn = mysql.createConnection({
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});

mysqlConn.connect((err) =>{
    if(err) {
        console.log(err.stack);
	return;
    }
    console.log('Mysql Connected with App...');
    test_db_service.createDB(mysqlConn);
});

exports.createDB = function () {
    let sql = "CREATE DATABASE IF NOT EXISTS PerfDemoNode;";
    try {
       mysqlConn.query(sql, (err, result) => {
           if (err)
               console.log(err.stack + "\n Unable to create table.");
       });
    } catch (e) { 
	console.log(e + "\n Connection Failed...");
    }
}

exports.createTable = function () {
    let sql = "CREATE TABLE IF NOT EXISTS test (id LONG PRIMARY KEY, name TEXT NOT NULL, time TIMESTAMP NOT NULL);";
    try {
        mysqlConn.query(sql, (err, result) => {
            if (err)
                console.log(err + "\n Unable to create table.");
        });
    } catch (e) {
	console.log(e + "\n Connection Failed...");
    }
}

exports.getAll = function (res) {
    let sql = "SELECT * FROM test;";
    try {
        mysqlConn.query(sql, (err, result) => {
            if (err) {
                console.log(err + "\n Unable to get all rows.");
                res.send(500, err);
            }
            res.json(result);
        });
    } catch (e) {
        console.log(e + "\n Connection Failed...");
        res.send(500, err);
    }
}

exports.insert = function (req, res) {
    try {
        let id = getCurrentId() + 1;
        let sql = `INSERT INTO test (${id}, ${mysqlConn.escape(req.body.name)}, ${mysqlConn.escape(req.body.time)});`;
        mysqlConn.query(sql, (err, result) => {
            if (err) {
                console.log(err + "\n Unable to get all rows.");
                res.send(500, err);
            }
            console.log(`Row ${id} ${req.body.name} ${req.body.time} was inserted`);
            res.json(result);
        });
    } catch (e) {
        console.log(e + "\n Connection Failed...");
        res.send(500, err);
    }
}

exports.remove = function (id, res) {
    try {
        let id = mysqlConn.escape(id);
        let sql = `DELETE FROM test WHERE id=${id};`;
        mysqlConn.query(sql, (err, result) => {
            if (err) {
                console.log(err + "\n Unable delete row.");
                res.send(500, err);
            }
            res.send(200, `Item with id ${id} was removed`);
        });
    } catch (e) {
        console.log(e + "\n Connection Failed...");
        res.send(500, err);
    }
}

function getCurrentId () {
    let sql = "SELECT id FROM test ORDER BY id DESC LIMIT 1;";
    mysqlConn.query(sql, (err, result) => {
        if (err) {
            console.log(err + "\n Unable to get all rows.");
            throw err;
        }
        console.log("\nCurrent id: " + result);
        return result;
    });
}
