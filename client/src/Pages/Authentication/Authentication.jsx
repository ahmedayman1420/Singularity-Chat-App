// ===== --- ===== ### React ### ===== --- ===== //
import React, { useEffect, useState } from "react";

// ===== --- ===== ### Style-Component ### ===== --- ===== //
import Style from "./Authentication.module.scss";

// ===== --- ===== ### React-Bootstrap ### ===== --- ===== //
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

// ===== --- ===== ### React-Router-Dom ### ===== --- ===== //
import { useNavigate, useLocation } from "react-router-dom";

// ===== --- ===== ### Fontawesome ### ===== --- ===== //
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye, faG } from "@fortawesome/free-solid-svg-icons";

// ===== --- ===== ### Google-Login ### ===== --- ===== //
import { GoogleLogin } from "react-google-login";

// ===== --- ===== ### User-Regex ### ===== --- ===== //
import { userRegex } from "./UserRegex";

// ===== --- ===== ### Gapi ### ===== --- ===== //
import { gapi } from "gapi-script";

// ===== --- ===== ### React-Redux ### ===== --- ===== //
import { useDispatch, useSelector } from "react-redux";

// ===== --- ===== ### User-Actions ### ===== --- ===== //
import {
  ContinueWithGoogleAction,
  LoginAction,
  SignUpAction,
} from "../../Redux/Actions/UserAction";

// ===== --- ===== ### External-Components ### ===== --- ===== //
import Loading from "../../Components/Loading/Loading";
import { validEmail } from "./UserRegex";

// ===== --- ===== ### Home-Component ### ===== --- ===== //
function Authentication() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector((state) => state.error);
  // ===== --- ===== ### Component-States ### ===== --- ===== //
  let [isSignIn, setIsSignIn] = useState(true);
  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });

  let [isFirstTime, setIsFirstTime] = useState({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
    pic: true,
  });

  let [isValidUser, setIsValidUser] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    pic: false,
  });

  let [waiting, setWaiting] = useState(true);
  let [passwordShown, setPasswordShown] = useState(false);

  // ===== --- ===== ### Component-Functions ### ===== --- ===== //
  let togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const getUser = ({ target }) => {
    setUser((prevUser) => {
      return { ...prevUser, [target.name]: target.value };
    });
  };

  const checkUserRegex = ({ target }) => {
    if (userRegex[target.name].test(target.value)) {
      setIsValidUser((prevUser) => {
        return { ...prevUser, [target.name]: true };
      });
      return true;
    } else {
      setIsValidUser((prevUser) => {
        return { ...prevUser, [target.name]: false };
      });
      return false;
    }
  };

  const register = async (user) => {
    let res = await dispatch(SignUpAction(user));
    return res;
  };

  const login = async (user) => {
    let res = await dispatch(
      LoginAction({ email: user.email, password: user.password })
    );
    return res;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWaiting(true);
    let res = false;

    console.log({ user });
    if (isSignIn) res = await login(user);
    else res = await register(user);

    if (res) navigate("/chats");
    setWaiting(false);
  };

  const getBase64 = ({ target }, cb) => {
    let reader = new FileReader();
    if (target.files[0] && target.files[0].type.match("image.*"))
      reader.readAsDataURL(target.files[0]);
    else {
      target.value = "";
      setIsValidUser((prevUser) => {
        return { ...prevUser, pic: false };
      });
    }

    reader.onload = function () {
      cb(reader.result);
    };

    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const responseGoogleSuccess = async (res) => {
    console.log("Google Sign Up success");
    const profile = res?.profileObj;
    const token = res?.tokenId;

    let isDone = await dispatch(ContinueWithGoogleAction(token));
    if (isDone) navigate(`/chats`);
  };

  const responseGoogleFailure = async (error) => {
    console.log("Google Sign up failure");
    console.log(error);
  };

  const RegisterOrLogin = () => {
    if (location.pathname === "/register") setIsSignIn(false);
    else if (location.pathname === "/login") setIsSignIn(true);
  };

  useEffect(() => {
    setWaiting(true);
    function start() {
      gapi.client.init({
        clientId: process.env.React_App_Client_Id,
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);

    RegisterOrLogin();
    setWaiting(false);
  }, []);

  // ===== --- ===== ### Component-JSX ### ===== --- ===== //
  console.log({ user });

  return (
    <>
      {!waiting ? (
        <div className="mt-5 d-flex justify-content-center align-items-center">
          <Form
            className="w-50 p-4 rounded-1"
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "#fbfbfb",
            }}
          >
            <div className="text-center ">
              <h2>Singularity</h2>
            </div>

            {/* // ===== --- ===== ### User-Name-Input ### ===== --- ===== // */}

            {!isSignIn && (
              <Form.Group className="mb-3" controlId="formBasicFirstName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  className="mb-3"
                  name="name"
                  type="text"
                  required={true}
                  placeholder="Enter your name"
                  onChange={(e) => {
                    let res = checkUserRegex(e);
                    if (res) getUser(e);

                    if (isFirstTime[e.target.name])
                      setIsFirstTime((prevUser) => {
                        return { ...prevUser, [e.target.name]: false };
                      });
                  }}
                />
                {!isFirstTime.name && !isValidUser.name && (
                  <Alert variant="danger">
                    <Alert.Heading>
                      Your name must start with a uppercase letter
                    </Alert.Heading>
                  </Alert>
                )}
              </Form.Group>
            )}

            {/* // ===== --- ===== ### User-Email-Input ### ===== --- ===== // */}

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                className="mb-3"
                name="email"
                type="email"
                required={true}
                placeholder="Enter your email"
                onChange={(e) => {
                  let res = checkUserRegex(e);
                  if (res) getUser(e);

                  if (isFirstTime[e.target.name])
                    setIsFirstTime((prevUser) => {
                      return { ...prevUser, [e.target.name]: false };
                    });
                }}
              />
              {!isFirstTime.email && !isValidUser.email && (
                <Alert variant="danger">
                  <Alert.Heading>
                    Please include a valid domain in the email address.
                  </Alert.Heading>
                </Alert>
              )}
            </Form.Group>

            {/* // ===== --- ===== ### User-Password-Input ### ===== --- ===== // */}

            <Form.Group
              className={["mb-3"].join(" ")}
              controlId="formBasicPassword"
            >
              <Form.Label>Password</Form.Label>
              <div className={Style.password}>
                <Form.Control
                  className="mb-3"
                  name="password"
                  placeholder="Enter password"
                  required={true}
                  onChange={(e) => {
                    let res = checkUserRegex(e);
                    if (res) getUser(e);

                    if (isFirstTime[e.target.name])
                      setIsFirstTime((prevUser) => {
                        return { ...prevUser, [e.target.name]: false };
                      });
                  }}
                  type={passwordShown ? "text" : "password"}
                />
                <FontAwesomeIcon
                  className={[Style.icon, Style.posswordIcon].join(" ")}
                  size="lg"
                  icon={passwordShown ? faEye : faEyeSlash}
                  onClick={togglePassword}
                />
              </div>
              {!isFirstTime.password && !isValidUser.password && (
                <Alert variant="danger">
                  <Alert.Heading>
                    <p>Your password must:</p>
                    <ul>
                      <li>Contain at least 8 characters</li>
                      <li>
                        At least one uppercase letter, one lowercase letter, one
                        number and one special character
                      </li>
                    </ul>
                  </Alert.Heading>
                </Alert>
              )}
            </Form.Group>

            {/* // ===== --- ===== ### User-Confirm-Password-Input ### ===== --- ===== // */}

            {!isSignIn && (
              <Form.Group
                className={["mb-3"].join(" ")}
                controlId="formBasicConfirmPassword"
              >
                <Form.Label>Confirm Password</Form.Label>
                <div className={Style.confirmPasswrod}>
                  <Form.Control
                    className="mb-3"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required={true}
                    onChange={(e) => {
                      let res = e.target.value === user.password;
                      console.log({ res });
                      if (res) {
                        setIsValidUser((prevUser) => {
                          return { ...prevUser, [e.target.name]: true };
                        });
                        getUser(e);
                      } else
                        setIsValidUser((prevUser) => {
                          return { ...prevUser, [e.target.name]: false };
                        });

                      if (isFirstTime[e.target.name])
                        setIsFirstTime((prevUser) => {
                          return { ...prevUser, [e.target.name]: false };
                        });
                    }}
                    type={passwordShown ? "text" : "password"}
                  />

                  <FontAwesomeIcon
                    className={[Style.icon, Style.confirmPasswrodIcon].join(
                      " "
                    )}
                    size="lg"
                    icon={passwordShown ? faEye : faEyeSlash}
                    onClick={togglePassword}
                  />
                </div>
                {!isFirstTime.confirmPassword && !isValidUser.confirmPassword && (
                  <Alert variant="danger">
                    <Alert.Heading>
                      Password confirmation does not match password
                    </Alert.Heading>
                  </Alert>
                )}
              </Form.Group>
            )}

            {/* // ===== --- ===== ### User-Picture-Input ### ===== --- ===== // */}

            {!isSignIn && (
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload your picture</Form.Label>
                <Form.Control
                  className="mb-3"
                  type="file"
                  onChange={(e) => {
                    getBase64(e, (result) => {
                      setIsValidUser((prevUser) => {
                        return { ...prevUser, pic: true };
                      });
                      setUser((prevUser) => {
                        return { ...prevUser, pic: result };
                      });
                    });

                    if (isFirstTime.pic)
                      setIsFirstTime((prevUser) => {
                        return { ...prevUser, pic: false };
                      });
                  }}
                />

                {!isFirstTime.pic && !isValidUser.pic && (
                  <Alert variant="danger">
                    <Alert.Heading>
                      Allowed files are .png, .jpg and .jpeg
                    </Alert.Heading>
                  </Alert>
                )}
              </Form.Group>
            )}

            {/* // ===== --- ===== ### Error-State ### ===== --- ===== // */}

            {error.value && error.type === "auth" && (
              <Alert variant="danger">
                <Alert.Heading>{error.message}</Alert.Heading>
              </Alert>
            )}

            {/* // ===== --- ===== ### Submit-Buttons ### ===== --- ===== // */}

            <Button
              className="w-100 mb-3"
              variant="info"
              type="submit"
              disabled={
                (!isSignIn &&
                  (waiting ||
                    !(
                      isValidUser.name &&
                      isValidUser.email &&
                      isValidUser.password &&
                      isValidUser.confirmPassword &&
                      isValidUser.pic
                    ))) ||
                (isSignIn &&
                  (waiting || !(isValidUser.email && isValidUser.password)))
              }
            >
              {waiting && "Waiting ... "}
              {!waiting && !isSignIn && "Signup"}
              {!waiting && isSignIn && "Signin"}
            </Button>
            <GoogleLogin
              clientId={process.env.React_App_Client_Id}
              render={(renderProps) => (
                <Button
                  className="w-100 mb-3"
                  variant="success"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FontAwesomeIcon size="lg" icon={faG} />
                  <span> Google</span>
                </Button>
              )}
              buttonText="Login"
              onSuccess={responseGoogleSuccess}
              onFailure={responseGoogleFailure}
              cookiePolicy={"single_host_origin"}
            />
            {isSignIn && (
              <Alert variant="primary">
                <>
                  <span>Don't have an account ? </span>
                  <span
                    className={Style.sign}
                    onClick={() => {
                      setIsSignIn(false);
                      navigate(`/register`);
                    }}
                  >
                    Sign Up
                  </span>
                </>
              </Alert>
            )}
            {!isSignIn && (
              <Alert variant="primary">
                <>
                  <span>Already have an account ? </span>
                  <span
                    className={Style.sign}
                    onClick={() => {
                      setIsSignIn(true);
                      navigate(`/login`);
                    }}
                  >
                    Sign In
                  </span>
                </>
              </Alert>
            )}
          </Form>
        </div>
      ) : (
        <Loading height={"vh-100"} />
      )}
    </>
  );
}

export default Authentication;
