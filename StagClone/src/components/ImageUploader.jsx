
import React, { useState } from 'react';

const ImageUploader = () => {
  const [imageSrc, setImageSrc] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        handleFile(file);
        break; 
      }
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
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
    document.getElementById('fileInput').click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
    console.log(file);
  };

  return (
    <div
      style={{
        width: '80%',
        height: '300px',
        border: '2px dashed #ccc',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
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
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
          <div>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </>
      )}
      {!imageSrc && <div>Drag & Drop Image Here or Paste Image</div>}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      <div>
        <button onClick={handleSelectFile}>Select Image</button>
      </div>
    </div>
  );
};

export default ImageUploader;
