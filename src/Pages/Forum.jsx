import React, { useState, useEffect, useContext } from 'react'
import { Container, Box, Paper, Grid, Typography, Button, Divider, Card, CardContent } from '@mui/material'
import { MarginTwoTone } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import http from '../http.js';
import UserContext from '../contexts/UserContext.js';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Forum() {
    const btnstyle = { backgroundColor: 'btn', fontWeight: 'bold', color: 'white', marginLeft: 50 }

    const [role, setRole] = useState('');
    const { user } = useContext(UserContext);

    const [postList, setPostList] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    useEffect(() => {
        http.get(`/Post/All/?role=${role}`).then((res) => {
            setPostList(res.data);
            console.log(res.data)
        })
    }, [role, likedPosts])

    useEffect(() => {
        http.get('/Post/Liked').then((res) => {
            const likedPostIds = res.data.map(post => post.id);
            setLikedPosts(likedPostIds);
        });
    }, []);


    const handleLike = async (postId) => {
        try {
            await http.post(`/Post/Like/${postId}`);
            if (likedPosts.includes(postId)) {
                const updatedLikedPosts = likedPosts.filter(id => id !== postId);
                setLikedPosts(updatedLikedPosts);
            } else {
                setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleClick = (clickedRole) => {
        setRole(clickedRole)
    };
    return (
        <Container maxWidth="x1">
            <Box style={{ backgroundColor: '#DBDBDB', backgroundSize: 'cover', borderRadius: 15, maxWidth: 1200, height: 500, margin: '50px auto' }} display={'flex'} flexDirection={'column'}>
                <Grid container spacing={0} marginTop={5} justifyContent={"space-between"}>
                    <Grid item xs={12} md={5} marginLeft={10} justifyContent={'center'}>
                        <Typography variant="h5" style={{ fontWeight: "bold", textAlign: 'left', fontSize: 45 }}>
                            Join In On The Discussions
                            In The Community
                        </Typography>
                        <Typography variant="h7" style={{ color: "black", textAlign: 'left', fontSize: 24, marginTop: 10 }}>
                            Search for relevant topics that you may enjoy, you can also find out official forums from UPlay to aid any troubles you may have.
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20, paddingLeft: 20, paddingRight: 20, color: "black" }}>
                        </Typography> {/* paddingbottom for button (temporary) */}
                        {!user && (
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="btnGreen" style={{ marginRight: 'auto', display: 'block', fontWeight: "bold", color: 'white', padding: 15 }}>
                                    Start your own Discussion
                                </Button>
                            </Link>
                        )}
                        {user && (
                            <Link to="/addpost" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="btnGreen" style={{ marginRight: 'auto', display: 'block', fontWeight: "bold", color: 'white', padding: 15 }}>
                                    Start your own Discussion
                                </Button>
                            </Link>
                        )}
                    </Grid>
                    <Grid item xs={12} md={4} marginRight={10}>
                        <img src="../images/calender.png" style={{ width: '100%', borderRadius: '10px' }} />
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ flexGrow: 1 }} display={'flex'} justifyContent='center' >

                <Button variant='contained' color='btn' style={btnstyle} onClick={() => handleClick('')}>All</Button>


                <Button variant='contained' color='btn' style={btnstyle} onClick={() => handleClick('Customer')}>Community Posts</Button>


                <Button variant='contained' color='btn' style={btnstyle} onClick={() => handleClick('Admin')}>Official Posts</Button>

            </Box>
            <Box style={{ backgroundSize: 'cover', borderRadius: 15, maxWidth: 1200, margin: '50px auto' }} display={'flex'} flexDirection={'column'}>
                <Grid container spacing={3} marginTop={5} direction={'column'}>
                    {
                        postList.map((post) =>
                            <>
                                <Grid item xs={12} md={12}>
                                    <Paper style={{ padding: 15 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={10}>
                                                <Link to={`/forum/viewpost/${post.id}`} style={{ textDecoration: 'none' }}>
                                                    <Typography variant="h5" style={{ fontWeight: 'bold', fontSize: 25 }}>
                                                        {post.title}
                                                    </Typography>
                                                </Link>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Box style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Button onClick={() => handleLike(post.id)}>
                                                        {likedPosts.includes(post.id) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                                    </Button>                                                    
                                                    <Typography variant='h6' style={{ marginLeft: '10px' }}>
                                                        {post.likes}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Typography variant="h7" style={{ color: "black", textAlign: 'left', fontSize: 15, marginTop: 10 }}>
                                            Posted By: {post.user.name}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </>
                        )
                    }
                </Grid>
            </Box>

        </Container>
    )
}
export default Forum