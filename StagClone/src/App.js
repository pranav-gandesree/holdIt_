import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TextArea from './components/TextArea';
import ImageUploader from './components/ImageUploader';
import Navbar from './components/Navbar'; 
import { useState } from 'react';
import ImageReceiver from './components/ImageReceiver';


function App() {
  const [textValue, setTextValue] = useState("");

  return (
      <>
      <BrowserRouter>
        <Navbar/>
        <div>
          <Routes>
         
          <Route path="/" element={<TextArea setTextValue={setTextValue}/>}/>
          <Route path="/textarea" element={<TextArea setTextValue={setTextValue}/>}/>
          <Route path="/imageuploader" element={<ImageUploader/>}/>
          <Route path="/:id" element={<TextArea setTextValue={setTextValue}/>} />   
          <Route path="/imageuploader/:id" element={<ImageReceiver/>}/>
      
          </Routes>
        </div>
      </BrowserRouter>
      </>
    );
}

export default App;
