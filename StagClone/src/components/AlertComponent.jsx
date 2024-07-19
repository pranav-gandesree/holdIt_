import React from 'react';
import Alert from '@mui/material/Alert';

const AlertComponent = ({ showAlert, alertMessage, alertSeverity }) => {
  if (!showAlert) return null;

  return (
    <Alert severity={alertSeverity}>{alertMessage}</Alert>
  );
};

export default AlertComponent;
