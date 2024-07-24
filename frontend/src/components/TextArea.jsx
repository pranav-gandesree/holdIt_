
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
import Select from '@mui/material/Select';





export default function TextArea({ setTextValue }) {
  const [editorValue, setEditorValue] = useState("");
  const editorRef = useRef(null);
  const [url, setUrl] = useState("");
  const urlInputRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const { id } = useParams(); // Get the id from the URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const frontendUrl = process.env.REACT_APP_FRONTEND_URL;

  const [expireTime, setExpireTime] = React.useState('0');
  const navigate = useNavigate();

  const handleExpiry = (event) => {
    setExpireTime(event.target.value);
  }



  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.updateOptions({ wordWrap: "on" });
  }




  useEffect(() => {
    if (id) {
      // Fetch the corresponding text using the id from the URL
      axios.get(`${backendUrl}/api/v1/${id}`)
        .then(response => {
          setEditorValue(response.data.text || "//some comment");
          console.log(response.data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    } else {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      axios.get(`${backendUrl}/api/v1/${path}`)
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
      setEditorValue("");
    }
  }, [editorValue]);

  function saveData() {
    saveTextToDatabase(editorValue);
  }

  function saveTextToDatabase(text) {
    axios.post(`${backendUrl}/api/v1/paste`, { text, url, expireTime })
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

            // Reload the page after 10 seconds
            setTimeout(() => {
              window.location.reload();
          }, 10000);
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
    // setEditorValue("")
    navigate('/')
    window.location.reload();
  };

  const copyToClipboard = () => {
    if (urlInputRef.current) {
      const fullUrl = `${frontendUrl}/${url}`;
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
            className="mb-4"
          >

            <div className='flex flex-row '>
              <TextField
                id="outlined-basic"
                label="Enter URL"
                variant="outlined"
                inputRef={urlInputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={!!id} // Disable if id is present
                className="w-full sm:w-96 lg:w-[300px] md:w-full  sm:mb-0 sm:mr-2 "
              />

              <Box className="ml-2  sm:ml-4 w-full sm:w-96 lg:w-[300px] md:w-full ">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Expire in </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={expireTime}
                    disabled={!!id}
                    label="Expiry"
                    onChange={handleExpiry}
                    className="w-full"
                  >
                    <MenuItem value={3600}>1 hour</MenuItem>
                    <MenuItem value={86400}>1 day</MenuItem>
                    <MenuItem value={2592000}>1 month</MenuItem>
                    <MenuItem value={0}>NEVER</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>

            <div className="flex mt-2 flex-row md:flex-row md:space-x-2 space-x-2 ">
              <Button
                onClick={copyToClipboard}
                variant="contained"
                className="bg-blue-500 hover:bg-blue-700 lg:w-24 md:full h-14 w-full text-white md:mb-2  "
                disabled={!!id}
                size="medium"
              >
                COPY
              </Button>
              <Button
                onClick={saveData}
                variant="contained"
                className="  text-white w-full lg:w-28 md:mb-0 md:w-full  "
                disabled={!!id}
                size="medium"
              >
                SAVE
              </Button>
              <Button
                onClick={reload}
                size="medium"
                variant="contained"
                className="text-white w-full lg:w-28 md:mb-0 md:w-full "
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

