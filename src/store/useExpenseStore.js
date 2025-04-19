import { create } from 'zustand';
import { rojmedAPI } from '../api/endpoints/rojmed';

export const useExpenseStore = create((set, get) => ({
  loading: false,
  setLoading: loading => set({ loading }),

  currentView: 'calendar',
  selectedDate: new Date().toISOString().split('T')[0],

  rojmedData: [],

  editingData: {},
  setEditingData: editingData => set({ editingData }),

  hasExistingRecord: false,
  setHasExistingRecord: hasExistingRecord => set({ hasExistingRecord }),

  setSelectedDate: date => set({ selectedDate: date }),
  switchToExpenseView: date => set({ currentView: 'expense', selectedDate: date }),
  switchToCalendarView: () =>
    set({
      currentView: 'calendar',
      rojmedData: null, // Reset this too
      expenseFromBelow: [{ id: Date.now(), name: '', price: '' }],
      expenseFromAbove: [{ id: Date.now(), name: '', price: '' }],
    }),

  expenseFromBelow: [
    {
      id: Date.now(),
      name: '',
      price: '',
    },
  ],
  setExpenseFromBelow: expenseFromBelow => set({ expenseFromBelow }),

  expenseFromAbove: [
    {
      id: Date.now() + 1,
      name: '',
      price: '',
    },
  ],
  setExpenseFromAbove: expenseFromAbove => set({ expenseFromAbove }),

  getRojmedData: async selectedDate => {
    try {
      const response = await rojmedAPI.getAll({ date: selectedDate });

      if (response && response.rojmed && response.rojmed.length > 0) {
        set({
          rojmedData: response.rojmed[0],
          editingData: response.rojmed[0],
          hasExistingRecord: true,
        });
      } else {
        // Explicitly reset the state when no data is found
        set({
          rojmedData: null,
          editingData: {},
          hasExistingRecord: false,
          expenseFromBelow: [{ id: Date.now(), name: '', price: '' }],
          expenseFromAbove: [{ id: Date.now(), name: '', price: '' }],
        });
      }
    } catch (error) {
      console.log('error', error);
      set({
        rojmedData: null,
        editingData: {},
        hasExistingRecord: false,
        expenseFromBelow: [{ id: Date.now(), name: '', price: '' }],
        expenseFromAbove: [{ id: Date.now(), name: '', price: '' }],
      });
    }
  },

  saveRojmed: async data => {
    const { hasExistingRecord, rojmedData } = get();

    try {
      let response;

      if (hasExistingRecord && rojmedData && rojmedData._id) {
        // We have an existing record, so use update
        const updateData = {
          ...data,
          _id: rojmedData._id, // Make sure to include the document ID
        };

        response = await rojmedAPI.update(updateData);
      } else {
        // No existing record, create new one
        response = await rojmedAPI.create(data);

        // After successful creation, mark as existing
        if (response && response.data) {
          set({
            rojmedData: response.data,
            hasExistingRecord: true,
          });
        }
      }

      return { success: true, data: response };
    } catch (error) {
      console.log('Error occurred while saving the rojmed', error);
      return { success: false, error };
    }
  },
}));
