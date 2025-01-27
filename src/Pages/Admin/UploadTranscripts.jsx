import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import { fetchAuthSession } from 'aws-amplify/auth';
import http from '../../http';
import { DataGrid } from '@mui/x-data-grid';

function UploadTranscripts() {
  const [eventList, setEventList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  // Columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Vet Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'transcription', headerName: 'Transcription', width: 300 },
  ];

  const rows = eventList.map((event) => ({
    id: event.transcript_ID,
    name: event.name,
    description: event.description,
    date: new Date(event.date).toLocaleDateString(),
    transcription: event.transcription,
  }));
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        const userEmail = tokens.idToken.payload['email']; // Get the email from the tokens
        setEmail(userEmail); // Set the email dynamically
      } catch (error) {
        console.error('Error fetching the session or user data', error);
      }
    };

    checkAuthSession();
    getTranscripts(); // Fetch transcripts on component mount
  }, []);
  // Fetch transcript data
  const getTranscripts = () => {
    http.get('https://0ylgzr9mv6.execute-api.us-east-1.amazonaws.com/dev/gettranscripts').then((res) => {
      setEventList(res.data); // Update state
    })

  };

  // Handle file upload and Lambda trigger
  const handleSubmit = async () => {
    if (!selectedFile || !description || !email) {
      alert('Please upload an MP3 file, enter a description.');
      return;
    }

    // Prepare the form data to send as JSON
    const data = {
      email,
      description,
      // Assuming you want to send the file as base64-encoded string
      file: await convertFileToBase64(selectedFile), // Convert the file to base64
    };

    try {
      const response = await http.post(
        'https://0ylgzr9mv6.execute-api.us-east-1.amazonaws.com/dev/uploadtranscript',
        JSON.stringify(data), // Send the data as JSON
        {
          headers: {
            'Content-Type': 'application/json', // Set Content-Type to JSON
          },
        }
      );
      console.log('Transcription started:', response.data);
      setOpenDialog(false);
      getTranscripts();
    } catch (error) {
      console.error('Error starting transcription:', error);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get base64 string
      reader.onerror = reject;
      reader.readAsDataURL(file); // Read file as base64
    });
  };



  return (
    <div>
      {/* Upload Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        style={{ marginBottom: '20px' }}
      >
        Upload Transcription
      </Button>

      {/* Dialog for Upload */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Upload MP3 and Description</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please upload an MP3 file and enter a description for the procedure.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            accept=".mp3"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ marginTop: '20px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* DataGrid for Displaying Transcriptions */}
      <div style={{ width: '100%', backgroundColor: 'white' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ height: 500 }}
        />
      </div>
    </div>
  );
}

export default UploadTranscripts;
