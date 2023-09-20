import { useState } from "react";
import NoteContex from "./NoteContex";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);

// Get All Note

const getNotes = async () => {
  // API Calls here
  const response = await fetch(`${host}/api/notes/fetchallnotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token":localStorage.getItem('token'),
    }, 
  });
  const json = await response.json()
  setNotes(json);
  
};

  // Add Note
  const addNote = async (title, description, tag) => {
    // API Calls here
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note =await response.json()
    setNotes(notes.concat(note));
  };

  //  Edit Note
  const editNote = async (id, title, description, tag) => {
    //Api Calls are here

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
      body: JSON.stringify({id, title,description,tag}),
    });
    const json = await response.json();

    //logic of Edit
    let newNote = JSON.parse(JSON.stringify(notes));

    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id === id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
        break;
      }
    }
    setNotes(newNote);
  };

  // Delete Note
  const deleteNote =async (id) => {
    // API Calls here
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
    });
    const json= await response.json();
    
    // Logic
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  return (
    <NoteContex.Provider value={{ notes, addNote, editNote, deleteNote ,getNotes }}>
      {props.children}
    </NoteContex.Provider>
  );
};
export default NoteState;
