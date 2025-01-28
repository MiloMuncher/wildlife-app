import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http';

function RenderButton(props) {
    const { hasFocus, value, user, getShifts } = props;
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
            {/* <Button
                ref={buttonElement}
                variant="contained"
                size="small"
                style={{ backgroundColor: '#6CA0DC' }}
                LinkComponent={Link} to={`/admin/viewshifts/edit/${user.id}`}
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
                    Delete Shift
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this shift?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained" color="error"
                        onClick={() => {
                            http.delete(`https://kvhdoqjcua.execute-api.us-east-1.amazonaws.com/dev/shifts/${user.id}`).then((res) => {
                                console.log(res.data);
                                handleClose();
                                getShifts();
                            });
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
}

function ShiftView() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#496A72' };
    const [shiftList, setShiftList] = useState([]);

    const rows = shiftList.map((shift) => ({
        id: shift.schedule_ID,
        employee_id: shift.employee_ID,
        name: `${shift.fname} ${shift.lname}`,
        date: shift.date,
        shift_start: shift.shift_start,
        shift_duration: shift.shift_duration,
    }));

    const columns = [
        { field: 'id', headerName: 'Schedule ID', width: 120 },
        { field: 'employee_id', headerName: 'Employee ID', width: 120 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'shift_start', headerName: 'Shift Start', width: 150 },
        { field: 'shift_duration', headerName: 'Duration (hrs)', width: 130 },
        // { field: 'action', headerName: 'Actions', width: 200, renderCell: (params) => <RenderButton user={params.row} getShifts={getAllShifts} /> },
    ];

    const getAllShifts = () => {
        http.get(`https://v9c358horj.execute-api.us-east-1.amazonaws.com/dev/shifts`).then((res) => {
            console.log(res.data);
            setShiftList(res.data);
        });
    };

    useEffect(() => {
        getAllShifts();
    }, []);

    return (
        <>
            <Button variant='contained' style={btnstyle} LinkComponent={Link} to={`/admin/addshift`}>New Shift</Button>
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

export default ShiftView;
