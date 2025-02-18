import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http';

function RenderButton(props) {
    const { hasFocus, value, user, getUsers } = props;
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
                LinkComponent={Link} to={`/admin/viewpayroll/edit/${user.id}`}
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
                    Delete Payroll Entry
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this payroll entry?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained" color="error"
                        onClick={() => {
                            http.delete(`https://kvhdoqjcua.execute-api.us-east-1.amazonaws.com/dev/payroll/${user.id}`).then((res) => {
                                console.log(res.data);
                                handleClose();
                                getUsers();
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

function PayrollView() {
    // const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#496A72' };
    const [payrollList, setPayrollList] = useState([]);

    const rows = payrollList.map((payroll) => ({
        id: payroll.payroll_ID,
        employee_id: payroll.employee_ID,
        name: `${payroll.fname} ${payroll.lname}`, 
        payroll_month: payroll.payroll_month,
        total_hours: payroll.total_hours,
        amount_processed: payroll.payroll_processed ? `$${payroll.payroll_processed.toFixed(2)}` : 'N/A',
        payroll_processed: payroll.payroll_processed ? 'Yes' : 'No',  // Convert boolean to Yes/No for readability
    }));

    const columns = [
        { field: 'id', headerName: 'Payroll ID', width: 100 },
        { field: 'employee_id', headerName: 'Employee ID', width: 120 },
        { field: 'name', headerName: 'Name', width: 180 },
        { field: 'payroll_month', headerName: 'Month', width: 120 },
        { field: 'total_hours', headerName: 'Total Hours', width: 120 },
        { field: "amount_processed", headerName: 'Amount Processed', width: 180},
        { field: 'payroll_processed', headerName: 'Processed', width: 180 },
    ];

    const getAllPayroll = () => {
        http.get(`https://v9c358horj.execute-api.us-east-1.amazonaws.com/dev/payroll`).then((res) => {
            console.log(res.data);
            setPayrollList(res.data);
            console.log(payrollList)
        });
    };

    useEffect(() => {
        getAllPayroll();
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
    );
}

export default PayrollView;
