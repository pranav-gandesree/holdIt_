
import React, { useState,useEffect } from "react";
// import ImageUploader from "./ImageUploader";
// import TextArea from './TextArea';
// import Table from './Table';

const DropDown = () => {
  const [selectedComponent, setSelectedComponent] = useState("");

  const handleChange = (event) => {
    setSelectedComponent(event.target.value);
  }

  useEffect(() => {
    console.log(selectedComponent); // Log the updated value of selectedComponent
  }, [selectedComponent]);

//   const renderComponent = () => {
//     switch (selectedComponent) {
//       case "ImageUploader":
//         return <ImageUploader />;
//       case "TextArea":
//         return <TextArea />;
//       case "Table":
//         return <Table />;
//       default:
//         return null;
//     }
//   };

  return (
    <>
      <label htmlFor="componentSelect">Choose a component:</label>
      <select id="componentSelect" value={selectedComponent} onChange={handleChange}>
        <option value="TextArea">TextArea</option>
        <option value="ImageUploader">ImageUploader</option>
        <option value="Table">Table</option>
      </select>
      {/* {renderComponent()} */}
    </>
  );
};

export default DropDown;


