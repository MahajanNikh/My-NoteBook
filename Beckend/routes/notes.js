const express = require("express");
const router = express.Router();
const Note = require("../models/Notes");
var fetchuser = require("../middleware/fetchuser");

const { body, validationResult } = require("express-validator");

// app.get("/", (req, res) => {
//   res.send("Hello Nikhil! I am good how are u?");
// });

// Router 1: Get All The Notes using : GET "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const note = await Note.find({ user: req.user.id });
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Router 2: Add a New Notes using : POST "/api/notes/addnote". Login Required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Title should contain at least 3 alphabates"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description should be at least 5 characters"),
  ],
  async (req, res) => {
    // if there are errors, return bad request and the erros
    try {
      const { title, description, tag } = req.body;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.send({ errors: result.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Router 3: Update Exiting Note  using : PUT "/api/notes/updatenote". Login Required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //   find the note to be update and update it
    // const note =Note.findByIdAndUpdate(id) // we can directly use it but there is security issue 
    
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Router 4 : Delete Exiting Note  using : DELETE "/api/notes/deletenote". Login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //   find the note to be deleted
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not Found");
    }

    //   Allow Deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been Successfully Deleted." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
