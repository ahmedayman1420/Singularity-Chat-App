// ===== --- ===== ### Action-Strings ### ===== --- ===== //
import { ERROR_ADD_POST } from "../Actions/ActionStrings";

// ===== --- ===== ### Error-Reducer ### ===== --- ===== //
const errorReducer = (state = { value: false, message: "" }, action) => {
  switch (action.type) {
    case ERROR_ADD_POST:
      return { ...action.payload, type: "post" };

    default:
      return state;
  }
};

export default errorReducer;
