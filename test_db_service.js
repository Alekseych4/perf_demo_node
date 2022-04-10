const mysql = require("mysql");
const table = "test";
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
});

exports.createDB = function () {
    let sql = "CREATE DATABASE IF NOT EXISTS PerfDemoNode;";
    try {
       mysqlConn.query(sql, (err, result) => {
           if (err)
               console.log(err.stack + "\nUnable to create database.");
       });
    } catch (e) { 
	console.log(e + "\nConnection Failed...");
    }
}

exports.createTable = function () {
    let use = "USE PerfDemoNode";
    mysqlConn.query(use, (err, res) => {
	if (err)
	    console.log(err.stack + "\nError during USE DB query");
	console.log("Using database PerfDemoNode");
    });	
    let sql = `CREATE TABLE IF NOT EXISTS ${table} (id BIGINT PRIMARY KEY, name TEXT NOT NULL, time TIMESTAMP NOT NULL);`;
    try {
        mysqlConn.query(sql, (err, result) => {
            if (err)
                console.log(err + `\nUnable to create table ${table}.`);
	    console.log(`Table ${table} is existing now.`);
        });
    } catch (e) {
	console.log(e + "\nConnection Failed...");
    }
}

exports.getAll = function (res) {
    let sql = "SELECT * FROM test;";
    try {
        mysqlConn.query(sql, (err, result) => {
            if (err) {
                console.log(err + "\nUnable to get all rows.");
                res.send(500, err);
            }
            res.json(result);
        });
    } catch (e) {
        console.log(e + "\nConnection Failed...");
        res.send(500, err);
    }
}

exports.insert = function (req, res) {
    try {
        getCurrentId().then(currentMaxId => {
	    console.log("currentMaxID: " + currentMaxId);
            let id = currentMaxId + 1; 
            console.log("id: " + id);
            let sql = `INSERT INTO test (${id}, ${mysqlConn.escape(req.body.name)}, ${mysqlConn.escape(req.body.time)});`;
            mysqlConn.query(sql, (err, result) => {
                if (err) {
                    console.log(err + "\nUnable to get all rows.");
                    res.send(500, err);
                }
                console.log(`Row ${id} ${req.body.name} ${req.body.time} was inserted`);
                res.json(result);
            });
        }, idError => {throw idError;});
    } catch (e) {
        console.log(e + "\nConnection Failed...");
        res.send(500, err);
    }
}

exports.remove = function (id, res) {
    try {
        let id = mysqlConn.escape(id);
        let sql = `DELETE FROM test WHERE id=${id};`;
        mysqlConn.query(sql, (err, result) => {
            if (err) {
                console.log(err + "\nUnable to delete row.");
                res.send(500, err);
            }
            res.send(200, `Item with id ${id} was removed`);
        });
    } catch (e) {
        console.log(e + "\nConnection Failed...");
        res.send(500, err);
    }
}

async function getCurrentId () {
    let sql = "SELECT id FROM test ORDER BY id DESC LIMIT 1;";
    mysqlConn.query(sql, (err, result) => {
        if (err) {
            console.log(err + "\nUnable to get max id.");
            throw err;
        }
        console.log("Current max id: " + result);
        if (result) {
            return result;
        }
        return 0;
    });
}
