import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Chatbot({ setShowChatbot }) { 
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
       
        setMessages([{ text: "Hello! Welcome to Uplay by NTUC. How may I help you?", sender: 'bot', style: { color: 'white', fontSize: '14px' } }]);
    }, []);

    const handleMessageSend = () => {
        if (inputValue.trim() !== '') {
          
            const newUserMessage = { text: inputValue, sender: 'user' };
           
            setMessages(prevMessages => [...prevMessages, newUserMessage]);
            
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { text: generateResponse(inputValue), sender: 'bot' }]);
            }, 500);
            
            setInputValue('');
        }
    };

    const generateResponse = (message) => {
        
        const lowercaseMessage = message.toLowerCase();
    
        if (lowercaseMessage.includes('login') || lowercaseMessage.includes('logging')){
            return "I am sorry to hear that. Have you checked that the credentials are correct?";
        }

        if (lowercaseMessage.includes('payment')){
            return "I am sorry to hear that. Have you tried using another card?"
        }
       
         else if (lowercaseMessage.includes('enquiry') || lowercaseMessage.includes('help') 
        || lowercaseMessage.includes('problem') || lowercaseMessage.includes('yes')) {
            return (
                <span>
                    Unfortunately, I am unable to help. You can 
                    <a href="http://localhost:5173/contactus/raisedrequest" target="_blank" rel="noopener noreferrer"> click here </a> 
                    to send us an enquiry regarding this issue.
                </span>
            );
            

        } else {
            return "I'm not sure how to respond to that.";
        }
    };
    

    return (
        <div style={{ 
            backgroundColor: '#484752',
            width: '400px',
            height: '550px',
            overflow: 'hidden',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999',
            display: 'flex',
            flexDirection: 'column',
        }}>
             {/* Close button */}
    <div style={{ 
        position: 'absolute',
        top: '20px',
        right: '20px',
        cursor: 'pointer',
        color: 'white',
        zIndex: '1000', // Ensure the button is above other elements
    }} onClick={() => setShowChatbot(false)}>
        <CloseIcon style={{ width: '24px', height: '24px' }} />
    </div>
            {/* Chat interface */}
            <div style={{ 
                flex: 1, // Grow to fill available space
                overflowY: 'auto',
                padding: '20px',
            }}>
                {/* Bot name */}
                <div style={{ 
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    color: 'white'
                }}>
                    Annie
                </div>
                {/* Chat messages */}
                <Box style={{ 
                    overflowY: 'auto',
                    padding: '10px',
                    borderRadius: '10px'
                   
                }}>
                     <Divider sx={{ backgroundColor: 'black' }} />
                    {messages.map((message, index) => (
                        <Box key={index} display="flex" alignItems="center" justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}>
                            {message.sender === 'bot' && (
                                <img src="../images/ContactUsLogo2.png" alt="Chatbot Icon" style={{ width: '24px', height: '24px', marginRight: '5px' }} /> // Your custom chatbot icon
                            )}
                            <Typography
                                variant="body1"
                                className={`message ${message.sender}`}
                                style={{
                                    color: 'white',
                                    backgroundColor: message.sender === 'user' ? '#40A2E3' : 'transparent',
                                    borderRadius: message.sender === 'user' ? '0 10px 10px 10px' : '10px 10px 10px 0',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    marginLeft: message.sender === 'bot' ? '10px' : '0',
                                    marginRight: message.sender === 'user' ? '5px' : '0', 
                                    textAlign: message.sender === 'user' ? 'right' : 'left',
                                    maxWidth: '70%', 
                                    fontSize: '14px',
                                }}
                            >
                                {message.text}
                            </Typography>
                            {message.sender === 'user' && (
                                <AccountCircleIcon style={{ width: '24px', height: '24px', marginLeft: '5px' }} /> // Your custom user icon
                            )}
                        </Box>
                    ))}
                </Box>
            </div>
            {/* User input */}
            <Box mt={2} style={{ padding: '20px', backgroundColor: '#484752' }}>
                <TextField
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    variant="outlined"
                    placeholder="Type your message..."
                    fullWidth
                    inputProps={{
                        style: { fontSize: '14px', color: 'white' }, 
                    }}
                    InputProps={{
                        style: { borderColor: 'white' }, 
                    }}
                />
                {/* Send button */}
                <Box mt={2} textAlign="right">
                    <Button variant="contained" color="primary" onClick={handleMessageSend}>
                        Send
                    </Button>
                </Box>
            </Box>
        </div>

        
        
          
    );
}

export default Chatbot;