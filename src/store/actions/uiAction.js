import { UI_START, UI_END } from "./actionTypes";

export const uiStart = () => {
  return {
    type: UI_START,
    isLoading: true
  };
};

export const uiEnd = () => {
  return {
    type: UI_END,
    isLoading: false
  };
};
