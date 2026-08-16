import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';

const ClubCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/clubs/${item.id}`)}
      className="cursor-pointer border border-gray-700 p-4 rounded-xl hover:bg-gray-800 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        {/* Club Image/Logo */}
        <img 
          src={item.image || "https://res.cloudinary.com/dnbw04gbs/image/upload/v1690640953/campus_default_club_ex8z0z.png"} 
          alt={item.name} 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        
        {/* Club Name & Description */}
        <h1 className="text-xl font-bold mb-2">{item.name}</h1>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
          {item.description}
        </p>
      </div>

      {/* President Info at the bottom */}
      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-700">
        <Avatar src={item.president?.image} alt={item.president?.fullName} sx={{ width: 32, height: 32 }} />
        <div>
          <p className="text-xs text-gray-500">President</p>
          <p className="text-sm font-semibold">{item.president?.fullName || "Not Assigned"}</p>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;