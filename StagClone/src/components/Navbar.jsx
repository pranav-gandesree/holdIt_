

import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import ImageUploader from "./ImageUploader";
import TextArea from "./TextArea";
import Table from "./Table";
import axios from 'axios';



function Navbar() {
  const [selectedComponent, setSelectedComponent] = useState("TextArea");
  const [editorValue, setEditorValue] = useState("");
//   const [url, setUrl] = useState("")
//   const urlInputRef = useRef(null);

  const handleChange = (event) => {
      setSelectedComponent(event.target.value);
  };

  const setTextValue = (value) => {
      setEditorValue(value);
  };

  useEffect(() => {
      console.log("selected component is ", selectedComponent); 
  }, [selectedComponent]);

  const renderComponent = () => {
      switch (selectedComponent) {
          case "ImageUploader":
              return <ImageUploader />;
          case "TextArea":
              return <TextArea  setTextValue={setTextValue}/>;
          case "Table":
              return <Table />;
          default:
              return null;
      }
  };

 

  
  return (
      <>
          <div className="component">
              <div className="navbar">TextShare</div>
              {/* <div className="url">

                  <input ref={urlInputRef} type="text" name="url" id="url" value={url} placeholder="Enter url" onChange={(e) => setUrl(e.target.value)} />

              </div> */}
              <div className="dropdown">
                  <label htmlFor="componentSelect">Choose a component:</label>
                  <select
                      id="componentSelect"
                      value={selectedComponent}
                      onChange={handleChange}>
                      <option value="TextArea">TextArea</option>
                      <option value="ImageUploader">ImageUploader</option>
                      <option value="Table">Table</option>
                  </select>
              </div>         
              
          </div>

          <div className="rendered-component">{renderComponent()}</div>
      </>
  );
}

export default Navbar;
