import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import http from '../../http';

function UserChart() {
    const [userList, setUserList] = useState([]);

    const getUsers = () => {
        http.get(`/AdminUser/allusers`).then((res) => {
            setUserList(res.data);
        });
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        const monthsSet = new Set(userList.map(user => {
            const date = new Date(user.createdAt);
            return date.toLocaleString('default', { month: 'short' });
        }));
        
        const months = [...monthsSet];

        const totalUserPerMonth = months.map((month, index) => {
            const monthUsers = userList.filter(user => {
                const date = new Date(user.createdAt);
                return date.toLocaleString('default', { month: 'short' }) == month;
            });
            console.log(monthUsers)
            const totalForMonth = monthUsers.reduce((total, user) => {
                return total + 1
            }, 0);

            return totalForMonth;
        });

        console.log(totalUserPerMonth)

        setOptions(prevOptions => ({
            ...prevOptions,
            labels: months.reverse(),
            title: {
                text: totalUserPerMonth.reduce((total, count) => {
                    return total + count
                }, 0)
            }
        }));

        setSeries([
            {
                name: 'Total User',
                data: totalUserPerMonth.reverse()
            }
        ]);

    }, [userList]);

    const [options, setOptions] = useState({
        chart: {
            id: 'sparkline2',
            group: 'sparklines2',
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
                text: 'Count',
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
            offsetX: 20,
            offsetY: 20,
            style: {
                fontSize: '24px',
                cssClass: 'apexcharts-yaxis-title',
                color: 'white',
            }
        },
        subtitle: {
            text: 'Total Users',
            offsetX: 20,
            offsetY: 50,
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

export default UserChart;