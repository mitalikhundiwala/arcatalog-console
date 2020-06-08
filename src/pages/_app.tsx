import App, { Container } from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import client from '../lib/apollo.client';
import { ReactElement } from 'react';
import Page from '../components/Page';
import UserContextProvider from '../contexts/user.context';
// import '../../node_modules/antd/dist/antd.css';
import '../styles/ant.upload.scss';

import '../../node_modules/bootstrap/scss/bootstrap-grid.scss';

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return { pageProps };
    }
    render(): ReactElement {
        const { Component, pageProps } = this.props;
        return (
            <ApolloProvider client={client}>
                <UserContextProvider>
                    <Page>
                        <Component {...pageProps} />
                    </Page>
                </UserContextProvider>
            </ApolloProvider>
        );
    }
}

export default MyApp;
