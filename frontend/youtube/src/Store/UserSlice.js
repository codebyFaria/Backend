import {createSlice} from '@reduxjs/toolkit'

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = UserSlice.actions;
export default UserSlice.reducer;
