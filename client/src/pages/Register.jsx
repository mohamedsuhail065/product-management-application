import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import styles from "./styles/Register.module.css";

const Register = () => {
  const navigate = useNavigate();

  const initialValues = { name: "", email: "", password: "", confirmPassword: "" };

  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters").required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { name, email, password } = values;
      await axios.post("http://localhost:5000/api/users/register", { name, email, password });
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
      <div className={styles.leftPane}>
        <h2 className={styles.welcome}>Welcome Back!</h2>
        <p className={styles.info}>To keep connected with us please<br />login with your personal info</p>
        <button className={styles.signInBtn} onClick={() => navigate("/")}>SIGN IN</button>
      </div>
      <div className={styles.rightPane}>
        <h2 className={styles.title}>Create Account</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, errors }) => (
            <Form className={styles.form}>
              {errors.general && <div className={styles.error}>{errors.general}</div>}

              <div className={styles.inputGroup}>
                <span className={styles.icon}><i className="fas fa-user" /></span>
                <Field type="text" name="name" placeholder="Name" className={styles.input} />
                <ErrorMessage name="name" component="div" className={styles.error} />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.icon}><i className="fas fa-envelope" /></span>
                <Field type="email" name="email" placeholder="Email" className={styles.input} />
                <ErrorMessage name="email" component="div" className={styles.error} />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.icon}><i className="fas fa-lock" /></span>
                <Field type="password" name="password" placeholder="Password" className={styles.input} />
                <ErrorMessage name="password" component="div" className={styles.error} />
              </div>

              <button type="submit" disabled={isSubmitting} className={styles.signUpBtn}>
                {isSubmitting ? "Registering..." : "SIGN UP"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
