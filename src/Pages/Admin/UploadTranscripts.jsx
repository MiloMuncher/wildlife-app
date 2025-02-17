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

  const getTranscripts = () => {
    http.get('https://0ylgzr9mv6.execute-api.us-east-1.amazonaws.com/dev/gettranscripts').then((res) => {
      setEventList(res.data);
    });
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
  // Start recording
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

    // Start timer for recording
    const id = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    setTimerId(id);
  };

  // Stop recording and convert to Base64
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

  // Convert file to Base64
  const convertFileToBase64 = (file) => {
    console.log(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle submission
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

  // Format the recording time (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Upload Button */}
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
          <DialogContentText>
            Please record your audio and enter a description for the procedure.
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
          <div style={{ marginTop: '20px' }}>
            {!isRecording ? (
              <Button variant="contained" color="primary" onClick={startRecording}>
                Start Recording
              </Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={stopRecording}>
                Stop Recording
              </Button>
            )}
            {isRecording && (
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'red',
                    marginRight: '10px',
                    animation: 'blinking 1s infinite',
                  }}
                ></div>
                <Typography variant="body1">Recording... {formatTime(recordingTime)}</Typography>
              </div>
            )}
            {audioBase64 && <p>Audio recorded and ready for upload.</p>}
          </div>
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
