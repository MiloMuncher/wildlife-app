import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'
import { DataGrid } from '@mui/x-data-grid';
import http from '../../http'
import { useParams } from 'react-router-dom';

function OrderItems() {
  const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#FF4E00' };
  const [orderList, setOrderList] = useState([]);
  const { id } = useParams()

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'date', headerName: 'Date', width: 200 },

  ];

  const rows = orderList.map((order) => ({
    id: order.id,
    title: order.event.title,
    price: order.event.price,
    quantity: order.quantity,
    date: new Date(order.date).toLocaleDateString()
  }));

  const getOrders = () => {
    http.get(`/Order/${id}`).then((res) => {
      setOrderList(res.data);
      console.log(res.data)
    });
  };

  useEffect(() => {
    getOrders();
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
          sx={{ height: 500 }}
        />
      </div>
      <Button variant='contained' style={btnstyle} LinkComponent={Link} to={`/admin/vieworders`}>Go Back</Button>
    </>
  )
}

export default OrderItems