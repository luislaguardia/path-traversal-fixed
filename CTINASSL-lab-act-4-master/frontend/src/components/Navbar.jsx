import { Box, Image, Button, Container, Flex, HStack, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMoon } from 'react-icons/io5';
import { LuSun } from 'react-icons/lu';
import smiski_logo from '../components/smiski_logo.png';

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem('token'); // remove token here
        navigate('/'); 
        window.location.reload();
    };

    return (
        <Container maxW={"100%"} px={8} bg={"#FFEB2F"}>
            <Flex
                h={20}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={{
                    base: "column",
                    sm: "row"
                }}
            >
                <Image 
                    src={smiski_logo} 
                    alt="Logo" 
                    boxSize={{ base: "95px", sm: "190px" }} 
                    objectFit="contain" 
                />

                <HStack spacing={6} alignItems={"center"}>
                    <Link to={"/products"}>
                        <Button variant={"link"}>
                            <Text fontSize={20} textColor={'green.500'} fontFamily="'Comic Sans MS', cursive">Products</Text>
                        </Button>
                    </Link>

                    {/* updated logout button */}
                    <Button variant={"link"} onClick={handleLogout}>
                        <Text fontSize={20} textColor={'green.500'} fontFamily="'Comic Sans MS', cursive">Log Out</Text>
                    </Button>

                    <Button variant="link" onClick={toggleColorMode}>
                        {colorMode === "light" ? <IoMoon /> : <LuSun size='20' />}
                    </Button>
                </HStack>
            </Flex>
        </Container>
    );
}

export default Navbar;
