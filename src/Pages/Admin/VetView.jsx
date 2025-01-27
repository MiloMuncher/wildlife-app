import React, { useEffect, useState, useContext } from 'react'
import { Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http'

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
                ref={buttonElement}
                variant="contained"
                size="small"
                style={{ backgroundColor: '#6CA0DC' }}
                LinkComponent={Link} to={`/admin/editvet/${user.id}`}
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
                    Delete User
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => {
                            http.delete(`/AdminUser/${user.id}`).then((res) => {
                                console.log(res.data)
                                handleClose()
                                getUsers();
                            });
                        }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </>


    );
}
function MerchantView() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };

    const [userList, setUserList] = useState([]);

    const rows = userList.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.contact,
        companyId: user.companyId
    }));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 100 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'companyId', headerName: 'Company ID', width: 150 },
        { field: 'action', headerName: 'Actions', width: 200, renderCell: (params) => <RenderButton user={params.row} getUsers={getUsers} /> },
    ];

    const getUsers = () => {
        http.get(`/AdminUser/allmerchants`).then((res) => {
            setUserList(res.data);
            console.log(res.data)
        });
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <Button variant='contained' style={btnstyle} LinkComponent={Link} to={`/admin/addmerchant`}>Add Merchant</Button>
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

export default MerchantView