import React, {
  useEffect,
  useState
} from "react";

import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Typography
} from "@mui/material";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import axios from "axios";

import {
  API_BASE_URL
} from "../../Config/apiConfig";

const VerifyOtp = () => {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [email] =
    useState(
      location.state?.email ||
      localStorage.getItem(
        "verificationEmail"
      ) ||
      ""
    );

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [resendSeconds, setResendSeconds] =
    useState(0);

  useEffect(() => {

    if (!email) {

      navigate("/signup");
    }

  }, [email, navigate]);

  useEffect(() => {

    if (resendSeconds <= 0) {
      return;
    }

    const timer =
      setInterval(() => {

        setResendSeconds(
          previous =>
            previous > 0
              ? previous - 1
              : 0
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [resendSeconds]);

  const handleOtpChange =
    (event) => {

      const value =
        event.target.value
          .replace(/\D/g, "")
          .slice(0, 6);

      setOtp(value);
      setError("");
    };

  const handleVerify =
    async () => {

      if (otp.length !== 6) {

        setError(
          "Please enter the 6-digit OTP."
        );

        return;
      }

      try {

        setLoading(true);
        setError("");
        setSuccess("");

        await axios.post(
          `${API_BASE_URL}/auth/verify-otp`,
          null,
          {
            params: {
              email,
              otp
            }
          }
        );

        localStorage.removeItem(
          "verificationEmail"
        );

        setSuccess(
          "Email verified successfully. Redirecting to login..."
        );

        setTimeout(() => {

          navigate("/signin");

        }, 1000);

      } catch (error) {

        setError(
          error.response?.data?.message ||
          error.response?.data ||
          "Invalid OTP."
        );

      } finally {

        setLoading(false);
      }
    };

  const handleResend =
    async () => {

      if (resendSeconds > 0) {
        return;
      }

      try {

        setResending(true);
        setError("");
        setSuccess("");

        await axios.post(
          `${API_BASE_URL}/auth/resend-otp`,
          null,
          {
            params: {
              email
            }
          }
        );

        setOtp("");

        setSuccess(
          "A new OTP has been sent to your college email."
        );

        setResendSeconds(60);

      } catch (error) {

        setError(
          error.response?.data?.message ||
          error.response?.data ||
          "Unable to resend OTP."
        );

      } finally {

        setResending(false);
      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <Typography
          variant="h4"
          fontWeight="700"
          textAlign="center"
        >
          Verify Your College Email
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 1 }}
        >
          We sent a 6-digit OTP to
        </Typography>

        <Typography
          fontWeight="600"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          {email}
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          inputProps={{
            maxLength: 6,
            inputMode: "numeric"
          }}
        />

        <Button
          fullWidth
          variant="contained"
          disabled={
            loading ||
            otp.length !== 6
          }
          onClick={handleVerify}
          sx={{
            mt: 3,
            borderRadius: "30px",
            py: 1.5
          }}
        >

          {loading ? (
            <CircularProgress
              size={24}
              color="inherit"
            />
          ) : (
            "Verify Email"
          )}

        </Button>

        <Button
          fullWidth
          disabled={
            resending ||
            resendSeconds > 0
          }
          onClick={handleResend}
          sx={{ mt: 1 }}
        >

          {resending
            ? "Sending..."
            : resendSeconds > 0
            ? `Resend OTP in ${resendSeconds}s`
            : "Resend OTP"
          }

        </Button>

        <Button
          fullWidth
          onClick={() =>
            navigate("/signin")
          }
        >
          Back to Sign In
        </Button>

      </div>

    </div>
  );
};

export default VerifyOtp;