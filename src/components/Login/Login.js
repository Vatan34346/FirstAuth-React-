import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";
import Input from "../UI/Input/input";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../Store/AuthContext";
//function for reducer

const emailReducer = (state, action) => {
  if (action.type === "User Input") {
    return { value: action.val, isValid: action.val.includes("@") };
  }

  if (action.type === "Input blur") {
    return { value: state.value, isValid: state.value.includes("@") };
  }

  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "User Input") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }

  if (action.type === "Input blur") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }

  return { value: "", isValid: false };
};

const Login = (props) => {
  const ctx = useContext(AuthContext);
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  //use ref
  const pasRef = useRef();
  const mailRef = useRef();

  //reducer
  const [emailState, dispachEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });

  const [passState, dispachPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });
  //

  const { isValid: emailIsValid } = emailState;
  const { isValid: passIsValid } = passState; //{x:elias }
  //useEffect
  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Chekin");

      setFormIsValid(emailIsValid && passIsValid);
    }, 500);

    return () => {
      console.log("clean Up"); // clean up function that runs every time sideEffect function exuctions
      clearTimeout(identifier);
    };
  }, [emailIsValid, passIsValid]);

  const emailChangeHandler = (event) => {
    dispachEmail({ type: "User Input", val: event.target.value });

    //  setFormIsValid(event.target.value.includes('@')&&passState)
  };

  const passwordChangeHandler = (event) => {
    dispachPassword({ type: "User Input", val: event.target.value });

    // setFormIsValid(event.target.value.trim().length > 6 && emailState.isValid);
  };

  const validateEmailHandler = () => {
    dispachEmail({ type: "Input blur" });
  };

  const validatePasswordHandler = () => {
    dispachPassword({ type: "Input blur" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      ctx.onLogin(emailState.value, passState.value);
    } else if (!emailIsValid) {
             mailRef.current.focus();
    } else {
    pasRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={mailRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={pasRef}
          id="password"
          label="Password"
          type="password"
          isValid={passIsValid}
          value={passState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
