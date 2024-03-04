import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      let data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('token', data.body.token);
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.error('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userName }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userName,
        }),
      });
      let data = await response.json();
      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.error('Error', e.response?.data);
      return thunkAPI.rejectWithValue(e.response?.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('Token not found');

    try {
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (response.status === 200) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (e) {
      return rejectWithValue(e.toString());
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  },
  reducers: {
    logout: (state) => {
    state.user = null;
    state.isError = false;
    state.isSuccess = false;
    state.isLoading = false;
    state.message = '';
    localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = payload;
    })
    .addCase(loginUser.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload ? payload.message : '';
    })
    .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
      state.user = { ...state.user, ...payload };
    })
    .addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = { ...state.user, ...action.payload };
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
