import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from "./components/ImageUploader";
import TextArea from './components/TextArea';
import Table from './components/Table';


 export default function App() {
  const [selectedComponent, setSelectedComponent] = useState('ImageUploader'); 

  return (
    <>
      <Navbar selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} />
    </>
  );
}
