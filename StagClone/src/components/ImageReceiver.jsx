import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';

const ImageReceiver = () => {
    const { id } = useParams(); // Get the id from the URL
    const navigate = useNavigate();
    const [imageSrc, setImageSrc] = useState(null);

    const reload = () => {
        navigate('/imageuploader')
      };

      useEffect(() => {
        if (id) {
          // Fetch the corresponding text using the id from the URL
          axios.get(`http://localhost:4000/api/v1/${id}`)
            .then(response => {
                setImageSrc(response.data.text);
              console.log(response.data);
            })
            .catch(error => {
              console.error("Error fetching data:", error);
            });
        } else {
          const path = window.location.pathname.replace(/^\/|\/$/g, '');
          axios.get(`http://localhost:4000/api/v1/${path}`)
            .then(response => {
            //   setEditorValue(response.data.text || "//some comment");
              console.log(response.data);
            })
            .catch(error => {
              console.error("Error fetching data:", error);
            });
        }
      }, [id]);
    
    

  return (
    imageSrc && (
        <>
          <div>
          <Button onClick={reload} variant="contained">  NEW </Button>
          </div>
          <div
        className="w-4/5 h-72 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center overflow-hidden"
        >
          <img
            src={imageSrc}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
        </div>
        </>
      )
    )
}

export default ImageReceiver
