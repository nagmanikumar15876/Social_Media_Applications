import React from "react";
import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useSelector } from "react-redux";

const UserChatCard = ({chat}) => {

    const {message , auth} = useSelector(store=>store);

    const otherUser =
                  auth?.user?.id === chat?.users[0]?.id
                    ? chat?.users[1]
                    : chat?.users[0];

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              width: "3.5rem",
              height: "3.5rem",
              fontSize: "1.5rem",
              bgcolor: "#191c29",
              color: "rgb(88,199,250)",
            }}
            src={otherUser?.image}
          />
        }
        action={
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        }
        title={
    chat?.users?.length > 1
    ? (auth.user?.id === chat.users[0].id
        ? chat.users[1].fullName
        : chat.users[0].fullName)
    : "No User"
    }
        subheader={"new message"}
      />
    </Card>
  );
};

export default UserChatCard;