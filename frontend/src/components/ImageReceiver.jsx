import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ImageReceiver = () => {
  const { id } = useParams(); // Get the id from the URL
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(null);
  const [expireTime, setExpireTime] = useState(""); // Assuming you want to manage expireTime state

  const reload = () => {
    navigate("/imageuploader");
  };

  const downloadImage = async () => {
    if (!imageSrc) return;

    try {
      const response = await fetch(imageSrc);
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'downloaded-image.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/image/${id}`);
        setImageSrc(response.data.text);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (id) {
      fetchImageData();
    } else {
      const path = window.location.pathname.replace(/^\/|\/$/g, "");
      axios
        .get(`http://localhost:4000/api/v1/image/${path}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [id]);

  return (
    <div className="flex justify-center items-center bg-gray-200 min-h-screen py-8">
      <div className="max-w-screen-lg w-full bg-white shadow-lg p-6 rounded-lg ">
        <Stack spacing={2} direction={{ base: "column", md: "row" }} className="pb-2">
          <div className="flex flex-row">
            <TextField
              id="outlined-basic"
              label="Enter URL"
              variant="outlined"
              disabled={!!id} // Disable if id is present
              className="w-full sm:w-96 lg:w-[300px]  sm:mb-0 sm:mr-2 md:w-full"
            />

            <Box className="ml-2  sm:ml-4 w-full sm:w-96 lg:w-[300px] md:w-full">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Expire in </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={expireTime}
                  onChange={(e) => setExpireTime(e.target.value)}
                  disabled={!!id}
                  label="Expiry"
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
              variant="contained"
              className="bg-blue-500 hover:bg-blue-700 lg:w-24 md:full h-14 w-full text-white md:mb-2"
              disabled={!!id}
              size="medium"
            >
              COPY
            </Button>
            <Button
              variant="contained"
              className="text-white w-full lg:w-28 md:mb-0 md:w-full"
              disabled={!!id}
              size="medium"
            >
              SAVE
            </Button>
            <Button
              size="medium"
              onClick={reload}
              variant="contained"
              className="text-white w-full lg:w-28 md:mb-0 md:w-full"
            >
              NEW
            </Button>
          </div>
        </Stack>

        {imageSrc && (
          <div className="w-full h-80 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center mt-4 overflow-hidden">
            <img
              src={imageSrc}
              alt="Uploaded"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
            <div>
              <Button
                size="medium"
                onClick={downloadImage}
                variant="contained"
                className="text-white w-full lg:w-28 md:mb-0 md:w-full"
              >
                Download Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageReceiver;
