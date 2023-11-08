import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user && user.email) {
        navigate("/chats");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  // const customBackground = {
  //   background:
  //     "radial-gradient(circle, rgba(102,102,102,0.82535012295934) 0%, rgba(82,87,100,0.8085434002702644) 24%, rgba(69,77,99,0.8085434002702644) 40%, rgba(43,42,47,0.805742279822085) 69%, rgba(93,83,85,0.7917366775811887) 100%)",
  // };

  return (
    <Container centerContent maxWidth={"xl"}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        bg="rgb(109, 94, 84)"
        p={3}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"work sans"} color={"white"}>
          Talk A Live
        </Text>
      </Box>
      <Box
        p={2}
        color={"#fff"}
        borderWidth={"1px"}
        bg={"rgba(161, 103, 73,.3)"}
        w={"100%"}
        borderRadius={"lg"}
      >
        <Tabs variant={"soft-rounded"}>
          <TabList mb="1em">
            <Tab
              _selected={{ color: "white", bg: "#615146" }}
              color="white"
              width={"50%"}
              bg={"rgba(0,0,0,.2)"}
            >
              Login
            </Tab>
            <Tab
              _selected={{ color: "white", bg: "#615146" }}
              color="white"
              width={"50%"}
              bg={"rgba(0,0,0,.2)"}
            >
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
