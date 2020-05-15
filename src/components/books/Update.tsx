import { Formik, Field } from 'formik';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Button,
    CircularProgress
} from '@chakra-ui/core';
import gql from 'graphql-tag';
import Router from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';

const UPDATE_BOOK_MUTATION = gql`
    mutation updateBook($id: String!, $title: String, $author: [String!]) {
        updateBook(id: $id, title: $title, author: $author) {
            id
        }
    }
`;

const GET_BOOK = gql`
    query getBook($id: String!) {
        getBook(id: $id) {
            id
            title
            author {
                id
                name
            }
        }
    }
`;

const UpdateBook = ({ bookId }) => {
    const { loading, error, data } = useQuery(GET_BOOK, {
        variables: { id: bookId }
    });

    const bookData = data?.getBook;

    const [
        updateBook,
        {
            data: updateBookData,
            loading: updateBookLoading,
            error: updateBookError
        }
    ] = useMutation(UPDATE_BOOK_MUTATION);
    const toast = useToast();

    if (error) {
        console.log(error);
        toast({
            title: 'Unable to get a book.',
            status: 'error',
            duration: 9000,
            isClosable: true
        });
    }

    if (updateBookError) {
        console.log(updateBookError);
        toast({
            title: 'Unable to update a book.',
            status: 'error',
            duration: 9000,
            isClosable: true
        });
    }

    if (updateBookData) {
        Router.push({
            pathname: '/books'
        });
    }

    if (!bookData && loading)
        return <CircularProgress isIndeterminate></CircularProgress>;
    return (
        <Formik
            initialValues={{
                title: bookData?.title,
                author: bookData.author.map(({ name }) => name).join(',')
            }}
            onSubmit={async (values, actions) => {
                await updateBook({
                    variables: {
                        id: bookId,
                        title: values.title,
                        author: values.author.split(',')
                    }
                });

                actions.resetForm();
            }}
        >
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <Field name="title">
                        {({ field, form }) => (
                            <FormControl
                                isInvalid={
                                    form.errors.title && form.touched.title
                                }
                            >
                                <FormLabel htmlFor="title">Title</FormLabel>
                                <Input
                                    {...field}
                                    id="title"
                                    placeholder="Title"
                                />
                                <FormErrorMessage>
                                    {form.errors.title}
                                </FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <Field name="author">
                        {({ field, form }) => (
                            <FormControl
                                isInvalid={
                                    form.errors.author && form.touched.author
                                }
                            >
                                <FormLabel htmlFor="author">
                                    Author Name
                                </FormLabel>
                                <Input
                                    {...field}
                                    id="author"
                                    placeholder="Author"
                                />
                                <FormErrorMessage>
                                    {form.errors.author}
                                </FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <Button mt={4} isLoading={updateBookLoading} type="submit">
                        Submit
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default UpdateBook;
