const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
        if (err) { throw err }
        else {
            const parseData = JSON.parse(data)
            res.send(parseData);
        };
    });
});

app.post("/api/notes", (req, res) => {
    const note = req.body;
    note.id = uuidv4();
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
        const noteData = JSON.parse(data);
        const newNote = [...noteData, note];
        JSON.stringify(newNote);
        res.send(newNote);

        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNote), (err, data) => {
            if (err) { throw err };
        });
    });
});


app.delete("/api/notes/:id", (req, res) => {
    const parameter = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
        if (err) { throw err }
        else {
            const newData = JSON.parse(data);
            for (let i = 0; i < newData.length; i++) {
                if (newData[i].id === parameter) {
                    newData.splice(i, 1)
                    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newData), (err, data) => {
                        if (err) { throw err }
                        else {
                            res.send(newData);
                        };
                    });
                };
            };
        };
    });
});

app.listen(PORT, function () {
    console.log("testing port");
});
