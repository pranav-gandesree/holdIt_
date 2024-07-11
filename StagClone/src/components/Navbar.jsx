// import React, { useState, useEffect } from "react";
// import "../index.css";
// import ImageUploader from "./ImageUploader";
// import TextArea from "./TextArea";
// import Table from "./Table";
// import axios from 'axios';


// //  import FaBeer from 'react-icons/fa'

// function Navbar() {
//   const [selectedComponent, setSelectedComponent] = useState("TextArea");
//   const [editorValue, setEditorValue] = useState("");
//   const [url, setUrl] = useState("")

//   const handleChange = (event) => {
//     setSelectedComponent(event.target.value);
//   };

//   const setTextValue = (value) => {
//     setEditorValue(value);
//   };

//   useEffect(() => {
//     console.log("selected component is ", selectedComponent); 
//   }, [selectedComponent]);

//   const renderComponent = () => {
//     switch (selectedComponent) {
//       case "ImageUploader":
//         return <ImageUploader />;
//       case "TextArea":
//         return <TextArea  setTextValue={setTextValue}/>;
//       case "Table":
//         return <Table />;
//       default:
//         return null;
//     }
//   };
//   function saveData(){
//     saveTextToDatabase(editorValue);
//   }

//   // function clearData() {  
//   //   setEditorValue("//some comment");
//   // }
  
//   // useEffect(() => {
//   //   console.log("Editor value:", editorValue);
//   // }, [editorValue]);
  



//     // Function to save text value to MongoDB
//     function saveTextToDatabase(text) {
//       // Make HTTP request to your MongoDB backend using Axios
//       axios.post('http://localhost:4000/api/v1/paste', { text,url })
//         .then(response => {
//           console.log("Data saved successfully:", response.data);
//           const { data: { data: { text, url } } } = response;
//           console.log("Text:", text);
//           console.log("URL:", url);
//         })
//         .catch(error => {
//           console.error("Error saving data:", error);
//         });
//     }
  

//   return (
//     <>
//       <div className="component">
//           <div className="navbar">NAVBAdxf</div>
//           <div className="url">
//             <input type="text" name="url" id="url" placeholder="Enter url" onChange={(e) => setUrl(e.target.value)} />
//           </div>
//           <div className="dropdown">
//             <label htmlFor="componentSelect">Choose a component:</label>
//             <select
//               id="componentSelect"
//               value={selectedComponent}
//               onChange={handleChange}>
//               <option value="TextArea">TextArea</option>
//               <option value="ImageUploader">ImageUploader</option>
//               <option value="Table">Table</option>
//             </select>
//           </div>         
//           <div>
//           <button className="save" onClick={saveData}>SAVE</button>
//           <button className="new">NEW</button>

//         </div>

//       </div>


//       <div className="rendered-component">{renderComponent()}</div>
  
//     </>
//   );
// }

// export default Navbar;


import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import ImageUploader from "./ImageUploader";
import TextArea from "./TextArea";
import Table from "./Table";
import axios from 'axios';



function Navbar() {
  const [selectedComponent, setSelectedComponent] = useState("TextArea");
  const [editorValue, setEditorValue] = useState("");
  const [url, setUrl] = useState("")
  const urlInputRef = useRef(null);

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

  function saveData() {
      saveTextToDatabase(editorValue);
  }

  function saveTextToDatabase(text) {
      axios.post('http://localhost:4000/api/v1/paste', { text, url })
          .then(response => {
              console.log("Data saved successfully:", response.data);
              const { data: { data: { url } } } = response;
              setUrl(url);
          })
          .catch(error => {
              console.error("Error saving data:", error);
          });
  }

  const  reload = () => {
    window.location.reload();
  };

  const copyToClipboard = () => {
    if (urlInputRef.current) {
      const fullUrl = `http://localhost:3000/${url}`;
      navigator.clipboard.writeText(fullUrl)
        .then(() => {
          alert('Copied URL to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  
  return (
      <>
          <div className="component">
              <div className="navbar">TextShare</div>
              <div className="url">

                  <input ref={urlInputRef} type="text" name="url" id="url" value={url} placeholder="Enter url" onChange={(e) => setUrl(e.target.value)} />

                  <button onClick={copyToClipboard}>Copy</button>
              </div>
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
              <div>
                  <button className="save" onClick={saveData}>SAVE</button>
                  <button className="new" onClick={reload}>NEW</button>
              </div>
          </div>

          <div className="rendered-component">{renderComponent()}</div>
      </>
  );
}

export default Navbar;
