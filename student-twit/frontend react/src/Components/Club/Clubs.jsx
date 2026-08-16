import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllClubs } from '../../Store/Club/Action';
import ClubCard from './ClubCard';
import { Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Clubs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Bring in the club state and auth state from Redux
  const { club, auth, theme } = useSelector((store) => store);

  // Automatically fetch clubs when this page loads
  useEffect(() => {
    dispatch(getAllClubs());
  }, [dispatch]);

  // Check if the current logged-in user is the Main Admin
  const isAdmin = auth.user?.role === "ROLE_ADMIN";

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <section className="flex justify-between items-center py-5">
        <h1 className="text-2xl font-bold opacity-90">Campus Clubs</h1>
        
        {/* Only Admin can see this Create button */}
        {isAdmin && (
          <Button 
            onClick={() => navigate("/clubs/create")}
            variant="contained" 
            startIcon={<AddCircleIcon />}
            sx={{ borderRadius: "20px", textTransform: "none" }}
          >
            Create New Club
          </Button>
        )}
      </section>

      {/* Clubs Grid Section */}
      <section className={`p-5 rounded-md min-h-screen ${theme.currentTheme === "dark" ? "bg-[#151515]" : "bg-gray-50"}`}>
        {club.clubs?.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">No clubs found on campus.</p>
            {isAdmin && <p className="mt-2">Click the button above to create the first one!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {club.clubs?.map((item) => (
              <ClubCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Clubs;