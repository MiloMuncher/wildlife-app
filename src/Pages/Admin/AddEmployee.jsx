import React, { useEffect, useState } from 'react';
import { Container, Box, Paper, Grid, Typography, Button, TextField, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import http from '../../http.js';

function AddEmployee() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };
    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUserGroups = async () => {
        setLoading(true);
        try {
            const response = await http.get('https://axkrc2z804.execute-api.us-east-1.amazonaws.com/dev/user-groups');
            console.log('User Groups:', response);
            setUserGroups(response.data.groups); // Assuming response is an array of groups
        } catch (error) {
            console.error('Error fetching user groups:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserGroups();
    }, []);

    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            fname: '',
            lname: '',
            email: '',
            phone_number: '',
            job_title: '',
            hourly_rate: '',
            userGroup: '', // New field for the group selection
        },
        validationSchema: yup.object({
            fname: yup.string().trim().min(2).max(50).required('First name is required'),
            lname: yup.string().trim().min(2).max(50).required('Last name is required'),
            email: yup.string().email('Invalid email address').required('Email is required'),
            phone_number: yup.string().matches(/^[689]\d{7}$/, 'Invalid phone number').required('Phone number is required'),
            job_title: yup.string().trim().max(50),
            hourly_rate: yup.number().typeError('Hourly rate must be a number').positive('Hourly rate must be positive').required('Hourly rate is required'),
            userGroup: yup.string().nullable()
        }),
        onSubmit: async (data) => {
            try {
                // Send employee data to the backend
                const res = await http.post(
                    'https://v9c358horj.execute-api.us-east-1.amazonaws.com/dev/employees',
                    data
                );
        
                console.log('Employee created:', res.data);
        
                // Add user to the selected Cognito group
                if (data.userGroup) {
                    await http.post(
                        'https://axkrc2z804.execute-api.us-east-1.amazonaws.com/dev/add-to-group',
                        {
                            email: data.email,
                            group_name: data.userGroup
                        }
                    ).then(response => {
                        console.log('User added to group:', response.data);
                    }).catch(error => {
                        console.error('Error adding user to group:', error.response || error.message);
                    });
                    
                }
        
                console.log('User added to group successfully');
        
                // Navigate to another page after successful onboarding
                navigate("/admin/viewusers");
            } catch (error) {
                console.error('Error onboarding employee:', error);
            }
        }
        
    });

    return (
        <Container maxWidth="x1">
            <Typography variant="h6">
                Onboard Employee
            </Typography>
            <Card>
                <CardContent>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} direction="column">
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="fname"
                                    onChange={formik.handleChange}
                                    value={formik.values.fname}
                                    error={formik.touched.fname && Boolean(formik.errors.fname)}
                                    helperText={formik.touched.fname && formik.errors.fname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lname"
                                    onChange={formik.handleChange}
                                    value={formik.values.lname}
                                    error={formik.touched.lname && Boolean(formik.errors.lname)}
                                    helperText={formik.touched.lname && formik.errors.lname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone_number"
                                    onChange={formik.handleChange}
                                    value={formik.values.phone_number}
                                    error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                                    helperText={formik.touched.phone_number && formik.errors.phone_number}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Job Title"
                                    name="job_title"
                                    onChange={formik.handleChange}
                                    value={formik.values.job_title}
                                    error={formik.touched.job_title && Boolean(formik.errors.job_title)}
                                    helperText={formik.touched.job_title && formik.errors.job_title}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Hourly Rate"
                                    name="hourly_rate"
                                    type="number"
                                    onChange={formik.handleChange}
                                    value={formik.values.hourly_rate}
                                    error={formik.touched.hourly_rate && Boolean(formik.errors.hourly_rate)}
                                    helperText={formik.touched.hourly_rate && formik.errors.hourly_rate}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={formik.touched.userGroup && Boolean(formik.errors.userGroup)}>
                                    <InputLabel>Assign User Group</InputLabel>
                                    <Select
                                        name="userGroup"
                                        value={formik.values.userGroup}
                                        onChange={formik.handleChange}
                                        label="Select User Group"
                                    >
                                        {userGroups.map((group) => (
                                            <MenuItem key={group} value={group}>
                                                {group}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.userGroup && formik.errors.userGroup && (
                                        <Typography variant="body2" color="error">
                                            {formik.errors.userGroup}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" style={btnstyle}>
                            Onboard
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default AddEmployee;
