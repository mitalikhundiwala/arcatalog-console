import React, {
    Component,
    useContext,
    FunctionComponent,
    useEffect
} from 'react';
import { ThemeProvider, theme, CSSReset, Box } from '@chakra-ui/core';
import GlobalStyles from '../styles/global.styles';
import Header from './header';
import Router from 'next/router';
import { firebase } from '../lib/firebase.auth';
import { UserContext } from '../contexts/user.context';
import UserAdapter from '../services/adapters/user';
import appTheme from '../styles/theme';

const customTheme = {
    ...theme,
    colors: {
        ...theme.colors,
        ...appTheme.colors
    }
};

const Page: FunctionComponent = (props: any) => {
    const { user, storeLoginInfo } = useContext(UserContext);
    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (result) => {
            if (result) {
                const user = UserAdapter.fromFirebaseResponse(result);
                const idToken = await result.getIdToken();
                sessionStorage.setItem('AUTH_TOKEN', idToken);
                storeLoginInfo(user, idToken, result.refreshToken);
            } else {
                Router.push({
                    pathname: '/login'
                });
            }
        });
    }, []);
    return (
        <ThemeProvider theme={customTheme as any}>
            <CSSReset />
            <GlobalStyles />
            {user && <Header />}
            <Box className="container" pt={8}>
                {props.children}
            </Box>
        </ThemeProvider>
    );
};

export default Page;
