import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, TextField, CircularProgress } from "@mui/material";
import { createClub } from "../../Store/Club/Action";
import { uploadToCloudinary } from "../../Utils/UploadToCloudinary"; // Adjust path if needed
import ImageIcon from "@mui/icons-material/Image";

const CreateClubForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((store) => store);
  const [uploadingImage, setUploadingImage] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: "",
      googleFormLink: "",
      presidentId: "",
      vicePresidentId: "",
    },
    onSubmit: (values) => {
      dispatch(createClub(values));
      // After creating, redirect back to the clubs directory
      navigate("/clubs"); 
    },
  });

  const handleSelectImage = async (event) => {
    setUploadingImage(true);
    const imgUrl = await uploadToCloudinary(event.target.files[0], "image");
    formik.setFieldValue("image", imgUrl);
    setUploadingImage(false);
  };

  return (
    <div className={`p-5 max-w-2xl mx-auto ${theme.currentTheme === "dark" ? "text-white" : "text-black"}`}>
      <h1 className="text-2xl font-bold mb-8">Create New Campus Club</h1>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        
        {/* Image Upload Section */}
        <div className="flex items-center space-x-5">
          <label className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700">
            <ImageIcon />
            <span>{uploadingImage ? "Uploading..." : "Upload Club Logo"}</span>
            <input
              type="file"
              name="imageFile"
              className="hidden"
              onChange={handleSelectImage}
            />
          </label>
          {formik.values.image && (
            <img src={formik.values.image} alt="Club Logo" className="w-16 h-16 rounded-full object-cover" />
          )}
        </div>

        {/* Form Fields */}
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Club Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
          sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          id="description"
          name="description"
          label="Club Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
          sx={{ textarea: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
        />

        <TextField
          fullWidth
          id="googleFormLink"
          name="googleFormLink"
          label="Google Form Link (For Recruitment - Optional)"
          value={formik.values.googleFormLink}
          onChange={formik.handleChange}
          InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
          sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            fullWidth
            type="number"
            id="presidentId"
            name="presidentId"
            label="President's User ID"
            value={formik.values.presidentId}
            onChange={formik.handleChange}
            InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
            sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
          />

          <TextField
            fullWidth
            type="number"
            id="vicePresidentId"
            name="vicePresidentId"
            label="Vice President's User ID"
            value={formik.values.vicePresidentId}
            onChange={formik.handleChange}
            InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
            sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          disabled={uploadingImage}
          sx={{
            width: "100%",
            borderRadius: "29px",
            py: "15px",
            bgcolor: "#1e88e5",
          }}
        >
          {uploadingImage ? <CircularProgress size={24} color="inherit" /> : "Create Club"}
        </Button>
      </form>
    </div>
  );
};

export default CreateClubForm;