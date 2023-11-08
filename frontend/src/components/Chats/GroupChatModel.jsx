import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/ChatContext";
import instance from "../../axios";
import UserList from "./UserList";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chats, setChats } = ChatState();
  const toast = useToast();

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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      const { data } = await instance.post("/api/v1/newgroup", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers?.map((u) => u._id)),
      });
      setChats([data, ...(chats || [])]);
      onClose();
      toast({
        title: "New Group Created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to create group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const hanldeGroup = (userToadd) => {
    if (selectedUsers?.includes(userToadd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      setSelectedUsers((prev) => [...(prev || []), userToadd]);
    }
  };
  const handleDelete = (id) => {
    const filter = setSelectedUsers((prev) =>
      prev?.filter((item) => item._id !== id)
    );
    return filter;
  };
  // console.log(selectedUsers);
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Wasih , Aftab"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} flexWrap={"wrap"}>
              {selectedUsers &&
                selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user._id)}
                  />
                ))}
            </Box>

            {loading ? (
              <div>Loading</div>
            ) : (
              <>
                {searchResult.slice(0, 4).map((user) => (
                  <UserList
                    user={user}
                    key={user._id}
                    handleFunction={() => hanldeGroup(user)}
                  />
                ))}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
