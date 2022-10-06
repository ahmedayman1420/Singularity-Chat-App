// ===== --- ===== ### Action-String ### ===== --- ===== //

// ===== --- ===== ### Error-Action ### ===== --- ===== //
import { unexpectedErrorAction } from "./ErrorActions";

// ===== --- ===== ### User-APIs ### ===== --- ===== //
import { ContinueWithGoogleAPI } from "../../APIs/UserAPIs";

// ===== --- ===== ### User-Action ### ===== --- ===== //
export const ContinueWithGoogleAction = (token) => async (dispatch) => {
  const res = await ContinueWithGoogleAPI(token);

  if (Math.floor(res.status / 100) !== 2) {
    let message = res.response.data.message;
    dispatch(unexpectedErrorAction(message));
    return false;
  } else {
    localStorage.setItem("token", res.data.payload.token);
    localStorage.setItem("User", res.data.payload.user);
    return true;
  }
};
