import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import fetch from 'node-fetch';
import { useToast } from '@chakra-ui/core';

const httpLink = createHttpLink({ uri: 'http://localhost:4000', fetch });
const middlewareLink = new ApolloLink((operation, forward) => {
    const token = sessionStorage.getItem('AUTH_TOKEN');
    operation.setContext({
        headers: {
            authorization: token
        }
    });
    return forward(operation);
});

const requestLink = middlewareLink.concat(httpLink);

export default new ApolloClient({
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                // sendToLoggingService(graphQLErrors);
                console.log(graphQLErrors);
            }
            if (networkError) {
                // logoutUser();
                console.log(networkError);
            }
        }),
        requestLink
    ]),
    cache: new InMemoryCache()
});
