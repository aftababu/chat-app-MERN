import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/ChatContext";
import UserBadgeItem from "./UserBadgeItem";
import instance from "../../axios";
import UserList from "./UserList";
import { isAxiosError } from "axios";

const UpdateGroupChatModel = ({ fetchMessages }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user, chats } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  // const [selectedUsers, setSelectedUsers] = useState<User[]>();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const handleRemove = async (user1) => {
    if (selectedChat?.groupAdmin._id !== user?._id && user1._id !== user?._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await instance.delete("/api/v1/group/removefromgroup", {
        data: {
          chatID: selectedChat?._id,
          userID: user1._id,
        },
      });
      user1._id === user?._id ? setSelectedChat("") : setSelectedChat(data);
      setLoading(false);
      fetchMessages();
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Error Occured",
          description: error?.response?.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);

      const { data } = await instance.put("/api/v1/group/rename", {
        chatID: selectedChat?._id,
        chatName: groupChatName,
      });
      setSelectedChat(data);
      setRenameLoading(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Error Occured",
          description: error?.response?.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      setRenameLoading(false);
      setGroupChatName("");
    }
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await instance.get(`/api/v1/users?search=${search}`);
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat?.users.find((u) => u._id === user1._id)) {
      toast({
        title: "user Already exist",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat?.groupAdmin._id !== user?._id) {
      toast({
        title: "Only admin can add someone",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await instance.post("/api/v1/group/addtogroup", {
        chatID: selectedChat?._id,
        userID: user1._id,
      });
      console.log(data);
      setSelectedChat(data);
      setLoading(false);
      toast({
        title: "added",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to add to the group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  console.log(chats);
  return (
    <>
      <IconButton
        aria-label="view"
        display={{ base: "flex" }}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
          >
            <circle cx="16" cy="16" r="4" fill="currentColor" />
            <path
              fill="currentColor"
              d="M30.94 15.66A16.69 16.69 0 0 0 16 5A16.69 16.69 0 0 0 1.06 15.66a1 1 0 0 0 0 .68A16.69 16.69 0 0 0 16 27a16.69 16.69 0 0 0 14.94-10.66a1 1 0 0 0 0-.68ZM16 22.5a6.5 6.5 0 1 1 6.5-6.5a6.51 6.51 0 0 1-6.5 6.5Z"
            />
          </svg>
        }
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <Box>
              {selectedChat?.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Wasih , Aftab"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
