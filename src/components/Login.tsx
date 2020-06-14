import React, { useContext, FunctionComponent } from 'react';
import { Button, Box, Text } from '@chakra-ui/core';
import Router from 'next/router';
import { firebase, googleAuthProvider } from '../lib/firebase.auth';
import UserAdapter from '../services/adapters/user';
import { UserContext } from '../contexts/user.context';

const LoginComponent: FunctionComponent = () => {
    const { user } = useContext(UserContext);
    const login = async (): Promise<void> => {
        await firebase.auth().signInWithPopup(googleAuthProvider);
    };

    if (user) {
        Router.push({
            pathname: '/'
        });
    }

    return (
        <Box
            className="row justify-content-center align-items-center"
            height="100vh"
        >
            <Box className="col-4" textAlign="center">
                <Text fontSize="3xl">Sign In</Text>
                <Box mt="4" px="4" py="8" backgroundColor="white">
                    <Button onClick={login}>Sign In with Google</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginComponent;
