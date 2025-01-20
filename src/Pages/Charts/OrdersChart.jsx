import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import http from '../../http';

function OrdersChart () {
    const [orderList, setOrderList] = useState([]);

    const getOrders = () => {
        http.get(`/Order`).then((res) => {
            setOrderList(res.data);
            console.log(res.data)
        });
    };

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        const monthsSet = new Set(orderList.map(order => {
            const date = new Date(order.createdAt);
            return date.toLocaleString('default', { month: 'short' });
        }));
        
        const months = [...monthsSet];

        const totalPricePerMonth = months.map((month, index) => {
            const monthOrders = orderList.filter(order => {
                const date = new Date(order.createdAt);
                return date.toLocaleString('default', { month: 'short' }) == month;
            });

            const totalForMonth = monthOrders.reduce((total, order) => {
                return total + order.cartItems.reduce((subtotal, cartItem) => {
                    return subtotal + cartItem.quantity * cartItem.event.price;
                }, 0);
            }, 0);

            return totalForMonth;
        });

        setOptions(prevOptions => ({
            ...prevOptions,
            labels: months.reverse(),
            title: {
                text: "$" + totalPricePerMonth.reduce((total, p) => {
                    return total + p
                }, 0)
            }
        }));

        setSeries([
            {
                name: 'Total Price',
                data: totalPricePerMonth.reverse()
            }
        ]);

    }, [orderList]);

    const [options, setOptions] = useState({
        chart: {
            id: 'sparkline1',
            group: 'sparklines1',
            height: 160,
        },
        stroke: {
            curve: 'smooth'
        },
        fill: {
            opacity: 1,
        },
        labels: [],
        yaxis: {
            min: 0,
            title: {
                text: 'Sales',
            },
            labels: {
                show: false, // Hide individual values on the y-axis
            },
        },
        grid: {
            show: false
        },
        xaxis: {
            type: 'string',
            title: {
                text: 'Date',
            },
        },
        colors: ['#008FFB'],
        title: {
            offsetX: 30,
            offsetY: 30,
            style: {
                fontSize: '24px',
                cssClass: 'apexcharts-yaxis-title',
                color: 'white',
            }
        },
        subtitle: {
            text: 'Total Orders',
            offsetX: 30,
            offsetY: 60,
            style: {
                fontSize: '14px',
                cssClass: 'apexcharts-yaxis-title',
                color: 'white',
            }
        }
    });

    const [series, setSeries] = useState([]);

    return (
        <Chart options={options} series={series} type="area" height={400} />
    );
};

export default OrdersChart;
