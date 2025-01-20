import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http'

function RenderButton(props) {
    const { ticket } = props;
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleCompleteBooking = () => {
        http.put(`/Ticket/${ticket.id}`)
            .then((res) => {
                console.log(res.data)
            })
    }

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
            {
                ticket.status == "Open" && (
                    <Button
                        variant="contained"
                        size="small"
                        style={{ marginLeft: 16, backgroundColor: '#228B22' }}
                        onClick={handleCompleteBooking}
                    >
                        Complete
                    </Button>
                )
            }


            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Ticket
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Ticket?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => {
                            http.delete(`/Ticket/${ticket.id}`).then((res) => {
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

function CustomerServiceTickets() {
    const [ticketList, setTicketList] = useState([]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 100 },
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'title', headerName: 'Title', width: 100 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'category', headerName: 'Category', width: 100 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'action', headerName: 'Actions', width: 200, renderCell: (params) => <RenderButton ticket={params.row} /> },

    ];

    const rows = ticketList.map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        status: ticket.status,
    }));

    const getTickets = () => {
        http.get(`/Ticket/all`).then((res) => {
            setTicketList(res.data);
        });
    };

    useEffect(() => {
        getTickets();
    }, [ticketList]);


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

export default CustomerServiceTickets