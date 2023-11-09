import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/ChatContext";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import Axios from "axios";
import ChatLoader from "./ChatLoader";
import UserList from "./UserList";
import { getSender } from "../../config/ChatLogic";

const SideDrawer = () => {
  const { user, setChats, setSelectedChat, notification, setNotification } =
    ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  // console.log(user);
  const navigate = useNavigate();
  const toast = useToast();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    // console.log(12)
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/users?search=${search}`);
      setLoading(false);
      // console.log(data);
      setSearchResult(data.users);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userID) => {
    try {
      setLoadingChats(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/chats",
        {
          userID,
        },
        config
      );
      setChats((existingChats) => {
        if (!existingChats?.find((chat) => chat._id === data._id)) {
          return [data, ...(existingChats || [])];
        }
        return existingChats;
      });
      setSelectedChat(data);
      setLoadingChats(false);
      onClose();
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        const errorMessage =
          error && "message" in error
            ? error.message
            : "An unexpected error occurred.";
        toast({
          title: "Error fetching the chat",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      } else {
        toast({
          title: "Error fetching the chat",
          description: "An unexpected error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"100%"}
        p={"8px 12px"}
        bg={"#3F383C"}
        borderRadius={"5px"}
        color={"whiteAlpha.800"}
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button
            variant={"chatbtn"}
            display={"flex"}
            alignItems={"center"}
            color={"whiteAlpha.800"}
            onClick={onOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3l-1.4 1.4ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"
              />
            </svg>
            <Text display={{ base: "none", md: "block" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Lets Chats
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu>
            <MenuButton p={1}>
              <HStack>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M21 19v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.29c2.97.88 5 3.61 5 6.71v6l2 2m-7 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2"
                  />
                </svg>
                <Badge
                  sx={{ transform: "translate(-15px,-15px)" }}
                  // p={0}
                  borderRadius={'full'}
                  bg={"red.800"}
                  fontSize={18}
                  colorScheme="whiteAlpha"
                >
                  {notification?.length}
                </Badge>
              </HStack>
            </MenuButton>
            <MenuList pl={2}>
              {!notification?.length && "No New Messages"}
              {notification?.map((notif) => (
                <MenuItem
                  color={"#000"}
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message From ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu variant={"chatMenu"}>
            <MenuButton
              as={Button}
              border={"none"}
              // w={"30%"}
              // h={"20%"}
              rightIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  style={{ width: "24px", height: "24px" }}
                >
                  <mask id="ipSDownOne0">
                    <path
                      fill="#fff"
                      stroke="#fff"
                      stroke-linejoin="round"
                      stroke-width="4"
                      d="M36 19L24 31L12 19h24Z"
                    />
                  </mask>
                  <path
                    fill="currentColor"
                    d="M0 0h48v48H0z"
                    mask="url(#ipSDownOne0)"
                  />
                </svg>
              }
              variant={"chatbtn"}
            >
              <Avatar
                name={user?.name}
                src={user?.pic}
                size={"sm"}
                cursor={"pointer"}
              />
            </MenuButton>
            <MenuList border={"1px solid #777"}>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box>
              <HStack>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <Button onClick={handleSearch}>Go</Button>
              </HStack>
            </Box>
            {search ? (
              loading ? (
                <>
                  <ChatLoader />
                </>
              ) : (
                <>
                  {searchResult?.map((user) => (
                    <UserList
                      user={user}
                      key={user._id}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))}
                </>
              )
            ) : (
              <span>search to chat</span>
            )}
            {loadingChats && <Spinner size={"sm"} ml={2} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
