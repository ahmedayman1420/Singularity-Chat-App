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

// ===== --- ===== ### Gapi ### ===== --- ===== //
import { gapi } from "gapi-script";

// ===== --- ===== ### React-Redux ### ===== --- ===== //
import { useDispatch, useSelector } from "react-redux";

// ===== --- ===== ### User-Actions ### ===== --- ===== //
import { ContinueWithGoogleAction } from "../../Redux/Actions/UserAction";

// ===== --- ===== ### External-Components ### ===== --- ===== //
import Loading from "../../Components/Loading/Loading";

// ===== --- ===== ### Home-Component ### ===== --- ===== //
function Authentication() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ===== --- ===== ### Component-States ### ===== --- ===== //
  let [isSignIn, setIsSignIn] = useState(true);
  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
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

  const responseGoogleSuccess = async (res) => {
    console.log("Google Sign Up success");
    const profile = res?.profileObj;
    const token = res?.tokenId;

    await dispatch(ContinueWithGoogleAction(token));
    navigate(`/chats`);
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

  console.log(user);
  return (
    <>
      {!waiting ? (
        <div className="mt-5 d-flex justify-content-center align-items-center">
          <Form
            className="w-50 p-4 rounded-1"
            onSubmit={() => {
              console.log("Hi");
            }}
            style={{
              backgroundColor: "#fbfbfb",
            }}
          >
            <div className="text-center ">
              <h2>Singularity</h2>
            </div>
            {!isSignIn && (
              <Form.Group className="mb-3" controlId="formBasicFirstName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  required={true}
                  placeholder="Enter your name"
                  onChange={getUser}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                required={true}
                placeholder="Enter your email"
                onChange={getUser}
              />
            </Form.Group>
            <Form.Group
              className={["mb-3"].join(" ")}
              controlId="formBasicPassword"
            >
              <Form.Label>Password</Form.Label>
              <div className={Style.password}>
                <Form.Control
                  name="password"
                  placeholder="Enter password"
                  required={true}
                  onChange={getUser}
                  type={passwordShown ? "text" : "password"}
                />

                <FontAwesomeIcon
                  className={[Style.icon, Style.posswordIcon].join(" ")}
                  size="lg"
                  icon={passwordShown ? faEye : faEyeSlash}
                  onClick={togglePassword}
                />
              </div>
            </Form.Group>
            {!isSignIn && (
              <Form.Group
                className={["mb-3"].join(" ")}
                controlId="formBasicConfirmPassword"
              >
                <Form.Label>Confirm Password</Form.Label>
                <div className={Style.confirmPasswrod}>
                  <Form.Control
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required={true}
                    onChange={getUser}
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
              </Form.Group>
            )}
            {!isSignIn && (
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload your picture</Form.Label>
                <Form.Control type="file" />
              </Form.Group>
            )}
            {/* {error.value && error.type === "auth" && (
              <Alert variant="danger">
                <Alert.Heading>{error.message}</Alert.Heading>
              </Alert>
            )} */}

            <Button className="w-100 mb-3" variant="info" type="submit">
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
