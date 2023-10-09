const notes = require('express').Router();
const fsp = require('fs/promises');
const fs = require('fs');
const db = './db/db.json';
const {v4: uuid} = require('uuid');

// api GET route that reads the db.json file and returns all current notes in that file
notes.get('/notes', (req, res) => {
    fsp.readFile(db)
    .then((data) =>  {
        if (!data.includes('id')) {
            res.json([]);
        }
        else {
            res.json(JSON.parse(data));
        }        
    });
});

// api POST route that takes in a new note in the request body and saves it in the db.json file with a unique id attached to it
notes.post('/notes', (req, res) => {

    if (req.body) {
        const {title, text} = req.body;
        const newNote = {title, text, 'id':uuid()};

        fs.readFile(db, (err, data) => {
            if (err) {
                res.errored('Error');
            }
            else if (!data.includes('id')) {
                fsp.writeFile(db, JSON.stringify([newNote]));
                res.json('new file');
            }
            else {
                const database = JSON.parse(data);
                database.push(newNote);
                fsp.writeFile(db, JSON.stringify(database));
                res.json('Note added');
            }
        });  
    }
    else {
        res.errored('Error');
    }
});

// api DELETE route that deletes a note when the red trash can is clicked next to the corresponding note in the notes list
notes.delete('/notes/:id', (req, res) => {
    fs.readFile(db, (err, data) => {
        if (err) {
            res.errored(err);
        }
        else {
            let notes = JSON.parse(data);
            const {id} = req.params;
            notes = notes.filter((note) => note.id !== id);
            fsp.writeFile(db, JSON.stringify(notes));
            res.json('Note deleted');
        }
    });
});

// this exports the definted routes above to be used in th eapplication
module.exports = notes;