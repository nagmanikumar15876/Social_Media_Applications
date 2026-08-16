import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getClubById, getClubEvents } from "../../Store/Club/Action";
import { Avatar, Button, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ClubDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { club, auth, theme } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getClubById(id));
    dispatch(getClubEvents(id));
  }, [dispatch, id]);

  const currentClub = club.club;
  const events = club.events || [];

  // Check if the logged-in user is the President or Main Admin
  const isPresident = currentClub?.president?.id === auth.user?.id;
  const isAdmin = auth.user?.role === "ROLE_ADMIN";
  const canManage = isPresident || isAdmin;

  if (!currentClub) return <div className="p-5 text-center">Loading club details...</div>;

  return (
    <div className={`min-h-screen ${theme.currentTheme === "dark" ? "text-white" : "text-black"}`}>
      
      {/* Top Navigation Bar */}
      <section className="flex items-center space-x-4 p-5 border-b border-gray-700">
        <ArrowBackIcon className="cursor-pointer" onClick={() => navigate("/clubs")} />
        <h1 className="text-xl font-bold opacity-90">{currentClub.name}</h1>
      </section>

      {/* Club Banner/Logo */}
      <section>
        <img 
          src={currentClub.image || "https://res.cloudinary.com/dnbw04gbs/image/upload/v1690640953/campus_default_club_ex8z0z.png"} 
          alt={currentClub.name} 
          className="w-full h-[30vh] object-cover"
        />
      </section>

      {/* Club Info & Dynamic Join Button */}
      <section className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{currentClub.name}</h1>
            <p className="text-gray-500 mt-2">
              President: {currentClub.president?.fullName || "Not Assigned"}
            </p>
          </div>

          <div className="flex space-x-3">
            {/* THE DYNAMIC GOOGLE FORM BUTTON */}
            {currentClub.googleFormLink && (
              <Button 
                variant="contained" 
                href={currentClub.googleFormLink} 
                target="_blank" // Opens the Google Form in a new tab!
                sx={{ borderRadius: "20px", bgcolor: "#1e88e5", textTransform: "none" }}
              >
                Join Club
              </Button>
            )}

            {/* MANAGEMENT DASHBOARD BUTTON (Only for President/Admin) */}
            {canManage && (
              <Button 
                variant="outlined" 
                onClick={() => navigate(`/clubs/${id}/manage`)}
                startIcon={<SettingsIcon />}
                sx={{ borderRadius: "20px", textTransform: "none" }}
              >
                Manage
              </Button>
            )}
          </div>
        </div>

        <p className="mt-5 text-lg leading-relaxed opacity-90">
          {currentClub.description}
        </p>
      </section>

      <Divider sx={{ bgcolor: "gray.700" }} />

      {/* Upcoming Events Section */}
      <section className="p-5">
        <h2 className="text-2xl font-bold mb-5 flex items-center">
          <EventIcon className="mr-2" /> Upcoming Events
        </h2>
        
        {events.length === 0 ? (
          <p className="text-gray-500">No events scheduled right now.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-700 p-4 rounded-xl flex items-center space-x-5">
                {event.image && (
                  <img src={event.image} alt="Event" className="w-24 h-24 object-cover rounded-md" />
                )}
                <div>
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p className="text-gray-400 mt-1">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                    <span className="flex items-center"><EventIcon fontSize="small" className="mr-1" /> {new Date(event.date).toLocaleDateString()}</span>
                    <span className="flex items-center"><LocationOnIcon fontSize="small" className="mr-1" /> {event.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default ClubDetails;