import { configureStore } from "@reduxjs/toolkit";

import TodoReducer from "./Slice";

const store = configureStore({
  reducer: {
    todo: TodoReducer,
  },
});

export default store;
