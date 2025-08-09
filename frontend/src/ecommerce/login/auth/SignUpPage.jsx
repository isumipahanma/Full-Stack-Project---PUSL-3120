import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./components/SignUpPage.module.css";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import animationData from "./components/Animation.json";
import animationData2 from "./components/Successfully.json";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import Axios from "axios";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  terms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
});

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    // Create the payload as per the backend requirements
    const payload = {
      id: Math.random().toString(36).substr(2, 9), // Generate a unique ID (or use a better ID generator if needed)
      name: values.name,
      email: values.email,
      password: values.password,
    };

    // Send signup data to the backend API
    Axios.post("http://localhost:3001/api/adduserdata", payload)
      .then((response) => {
        console.log("User added successfully:", response.data);
        setShowPopup(true);

        // Automatically navigate to login after a short delay
        setTimeout(() => {
          setShowPopup(false);
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        console.error(
          "Error adding user:",
          error.response?.data?.message || error.message
        );
        setErrors({ email: "Email already exists or other signup issue" });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // Lottie Animation
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const Successfully = {
    loop: false,
    autoplay: true,
    animationData: animationData2,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={styles.container}>
      {/* Close Button */}
      <button
        className={styles.closeButton}
        onClick={() => navigate("/")}
        title="Close"
      >
        <IoMdClose size={24} />
      </button>

      {/* Left Side Animation */}
      <div className={styles.imageSection}>
        <Lottie
          options={defaultOptions}
          height={700}
          width={700}
          isClickToPauseDisabled={true}
        />
      </div>

      {/* Sign Up Form */}
      <div className={styles.formSection}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className={styles.link}>
            Login
          </span>
        </p>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className={styles.form}>
              {/* Name Field */}
              <div className={styles.inputGroup}>
                <Field
                  type="text"
                  name="name"
                  placeholder="Name"
                  className={styles.input}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Email Field */}
              <div className={styles.inputGroup}>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={styles.input}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Password Field */}
              <div className={styles.inputGroup}>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={styles.input}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Confirm Password Field */}
              <div className={styles.inputGroup}>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter Password"
                  className={styles.input}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Terms and Conditions */}
              <div className={styles.checkboxGroup}>
                <Field
                  type="checkbox"
                  name="terms"
                  className={styles.checkbox}
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" className={styles.link}>
                    Terms & Conditions
                  </a>
                </span>
                <ErrorMessage
                  name="terms"
                  component="div"
                  className={styles.error}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitButton}>
                Create an account
              </button>

              <div className={styles.orSection}>Or Register with</div>

              {/* Google Login Button */}
              <button type="button" className={styles.googleButton}>
                <FcGoogle size={20} />
                Log in with Google
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <div className={styles.animationSection}>
              <Lottie
                options={Successfully}
                height={100}
                width={100}
                isClickToPauseDisabled={true}
              />
            </div>
            <p>Account created successfully!</p>
            <p>Redirecting to login...</p>
          </div>
        </div>
      )}
    </div>
  );
};
