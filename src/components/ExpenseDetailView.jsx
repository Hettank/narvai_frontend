import {
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Grid,
  useMediaQuery,
  IconButton,
  Chip,
  Container,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useExpenseStore } from '../store/useExpenseStore';
import { useState, useEffect } from 'react';

const ExpenseDetailView = () => {
  const {
    selectedDate,
    switchToCalendarView,
    editingData,
    getRojmedData,
    rojmedData,
    setHasExistingRecord,
    saveRojmed,
    expenseFromBelow,
    setExpenseFromBelow,
    expenseFromAbove,
    setExpenseFromAbove,
  } = useExpenseStore();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const user = JSON.parse(localStorage.getItem('user-storage'))?.state?.user;

  console.log('editingData', editingData);

  // State for UI controls
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    getRojmedData(selectedDate);
  }, [selectedDate, getRojmedData]);

  // Format date with proper locale
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Load data when component mounts or selected date changes
  useEffect(() => {
    const loadExpenseData = async () => {
      setIsLoading(true);
      try {
        // Since rojmedData is now a single object and not an array
        if (rojmedData && Object.keys(rojmedData).length > 0) {
          console.log('Loading data from:', rojmedData);

          // Set the flag based on loaded data
          setHasExistingRecord(rojmedData && Object.keys(rojmedData).length > 0);

          setExpenseFromBelow(
            rojmedData.expenseFromBelow?.length > 0
              ? rojmedData.expenseFromBelow.map((item, index) => ({
                  id: Date.now() + index, // Add index to make IDs unique
                  name: item.name || '',
                  price: String(item.price) || '', // Convert number to string
                }))
              : [{ id: Date.now(), name: '', price: '' }]
          );

          setExpenseFromAbove(
            rojmedData.expenseFromAbove?.length > 0
              ? rojmedData.expenseFromAbove.map((item, index) => ({
                  id: Date.now() + 1000 + index, // Different base number + index
                  name: item.name || '',
                  price: String(item.price) || '', // Convert number to string
                }))
              : [{ id: Date.now() + 1, name: '', price: '' }]
          );
        } else {
          // Reset form when no data is available
          setExpenseFromBelow([{ id: Date.now(), name: '', price: '' }]);
          setExpenseFromAbove([{ id: Date.now() + 1, name: '', price: '' }]);
          // Make sure edit flag is false when no data
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.error('Error loading expense data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenseData();
  }, [rojmedData]); // Keep this dependency if you're sure it won't cause infinite loops // Depend on rojmedData, not selectedDate

  const validatePrice = value => {
    // Remove any non-numeric characters except decimal point
    let sanitized = value.replace(/[^\d.]/g, '');

    // Ensure only one decimal point
    const decimalCount = (sanitized.match(/\./g) || []).length;
    if (decimalCount > 1) {
      const firstDecimalIndex = sanitized.indexOf('.');
      sanitized =
        sanitized.substring(0, firstDecimalIndex + 1) +
        sanitized.substring(firstDecimalIndex + 1).replace(/\./g, '');
    }

    // Limit to 2 decimal places
    if (sanitized.includes('.')) {
      const parts = sanitized.split('.');
      sanitized = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // Set a maximum limit (e.g., 999999999.99)
    const numValue = parseFloat(sanitized);
    const MAX_VALUE = 999999999.99;

    if (!isNaN(numValue) && numValue > MAX_VALUE) {
      return MAX_VALUE.toFixed(2);
    }

    return sanitized;
  };

  // Handle adding new expense row
  const handleAddExpense = type => {
    const newItem = { id: Date.now() + Math.random(), name: '', price: '' };
    if (type === 'fromBelow') {
      setExpenseFromBelow([...expenseFromBelow, newItem]);
      // You might need to use a setTimeout to ensure the DOM has updated
      setTimeout(() => {
        // Find the new price input and focus it
        const inputs = document.querySelectorAll('[data-type="fromBelow"] input[type="text"]');
        const lastInput = inputs[inputs.length - 2]; // The price input of the last row
        if (lastInput) lastInput.focus();
      }, 0);
    } else {
      setExpenseFromAbove([...expenseFromAbove, newItem]);
      // Similar focus logic for fromAbove

      setTimeout(() => {
        // Find the new price input and focus it
        const inputs = document.querySelectorAll('[data-type="fromBelow"] input[type="text"]');
        const lastInput = inputs[inputs.length - 2]; // The price input of the last row
        if (lastInput) lastInput.focus();
      }, 0);
    }
  };

  // Handle removing an expense row
  const handleRemoveExpense = (type, id) => {
    if (type === 'fromBelow') {
      setExpenseFromBelow(expenseFromBelow.filter(item => item.id !== id));
    } else {
      setExpenseFromAbove(expenseFromAbove.filter(item => item.id !== id));
    }
  };

  // Handle expense field changes
  const handleExpenseChange = (type, id, field, value) => {
    // Apply validation for price fields
    if (field === 'price') {
      value = validatePrice(value);
    }

    if (type === 'fromBelow') {
      setExpenseFromBelow(
        expenseFromBelow.map(item => (item.id === id ? { ...item, [field]: value } : item))
      );
    } else {
      setExpenseFromAbove(
        expenseFromAbove.map(item => (item.id === id ? { ...item, [field]: value } : item))
      );
    }
  };

  // Save expense data
  // In your component's save handler
  const handleSaveExpenses = async () => {
    setIsLoading(true);
    try {
      // Filter out empty rows
      const filteredCashExpenses = expenseFromBelow.filter(
        item => item.name.trim() !== '' || Number(item.price) > 0
      );
      const filteredDigitalExpenses = expenseFromAbove.filter(
        item => item.name.trim() !== '' || Number(item.price) > 0
      );

      if (filteredCashExpenses.length === 0 && filteredDigitalExpenses.length === 0) {
        setErrorMessage('Please add at least one expense with a name or price before saving.');
        setShowError(true);
        setShowSaveDialog(false);
        setIsLoading(false);
        return;
      }

      // Convert prices to numbers and remove id properties
      const formattedFromBelow = filteredCashExpenses.map(({ id, ...rest }) => ({
        ...rest,
        price: Number(rest.price) || 0,
      }));

      const formattedFromAbove = filteredDigitalExpenses.map(({ id, ...rest }) => ({
        ...rest,
        price: Number(rest.price) || 0,
      }));

      const formattedData = {
        date: selectedDate,
        userId: user.id,
        expenseFromBelow: formattedFromBelow,
        expenseFromAbove: formattedFromAbove,
      };

      // Use the unified saveRojmed function
      const result = await saveRojmed(formattedData);
      console.log('result', result);
      if (result) {
        setShowSaveSuccess(true);
      }
      // setShowSaveSuccess(true);
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving expense data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals - using Number() to ensure proper conversion
  const belowTotal = expenseFromBelow.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const aboveTotal = expenseFromAbove.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const grandTotal = belowTotal + aboveTotal;

  return (
    <Container
      disableGutters
      maxWidth="xl"
      sx={{
        width: '100%',
        px: { xs: 1, sm: 2, md: 2 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          borderRadius: 2,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Header Section with responsive layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: 2,
            mb: 3,
            p: { xs: 1.5, sm: 2, md: 2.5 },
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
            {isMobile && (
              <IconButton
                onClick={switchToCalendarView}
                sx={{ mr: 1, color: theme.palette.primary.main }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" sx={{ lineHeight: 1.3 }}>
              {formattedDate}
            </Typography>
          </Box>

          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={switchToCalendarView}
                sx={{ py: 1 }}
              >
                Back to Calendar
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => setShowSaveDialog(true)}
                sx={{
                  backgroundColor: theme.palette.success.main,
                  '&:hover': { backgroundColor: theme.palette.success.dark },
                  py: 1,
                }}
              >
                Save
              </Button>
            </Box>
          ) : null}
        </Box>

        {/* Expense Tables with responsive grid */}
        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
          {/* Cash Expenses Table */}
          <Grid item xs={12} md={6} sx={{ p: { xs: 0, md: 1.5 }, width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1.5,
                pl: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon sx={{ mr: 1 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    mb: 0,
                    fontSize: isMobile ? '1rem' : '1.25rem',
                  }}
                >
                  નીચે થી ચૂકવેલા રોજમેળ
                </Typography>
                {!isMobile && (
                  <Chip
                    label={`₹${belowTotal.toFixed(2)}`}
                    size="small"
                    sx={{ ml: 2, fontWeight: 'bold' }}
                  />
                )}
              </Box>
              <IconButton color="primary" onClick={() => handleAddExpense('fromBelow')}>
                <AddIcon />
              </IconButton>
            </Box>
            <TableContainer
              component={Paper}
              sx={{
                mb: 2,
                boxShadow: 1,
                borderRadius: 1,
                overflow: 'hidden',
                width: '100%',
              }}
              data-type="fromBelow"
            >
              <Table size={isMobile ? 'small' : 'medium'} sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    {/* Swapped column order - Price now on left, Item Name on right */}
                    <TableCell width="30%" sx={{ fontWeight: 'bold', py: 1.5 }}>
                      Price (₹)
                    </TableCell>
                    <TableCell width="60%" sx={{ fontWeight: 'bold', py: 1.5 }}>
                      Item Name
                    </TableCell>
                    <TableCell width="10%" align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenseFromBelow.map((item, index) => (
                    <TableRow key={item.id}>
                      {/* Price column now on left */}
                      <TableCell>
                        <TextField
                          variant="standard"
                          placeholder="0.00"
                          value={item.price}
                          onChange={e =>
                            handleExpenseChange('fromBelow', item.id, 'price', e.target.value)
                          }
                          inputProps={{
                            style: { fontSize: isMobile ? 14 : 16 },
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          sx={{ width: '80px' }}
                        />
                      </TableCell>
                      {/* Item name column now on right */}
                      <TableCell>
                        <TextField
                          fullWidth
                          variant="standard"
                          placeholder="Enter item name"
                          value={item.name}
                          onChange={e =>
                            handleExpenseChange('fromBelow', item.id, 'name', e.target.value)
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddExpense('fromBelow');
                            }
                          }}
                          inputProps={{
                            style: { fontSize: isMobile ? 14 : 16 },
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveExpense('fromBelow', item.id)}
                          disabled={expenseFromBelow.length === 1 && index === 0}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    {/* Total row with swapped columns */}
                    <TableCell sx={{ fontWeight: 'bold' }}>₹{belowTotal.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Digital Expenses Table */}
          <Grid item xs={12} md={6} sx={{ p: { xs: 0, md: 1.5 }, width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1.5,
                pl: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    mb: 0,
                    fontSize: isMobile ? '1rem' : '1.25rem',
                  }}
                >
                  ઉપર થી ચૂકવેલા રોજમેળ
                </Typography>
                {!isMobile && (
                  <Chip
                    label={`₹${aboveTotal.toFixed(2)}`}
                    size="small"
                    sx={{ ml: 2, fontWeight: 'bold' }}
                  />
                )}
              </Box>
              <IconButton color="primary" onClick={() => handleAddExpense('fromAbove')}>
                <AddIcon />
              </IconButton>
            </Box>
            <TableContainer
              component={Paper}
              sx={{
                mb: 2,
                boxShadow: 1,
                borderRadius: 1,
                overflow: 'hidden',
                width: '100%',
              }}
              data-type="fromAbove"
            >
              <Table size={isMobile ? 'small' : 'medium'} sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    {/* Swapped column order - Price now on left, Item Name on right */}
                    <TableCell width="30%" sx={{ fontWeight: 'bold', py: 1.5 }}>
                      Price (₹)
                    </TableCell>
                    <TableCell width="60%" sx={{ fontWeight: 'bold', py: 1.5 }}>
                      Item Name
                    </TableCell>
                    <TableCell width="10%" align="center" sx={{ fontWeight: 'bold', py: 1.5 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenseFromAbove.map((item, index) => (
                    <TableRow key={item.id}>
                      {/* Price column now on left */}
                      <TableCell>
                        <TextField
                          variant="standard"
                          placeholder="0.00"
                          value={item.price}
                          onChange={e =>
                            handleExpenseChange('fromAbove', item.id, 'price', e.target.value)
                          }
                          inputProps={{
                            style: { fontSize: isMobile ? 14 : 16 },
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          sx={{ width: '80px' }}
                        />
                      </TableCell>
                      {/* Item name column now on right */}
                      <TableCell>
                        <TextField
                          fullWidth
                          variant="standard"
                          placeholder="Enter item name"
                          value={item.name}
                          onChange={e =>
                            handleExpenseChange('fromAbove', item.id, 'name', e.target.value)
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddExpense('fromAbove');
                            }
                          }}
                          inputProps={{
                            style: { fontSize: isMobile ? 14 : 16 },
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveExpense('fromAbove', item.id)}
                          disabled={expenseFromAbove.length === 1 && index === 0}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    {/* Total row with swapped columns */}
                    <TableCell sx={{ fontWeight: 'bold' }}>₹{aboveTotal.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Grand Total Section - simplified styling */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 2,
            p: 2,
            borderRadius: 1,
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography variant="h6" fontWeight="bold" mr={2}>
            Grand Total:
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            ₹{grandTotal.toFixed(2)}
          </Typography>
        </Box>

        {/* Mobile-only action buttons at bottom */}
        {isMobile && (
          <Box
            sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={switchToCalendarView}
              sx={{
                py: 1.5,
                flex: 1,
              }}
            >
              Back to Calendar
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              onClick={() => setShowSaveDialog(true)}
              sx={{
                py: 1.5,
                backgroundColor: theme.palette.success.main,
                '&:hover': { backgroundColor: theme.palette.success.dark },
                flex: 1,
              }}
            >
              Save
            </Button>
          </Box>
        )}
      </Paper>

      {/* Save Confirmation Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Expense Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to save the expense data for {formattedDate}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveExpenses}
            color="success"
            variant="contained"
            disabled={isLoading}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSaveSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSaveSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSaveSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Expense data saved successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ExpenseDetailView;
