import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';  // Plugin for the grid view
import http from '../../http';

function ShiftView() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#496A72' };
    const [shiftList, setShiftList] = useState([]);

    const getAllShifts = () => {
        http.get(`https://v9c358horj.execute-api.us-east-1.amazonaws.com/dev/shifts`).then((res) => {
            setShiftList(res.data);
        });
    };

    useEffect(() => {
        getAllShifts();
    }, []);

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`; 
    };

    const sortedShifts = [...shiftList].sort((a, b) => {
        const aDate = new Date(`${a.date}T${formatTime(a.shift_start)}`);
        const bDate = new Date(`${b.date}T${formatTime(b.shift_start)}`);
    
        return aDate - bDate;
    });

    console.log(sortedShifts)
    const calendarEvents = sortedShifts.map((shift) => {
        const dateTimeString = `${shift.date}T${formatTime(shift.shift_start)}`;
        const eventDate = new Date(dateTimeString);

        if (isNaN(eventDate.getTime())) {
            console.error("Invalid date for shift:", shift);
        }

        return {
            title: `${shift.fname} ${shift.lname}`,
            date: eventDate, 
            extendedProps: {
                employee_id: shift.employee_ID,
                shift_start: shift.shift_start,
                shift_duration: shift.shift_duration,
            },
        };
    });

    return (
        <div style={{ width: '100%', backgroundColor: 'white' }}>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridWeek"
                events={calendarEvents}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay',
                }}
            />
        </div>
    );
}

export default ShiftView;
