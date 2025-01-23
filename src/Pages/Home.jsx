import React from 'react'
import { Background, Parallax } from 'react-parallax';
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent } from '@mui/material'
import { min } from '@floating-ui/utils';



function Home() {
    return (
        <div>  
            <Parallax bgImage="src\images\background.png" strength={300}>
                <div className='content' >
                    <div className='content-text'>
                        <Typography variant="h4" style={{ fontWeight: "bold", fontSize: '50px', color: '#FAF6E3' }}>
                            Rescuing and rehabilitating wildlife for a better tomorrow.
                        </Typography>

                    </div>
                </div>
            </Parallax>
        </div>
    )
}

export default Home