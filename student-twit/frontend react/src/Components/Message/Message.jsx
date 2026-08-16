import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton
} from "@mui/material";

import WestIcon from "@mui/icons-material/West";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SearchUser from "../SearchUser/SearchUser";
import ChatMessage from "../Message/ChatMessage";
import UserChatCard from "../SearchUser/UserChatCard";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, getAllChats } from "../../Store/Message/Action";
import { ChatBubbleOutline } from "@mui/icons-material";
import { uploadToCloudinary } from "../../Utils/UploadToCloudinary";
import SockJS from "sockjs-client";
import Stom from "stompjs";
import { MOVE_CHAT_TO_TOP } from "../../Store/Message/ActionType";
import { useNavigate } from "react-router-dom";

const Message = () => {

    const dispatch = useDispatch();
    const {message , auth} = useSelector(store=>store);
    const [currentChat,setCurrentChat]=useState(null);
    const [messages,setMessages]=React.useState([]);
    const [selectedImage,setSelectedImage]=React.useState("");
    const [loading,setLoading]=React.useState(false); 
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [openImage, setOpenImage] = useState(null);


    const navigate = useNavigate();
    const scrollToBottom = () => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
    }
    };

    useEffect(() => {
    if (!auth.user) {
        navigate("/signin");
    }
    }, [auth.user, navigate]);
    
    useEffect(() => {
        scrollToBottom();
        }, [messages]);

    useEffect(() => {
        // Fetch initial chat data or perform any setup if needed
        dispatch(getAllChats());
    }, []);

    console.log("message ",message)

  const handleSelectImage = async (event) => {
    setLoading(true);
    const imageUrl = await uploadToCloudinary(event.target.files[0],"image");
    setSelectedImage(imageUrl);
    setLoading(false);
    console.log("handle select image...");
  };

  const handleCreateMessage = (value) => {
      const message = {
          chatId: currentChat?.id,
          content: value,
          image: selectedImage
      };

      dispatch(createMessage({message , sendMessageToServer}));

      dispatch({
          type: MOVE_CHAT_TO_TOP,
          payload: currentChat
      });
  };

  // useEffect(() => {
  //       if(message.message){
  //           setMessages(prev => [...prev, message.message]);
  //       }
  //   }, [message.message]);

    // websocket implementation


    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const sock = new SockJS("http://localhost:5454/ws");
        const stomp = Stom.over(sock);
        setStompClient(stomp);

        stomp.connect({}, onConnect, onErr);
        }, []);

        const onConnect = () => {
            console.log("...web socket connected...");
        }

        const onErr = (error) => {
            console.error("Error occurred while connecting to WebSocket");
        }

        useEffect(() => {
          if (stompClient && currentChat) {

              const subscription = stompClient.subscribe(
                  `/user/${currentChat.id}/private`,
                  onMessageReceived
              );

              return () => subscription.unsubscribe();
          }
      }, [stompClient, currentChat]);


      const onMessageReceived = (payload) => {
        const receivedMessage = JSON.parse(payload.body);
        console.log("message received from websocket ", receivedMessage);

        setMessages(prev => [...prev, receivedMessage]);
    };

         //send message to server
         
         const sendMessageToServer = (newMessage) => {
            if(stompClient && newMessage){
              stompClient.send(`/app/chat/${currentChat?.id.toString()}`, {}, JSON.stringify(newMessage));
            }
          }

          const otherUser =
                  auth?.user?.id === currentChat?.users[0]?.id
                    ? currentChat?.users[1]
                    : currentChat?.users[0];


  return (
    <div>
      <Grid
        container
        className="h-screen overflow-hidden"
      >
        {/* LEFT SECTION */}
        <Grid
              item
              xs={3}
              className="px-5 h-screen"
            >
       <div className="flex h-full justify-between space-x-2">

            <div className="w-full">

              <div className="sticky top-0 z-50  flex space-x-4 items-center py-5">
                   <div className="flex space-x-4 items-center py-5">
                        <WestIcon
                          className="cursor-pointer"
                          onClick={() => navigate(-1)}
                        />
                        <h1 className="text-xl font-bold">Home</h1>
                    </div>
              </div>

             <div className="flex flex-col h-[83vh]">

              <div className="pb-3">
                  <SearchUser />
              </div>

              <div className="flex-1 overflow-y-auto hideScrollbar space-y-4">

                    {message?.chats?.map((item) => {
                       return <div onClick={() => {setCurrentChat(item);
                        setMessages(item.messages);
                       }}
                       >
                        <UserChatCard chat={item} />
                        </div>
                    })}
        
              </div>

              </div>

            </div>

          </div>
        </Grid>

        {/* RIGHT SECTION */}
        <Grid
          item
          xs={9}
          className="h-full"
        >
          {currentChat ? 
            <div>

            {/* CHAT HEADER */}
            <div className="sticky top-0 z-50  flex justify-between items-center border-b p-5">

              <div className="flex items-center space-x-3">

                

                <Avatar src={otherUser?.image} />

                <p>{otherUser?.fullName}</p>

              </div>

              <div className="flex space-x-3">

                <IconButton>
                  <AddIcCallIcon />
                </IconButton>

                <IconButton>
                  <VideoCallIcon />
                </IconButton>

              </div>

            </div>

            {/* MESSAGES */}
            <div
                ref={chatContainerRef}
                className="hideScrollbar overflow-y-scroll h-[calc(100vh-150px)] px-2 space-y-5 py-5"
            >
                {messages.map((item) => (
                    <ChatMessage
                        key={item.id}
                        item={item}
                        onImageClick={(imageUrl) => setOpenImage(imageUrl)}
                    />
                    ))}

                <div ref={messagesEndRef}></div>
                </div>
                            {/* INPUT SECTION */}
            <div className="sticky bottom-0 ">
                {selectedImage && (
                  <img className="w-[5rem] h-[5rem] object-cover px-2" src={selectedImage} alt="" />
                )}
              <div className="py-5 flex items-center justify-center space-x-5">
            
                <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && messageText.trim()) {
                        handleCreateMessage(messageText);

                        setMessageText("");     // clear text
                        setSelectedImage("");   // clear image
                        }
                    }}
                    className="bg-transparent border border-[#3b4054] rounded-full w-[90%] py-3 px-5"
                    placeholder="Type message..."
                    type="text"
                    />

                <div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSelectImage}
                    className="hidden"
                    id="image-input"
                  />

                  <label htmlFor="image-input">
                    <AddPhotoAlternateIcon />
                  </label>

                </div>

              </div>

            </div>

          </div> : <div className="h-full space-y-5 flex flex-col justify-center items-center">  
            <ChatBubbleOutline className="text-gray-500" style={{ fontSize: 125 }} />
            <h1 className="text-2xl font-bold">Select a chat to start messaging</h1>
             <p className="text-gray-500">Your messages will appear here</p>

            </div>}
        </Grid>

      </Grid>

        <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        >
        <CircularProgress color="inherit" />
        </Backdrop>

        {openImage && (
            <div
                className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                onClick={() => setOpenImage(null)}
            >
                <img
                src={openImage}
                alt=""
                className="max-w-[90vw] max-h-[90vh] rounded-lg"
                />
            </div>
            )}
    </div>
  );
};

export default Message;