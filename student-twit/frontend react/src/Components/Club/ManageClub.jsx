import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { Button, TextField, CircularProgress, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// Import your Redux actions (Make sure you add deleteClub to your actions!)
import { getClubById, updateClub, createClubEvent, getClubEvents } from "../../Store/Club/Action";
import { uploadToCloudinary } from "../../Utils/UploadToCloudinary";

const ManageClub = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { club, auth, theme } = useSelector((store) => store);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    dispatch(getClubById(id));
    dispatch(getClubEvents(id));
  }, [dispatch, id]);

  const currentClub = club.club;
  const isAdmin = auth.user?.role === "ROLE_ADMIN"; // Check if Super Admin

  // Formik for updating the Google Form Link (Recruitment)
  const linkFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      googleFormLink: currentClub?.googleFormLink || "",
    },
    onSubmit: (values) => {
      dispatch(updateClub(id, values));
      alert("Recruitment Link Updated!");
    },
  });

  // NEW: Formik for Super Admin to change the President/Name
  const adminEditFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentClub?.name || "",
      description: currentClub?.description || "",
      presidentId: currentClub?.president?.id || "",
    },
    onSubmit: (values) => {
      dispatch(updateClub(id, values));
      alert("Club Details Updated!");
    },
  });

  // Formik for creating a new Event
  const eventFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      venue: "",
      date: "",
      image: "",
      clubId: id, 
    },
    onSubmit: (values) => {
      dispatch(createClubEvent(values));
      eventFormik.resetForm();
      alert("Event Created Successfully!");
      dispatch(getClubEvents(id)); 
    },
  });

  const handleSelectEventImage = async (event) => {
    setUploadingImage(true);
    const imgUrl = await uploadToCloudinary(event.target.files[0], "image");
    eventFormik.setFieldValue("image", imgUrl);
    setUploadingImage(false);
  };

  // NEW: Handle Deleting the Club
  const handleDeleteClub = async () => {
    if (window.confirm("Are you sure you want to completely delete this club? This action cannot be undone.")) {
      // NOTE: You will need to add a deleteClub action to your Redux Action.js file
      // dispatch(deleteClub(id)); 
      alert("Club Deleted! (Make sure you implement the delete action in Redux)");
      navigate("/clubs");
    }
  };

  if (!currentClub) return <div className="p-5">Loading...</div>;

  return (
    <div className={`min-h-screen p-5 ${theme.currentTheme === "dark" ? "text-white" : "text-black"}`}>
      
      <section className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <ArrowBackIcon className="cursor-pointer" onClick={() => navigate(`/clubs/${id}`)} />
          <h1 className="text-2xl font-bold">Manage: {currentClub.name}</h1>
        </div>

        {/* ADMIN SUPER POWER: DELETE BUTTON */}
        {isAdmin && (
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClub}
          >
            Delete Club
          </Button>
        )}
      </section>

      {/* --- SECTION 1: SUPER ADMIN EDIT (Only Admin sees this) --- */}
      {isAdmin && (
        <section className="mb-10 p-5 border border-red-900 bg-red-900/10 rounded-xl">
          <h2 className="text-xl font-bold mb-2 flex items-center text-red-500">
            <AdminPanelSettingsIcon className="mr-2" /> Admin Controls
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Change the club's core details or reassign the President.
          </p>
          
          <form onSubmit={adminEditFormik.handleSubmit} className="space-y-4">
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Edit Club Name"
              value={adminEditFormik.values.name}
              onChange={adminEditFormik.handleChange}
              InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
              sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
            />
            <div className="flex space-x-3">
              <TextField
                fullWidth
                id="presidentId"
                name="presidentId"
                label="New President User ID"
                value={adminEditFormik.values.presidentId}
                onChange={adminEditFormik.handleChange}
                InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
                sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
              />
              <Button type="submit" variant="contained" color="error">
                Update
              </Button>
            </div>
          </form>
        </section>
      )}

      {/* --- SECTION 2: RECRUITMENT LINK (Both Admin and President see this) --- */}
      <section className="mb-10 p-5 border border-gray-700 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Recruitment Settings</h2>
        <p className="text-sm text-gray-500 mb-4">
          Paste a Google Form link here to turn ON the "Join Club" button.
        </p>
        
        <form onSubmit={linkFormik.handleSubmit} className="flex space-x-3">
          <TextField
            fullWidth
            id="googleFormLink"
            name="googleFormLink"
            label="Google Form URL"
            value={linkFormik.values.googleFormLink}
            onChange={linkFormik.handleChange}
            InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
            sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
          />
          <Button type="submit" variant="contained" sx={{ bgcolor: "#1e88e5" }}>
            Save Link
          </Button>
        </form>
      </section>

      <Divider sx={{ bgcolor: "gray.700", my: 5 }} />

      {/* --- SECTION 3: CREATE EVENT (Both Admin and President see this) --- */}
      <section className="p-5 border border-gray-700 rounded-xl">
        <h2 className="text-xl font-bold mb-5">Create New Event</h2>
        {/* ... (Keep the exact same event form code here from my previous message) ... */}
         <form onSubmit={eventFormik.handleSubmit} className="space-y-5">
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Event Title"
            value={eventFormik.values.title}
            onChange={eventFormik.handleChange}
            InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
            sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            id="description"
            name="description"
            label="Event Description"
            value={eventFormik.values.description}
            onChange={eventFormik.handleChange}
            InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
            sx={{ textarea: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              id="venue"
              name="venue"
              label="Venue / Location"
              value={eventFormik.values.venue}
              onChange={eventFormik.handleChange}
              InputLabelProps={{ style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
              sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
              required
            />
            
            <TextField
              fullWidth
              type="datetime-local"
              id="date"
              name="date"
              label="Event Date & Time"
              value={eventFormik.values.date}
              onChange={eventFormik.handleChange}
              InputLabelProps={{ shrink: true, style: { color: theme.currentTheme === "dark" ? "gray" : "black" } }}
              sx={{ input: { color: theme.currentTheme === "dark" ? "white" : "black" } }}
              required
            />
          </div>

          <div className="flex items-center space-x-5">
            <label className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-700">
              <ImageIcon />
              <span>{uploadingImage ? "Uploading Poster..." : "Upload Event Poster"}</span>
              <input type="file" className="hidden" onChange={handleSelectEventImage} />
            </label>
            {eventFormik.values.image && (
              <img src={eventFormik.values.image} alt="Event Poster" className="w-16 h-16 rounded-md object-cover" />
            )}
          </div>

          <Button
            type="submit"
            variant="contained"
            disabled={uploadingImage}
            sx={{ width: "100%", borderRadius: "20px", py: "10px", bgcolor: "#1e88e5" }}
          >
            Create Event
          </Button>
        </form>
      </section>

    </div>
  );
};

export default ManageClub;