import React, { useContext } from "react";
import NoteContex from "../contex/notes/NoteContex";

function NoteItem(props) {
  const context = useContext(NoteContex);
  const { deleteNote } = context;

  const { note, updateNote } = props;
  return (
    <div className="col-md-3 ">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <i
              className="fa-regular fa-pen-to-square mx-2"
              onClick={() => {
                updateNote(note);
              }}
            ></i>
            <i
              className="fa-regular fa-trash-can mx-2 "
              onClick={() => {
                deleteNote(note._id);
                props.showAlert("Deleted Succesfully","success");
              }}
            ></i>
          </div>

          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
