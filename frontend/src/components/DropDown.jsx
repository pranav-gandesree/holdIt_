
import React, { useState,useEffect } from "react";

const DropDown = () => {
  const [selectedComponent, setSelectedComponent] = useState("");

  const handleChange = (event) => {
    setSelectedComponent(event.target.value);
  }

  useEffect(() => {
    console.log(selectedComponent); // Log the updated value of selectedComponent
  }, [selectedComponent]);

  return (
    <>
      <label htmlFor="componentSelect">Choose a component:</label>
      <select id="componentSelect" value={selectedComponent} onChange={handleChange}>
        <option value="TextArea">TextArea</option>
        <option value="ImageUploader">ImageUploader</option>
        <option value="Table">Table</option>
      </select>
      
    </>
  );
};

export default DropDown;


