import {
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          aria-label="Button Label for Accessibility"
          display={"flex"}
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
      )}
      <Modal
        size={{ base: "xs", md: "md", lg: "lg" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent height={{ base: "35%", md: "50%" }}>
          <ModalHeader
            fontSize={{ base: "32px", md: "40px" }}
            p={{ base: "0", md: "2" }}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <Image
              borderRadius={"full"}
              boxSize={{ base: "100px", md: "150px" }}
              src={user?.pic}
              alt={user?.name}
            />
            <Text fontSize={{ base: "2xl", md: "3xl" }}>{user?.email}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
