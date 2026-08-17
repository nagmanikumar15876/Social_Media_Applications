import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert
} from "@mui/material";

import { useFormik } from "formik";
import React from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";

import { registerUser } from "../../Store/Auth/Action";

const validationSchema =
  Yup.object().shape({

    fullName: Yup.string()
      .trim()
      .required("Full Name is required"),

    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("College email is required")
      .test(
        "college-email",
        "Use your @nitp.ac.in college email",
        (value) =>
          value
            ?.toLowerCase()
            .endsWith("@nitp.ac.in")
      ),

    password: Yup.string()
      .required("Password is required")
      .min(
        8,
        "Password must be at least 8 characters"
      ),

    dateOfBirth: Yup.object()
      .shape({

        day: Yup.string()
          .required("Day is required"),

        month: Yup.string()
          .required("Month is required"),

        year: Yup.string()
          .required("Year is required")

      })
  });

const days =
  Array.from(
    { length: 31 },
    (_, index) => index + 1
  );

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

const currentYear =
  new Date().getFullYear();

const years =
  Array.from(
    { length: 100 },
    (_, index) =>
      currentYear - index
  );

const SignupForm = () => {

  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const formik =
    useFormik({

      initialValues: {

        fullName: "",

        email: "",

        password: "",

        dateOfBirth: {
          day: "",
          month: "",
          year: ""
        }

      },

      validationSchema,

      onSubmit: async (values) => {

        const {
          day,
          month,
          year
        } = values.dateOfBirth;

        /*
         * Backend field is birthDate.
         */
        const birthDate =
          `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        /*
         * Send ONLY fields needed for signup.
         */
        const data = {

          fullName:
            values.fullName.trim(),

          email:
            values.email
              .trim()
              .toLowerCase(),

          password:
            values.password,

          birthDate

        };

        console.log(
          "SIGNUP DATA:",
          data
        );

        const result =
          await dispatch(
            registerUser(data)
          );

        if (result.success) {

          localStorage.setItem(
            "verificationEmail",
            data.email
          );

          navigate(
            "/verify-otp",
            {
              state: {
                email: data.email
              }
            }
          );
        }
      }
    });

  const handleDateChange =
    (name) =>
    (event) => {

      formik.setFieldValue(
        "dateOfBirth",
        {
          ...formik.values.dateOfBirth,
          [name]:
            event.target.value
        }
      );
    };

  return (

    <form
      onSubmit={
        formik.handleSubmit
      }
    >

      <Grid
        container
        spacing={2}
      >

        <Grid
          item
          xs={12}
        >

          <TextField
            name="fullName"
            label="Full Name"
            fullWidth
            value={
              formik.values.fullName
            }
            onChange={
              formik.handleChange
            }
            onBlur={
              formik.handleBlur
            }
            error={
              formik.touched.fullName &&
              Boolean(
                formik.errors.fullName
              )
            }
            helperText={
              formik.touched.fullName &&
              formik.errors.fullName
            }
          />

        </Grid>

        <Grid
          item
          xs={12}
        >

          <TextField
            name="email"
            label="College Email"
            placeholder="example@nitp.ac.in"
            fullWidth
            value={
              formik.values.email
            }
            onChange={
              formik.handleChange
            }
            onBlur={
              formik.handleBlur
            }
            error={
              formik.touched.email &&
              Boolean(
                formik.errors.email
              )
            }
            helperText={
              formik.touched.email &&
              formik.errors.email
            }
          />

        </Grid>

        <Grid
          item
          xs={12}
        >

          <TextField
            name="password"
            label="Password"
            fullWidth
            type="password"
            value={
              formik.values.password
            }
            onChange={
              formik.handleChange
            }
            onBlur={
              formik.handleBlur
            }
            error={
              formik.touched.password &&
              Boolean(
                formik.errors.password
              )
            }
            helperText={
              formik.touched.password &&
              formik.errors.password
            }
          />

        </Grid>

        <Grid
          item
          xs={12}
        >

          <InputLabel>
            Date of Birth
          </InputLabel>

        </Grid>

        <Grid
          item
          xs={4}
        >

          <Select
            fullWidth
            value={
              formik.values.dateOfBirth.day
            }
            onChange={
              handleDateChange("day")
            }
          >

            {days.map(
              (day) => (

                <MenuItem
                  key={day}
                  value={day}
                >
                  {day}
                </MenuItem>

              )
            )}

          </Select>

        </Grid>

        <Grid
          item
          xs={4}
        >

          <Select
            fullWidth
            value={
              formik.values.dateOfBirth.month
            }
            onChange={
              handleDateChange("month")
            }
          >

            {months.map(
              (month) => (

                <MenuItem
                  key={month.value}
                  value={month.value}
                >
                  {month.label}
                </MenuItem>

              )
            )}

          </Select>

        </Grid>

        <Grid
          item
          xs={4}
        >

          <Select
            fullWidth
            value={
              formik.values.dateOfBirth.year
            }
            onChange={
              handleDateChange("year")
            }
          >

            {years.map(
              (year) => (

                <MenuItem
                  key={year}
                  value={year}
                >
                  {year}
                </MenuItem>

              )
            )}

          </Select>

        </Grid>

        <Grid
          item
          xs={12}
        >

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              borderRadius: "29px",
              py: "15px",
              bgcolor: "#1d9bf0"
            }}
          >
            Create Account
          </Button>

        </Grid>

      </Grid>

    </form>
  );
};

export default SignupForm;