import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITheme {
  isDarkMode: boolean;
}

const initialState: ITheme = {
  isDarkMode: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkMode: (state: ITheme, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;

      localStorage.setItem("darkMode", action.payload.toString());

      if (action.payload) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    },
  },
});

export const { setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
