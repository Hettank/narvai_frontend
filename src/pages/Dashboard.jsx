import React from 'react';
import FullCalendarComponent from '../components/FullCalendarComponent';
import { useExpenseStore } from '../store/useExpenseStore';
import ExpenseDetailView from '../components/ExpenseDetailView';
import { Box } from '@mui/material';

const Dashboard = () => {
  const { currentView } = useExpenseStore();

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {currentView === 'calendar' ? <FullCalendarComponent /> : <ExpenseDetailView />}
    </Box>
  );
};

export default Dashboard;
