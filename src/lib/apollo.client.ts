import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import fetch from 'node-fetch';

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL,
    fetch
});

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
        onError(({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
                // sendToLoggingService(graphQLErrors);
                console.log(graphQLErrors);
                // for (const err of graphQLErrors) {
                //     switch (err.extensions.code) {
                //         case 'UNAUTHENTICATED':
                //             console.log(operation.getContext());
                //             const oldHeaders = operation.getContext().headers;
                //         // operation.setContext({
                //         //     headers: {
                //         //         ...oldHeaders,
                //         //         authorization: getNewToken()
                //         //     }
                //         // });
                //         // // retry the request, returning the new observable
                //         // return forward(operation);
                //     }
                // }
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
