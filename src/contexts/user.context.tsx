import React, { createContext, useState } from 'react';
import User from '../models/user';
import { firebase } from '../lib/firebase.auth';

export interface IUserContext {
    user: User | undefined;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    storeLoginInfo?: (
        user: User,
        accessToken: string,
        refreshToken: string
    ) => void;
    logout?: () => void;
}
export const UserContext = createContext<IUserContext>({
    user: undefined,
    accessToken: undefined,
    refreshToken: undefined
});

const UserContextProvider = (props: any) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const storeLoginInfo = (
        user: User,
        accessToken: string,
        refreshToken: string
    ): void => {
        setUser(user);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };
    const logout = (): void => {
        firebase.auth().signOut();
        setUser(null);
    };
    return (
        <UserContext.Provider
            value={{ user, accessToken, refreshToken, storeLoginInfo, logout }}
        >
            {props.children}
        </UserContext.Provider>
    );
};
export default UserContextProvider;
