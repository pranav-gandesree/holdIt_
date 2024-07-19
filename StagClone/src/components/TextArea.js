
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import '../index.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';





export default function TextArea({ setTextValue }) {
  const [editorValue, setEditorValue] = useState("//some comment");
  const editorRef = useRef(null);
  const [url, setUrl] = useState("");
  const urlInputRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const { id } = useParams(); // Get the id from the URL
  const navigate = useNavigate();

  const [age, setAge] = React.useState('');



  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.updateOptions({ wordWrap: "on" });
  }




  useEffect(() => {
    if (id) {
      // Fetch the corresponding text using the id from the URL
      axios.get(`http://localhost:4000/api/v1/${id}`)
        .then(response => {
          setEditorValue(response.data.text || "//some comment");
          console.log(response.data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    } else {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      axios.get(`http://localhost:4000/api/v1/${path}`)
        .then(response => {
          setEditorValue(response.data.text || "//some comment");
          console.log(response.data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id]);

  function debounce(fn, time) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => { fn.apply(this, arguments); }, time);
    };
  }

  function handleChange(newValue) {
    setTextValue(newValue);
    setEditorValue(newValue);
    console.log("newvalue:" + newValue);
  }

  useEffect(() => {
    // Check if editor value is empty and set default value if true
    if (editorValue.trim() === "") {
      setEditorValue("// some comment");
    }
  }, [editorValue]);

  function saveData() {
    saveTextToDatabase(editorValue);
  }

  function saveTextToDatabase(text) {
    axios.post('http://localhost:4000/api/v1/paste', { text, url })
      .then(response => {
        console.log("Response from server:", response);

        // Check if the response structure is as expected
        if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const { data: [{ url }] } = response.data;
          console.log("Extracted URL:", url);
          setUrl(url);

          // Show success alert
          setAlertMessage('Saved to database successfully!');
          setAlertSeverity('success');
          setShowAlert(true);

          // Hide the alert after 3 seconds
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        } else {
          throw new Error("Unexpected response structure");
        }
      })
      .catch(error => {
        console.error("Error saving data:", error);
        // Show error alert
        setAlertMessage('Error saving data!');
        setAlertSeverity('error');
        setShowAlert(true);

        // Hide the alert after 3 seconds
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      });
  }

  const reload = () => {
    navigate('/');
    setTextValue("// some comment");
  };

  const copyToClipboard = () => {
    if (urlInputRef.current) {
      const fullUrl = `http://localhost:3000/${url}`;
      navigator.clipboard.writeText(fullUrl)
        .then(() => {
          setAlertMessage('Copied URL to the clipboard!');
          setAlertSeverity('info');
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          setAlertMessage('Failed to copy URL to the clipboard!');
          setAlertSeverity('error');
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        });
    }
  };

  // return (
  //   <>
  //     <div>
  //       {showAlert && <Alert severity={alertSeverity}>{alertMessage}</Alert>}
  //     </div>
  //     <div className="flex justify-center flex-col items-center bg-slate-200 h-screen">
  //       <Stack spacing={2} direction="row" className='pb-2'>
  //         <TextField id="outlined-basic" label="Enter URL" variant="outlined"
  //           ref={urlInputRef}
  //           value={url}
  //           onChange={(e) => setUrl(e.target.value)}
  //           disabled={!!id} // Disable if id is present
  //         />
  //         <Button onClick={copyToClipboard} variant="contained" disabled={!!id}>COPY</Button>
  //         <Button onClick={saveData} variant="contained" disabled={!!id}>SAVE</Button>
  //         <Button onClick={reload} variant="contained">NEW</Button>
  //       </Stack>
  //       <div className="editor-container">
  //         <Editor
  //           height="70vh"
  //           width="70vw"
  //           theme="vs-dark"
  //           defaultValue={editorValue}
  //           loading="Loading..."
  //           onMount={handleEditorDidMount}
  //           onChange={debounce(handleChange, 1500)}
  //           options={{
  //             fontSize: 16,
  //             minimap: {
  //               enabled: false
  //             }
  //           }}
  //         />
  //       </div>
  //     </div>
  //   </>
  // );


  return (
    <>
      <div className="fixed bottom-4 left-4 w-72 z-50">
        {showAlert && (
          <Alert severity={alertSeverity} className="mb-4">
            {alertMessage}
          </Alert>
        )}
      </div>

      <div className="flex justify-center items-center bg-gray-200 min-h-screen py-8">
        <div className="max-w-screen-lg w-full bg-white shadow-lg p-6 rounded-lg ">
          <Stack
            spacing={2}
            direction={{ base: "column", md: "row" }}
            className="mb-4 "
          >
            <TextField
              id="outlined-basic"
              label="Enter URL"
              variant="outlined"
              inputRef={urlInputRef}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={!!id} // Disable if id is present
              className="mb-2 md:mb-0 md:mr-2 md:w-56 " 
            />

            <div className='mb-4 h-12'>

              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Expire in </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                  // onChange={handleChange}
                  >
                    <MenuItem value={10}>1 hour</MenuItem>
                    <MenuItem value={20}>1 day</MenuItem>
                    <MenuItem value={30}>1 month</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>




            <div className="flex mt-2 w-auto flex-row md:flex-row md:space-x-2 space-x-2 ">
              <Button
                onClick={copyToClipboard}
                variant="contained"
                className="bg-blue-500 hover:bg-blue-700 text-white  md:mb-2 md:w-full h-12"
                disabled={!!id}
                size="medium"
              >
                COPY
              </Button>
              <Button
                onClick={saveData}
                variant="contained"
                className="bg-green-500 hover:bg-green-700 text-white  md:mb-0 md:w-full"
                disabled={!!id}
                size="medium"
              >
                SAVE
              </Button>
              <Button
                onClick={reload}
                size="medium"
                variant="contained"
                className="bg-gray-500 hover:bg-gray-700 text-white  md:mb-0 md:w-full"
              >
                NEW
              </Button>
            </div>
          </Stack>
          <div className="editor-container">
            <Editor
              height="70vh"
              width="100%"
              theme="vs-dark"
              defaultValue={editorValue}
              loading="Loading..."
              onMount={handleEditorDidMount}
              onChange={debounce(handleChange, 1500)}
              options={{
                fontSize: 16,
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );


}

