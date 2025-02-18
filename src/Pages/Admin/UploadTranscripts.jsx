import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography } from '@mui/material';
import { fetchAuthSession } from 'aws-amplify/auth';
import http from '../../http';
import { DataGrid } from '@mui/x-data-grid';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util'

function UploadTranscripts() {
  const [eventList, setEventList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [userGroup, setUserGroup] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [transcript, setTranscript] = useState('');
  // Columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Vet Email', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'transcription', headerName: 'Transcription', width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleView(params.row.id)}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 10 }}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
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
        const groups = tokens.accessToken.payload['cognito:groups'];
        setUserGroup(groups ? groups[0] : null);
        const userEmail = tokens.idToken.payload['email'];
        setEmail(userEmail);
      } catch (error) {
        console.error('Error fetching the session or user data', error);
      }
    };

    checkAuthSession();
    getTranscripts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transcript?")) return;

    try {
      const response = await http.delete(
        `https://0ylgzr9mv6.execute-api.us-east-1.amazonaws.com/dev/deletetranscript/${id}`
      );
      console.log("Delete response:", response.data);
      alert("Transcript deleted successfully");
      window.reload()
    } catch (error) {
      console.error("Error deleting transcript:", error);
      alert("Failed to delete transcript");
    }
  };

  const getTranscripts = () => {
    http.get('https://0ylgzr9mv6.execute-api.us-east-1.amazonaws.com/dev/gettranscripts').then((res) => {
      setEventList(res.data);
    });
  };

  const handleView = async (id) => {
    await http.get(`https://0ylgzr9mv6.execute-api.us-east-1.amazonaws.com/dev/gettranscripts/${id}`)
      .then((res) => {
        setTranscript(res.data[0]); // Ensure state is updated
      })
      .catch((error) => console.error("Error fetching transcript details", error));
  };
  useEffect(() => {
    if (transcript) {
      setOpenViewDialog(true); // Open the dialog only when transcript is set
    }
  }, [transcript]);

  const closeViewDialog = () => {
    setOpenViewDialog(false);
    setTranscript(null); // Reset the data when closing the modal
  };

  const convertWebMToMP3 = async (webmBlob) => {
    const ffmpeg = new FFmpeg()
    try {
      await ffmpeg.load();

      console.log('Converting WebM to MP3...');

      const webmData = await fetchFile(webmBlob);

      // Write the WebM file to FFmpeg's in-memory filesystem
      await ffmpeg.writeFile('input.webm', webmData);

      // Convert input.webm to output.mp3
      await ffmpeg.exec(['-i', 'input.webm', 'output.mp3']);

      // Read the generated MP3 file from FFmpeg's filesystem
      const mp3Data = await ffmpeg.readFile('output.mp3');

      // Create a Blob from the MP3 data
      const mp3Blob = new Blob([mp3Data], { type: 'audio/mp3' });  // Create Blob from Uint8Array

      console.log('Conversion complete:', mp3Blob);
      return mp3Blob;
    } catch (error) {
      console.error('Error during conversion:', error);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setAudioChunks((prev) => [...prev, event.data]);
      } else {
        console.warn('Empty data chunk:', event.data);
      }
    };
    recorder.start(1000); // Collect audio chunks every 1 second
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordingTime(0);

    const id = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    setTimerId(id);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
    clearInterval(timerId);

    mediaRecorder.onstop = async () => {
      console.log('Stopping recording...');
      if (audioChunks.length === 0) {
        console.error('No audio chunks available!');
        return;
      }

      const webmBlob = new Blob(audioChunks, { type: 'audio/webm' });

      setAudioChunks([]);
      const mp3Blob = await convertWebMToMP3(webmBlob);
      const base64Audio = await convertFileToBase64(mp3Blob);
      console.log('Base64 MP3:', base64Audio);
      setAudioBase64(base64Audio);
    };
  };

  const convertFileToBase64 = (file) => {
    console.log(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!audioBase64 || !description || !email) {
      alert('Please record audio and enter a description.');
      return;
    }

    const data = {
      email,
      description,
      file: audioBase64,
    };

    try {
      const response = await http.post(
        'https://0ylgzr9mv6.execute-api.us-east-1.amazonaws.com/dev/uploadtranscript',
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div>
      {userGroup === 'Vets' && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            style={{ marginBottom: '20px' }}
          >
            Upload Transcription
          </Button>
        </>
      )}

      {/* Dialog for Upload */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Record Audio and Enter Description</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            value={email}
            disabled
            margin="normal"
          />

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={startRecording}
              disabled={isRecording}
            >
              Start Recording
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={stopRecording}
              disabled={!isRecording}
            >
              Stop Recording
            </Button>
            <Typography>{formatTime(recordingTime)}</Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Viewing Transcript */}
      <Dialog open={openViewDialog} onClose={closeViewDialog}>
        <DialogTitle>View Transcript</DialogTitle>
        <DialogContent>
          {transcript ? (
            <>
              <DialogContentText>
                <strong>Name:</strong> {transcript.name || "N/A"}
                <br />
                <strong>Description:</strong> {transcript.description || "No description available"}
                <br />
                <strong>Date:</strong> {transcript.date ? new Date(transcript.date).toLocaleDateString() : "N/A"}
                <br />
                <strong>Transcription:</strong> {transcript.transcription || "No transcription available"}
              </DialogContentText>
            </>
          ) : (
            <DialogContentText>Loading...</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ height: 400, width: '110%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
}

export default UploadTranscripts;
