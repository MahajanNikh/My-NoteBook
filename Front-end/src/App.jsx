import Navbar from "./components/Navbar";
import About from "./components/About";
import Home from "./components/Home";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NoteState from "./contex/notes/NoteState";
import Alert from "./components/Alert";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useState } from "react";
import Contact from "./components/Contact ";

function App() {
  const [alert, setAlert] = useState(null)
  
  const showAlert=(message,type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
      <NoteState>
        <Navbar />
        <Alert alert={alert}/>
        <div className="container">
        <Routes>
          <Route path="/" element={<Home showAlert={showAlert}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/signup" element={<Signup showAlert={showAlert}/>}/>
          <Route path="/login" element={<Login showAlert={showAlert}/>}/>
        </Routes>
        </div>
      </NoteState>
    </>
  );
}

export default App;
