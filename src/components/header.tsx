import React, { useContext, useState } from 'react';
import {
    Box,
    Heading,
    Flex,
    Text,
    Image,
    IconButton,
    Stack
} from '@chakra-ui/core';
import Link from 'next/link';
import { UserContext } from '../contexts/user.context';
import { AiOutlineLogout } from 'react-icons/ai';

const MenuItems = ({ children }) => (
    <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
        {children}
    </Text>
);

const Header = (props) => {
    const { user, logout } = useContext(UserContext);
    const [show, setShow] = useState(false);
    const handleToggle = () => setShow(!show);

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            py="3"
            px="4"
            bg="primary.500"
            color="white"
            {...props}
        >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
                    <Link href="/">
                        <a>Architecture Catalog</a>
                    </Link>
                </Heading>
            </Flex>

            <Box display={{ sm: 'block', md: 'none' }} onClick={handleToggle}>
                <svg
                    fill="white"
                    width="12px"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </Box>

            <Box
                display={{ sm: show ? 'block' : 'none', md: 'flex' }}
                width={{ sm: 'full', md: 'auto' }}
                alignItems="center"
                flexGrow={1}
            >
                <MenuItems>
                    <Link href="/books">
                        <a>Books</a>
                    </Link>
                </MenuItems>
                <MenuItems>
                    <Link href="/categories">
                        <a>Categories</a>
                    </Link>
                </MenuItems>
                <MenuItems>Blog</MenuItems>
            </Box>

            <Box
                display={{ sm: show ? 'block' : 'none', md: 'block' }}
                mt={{ base: 4, md: 0 }}
            >
                <Stack isInline spacing={4} align="center">
                    <Text>Welcome, {user?.displayName}</Text>
                    <Image
                        rounded="full"
                        size="10"
                        src={user?.picture}
                        alt={user?.displayName}
                    />
                    <IconButton
                        rounded="full"
                        variant="outline"
                        aria-label="Logout"
                        icon={AiOutlineLogout}
                        onClick={logout}
                    />
                </Stack>
            </Box>
        </Flex>
    );
};

export default Header;
