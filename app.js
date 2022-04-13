const express = require("express");
const app = express();
const http = require("http");
const test_db_service = require("./test_db_service");

http.createServer(app).listen(5000, () => {
    console.log("Server started on port 5000");
    test_db_service.createDB();
    test_db_service.createTable();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/demo/simple-get", (req, res) => {
    res.send("Hello, world!");

});

app.get("/db/getAll", (req, res) => {
    test_db_service.getAll(res);
});

app.post("/db/insert", (req, res) => {
    test_db_service.insert(req, res);
});

app.delete("/db/remove/:id", (req, res) => {
    test_db_service.remove(req.params.id, res);
});

app.delete("/db/removeAll", (req, res) => {
    test_db_service.removeAll(res); 
});


