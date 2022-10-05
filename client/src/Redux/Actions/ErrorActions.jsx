// ===== --- ===== ### Action-String ### ===== --- ===== //
import { ERROR_RESET } from "./ActionStrings";

// ===== --- ===== ### Error-Actions ### ===== --- ===== //
export const unexpectedErrorAction = (mes) => async (dispatch) => {
  dispatch({
    type: mes,
    payload: { value: true, message: mes },
  });
};

export const errorResetAction = () => async (dispatch) => {
  dispatch({
    type: ERROR_RESET,
    payload: { value: false, message: "All is good" },
  });
};
