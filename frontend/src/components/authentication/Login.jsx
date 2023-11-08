import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "../../axios";
import {  useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

const Login = () => {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const btnref = useRef(null);

  const [user, setUser] = useState({
    error: null,
    loading: false,
    success: false,
  });

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const formdata = new FormData();
      formdata.set("email", email);
      formdata.set("password", password);
      setUser(() => ({
        success: false,
        error: null,
        loading: true,
      }));
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/v1/login", formdata, config);
      setUser(() => ({
        success: data.success,
        error: null,
        loading: false,
      }));
      localStorage.setItem("userInfo", JSON.stringify(data.user)); // Save user info to local storage
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        const axiosError = error ;
        if (axiosError.response) {
          const errorResponse = axiosError.response.data;
          setUser(() => ({
            success: false,
            error: errorResponse.message,
            loading: false,
          }));
        } else {
          setUser(() => ({
            success: false,
            error: "An error occurred",
            loading: false,
          }));
        }
      } else {
        // Handle non-Axios errors
        setUser(() => ({
          success: false,
          error: "An error occurred",
          loading: false,
        }));
      }
    }
  };
  const { from } = location?.state || { from: "/chats" };

  useEffect(() => {
    if (btnref.current) {
      btnref.current.disabled = user.loading;
    }
    if (user.error) {
      toast({
        title: user.error,
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    if (user.success) {
      toast({
        title: "User Login Successfully",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate(from);
    }
  }, [user.error, toast, user.success, navigate, user.loading, from,btnref]);
  return (
    <form onSubmit={handlesubmit}>
      <VStack spacing={"5px"}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              value={password}
              placeholder="Enter Your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width={"4.5rem"}>
              <Button
                variant={"unstyled"}
                h={"1.75rem"}
                size={"sm"}
                onClick={() => setShow(() => !show)}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          mt={3}
          fontSize={"2xl"}
          fontWeight={"normal"}
          width={"100%"}
          color={"white"}
          type="submit"
          ref={btnref}
          variant={"chatbtn"}
          bgColor={"#3F383C"}
        >
          Login
        </Button>
        <Button
          mt={2}
          fontSize={"1xl"}
          fontWeight={"normal"}
          width={"100%"}
          color={"white"}
          type="submit"
          // ref={btnref}
          variant={"chatbtn"}
          bgColor={"blackAlpha.800"}
        >
          Use Guest Account
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
