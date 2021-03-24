const express = require("express");
const app = express();
const notes = require("./data/notes-data");
app.use(express.json());

app.get("/notes/:noteId", (req, res, next) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote === undefined) {
    next(`Note id not found: ${noteId}`);
  } else {
    res.json({ data: foundNote }); // Return a JSON object, not a number.
  }
});

app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);
// TODO: Add ability to create a new note

app.post("/notes", (req, res, next) => {
  const { data: { text } = {} } = req.body;
  if (text) {
    const newNote = {
      id: ++lastNoteId, // Increment last id then assign as the current ID
      text,
    };
    notes.push(newNote);
    // counts[text] = counts[text] + 1; // Increment the counts
    res.status(201).json({ data: newNote });
  } else {
    next();
  }
});
// TODO: add not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// TODO: Add error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.status(400).send(error);
});

module.exports = app;
