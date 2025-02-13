import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http';

function RenderButton(props) {
    const { hasFocus, value, medication, getMedications } = props;
    const buttonElement = React.useRef(null);
    const rippleRef = React.useRef(null);

    React.useLayoutEffect(() => {
        if (hasFocus) {
            const input = buttonElement.current?.querySelector('input');
            input?.focus();
        } else if (rippleRef.current) {
            rippleRef.current.stop({});
        }
    }, [hasFocus]);

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                ref={buttonElement}
                variant="contained"
                size="small"
                style={{ backgroundColor: '#6CA0DC' }}
                LinkComponent={Link} to={`/admin/viewmedications/edit/${medication.id}`}
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
                            http.delete(`https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications/${medication.id}`).then((res) => {
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
    );
}

function MedicationView() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#496A72' };
    const [medicationList, setMedicationList] = useState([]);

    const rows = medicationList.map((medication) => ({
        id: medication.medication_ID, // Updated ID field
        name: medication.name, // Adjusted to match the medication data structure
        batch_number: medication.batch_number, // Added batch_number field
        expiration_date: medication.expiration_date, // Added expiration_date field
        available_quantity: medication.available_quantity // Added available_quantity field
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'batch_number', headerName: 'Batch Number', width: 150 }, // Added Batch Number column
        { field: 'expiration_date', headerName: 'Expiration Date', width: 150 }, // Added Expiration Date column
        { field: 'available_quantity', headerName: 'Available Quantity', width: 180 }, // Added Available Quantity column
        { field: 'action', headerName: 'Actions', width: 200, renderCell: (params) => <RenderButton medication={params.row} getMedications={getMedications} /> },
    ];

    const getMedications = () => {
        http.get(`https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications`).then((res) => {
            setMedicationList(res.data);
        });
    };

    useEffect(() => {
        getMedications();
    }, []);

    return (
        <>
            <Button variant='contained' style={btnstyle} LinkComponent={Link} to={`/admin/addemployee`}>New Medication</Button>
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
    );
}

export default MedicationView;
