import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http'

function RenderButton(props) {
    const { event, getEvents } = props;
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
            <Button
                variant="contained"
                size="small"
                style={{ backgroundColor: '#C70000' }}
                onClick={handleOpen}
            >
                Delete
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Event
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => {
                            http.delete(`/Event/Admin/${event.id}`).then((res) => {
                                console.log(res.data)
                                handleClose()
                                getEvents()
                            });
                        }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function Events() {
    const [eventList, setEventList] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Title', width: 200 },
        { field: 'category', headerName: 'Category', width: 250 },
        { field: 'startDate', headerName: 'Start Date', width: 150 },
        { field: 'endDate', headerName: 'End Date', width: 150 },
        { field: 'companyId', headerName: 'Created By', width: 100 },
        { field: 'action', headerName: 'Actions', width: 100, renderCell: (params) => <RenderButton event={params.row} getEvents={getEvents} /> },

    ];

    const rows = eventList.map((event) => ({
        id: event.id,
        name: event.title,
        category: event.category,
        startDate: new Date(event.startDate).toLocaleDateString(),
        endDate: new Date(event.endDate).toLocaleDateString(),
        companyId: event.user.companyId
    }));

    const getEvents = () => {
        http.get(`/Event`).then((res) => {
            console.log(res.data)
            setEventList(res.data);
        });
    };

    useEffect(() => {
        getEvents();
    }, []);

    return (
        <>
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

export default Events