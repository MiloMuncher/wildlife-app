import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import http from '../../http';

function EventChart() {
    const [eventList, setEventList] = useState([]);

    const getEvents = () => {
        http.get(`/Event`).then((res) => {
            console.log(res.data)
            setEventList(res.data);
        });
    };

    useEffect(() => {
        getEvents();
    }, []);

    useEffect(() => {
        const monthsSet = new Set(eventList.map(event => {
            const date = new Date(event.createdAt);
            return date.toLocaleString('default', { month: 'short' });
        }));
        
        const months = [...monthsSet];

        const totalEventPerMonth = months.map((month, index) => {
            const monthEvent = eventList.filter(event => {
                const date = new Date(event.createdAt);
                return date.toLocaleString('default', { month: 'short' }) == month;
            });
            console.log(monthEvent)
            const totalForMonth = monthEvent.reduce((total, event) => {
                return total + 1
            }, 0);

            return totalForMonth;
        });

        console.log(totalEventPerMonth)

        setOptions(prevOptions => ({
            ...prevOptions,
            labels: months,
            title: {
                text: totalEventPerMonth.reduce((total, count) => {
                    return total + count
                }, 0)
            }
        }));

        setSeries([
            {
                name: 'Total Event',
                data: totalEventPerMonth.reverse()
            }
        ]);

    }, [eventList]);

    const [options, setOptions] = useState({
        chart: {
            id: 'sparkline3',
            group: 'sparklines3',
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
            text: 'Total Events',
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

export default EventChart;