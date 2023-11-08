import { Box, HStack, Text } from "@chakra-ui/react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      bgColor={"purple"}
      color={"white"}
      fontSize={12}
      cursor={"pointer"}
      onClick={handleFunction}
    >
      <HStack>
        <Text> {user?.name}</Text>
        <button onClick={handleFunction}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ width: "18px", height: "18px" }}
          >
            <path
              fill="currentColor"
              d="m6.4 18.308l-.708-.708l5.6-5.6l-5.6-5.6l.708-.708l5.6 5.6l5.6-5.6l.708.708l-5.6 5.6l5.6 5.6l-.708.708l-5.6-5.6l-5.6 5.6Z"
            />
          </svg>
        </button>
      </HStack>
    </Box>
  );
};

export default UserBadgeItem;
