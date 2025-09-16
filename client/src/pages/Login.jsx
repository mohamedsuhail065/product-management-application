import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styles from "./styles/Login.module.css";
import { CiMail } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        values
      );
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Side - Login Form */}
      <div className={styles.leftPane}>
        <h2 className={styles.title}>
          Sign In to
          <br />
          Your Account
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className={styles.form}>
              {errors.general && (
                <div className={styles.error}>{errors.general}</div>
              )}

              <div className={styles.inputGroup}>
                <CiMail size={24} style={{ marginLeft: "10px" }} />
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className={styles.input}
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
              <div className={styles.inputGroup}>
                <IoLockClosedOutline size={24} style={{ marginLeft: "10px" }} />
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={styles.input}
                />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className={styles.error}
              />
              <div className={styles.forgotPwd}>
                <a href="#" className={styles.forgotLink}>
                  forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.signInBtn}
              >
                {isSubmitting ? "Signing in..." : "SIGN IN"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Right Side */}
      <div className={styles.rightPane}>
        <h2 className={styles.welcome}>Hello Friend!</h2>
        <p className={styles.info}>
          Enter your personal details and
          <br />
          start your journey with us
        </p>
        <button
          className={styles.signUpBtn}
          onClick={() => navigate("/register")}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default Login;
