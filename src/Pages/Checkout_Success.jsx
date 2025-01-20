import React, { useEffect } from 'react'
import http from '../http'
import { useNavigate, useLocation } from 'react-router-dom'

function Checkout_Success() {
    const navigate = useNavigate();

    useEffect(() => {
        var id = localStorage.getItem("stripeid")
        if (id != null) {
            http.post(`/Order/${id}`)
            .then((res) => {
                console.log(res.data)
                localStorage.removeItem("stripeid")
                navigate("/")
            })
        } else {
            navigate("/")
        }
    }, []);

    return (
        <div>Checkout_Success</div>
    )
}

export default Checkout_Success