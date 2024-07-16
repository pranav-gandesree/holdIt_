import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";

const ImageUploader = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);
  const [url, setUrl] = useState("");
  const urlInputRef = useRef(null);

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
      const response = await axios.post('http://localhost:4000/api/v1/saveimage', { imageSrc, url });
      if (response.data.success) {
        alert("image uploaded")
        console.log(response.data);
      } else {
        // Show error alert
        throw new Error('Error saving image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
  
    }
  };


  return (
    <>
    <div className="flex flex-col mt-24 ml-20" >

      <div>
        <Stack spacing={2} direction="row" className="pb-2">
          <TextField
            id="outlined-basic"
            label="Entet URL"
            variant="outlined"
            ref={urlInputRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            />
          <Button variant="contained">COPY</Button>
          <Button onClick={handleSave} variant="contained">SAVE</Button>
          <Button onClick={reload} variant="contained">  NEW </Button>
        </Stack>
      </div>

      <div
        className="w-4/5 h-72 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center overflow-hidden"
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
    </>
  );
};

export default ImageUploader;
