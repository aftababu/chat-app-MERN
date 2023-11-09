import {
  Box,
  Button,
  HStack,
  Image,
  SelectField,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { ChatState } from "../../context/ChatContext";
import axios from "../../axios";
import ChatLoader from "./ChatLoader";
import { getSender, getSenderPic } from "../../config/ChatLogic";
import GroupChatModel from "./GroupChatModel";

const MyChats = () => {
  const [loggedInUser, setLoggedInUser] = useState();
  const { chats, selectedChat, setChats, setSelectedChat } = ChatState();
  const toast = useToast();
  const fetchChats = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/chats");
      // console.log(data)
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }, [setChats, toast]);
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setLoggedInUser(JSON.parse(userInfo));
      fetchChats();
    }
  }, [fetchChats, setLoggedInUser]);
  return (
    <>
      <Box
        display={{ base: selectedChat?._id ? "none" : "flex", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        p={3}
        bg={"white"}
        w={{ base: "100%", md: "31%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
           <Box
            pb={3}
            px={3}
            fontSize={{ base: "28px", md: "24px" }}
            fontFamily={"Work sans"}
            display={"flex"}
            w={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
           Chats
            <GroupChatModel>
              <Button
                display={"flex"}
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                rightIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2v-6Z"
                    />
                  </svg>
                }
              >
                New Group Chat
              </Button>
            </GroupChatModel>
          </Box>
       

        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "#fff" : "#000"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <Text>
                    {!chat.isGroupChat && loggedInUser
                      ? getSender(loggedInUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {!chat?.isGroupChat ? (
                    <Image
                      w={8}
                      h={8}
                      borderRadius={"full"}
                      alt="user pic"
                      src={getSenderPic(loggedInUser, chat.users)}
                    />
                  ) : (
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaBBZS2qtC9nwwFHGdt_QCxFWGvEyyNoq25pj8Snpqpg&s"
                      w={8}
                      h={8}
                      borderRadius={"full"}
                      p={1}
                      bgColor={"red"}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoader />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
