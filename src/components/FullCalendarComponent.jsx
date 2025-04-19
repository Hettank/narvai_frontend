import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useExpenseStore } from '../store/useExpenseStore';

const FullCalendarComponent = () => {
  const { selectedDate, setSelectedDate, switchToExpenseView } = useExpenseStore();
  const calendarRef = useRef(null);

  const [viewDate, setViewDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const handleDateClick = info => {
    const formattedDate = info.dateStr;

    setSelectedDate(formattedDate);
    switchToExpenseView(formattedDate);
  };

  console.log('selected', selectedDate);

  const handleViewChange = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const date = calendarApi.getDate();
      setViewDate({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      });
    }
  };

  const goToYearMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(`${viewDate.year}-${viewDate.month.toString().padStart(2, '0')}-01`);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  const monthOptions = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {/* Controls */}
      <Grid container spacing={2} alignItems="center" justifyContent="start" mb={2} flexWrap="wrap">
        <Grid item xs={12} sm="auto">
          <FormControl fullWidth size="small">
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={viewDate.year}
              label="Year"
              onChange={e => setViewDate({ ...viewDate, year: parseInt(e.target.value) })}
            >
              {yearOptions.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm="auto">
          <FormControl fullWidth size="small">
            <InputLabel id="month-label">Month</InputLabel>
            <Select
              labelId="month-label"
              value={viewDate.month}
              label="Month"
              onChange={e => setViewDate({ ...viewDate, month: parseInt(e.target.value) })}
            >
              {monthOptions.map((month, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm="auto">
          <Button variant="contained" color="error" fullWidth onClick={goToYearMonth}>
            Go
          </Button>
        </Grid>

        <Grid item xs={12} sm="auto">
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setSelectedDate(today);

              if (calendarRef.current) {
                const calendarApi = calendarRef.current.getApi();
                calendarApi.today();
                setViewDate({
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1,
                });
              }
            }}
          >
            Today
          </Button>
        </Grid>
      </Grid>
      {/* Calendar */}
      <Paper elevation={2} sx={{ overflowX: 'auto', p: 1 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          dateClick={handleDateClick}
          height="auto"
          selectable
          weekends
          datesSet={handleViewChange}
          dayMaxEventRows={3}
          dayHeaderFormat={{ weekday: 'short' }}
          fixedWeekCount={false}
          showNonCurrentDates={false}
        />
      </Paper>

      <style>
        {`
          /* Calendar header */
          .fc .fc-toolbar-title {
            font-size: 1.25rem;
            font-weight: 500;
            color: #333;
            margin: 0;
          }

          /* Day headers */
          .fc .fc-col-header-cell {
            padding: 8px 0;
            background-color: #f8f9fa;
          }

          .fc .fc-col-header-cell-cushion {
            color: #555;
            font-weight: 500;
            text-decoration: none;
          }

          /* Day cells */
          .fc .fc-daygrid-day {
            border: 1px solid #e0e0e0;
          }

          .fc .fc-daygrid-day-top {
            flex-direction: row;
            padding: 4px;
          }

          .fc .fc-daygrid-day-number {
            color: #333;
            font-weight: 400;
            padding: 4px;
          }

          /* Today's cell */
          .fc .fc-daygrid-day.fc-day-today {
            background-color: #fff8e1;
          }

          /* Hover effects */
          .fc .fc-daygrid-day:hover {
            background-color: #f5f5f5;
          }

          /* Event styling */
          .fc .fc-daygrid-event {
            margin: 1px 2px;
            border-radius: 3px;
          }

          /* Remove outline on focus */
          .fc .fc-daygrid-day:focus,
          .fc .fc-daygrid-event:focus {
            outline: none;
          }

          /* Responsive adjustments */
          @media (max-width: 600px) {
            .fc .fc-col-header-cell-cushion,
            .fc .fc-daygrid-day-number {
              font-size: 0.75rem;
            }
            
            .fc .fc-toolbar-title {
              font-size: 1rem;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default FullCalendarComponent;
