import React, {
    Component,
    useContext,
    FunctionComponent,
    useEffect
} from 'react';
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/core';
import GlobalStyles from '../styles/global.styles';
import Header from './header';
import Router from 'next/router';
import { firebase, googleAuthProvider } from '../lib/firebase';
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
                console.log(idToken);
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
            <div className="container-fluid">{props.children}</div>
        </ThemeProvider>
    );
};

export default Page;
