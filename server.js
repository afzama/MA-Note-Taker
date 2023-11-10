//Import express package
const express = require('express');

const app = express();
const PORT = 3001;
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());

//Serve static assets (HTML,CSS,Javascript)
app.use(express.static('public'));

//Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

//Route for notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

//route to get notes (JSON data)
app.get('/api/notes', (req, res) => res.json(notes));

//route to add new note
app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    };
    const noteTaker = notes;
    noteTaker.push(newNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteTaker));
    res.json(newNote);
});

//route to delete note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteTaker = notes;
    for (let index = 0; index < noteTaker.length; index++) {
        if (noteTaker[index].id === noteId) {
            noteTaker.splice(index, 1)
            fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteTaker));
        }
    }
    console.log(noteId);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    // console.log(`Note Taker listening at http://localhost:${PORT}`)
});
