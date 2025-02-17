import React, { useEffect, useState } from 'react';
import { Button, Switch, FormControlLabel } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http';
import { fetchAuthSession } from 'aws-amplify/auth';

function RenderButton(props) {
    const { hasFocus, medication, getAllMedications } = props;
    const buttonElement = React.useRef(null);
    const rippleRef = React.useRef(null);
    const [userGroup, setUserGroup] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const checkAuthSession = async () => {
            try {
                const { tokens } = await fetchAuthSession();
                const groups = tokens.accessToken.payload['cognito:groups'];
                setUserGroup(groups ? groups[0] : null);
            } catch (error) {
                console.error('Error fetching the session', error);
            }
        };
        checkAuthSession();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            {(userGroup === "Suppliers" || userGroup === "Admins") && medication.batch_number === "INTAKE" && (
                <Button
                    ref={buttonElement}
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: '#008CBA', marginRight: 10 }}
                    component={Link}
                    to={`/admin/supply-qr/${medication.id}`}
                    state={{ fromMedicationPage: true }}
                >
                    QR
                </Button>
            )}
            {userGroup === "Admins" && (
                <>
                    <Button
                        variant="contained"
                        size="small"
                        style={{ backgroundColor: '#6CA0DC' }}
                        component={Link}
                        to={`/admin/viewmedications/edit/${medication.id}`}
                    >
                        Edit
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
                        <DialogTitle>Delete Medication</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Are you sure you want to delete this medication?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="inherit" onClick={handleClose}>Cancel</Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    http.delete(`https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications/${medication.id}`)
                                        .then(() => {
                                            handleClose();
                                            getAllMedications();
                                        });
                                }}
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
}

function MedicationView() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#496A72' };
    const [medicationList, setMedicationList] = useState([]);
    const [userGroup, setUserGroup] = useState(null);
    const [showIntakeOnly, setShowIntakeOnly] = useState(false);

    useEffect(() => {
        const checkAuthSession = async () => {
            try {
                const { tokens } = await fetchAuthSession();
                const groups = tokens.accessToken.payload['cognito:groups'];
                setUserGroup(groups ? groups[0] : null);
            } catch (error) {
                console.error('Error fetching the session', error);
            }
        };
        checkAuthSession();
    }, []);

    const getAllMedications = () => {
        http.get('https://z40lajab6h.execute-api.us-east-1.amazonaws.com/dev/medications').then((res) => {
            setMedicationList(res.data);
        });
    };

    useEffect(() => {
        getAllMedications();
    }, []);

    const filteredRows = medicationList.filter(medication => showIntakeOnly ? medication.batch_number !== "INTAKE" : medication.batch_number === "INTAKE");

    const rows = filteredRows.map((medication) => ({
        id: medication.medication_ID,
        name: medication.name,
        batch_number: medication.batch_number,
        expiration_date: medication.expiration_date,
        available_quantity: medication.available_quantity,
        dosage: medication.dosage,
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'batch_number', headerName: 'Batch No.', width: 100 },
        { field: 'expiration_date', headerName: 'Expiry Date', width: 150 },
        { field: 'available_quantity', headerName: 'Quantity Per Batch', width: 180 },
        { field: 'dosage', headerName: 'Dosage', width: 150 },
        { field: 'action', headerName: 'Actions', width: 300, renderCell: (params) => <RenderButton medication={params.row} getAllMedications={getAllMedications} /> },
    ];

    return (
        <>
            {userGroup === "Admins" && (
                <>
                    <Button variant='contained' style={{ ...btnstyle, marginRight: '20px' }} component={Link} to={`/admin/addmedication`}>New Medication</Button>
                    <FormControlLabel
                        control={<Switch checked={showIntakeOnly} onChange={() => setShowIntakeOnly(prev => !prev)} />}
                        label="Show Batches"
                        style={{ marginLeft: '5px' }}
                    />
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
    );
}

export default MedicationView;