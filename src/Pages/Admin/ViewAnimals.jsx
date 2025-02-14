import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http'

function RenderButton(props) {
    const { animal } = props;
    const buttonElement = React.useRef(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    };

    return (
        <>
            <Button
                ref={buttonElement}
                variant="contained"
                size="small"
                style={{ backgroundColor: '#6CA0DC' }}
                LinkComponent={Link} to={`/admin/viewanimals/edit/${animal.id}`}
            >
                Edit Animal
            </Button>

            <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 16, backgroundColor: '#C70000' }}
                onClick={handleOpen}
            >
                Delete
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Animal
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Animal?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => {
                            http.delete(`https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD/animals?animal_id=${animal.id}`).then((res) => {
                                console.log(res.data)
                                handleClose()
                            });
                        }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function ViewAnimals() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };
    const [animalList, setAnimalList] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'species', headerName: 'Species', width: 100 },
        { field: 'weight', headerName: 'Weight (kg)', width: 100 },
        { field: 'current_health_status', headerName: 'Current Health Status', width: 100 },
        { field: 'outcome_type', headerName: 'Outcome Type', width: 140 },
        { field: 'required_food_amount', headerName: 'Required Food Amount', width: 100 },
        { field: 'action', headerName: 'Actions', width: 200, renderCell: (params) => <RenderButton animal={params.row} /> },
    ];

    const rows = animalList.map((animal) => ({
        id: animal.animal_id,
        species: animal.species,
        weight: animal.weight,
        date_of_rescue: animal.date_of_rescue,
        initial_condition: animal.initial_condition,
        current_health_status: animal.current_health_status,
        outcome_type: animal.outcome_type,
        required_food_amount: animal.required_food_amount,
    }));

    const getAnimals = () => {
        http.get(`https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`).then((res) => {
            console.log("Data: ",res.data);
            setAnimalList(res.data);
        });
    };

    useEffect(() => {
        getAnimals();
    }, []);

    return (
        <>
            <Button variant='contained' style={btnstyle} LinkComponent={Link} to={`/admin/addanimal`}>Add Animal Rescue</Button>
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
                    checkboxSelection
                    sx={{ height: 500 }}
                />
            </div>
        </>
    )
}

export default ViewAnimals
