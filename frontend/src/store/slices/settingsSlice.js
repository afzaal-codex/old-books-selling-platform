import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: {
    supportEmail:
      "support@oldbooks.com",

    supportPhone:
      "+92 300 0000000",

    socialLinks: {
      facebook:
        "https://facebook.com",

      instagram:
        "https://instagram.com",

      whatsapp:
        "https://whatsapp.com",

      youtube:
        "https://youtube.com",
    },
  },
};

const settingsSlice = createSlice({
  name: "settings",

  initialState,

  reducers: {},
});

export default settingsSlice.reducer;