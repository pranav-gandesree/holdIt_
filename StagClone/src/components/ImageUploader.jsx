import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import AlertComponent from "./AlertComponent";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ImageUploader = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState("");
  const urlInputRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [age, setAge] = React.useState("");

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        handleFile(file);
        break;
      }
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setImageSrc(null);
  };

  const handleSelectFile = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
    console.log(file);
  };

  const reload = () => {
    window.location.reload();
  };

  const handleSave = async () => {
    try {
      // Send POST request to backend API
      const response = await axios.post(
        "http://localhost:4000/api/v1/saveimage",
        { imageSrc, url }
      );

      // Check if the response has data
      if (response.data) {
        const { message, generatedUrl } = response.data;

        // Check if generatedUrl is available
        if (generatedUrl) {
          setUrl(generatedUrl);
          console.log("Generated URL:", generatedUrl);
          // Show success alert
          setAlertMessage("Saved to database successfully!");
          setAlertSeverity("success");
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
          }, 5000);

          //   // Reload the page after 5 seconds
          //   setTimeout(() => {
          //     window.location.reload();
          // }, 10000);
        } else {
          // Handle unexpected cases
          throw new Error("Unexpected response structure");
        }
      }
    } catch (error) {
      // Log detailed error information
      console.error(
        "Error saving image:",
        error.response ? error.response.data : error.message
      );

      setAlertMessage("Error saving data!");
      setAlertSeverity("error");
      setShowAlert(true);

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };

  const copyToClipboard = () => {
    if (urlInputRef.current) {
      const fullUrl = `http://localhost:3000/imageuploader/${url}`;
      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          setAlertMessage("Copied URL to the clipboard!");
          setAlertSeverity("info");
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          setAlertMessage("Failed to copy URL to the clipboard!");
          setAlertSeverity("error");
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
        <AlertComponent
          showAlert={showAlert}
          alertMessage={alertMessage}
          alertSeverity={alertSeverity}
        />
      </div>

      <div className="flex justify-center items-center bg-gray-200 min-h-screen py-8">
        <div className="max-w-screen-lg w-full bg-white shadow-lg p-6 rounded-lg ">
          <Stack spacing={2} direction="row" className="pb-2">
             <TextField
              id="outlined-basic"
              label="Enter URL"
              variant="outlined"
              ref={urlInputRef}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              // disabled={!!id} // Disable if id is present
              className="mb-2 md:mb-0 md:mr-2 md:w-56 " 
            />

            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Expire in{" "}
                </InputLabel>
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
            <Button onClick={copyToClipboard} variant="contained">
              COPY
            </Button>
            <Button onClick={handleSave} variant="contained">
              SAVE
            </Button>
            <Button onClick={reload} variant="contained">
              {" "}
              NEW{" "}
            </Button>
          </Stack>

          <div
            className="w-full h-80 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center overflow-hidden mt-2"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onPaste={handlePaste}
            tabIndex={0}
          >
            {imageSrc && (
              <>
                <img
                  src={imageSrc}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
                <div>
                  <Button onClick={handleDelete} variant="contained">
                    Delete Image
                  </Button>
                </div>
              </>
            )}
            {!imageSrc && <div>Drag & Drop Image Here or Paste Image</div>}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
            <div className="mt-6">
              <Button onClick={handleSelectFile} variant="outlined">
                Select Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageUploader;
