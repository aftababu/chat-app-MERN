import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatContext";
import SideDrawer from "../components/Chats/SideDrawer";
import MyChats from "../components/Chats/MyChats";
import ChatBox from "../components/Chats/ChatBox";

const Chats = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display={"flex"} justifyContent={"space-between"} w={"100%"} h={"91.5vh"} p={'10px'} >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chats;
