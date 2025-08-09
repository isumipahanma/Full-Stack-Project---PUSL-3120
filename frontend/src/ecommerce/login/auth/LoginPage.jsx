import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Lottie from "react-lottie";
import animationData from "./components/Animation.json";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io"; // Import close icon
import Axios from "axios"; // Import Axios

// Yup validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Login Page Component
export const LoginPage = () => {
  const [loginError, setLoginError] = useState(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {},
  };
  const navigate = useNavigate();

  // Function to handle Sign Up navigation
  const handleSignUpClick = () => {
    navigate("/signin"); // Navigate to the Sign-Up page
  };

  // Handle form submission
  const handleLoginSubmit = async (values) => {
    setLoginError(null); // Clear previous error message

    try {
      // Check if it's admin login first
      if (
        values.email === "admin@gmail.com" &&
        values.password === "admin123"
      ) {
        // If admin credentials are correct, store admin data and login status
        const adminData = {
          email: "admin@gmail.com",
          role: "admin",
        };
        localStorage.setItem("user", JSON.stringify(adminData));
        localStorage.setItem("isLoggedIn", "true"); // Set login status

        console.log("Login status:", localStorage.getItem("isLoggedIn")); // Log status to console

        navigate("/admin"); // Redirect to admin page
        return;
      }

      // If not admin, check user credentials from the backend
      const response = await Axios.get("http://localhost:3001/api/userdata", {
        params: { email: values.email }, // Send email as a query parameter
      });

      const user = response.data.response; // Get the user from the response

      // Check if user exists and the password matches
      if (user && user.password === values.password) {
        // If credentials are correct, store user data in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true"); // Set login status

        console.log("Login status:", localStorage.getItem("isLoggedIn")); // Log status to console

        navigate("/"); // Redirect to user page
      } else {
        setLoginError("Incorrect email or password");
      }
    } catch (error) {
      console.log("Error:", error);
      setLoginError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Close Button */}
      <button
        className={styles.closeButton}
        onClick={() => navigate("/")} // Navigate to the home page
        title="Close"
      >
        <IoMdClose size={24} />
      </button>

      {/* Left Side Image */}
      <div className={styles.imageSection}>
        <Lottie
          options={defaultOptions}
          height={700}
          width={700}
          isClickToPauseDisabled={true}
        />
      </div>

      {/* Right Side Form */}
      <div className={styles.formSection}>
        <h1 className={styles.title}>Welcome back!</h1>
        <p className={styles.subtitle}>Please enter your details</p>

        {/* Login Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLoginSubmit}
        >
          {() => (
            <Form className={styles.form}>
              {/* Email Input */}
              <div className={styles.inputGroup}>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={styles.input}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Password Input */}
              <div className={styles.inputGroup}>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className={styles.input}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Show error if login fails */}
              {loginError && <div className={styles.error}>{loginError}</div>}

              {/* Options */}
              <div className={styles.options}>
                <label className={styles.remember}>
                  <Field type="checkbox" name="remember" />
                  Remember for 30 days
                </label>
                <button type="button" className={styles.forgotPassword}>
                  Forget password
                </button>
              </div>

              {/* Log In Button */}
              <button type="submit" className={styles.loginButton}>
                Log in
              </button>

              {/* Log In with Google */}
              <button type="button" className={styles.googleButton}>
                <FcGoogle size={20} />
                Log in with Google
              </button>

              {/* Footer */}
              <div className={styles.footer}>
                <span>Don't have an account?</span>
                <button
                  type="button"
                  className={styles.signUpLink}
                  onClick={handleSignUpClick}
                >
                  Sign up
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
