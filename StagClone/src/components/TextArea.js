import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react';
import axios from 'axios';
import '../index.css'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

export default function TextArea({ setTextValue }) {
  const [editorValue, setEditorValue] = useState("//some comment");
  const editorRef = useRef(null);
  const [url, setUrl] = useState("")
  const urlInputRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.updateOptions({ wordWrap: "on" })
  }

  useEffect(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    axios.get(`http://localhost:4000/api/v1/${path}`)
      .then(response => {
        setEditorValue(response.data.text || "//some comment");
        console.log(response.data);
      })

      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);


  function debounce(fn, time) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => { fn.apply(this, arguments) }, time);
    }
  }

  function handleChange(newValue) {
    // let txt=editorRef.current.getValue();
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
    window.location.reload();
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

  return (
    <>

      <div>
        {showAlert && <Alert severity={alertSeverity}>{alertMessage}</Alert>}
      </div>

      <div className="flex justify-center flex-col items-center bg-slate-200 h-screen">
        <Stack spacing={2} direction="row" className='pb-2'>
          <TextField id="outlined-basic" label="Entet URL" variant="outlined"
            ref={urlInputRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={copyToClipboard} variant="contained">COPY</Button>
          <Button onClick={saveData} variant="contained">SAVE</Button>
          <Button onClick={reload} variant="contained">NEW</Button>
        </Stack>
        <div className="editor-container">
          <Editor
            height="70vh"
            width="70vw"
            theme="vs-dark"
            defaultValue={editorValue}
            loading="Loading..."
            onMount={handleEditorDidMount}
            onChange={debounce(handleChange, 1500)}
            options={{
              fontSize: 16,
              minimap: {
                enabled: false
              }
            }}
          />
        </div>

      </div>
    </>
  )
}


