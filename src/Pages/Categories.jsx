import { React, useRef, useState, useEffect } from 'react'
import { Grid, Paper, Typography, TextField, Button, Box, Container, Card, CardContent } from '@mui/material'
import { Link } from 'react-router-dom'
import http from '../http.js';

// import icons
import SearchIcon from '@mui/icons-material/Search';

function Categories() {
  //function

  //style
  const paperStyle = { padding: 20, width: '60%', marginTop: 30, borderRadius: 10 }
  const searchbtnstyle = { backgroundColor: '#FF4E00', color: 'white', borderRadius: 17, alignItems: 'center', margin: 'auto', width: '30%', height: 50, marginLeft: '40px' }
  const btnstyle = { backgroundColor: 'btn', fontWeight: 'bold', color: 'white', marginLeft: '10px' }

  // Separate refs for each category
  const dineRef = useRef(null);
  const familyRef = useRef(null);
  const sportsRef = useRef(null);
  const hobbiesRef = useRef(null);
  const travelRef = useRef(null);

  const handleClick = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [eventList, setEventList] = useState([]);
  useEffect(() => {
    http.get('/Event').then((res) => {
      setEventList(res.data);
      console.log(res.data)
    })
  }, [])

  return (
    <Container maxWidth='xl'>
      <Grid align={'center'}>
        <Paper style={paperStyle}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              name='search'
              label="Search"
              variant="standard"
              fullWidth
            />
            <Button variant="contained" endIcon={<SearchIcon />}
              style={searchbtnstyle}>
              Search </Button>
          </Box>
        </Paper>
      </Grid>

      <Box sx={{ flexGrow: 1 }} display={'flex'} justifyContent='center' marginTop={3} >
        <Button variant='contained' color='btn' style={btnstyle} onClick={() => handleClick(dineRef)}>Dine & Wine</Button>
        <Button variant='contained' color='btn' style={btnstyle} onClick={() => handleClick(familyRef)}>Family bonding</Button>
        <Button variant='contained' color='btn' style={btnstyle} onClick={() => handleClick(sportsRef)}>Sports & Adventure</Button>
        <Button variant='contained' color='btn' style={btnstyle} onClick={() => handleClick(hobbiesRef)}>Hobbies & Wellness</Button>
        <Button variant='contained' color='btn' style={btnstyle} onClick={() => handleClick(travelRef)}>Travel</Button>
      </Box>

      <Box>
        <div ref={dineRef}>
          <Typography variant='h6' align='left' style={{ marginTop: '50px', fontWeight: 'bold', fontSize: '30px' }}>
            Dine & Wine
          </Typography>
        </div>


        <Grid container spacing={3}>
          {eventList
            .filter((event) => event.category == 'Dine & Wine')
            .map((event) =>
              <Grid item xs={12} md={6} xl={4}>

                <Card elevation={5} style={paperStyle}>
                  <CardContent>
                    <Box component="img" width="100%"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                      alt="car image">
                    </Box>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </Typography>
                    <Box display={'flex'}>
                      <Typography style={{ flexGrow: 1 }}>
                        ${event.price}
                      </Typography>
                      <Link to={`/description/${event.id}`}>
                        <Button variant='contained' color='btn' style={btnstyle}>View More</Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
        </Grid>

        <div ref={familyRef}>
          <Typography variant='h6' align='left' style={{ marginTop: '50px', fontWeight: 'bold', fontSize: '30px' }} >
            Family bonding
          </Typography>
        </div>

        <Grid container spacing={3}>
          {eventList
            .filter((event) => event.category == 'Family Bonding')
            .map((event) =>
              <Grid item xs={12} md={6} xl={4}>

                <Card elevation={5} style={paperStyle}>
                  <CardContent>
                    <Box component="img" width="100%"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                      alt="car image">
                    </Box>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </Typography>
                    <Box display={'flex'}>
                      <Typography style={{ flexGrow: 1 }}>
                        ${event.price}
                      </Typography>
                      <Link to={`/description/${event.id}`}>
                        <Button variant='contained' color='btn' style={btnstyle}>View More</Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
        </Grid>

        <div ref={sportsRef}>
          <Typography variant='h6' align='left' style={{ marginTop: '50px', fontWeight: 'bold', fontSize: '30px' }}>
            Sports & Adventure
          </Typography>
        </div>

        <Grid container spacing={3}>
          {eventList
            .filter((event) => event.category == 'Sports & Adventure')
            .map((event) =>
              <Grid item xs={12} md={6} xl={4}>

                <Card elevation={5} style={paperStyle}>
                  <CardContent>
                    <Box component="img" width="100%"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                      alt="car image">
                    </Box>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </Typography>
                    <Box display={'flex'}>
                      <Typography style={{ flexGrow: 1 }}>
                        ${event.price}
                      </Typography>
                      <Link to={`/description/${event.id}`}>
                        <Button variant='contained' color='btn' style={btnstyle}>View More</Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
        </Grid>

        <div ref={hobbiesRef}>
          <Typography variant='h6' align='left' style={{ marginTop: '50px', fontWeight: 'bold', fontSize: '30px' }} >
            Hobbies & Wellness
          </Typography>
        </div>

        <Grid container spacing={3}>
          {eventList
            .filter((event) => event.category == 'Hobbies & Wellness')
            .map((event) =>
              <Grid item xs={12} md={6} xl={4}>

                <Card elevation={5} style={paperStyle}>
                  <CardContent>
                    <Box component="img" width="100%"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                      alt="car image">
                    </Box>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </Typography>
                    <Box display={'flex'}>
                      <Typography style={{ flexGrow: 1 }}>
                        ${event.price}
                      </Typography>
                      <Link to={`/description/${event.id}`}>
                        <Button variant='contained' color='btn' style={btnstyle}>View More</Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
        </Grid>

        <div ref={travelRef}>
          <Typography variant='h6' align='left' style={{ marginTop: '50px', fontWeight: 'bold', fontSize: '30px' }} >
            Travel
          </Typography>
        </div>

        <Grid container spacing={3}>
          {eventList
            .filter((event) => event.category == 'Travel')
            .map((event) =>
              <Grid item xs={12} md={6} xl={4}>

                <Card elevation={5} style={paperStyle}>
                  <CardContent>
                    <Box component="img" width="100%"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                      alt="car image">
                    </Box>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                    <Typography style={{ fontWeight: 'bold' }}>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </Typography>
                    <Box display={'flex'}>
                      <Typography style={{ flexGrow: 1 }}>
                        ${event.price}
                      </Typography>
                      <Link to={`/description/${event.id}`}>
                        <Button variant='contained' color='btn' style={btnstyle}>View More</Button>
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
        </Grid>

      </Box>

    </Container>
  )
}

export default Categories