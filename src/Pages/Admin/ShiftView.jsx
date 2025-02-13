import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';  // Plugin for the grid view
import http from '../../http';

function ShiftView() {
    const btnstyle = { margin: '30px 0', fontWeight: 'bold', color: 'white', backgroundColor: '#496A72' };
    const [shiftList, setShiftList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredShifts, setFilteredShifts] = useState([]);

    const getAllShifts = () => {
        http.get(`https://v9c358horj.execute-api.us-east-1.amazonaws.com/dev/shifts`).then((res) => {
            setShiftList(res.data);
            setFilteredShifts(res.data);  // Initialize filtered shifts with all shifts
        });
    };

    useEffect(() => {
        getAllShifts();
    }, []);

    useEffect(() => {
        // Filter shifts based on the search term
        if (searchTerm) {
            const filtered = shiftList.filter(shift =>
                `${shift.fname} ${shift.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredShifts(filtered);
        } else {
            setFilteredShifts(shiftList);  // If no search term, show all shifts
        }
    }, [searchTerm, shiftList]);

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    const sortedShifts = [...filteredShifts].sort((a, b) => {
        const aDate = new Date(`${a.date}T${formatTime(a.shift_start)}`);
        const bDate = new Date(`${b.date}T${formatTime(b.shift_start)}`);
        return aDate - bDate;
    });

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
        <div style={{ width: '100%', height: '80%', backgroundColor: 'white' }}>
            {/* Search Input */}
            <TextField
                label="Search by Employee Name"
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                style={{ marginBottom: '20px' }}
            />
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridWeek"
                events={calendarEvents}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay',
                }}
                className="custom-calendar"
            />
        </div>
    );
}

export default ShiftView;
