import ApolloClient from 'apollo-boost';
import fetch from 'node-fetch';

export default new ApolloClient({
    uri: 'http:/localhost:4000',
    fetch
});
