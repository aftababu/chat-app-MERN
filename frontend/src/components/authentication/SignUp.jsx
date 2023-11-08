import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import {   useEffect, useRef, useState } from "react";
import { useToast } from "@chakra-ui/react";
import {  useLocation, useNavigate } from "react-router-dom";
import Axios from 'axios'
import axios from "../../axios";

const SignUp = () => {
  const location = useLocation();
  const toast = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const btnref = useRef(null);
  const [user, setUser] = useState({
    error: null,
    loading: false,
    success: false,
  });

  // const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);
  const postDetails = (e) => {
    const pics = e.target.files;
    if (pics && pics.length > 0) {
      setPic(pics[0]); // Assuming pics[0] is of type File
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const formdata = new FormData();
      formdata.set("name", name);
      formdata.set("email", email);
      formdata.set("password", password);
      if (pic instanceof File) {
        formdata.set("pic", pic);
      }
      setUser(() => ({
        success: false,
        error: null,
        loading: true,
      }));
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/v1/register", formdata, config);
      setUser(() => ({
        success: data.success,
        error: null,
        loading: false,
      }));
      localStorage.setItem("userInfo", JSON.stringify(data.user)); // Save user info to local storage
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        const axiosError = error
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
      btnref.current.disabled = user?.loading;
    }
    if (user.error) {
      toast({
        title: user?.error,
        position: "top",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setUser(() => ({
        success: false,
        error: null,
        loading: false,
      }));
    }
    if (user?.success) {
      toast({
        title: "User Created Successfully",
        position: "top",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate(from);
    }
  }, [user.error, toast, user.success, navigate, user.loading, from,btnref,setUser]);
  return (
    <form onSubmit={handlesubmit}>
      <VStack spacing={"5px"}>
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            _placeholder={{ color: "white" }}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
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
        <FormControl id="pic">
          <FormLabel>Upload your picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e)}
          />
        </FormControl>
        <Button
          mt={3}
          fontSize={"2xl"}
          fontWeight={"normal"}
          colorScheme="blue"
          width={"100%"}
          color={"white"}
          type="submit"
          ref={btnref}
          variant={"chatbtn"}
          bgColor={'#3F383C'}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};
export default SignUp;
