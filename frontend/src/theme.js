// theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      variants: {
        chatbtn: {
          _hover: {
            bg: "blackAlpha.600",
            color: "white",
          },
        },
      },
    },
    Menu: {
      variants: {
        chatMenu: {
          item: {
            bgColor: "#4c4449", // Change background color of the menu list
            color: "white", // Change text color of the menu list
            _hover:{
              bgColor:'rgb(48, 40, 44)'
            }
          },
          list: {
            bgColor: "#4c4449", // Change background color of the menu list
            color: "white", // Change text color of the menu list
 
          },
        },
      },
    },
  },
});

export default theme;
