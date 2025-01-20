import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router-dom'

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#000000',
    },
    btn: {
      main: '#FF4E00',
    },
    btnBlack: {
      main: '#000000',
    },
    btnWhite: {
      main: '#FFFFFF',
    },
    btnGreen: {
      main: '#70B01F',
    },
    btnYellow: {
      main: '#F7A506',
    },
    

  },
  
  typography: {
    fontFamily: [
      'Montserrat',
      'sans-serif',
    ].join(','),
  },
})

  ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>

  )
