import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import { Fastfood, Medication, Description, Mic, Stop } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../http.js";
import { fetchAuthSession } from 'aws-amplify/auth';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util'

function AnimalData() {
  const { id, email } = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [animalData, setAnimalData] = useState({
    food: null,
    required_food_amount: null,
    required_dosage: null,
    medication: null,
    fed: false,
    medicated: false,
    surgeryTranscript: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [description, setDescription] = useState('');
  const [audioBase64, setAudioBase64] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    http.get(`https://8zjp8vpeub.execute-api.us-east-1.amazonaws.com/dev/animal/${id}`)
      .then((res) => {
        const responseData = res.data;
        console.log(responseData);

        setAnimalData({
          food: responseData.food,
          required_food_amount: responseData.required_food_medication.required_food_amount,
          initial_quantity: responseData.intake_food.available_quantity,
          required_dosage: responseData.required_food_medication.required_dosage,
          medication: responseData.medication,
          surgeryTranscript: responseData.surgeryTranscript || "",
          fed: false,
          medicated: false,
          surgeryTranscript: responseData.transcript.transcription || "",
        });
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [id]);
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
  const closeViewDialog = () => {
    setOpenViewDialog(false);
    setTranscript(null); // Reset the data when closing the modal
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleUpload = async () => {
    if (!audioBase64 || !description || !email) {
      alert('Please record audio and enter a description.');
      return;
    }

    const data = {
      id: id,
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
      location.reload()
    } catch (error) {
      console.error('Error starting transcription:', error);
    }
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  const handleChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleInputChange = (event) => {
    const { name, type, checked, value } = event.target;
    setAnimalData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const extractDosageNumber = (dosageString) => {
    const number = parseFloat(dosageString);
    console.log("Extracted Dosage Number:", number);
    return isNaN(number) ? 0 : number;
  };

  const calculateRemainingMedication = (requiredDosage, dosagePerAdmin, availableQuantity) => {
    const dosesRequired = Math.ceil(requiredDosage / dosagePerAdmin);
    console.log("Total doses required:", dosesRequired);
    const remainingQuantity = availableQuantity - dosesRequired;
    console.log("Remaining quantity after given doses:", remainingQuantity);
    return remainingQuantity >= 0 ? remainingQuantity : 0;
  };

  const calculateRemainingFood = (requiredFoodAmount, weightPerQuantity, availableFoodQuantity) => {
    let remainingWeight = weightPerQuantity - requiredFoodAmount;
    let remainingQuantity = availableFoodQuantity;

    if (remainingWeight < 0) {
      remainingQuantity -= 1;
      remainingWeight = animalData.initial_quantity + remainingWeight; // Assuming initial_quantity is in animalData
    }

    console.log("Remaining food weight:", remainingWeight);
    console.log("Remaining food quantity:", remainingQuantity);

    return { final_weight_per_quantity: remainingWeight, final_food_quantity: remainingQuantity >= 0 ? remainingQuantity : 0 };
  };

  const calculateFood = () => {
    const requiredFoodAmount = animalData.required_food_amount;
    const weightPerQuantity = animalData.food.weight_per_quantity;
    const availableFoodQuantity = animalData.food.available_quantity;

    console.log("Required Food Amount:", requiredFoodAmount);
    console.log("Weight Per Quantity:", weightPerQuantity);
    console.log("Available Food Quantity:", availableFoodQuantity);

    return calculateRemainingFood(requiredFoodAmount, weightPerQuantity, availableFoodQuantity);
  };

  const calculateMedication = () => {
    const requiredDosage = animalData.required_dosage;
    const dosagePerAdmin = extractDosageNumber(animalData.medication.dosage);
    const availableQuantity = animalData.medication.available_quantity;

    console.log("Required Dosage:", requiredDosage);
    console.log("Dosage Per Administration:", dosagePerAdmin);
    console.log("Available Medication Quantity:", availableQuantity);

    return calculateRemainingMedication(requiredDosage, dosagePerAdmin, availableQuantity);
  };

  const handleSubmit = () => {
    let finalQuantities = {
      final_weight_per_quantity: animalData.food?.weight_per_quantity,
      final_food_quantity: animalData.food?.available_quantity,
      final_medication_quantity: animalData.medication?.available_quantity,
    };

    console.log("Initial Final Quantities:", finalQuantities);

    // If food checkbox is checked, perform food calculation
    if (animalData.fed) {
      const foodValues = calculateFood();
      finalQuantities.final_weight_per_quantity = foodValues.final_weight_per_quantity;
      finalQuantities.final_food_quantity = foodValues.final_food_quantity;
      console.log("Updated Final Quantities after Food Calculation:", finalQuantities);
    }

    // If medication checkbox is checked, perform medication calculation
    if (animalData.medicated) {
      const medicationValue = calculateMedication();
      finalQuantities.final_medication_quantity = medicationValue;
      console.log("Updated Final Quantities after Medication Calculation:", finalQuantities);
    }

    // Proceed with PUT request only if the calculations are made
    http.put(`https://8zjp8vpeub.execute-api.us-east-1.amazonaws.com/dev/animal/${id}`, {
      updated_weight_per_quantity: finalQuantities.final_weight_per_quantity,
      updated_food_quantity: finalQuantities.final_food_quantity,
      updated_medication_quantity: finalQuantities.final_medication_quantity
    })
      .then(() => {
        setSuccessMessage("Animal data successfully saved!");
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error("Error updating data:", err);
        setSuccessMessage("Failed to save animal data. Please try again.");
        setOpenSnackbar(true);
      });

    http.put(`https://8zjp8vpeub.execute-api.us-east-1.amazonaws.com/dev/animal/${id}`, {
      fed: animalData.fed,
      medicated: animalData.medicated,
    })
      .then(() => navigate(-1))
      .catch((err) => console.error("Error updating data:", err));
  };

  return (
    <Container maxWidth="xs" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 3, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<Fastfood />} label="Food" />
            <Tab icon={<Medication />} label="Medication" />
            <Tab icon={<Description />} label="Surgery" />
          </Tabs>

          <Box flex={1} overflow="auto" p={2}>
            {tabIndex === 0 && animalData.food && (
              <Box>
                <Typography variant="h6">
                  {animalData.food.name} <Typography variant="body2" component="span">({animalData.food.batch_number})</Typography>
                </Typography>
                <Typography>{animalData.food.description}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Available Quantity: {animalData.food.available_quantity}</Typography>
                <Typography>Batch Expiry: {animalData.food.expiration_date}</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#d32f2f" }} >
                  Required Amount: {animalData.required_food_amount}g
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={animalData.fed}
                      onChange={handleInputChange}
                      name="fed"
                    />
                  }
                  label="Fed the animal"
                />
              </Box>
            )}

            {tabIndex === 1 && animalData.medication && (
              <Box>
                <Typography variant="h6">
                  {animalData.medication.name} <Typography variant="body2" component="span">({animalData.medication.batch_number})</Typography>
                </Typography>
                <Typography>{animalData.medication.description}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Available Quantity: {animalData.medication.available_quantity}</Typography>
                <Typography>Dosage: {animalData.medication.dosage}</Typography>
                <Typography>Batch Expiry: {animalData.medication.expiration_date}</Typography>
                <Typography sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                  Required Dosage: {animalData.required_dosage} {animalData.medication.dosage.replace(/[^a-zA-Z]/g, '')}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={animalData.medicated}
                      onChange={handleInputChange}
                      name="medicated"
                    />
                  }
                  label="Gave medicine"
                />
              </Box>
            )}

            {tabIndex === 2 && (
              <>
                <Typography variant="h6">Surgery Transcript</Typography>
                <Typography variant="body1">{animalData.surgeryTranscript || "No transcript available."}</Typography>
                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                  Upload Audio Transcript
                </Button>
              </>
            )}
          </Box>

          <Grid container justifyContent="center" p={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ borderRadius: 2, width: '100%' }}>
              Save
            </Button>
          </Grid>
        </CardContent>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
      {/* Dialog for recording audio */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Record Surgery Transcript</DialogTitle>
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <DialogContent>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Mic />}
            onClick={startRecording}
            disabled={isRecording}
          >
            Start Recording
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Stop />}
            onClick={stopRecording}
            disabled={!isRecording}
          >
            Stop Recording
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} color="primary">Cancel</Button>
          <Button onClick={handleUpload} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AnimalData;
