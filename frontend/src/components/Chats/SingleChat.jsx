import {
  Box,
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatContext";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import ScrollableChat from "./SrcollableChat";
import { useCallback, useEffect, useState } from "react";
import instance from "../../axios";
import { io } from "socket.io-client";


const ENDPOINT = "https://chat-app-aftab.onrender.com";
// const ENDPOINT = "http://localhost:4200";

let socket, selectedChatCompare;

const SingleChat = () => {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [socketConnection, setSocketConnection] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat._id) return;
    try {
      setLoading(true);
      const { data } = await instance.get(
        `/api/v1/message/${selectedChat._id}`
      );
      setMessage(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to fetch Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }, [selectedChat, toast, setMessage, setLoading]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat?._id);
      try {
        setNewMessage("");
        const { data } = await instance.post(
          "/api/v1/message",
          {
            content: newMessage,
            chatID: selectedChat?._id,
          },
          {
            headers: {
              "Content-Type": "application/json", // Fix headers field
            },
          }
        );
        // console.log(data);
        socket.emit("new message", data);
        setMessage((prev) => [...(prev || []), data]);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed o send Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnection(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
        }
        //
      } else {
        setMessage([...(message || []), newMessageRecieved]);
      }
    });
  });
  // console.log(notification);
  // console.log(socketConnection, selectedChat);
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnection) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }

    const lastTyping = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTyping;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat.users ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "38px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              aria-label="go back"
              display={{ base: "flex", md: "none" }}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m6.921 12.5l5.792 5.792L12 19l-7-7l7-7l.713.708L6.921 11.5H19v1H6.921Z"
                  />
                </svg>
              }
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel fetchMessages={fetchMessages} />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <>
                <Spinner
                  size={"xl"}
                  w={20}
                  h={20}
                  alignSelf={"center"}
                  margin={"auto"}
                />
              </>
            ) : (
              <div
                className="messages"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                {message ? (
                  <ScrollableChat messages={message} />
                ) : (
                  <p>No messages available</p>
                )}
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
               <Image src="/typing.gif" alt="typing.." w={8} h={8} />
            
                </div>
              ) : (
                <></>
              )}

              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter A message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click On a User to Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
