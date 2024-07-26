import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import AlertComponent from "./AlertComponent";

import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ImageUploader = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState("");
  const urlInputRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const { id } = useParams();
  const backendUrl = "https://holdit-backend.onrender.com"
  const frontendUrl = "https://holdit-nm2m94hyz-pranavs-projects-53178da9.vercel.app"

  const [expireTime, setExpireTime] = React.useState("0");

  const handleExpiry = (event) => {
    setExpireTime(event.target.value);
  };

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
        `${backendUrl}/api/v1/saveimage`,
        { imageSrc, url, expireTime }
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

            // Reload the page after 10 seconds
            setTimeout(() => {
              window.location.reload();
          }, 10000);
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
      const fullUrl = `${frontendUrl}/imageuploader/${url}`;
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
          <Stack
            spacing={2}
            direction={{ base: "column", md: "row" }}
            className="pb-2"
          >
            <div className="flex flex-row">
              <TextField
                id="outlined-basic"
                label="Enter URL"
                variant="outlined"
                inputRef={urlInputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={!!id} // Disable if id is present
                className="w-full sm:w-96 lg:w-[300px]  sm:mb-0 sm:mr-2 md:w-full"
              />

              <Box className="ml-2  sm:ml-4 w-full sm:w-96 lg:w-[300px] md:w-full">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Expire in{" "}
                  </InputLabel>
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
                onClick={handleSave}
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
