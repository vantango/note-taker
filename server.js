const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

// The specificed server port
PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware function
app.use(express.static("./public"));

// Sends the home page back to the user
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

// Sends the note page back to the user
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// Sends back the individual objects for each note
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
        if (err) { throw err }
        else {
            const parseData = JSON.parse(data)
            res.send(parseData);
        };
    });
});

// Inserts the note input data onto the notes page
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

// Adds delete functionality to individual notes
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

// Sets up where the server port is listening
app.listen(PORT, function () {
    console.log("testing port");
});
