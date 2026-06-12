import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Avatar
} from "@mui/material";
import { useDispatch , useSelector } from "react-redux";
import { searchUser } from "../../Store/Auth/Action";
import { store } from "../../Store/store";
import { createChat } from "../../Store/Message/Action";

const SearchUser = () => {

    const [userName, setUserName] = useState("");
    const dispatch = useDispatch();
    const {message , auth} = useSelector(store=>store);



  const handleSearchUser = (e) => {
    const value = e.target.value;

    setUserName(value);

    dispatch(searchUser(value));
};

  const handleClick = (id) => {
    dispatch(createChat({ userId: id }));

    setUserName("");   

    console.log("Selected User Id:", id);
};
  return (
    <div>
      {/* Search Input */}
      <div className="py-5 relative">
        <input
          value={userName}
          className="bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full"
          placeholder="search user..."
          onChange={handleSearchUser}
          type="text"
        />

        {userName && (
        auth.searchResult?.map((chat) => (<Card key={chat.id} className="absolute w-full top-[4.5rem] cursor-pointer z-10">
          <CardHeader
            onClick={() => handleClick(chat.id)}
            setUserName={""}
            avatar={
              <Avatar
                src={chat.image}
              />
            }

            title={chat.fullName}
            subheader={chat.fullName.toLowerCase().split(" ").join("_")}
          />
        </Card>))
      )}
      </div>
    </div>
  );
};

export default SearchUser;