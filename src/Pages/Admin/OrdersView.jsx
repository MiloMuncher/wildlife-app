import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http'

function RenderButton(props) {
    const { hasFocus, value, order } = props;
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
                LinkComponent={Link} to={`/admin/orderitems/${order.id}`}
            >
                View Items
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
                    Delete Order
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this order?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => {
                            http.delete(`/Order/${order.id}`).then((res) => {
                                console.log(res.data)
                                navigate('/admin/vieworders')
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

function OrdersView() {
    const [orderList, setOrderList] = useState([]);

    const calculateTotalPrice = (order) => {
        return order.cartItems.reduce((total, cartItem) => {
            return total + cartItem.quantity * cartItem.event.price;
        }, 0);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 30 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'email', headerName: 'User Email', width: 200 },
        { field: 'number', headerName: 'No.Of Items', width: 100 },
        { field: 'price', headerName: 'Total Price', width: 100 },
        { field: 'createdAt', headerName: 'CreatedAt', width: 100 },
        { field: 'action', headerName: 'Actions', width: 500, renderCell: (params) => <RenderButton order={params.row} /> },
    ];

    const rows = orderList.map((order) => ({
        id: order.id,
        status: order.status,
        email: order.user.email,
        number: order.cartItems.length,
        price: calculateTotalPrice(order),
        createdAt: new Date(order.createdAt).toLocaleDateString(),
    }));

    const getOrders = () => {
        http.get(`/Order`).then((res) => {
            setOrderList(res.data);
        });
    };

    useEffect(() => {
        getOrders();
    }, [orderList]);
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

export default OrdersView