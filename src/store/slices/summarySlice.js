import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/summaries';

// Async thunks
export const createSummary = createAsyncThunk(
  'summary/createSummary',
  async ({ transcript }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${API_URL}/create`,
        { transcript },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create summary');
    }
  }
);

export const fetchUserSummaries = createAsyncThunk(
  'summary/fetchUserSummaries',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch summaries');
    }
  }
);

export const deleteSummary = createAsyncThunk(
  'summary/deleteSummary',
  async (summaryId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/${summaryId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return summaryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete summary');
    }
  }
);

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    currentTranscript: '',
    currentSummary: null,
    userSummaries: [],
    isLoading: false,
    isTranscribing: false,
    error: null,
  },
  reducers: {
    setTranscript: (state, action) => {
      state.currentTranscript = action.payload;
    },
    clearTranscript: (state) => {
      state.currentTranscript = '';
      state.currentSummary = null;
    },
    setTranscribing: (state, action) => {
      state.isTranscribing = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Summary
      .addCase(createSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSummary = action.payload.summary;
        state.userSummaries.unshift(action.payload);
        state.error = null;
      })
      .addCase(createSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch User Summaries
      .addCase(fetchUserSummaries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSummaries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSummaries = action.payload;
        state.error = null;
      })
      .addCase(fetchUserSummaries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Summary
      .addCase(deleteSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSummaries = state.userSummaries.filter(
          summary => summary._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setTranscript, clearTranscript, setTranscribing, clearError } = summarySlice.actions;
export default summarySlice.reducer;
