import React, { useEffect, useState, useContext } from 'react'
import { Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http';
import { fetchAuthSession } from 'aws-amplify/auth';

function RenderButton(props) {
    const { hasFocus, value, food, getAllFood} = props;
    const buttonElement = React.useRef(null);
    const rippleRef = React.useRef(null);
    const [id, setId] = useState(null)

    const [userGroup, setUserGroup] = useState(null);

    useEffect(() => {
        const checkAuthSession = async () => {
            try {
                const { tokens } = await fetchAuthSession();
                const groups = tokens.accessToken.payload['cognito:groups'];
                console.log(tokens)
                console.log(groups);
                setUserGroup(groups ? groups[0] : null); // Assuming the user belongs to a single group
            } catch (error) {
                console.error('Error fetching the session', error);
            }
        };

        checkAuthSession();
    }, []);

    React.useLayoutEffect(() => {
        if (hasFocus) {
            const input = buttonElement.current?.querySelector('input');
            input?.focus();
        } else if (rippleRef.current) {
            rippleRef.current.stop({});
        }
    }, [hasFocus]);

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>

            {(userGroup === "Suppliers" || userGroup==="Admins") && (
                <Button
                    ref={buttonElement}
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: '#008CBA', marginRight: 10 }}
                    component={Link}
                    to={`/admin/supply-qr/${food.id}`}
                    state={{ fromFoodPage: true }}
                >
                    QR
                </Button>
            )}

            {userGroup === "Admins" && (
                <>
                    <Button
                        ref={buttonElement}
                        variant="contained"
                        size="small"
                        style={{ backgroundColor: '#6CA0DC' }}
                        LinkComponent={Link} to={`/admin/viewusers/edit/${food.id}`}
                    >
                        Edit
                    </Button>

                    <Button
                        ref={buttonElement}
                        variant="contained"
                        size="small"
                        style={{ marginLeft: 16, backgroundColor: '#C70000' }}
                        onClick={handleOpen}
                    >
                        Delete
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>
                            Delete Medication
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this medication?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="inherit"
                                onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="error"
                                onClick={() => {
                                    http.delete(`https://kvhdoqjcua.execute-api.us-east-1.amazonaws.com/dev/food/${food.id}`).then((res) => {
                                        console.log(res.data)
                                        handleClose()
                                        getMedications();
                                    });
                                }}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

        </>


    );
}

function FoodView() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#496A72' };
    const [foodList, setFoodList] = useState([]);
    const [userGroup, setUserGroup] = useState(null); 

    const rows = foodList.map((food) => ({
        id: food.food_ID,
        name: food.name,
        description: food.description,
        expiration_date: food.expiration_date,
        available_quantity: food.available_quantity,
        batch_number: food.batch_number,
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'expiration_date', headerName: 'Expiry Date', width: 120 },
        { field: 'available_quantity', headerName: 'Quantity', width: 100 },
        { field: 'batch_number', headerName: 'Batch No.', width: 120 },
        { field: 'action', headerName: 'Actions', width: 300, renderCell: (params) => <RenderButton food={params.row} getAllFood={getAllFood} /> },
    ];


    const getAllFood = () => {
        http.get(`https://kvhdoqjcua.execute-api.us-east-1.amazonaws.com/dev/food`).then((res) => {
            console.log(res.data);
            setFoodList(res.data);
        });
    };

    useEffect(() => {
        getAllFood();
    }, []);

    return (
        <>
            {userGroup === "Admins" && (
                <> 
                    <Button variant='contained' style={btnstyle} LinkComponent={Link} to={`/admin/addfood`}>New Food Variety</Button>
                </>
            )}
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

export default FoodView