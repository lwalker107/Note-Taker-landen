const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = 3001;
const uuid = require('uniqid');
const db = require('./db/db.json');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        res.send(data);

    })
})

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        const notes = JSON.parse(data);
        const newNotes = {
            ...req.body,
            id: uuid()
        }
        notes.push(newNotes);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
            res.json(newNotes);
        })
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const notes = JSON.parse(data);
        const updatedNotes = notes.filter((note) => note.id !== noteId);

        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(204).send();
        })
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})


app.listen(PORT, () => {
    console.log('`App listening at http://localhost:${PORT} 🚀`')
})

