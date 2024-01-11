const express = require('express');
const path = require('path');
const fs = require('fs');

// Create express instance
const app = express();
// Set what port for the server to listen on
const PORT = process.env.PORT || 3001;

// Middleware to handle JSON and URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route for the index.html "landing" page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Route to get the notes.html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Route to get existing notes from the JSON file
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
});

// Route for new notes
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  newNote.id = notes.length + 1;
  notes.push(newNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json(newNote);
});

// Route to delete notes
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  notes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes));
  res.json({ message: 'Note deleted successfully' });
});

// Starting server and sending a console log to let user know what port it is on
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
