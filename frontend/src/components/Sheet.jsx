import React, { useState, useEffect, useRef } from "react";
import Spreadsheet from "react-spreadsheet";
import axios from "axios";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const INITIAL_DATA = [
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }],
];

const Sheet = () => {
  const [json, setJson] = useState(INITIAL_DATA);
  const [url, setUrl] = useState("");
  const urlInputRef = useRef(null);
  const { id } = useParams();
  const [selectedRowIndex, setSelectedRowIndex] = useState("");
  const [selectedColIndex, setSelectedColIndex] = useState("");
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const navigate = useNavigate();
  const [expireTime, setExpireTime] = React.useState("0");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleExpiry = (event) => {
    setExpireTime(event.target.value);
  };

  const copyToClipboard = () => {
    if (urlInputRef.current) {
      const fullUrl = `http://localhost:5173/excelsheet/${url}`;
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

  const copyJson = () => {
    if (id) {
      navigator.clipboard.writeText(JSON.stringify(json))
        .then(() => {
          setAlertMessage("Copied JSON data to the clipboard!");
          setAlertSeverity("info");
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        })
        .catch((err) => {
          console.error("Failed to copy JSON: ", err);
          setAlertMessage("Failed to copy JSON data to the clipboard!");
          setAlertSeverity("error");
          setShowAlert(true);

          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        });
    } else {
      setAlertMessage("No ID parameter provided. Cannot copy JSON.");
      setAlertSeverity("warning");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const path = id || window.location.pathname.replace(/^\/|\/$/g, "");
        const response = await axios.get(
          `${backendUrl}/api/v1/json/${path}`
        );
        setJson(response.data.json); // Assuming the response structure is { json: ... }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const reload = () => {
    navigate("/excelsheet");
    window.location.reload();
  };

  function AddCol() {
    const newData = json.map((row) => [...row, { value: "" }]);
    setJson(newData);
  }

  function AddRow() {
    let cols = json[0].length;
    let emptArr = [...Array(cols)].fill({ value: "" });
    let newData = [...json, emptArr];
    setJson(newData);
  }

  function deleteRow(index) {
    const newData = json.filter((_, rowIndex) => rowIndex !== index);
    setJson(newData);
  }

  function deleteCol(index) {
    const newData = json.map((row) =>
      row.filter((_, colIndex) => colIndex !== index)
    );
    setJson(newData);
  }

  const saveData = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/json`, {
        json,
        url,
        expireTime,
      });
      console.log("Data saved successfully:", response.data);
      const savedData = response.data.data[0];
      const extractedUrl = savedData.url;
      console.log("Extracted URL:", extractedUrl);
      setUrl(extractedUrl);

      setAlertMessage('Saved to database successfully!');
      setAlertSeverity('success');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      setTimeout(() => {
        window.location.reload();
      }, 10000);
    } catch (error) {
      console.error("Error saving data:", error.message);
      setAlertMessage('Error saving data!');
      setAlertSeverity('error');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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

      <div className="flex justify-center items-center flex-col bg-gray-200 min-h-screen py-8">
        <div className="max-w-screen-lg w-full bg-white shadow-lg p-6 rounded-lg border border-slate-700 mb-4">
          <Stack spacing={2} direction={{ base: "column", md: "row" }} className="mb-4">
            <div className="flex flex-row">
              <TextField
                id="outlined-basic"
                label="Enter URL"
                variant="outlined"
                inputRef={urlInputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={!!id}
                className="w-full sm:w-96 lg:w-[300px] md:w-full sm:mb-0 sm:mr-2"
              />
              <Box className="ml-2 sm:ml-4 w-full sm:w-96 lg:w-[300px] md:w-full">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Expire in</InputLabel>
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

            <div className="flex mt-2 flex-row md:flex-row md:space-x-2 space-x-2">
              <Button
                onClick={copyToClipboard}
                variant="contained"
                className="bg-blue-500 hover:bg-blue-700 lg:w-24 md:full h-14 w-full text-white md:mb-2"
                disabled={!!id}
                size="medium"
              >
                COPY
              </Button>
              <Button
                onClick={saveData}
                variant="contained"
                className="text-white w-full lg:w-28 md:mb-0 md:w-full"
                disabled={!!id}
                size="medium"
              >
                SAVE
              </Button>
              <Button
                onClick={reload}
                size="medium"
                variant="contained"
                className="text-white w-full lg:w-28 md:mb-0 md:w-full"
              >
                NEW
              </Button>
            </div>
          </Stack>
        </div>

    
        <div className="max-w-screen-lg w-full bg-white shadow-lg p-6 rounded-lg border border-slate-700 mb-4">
      

  <div className="flex flex-wrap gap-4 mb-4">
    <Button
      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 flex-1 min-w-[120px]"
      onClick={AddRow}
      disabled={!!id}
      variant="contained"
      color="success"
    >
      Add Row
    </Button>
    <Button
      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 flex-1 min-w-[120px]"
      onClick={() => deleteRow(Number(selectedRowIndex))}
      disabled={!!id}
      variant="contained"
      color="success"
    >
      Delete Row
    </Button>
    <Button
      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 flex-1 min-w-[120px]"
      onClick={AddCol}
      disabled={!!id}
      variant="contained"
      color="success"
    >
      Add Col
    </Button>
    <Button
      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 flex-1 min-w-[120px]"
      onClick={() => deleteCol(Number(selectedColIndex))}
      disabled={!!id}
      variant="contained"
      color="success"
    >
      Delete Col
    </Button>
    <Button
      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 flex-1 min-w-[120px]"
      onClick={copyJson}
      disabled={!id}
      variant="contained"
      color="success"
    >
      Copy Json
    </Button>
  </div>



          <div className="overflow-x-auto">
            <Spreadsheet data={json} onChange={setJson} className="bg-gray-100 shadow p-4 w-full min-w-[640px]" />
          </div>

        
        </div>
      </div>
    </>
  );
};

export default Sheet;
