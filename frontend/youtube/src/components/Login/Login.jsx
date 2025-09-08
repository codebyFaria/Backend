import { useForm } from "react-hook-form";
import { Input } from "../index.js";
import { Button } from "../index.js";
import style from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/actions"; // adjust import

const Login = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.isLoggedIn);

  const onLogin = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch(login(userData)); // redux action
        navigate("/"); // redirect
      } else {
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.loginBox}>
        <p>
          If you don't have an account, please
          <Link to="/signup">
            {" "}
            <span>Sign Up</span>{" "}
          </Link>
        </p>
        <form onSubmit={handleSubmit(onLogin)}>
          <Input
            type="email"
            placeholder="Enter Your Email"
            name="email"
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <Input
            type="password"
            placeholder="Enter Your Password"
            label="Password"
            name="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <Button
            style={{
              width: "100%",
              paddingBottom: "0px",
              marginTop: "20px",
            }}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
