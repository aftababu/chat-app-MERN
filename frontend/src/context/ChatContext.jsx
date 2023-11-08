import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [selectedChat, setSelectedChat] = useState({});
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUser(JSON.parse(storedUserInfo));
    }
  }, []);

  useEffect(() => {
    if (user && user.email) {
      navigate("/chats");
    }
  }, [navigate, user]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export default ChatProvider;
export const ChatState = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatState must be used within a ChatProvider");
  }
  return context;
};
