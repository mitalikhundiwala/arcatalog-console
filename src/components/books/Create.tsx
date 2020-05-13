import { Formik, Field } from 'formik';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Button
} from '@chakra-ui/core';
import gql from 'graphql-tag';
import Router from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';

const ADD_BOOK_MUTATION = gql`
    mutation createBook($title: String!, $author: [String!]!) {
        createBook(title: $title, author: $author) {
            id
        }
    }
`;

const CreateBook = () => {
    const [createBook, { data, loading, error }] = useMutation(
        ADD_BOOK_MUTATION
    );
    const toast = useToast();

    if (error) {
        console.log(error);
        toast({
            title: 'Unable to create a book.',
            description: error[0]?.message ?? null,
            status: 'error',
            duration: 9000,
            isClosable: true
        });
    }

    if (data) {
        Router.push({
            pathname: '/books'
        });
    }

    return (
        <Formik
            initialValues={{ title: '', author: '' }}
            onSubmit={async (values, actions) => {
                await createBook({
                    variables: {
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
                    <Button mt={4} isLoading={loading} type="submit">
                        Submit
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default CreateBook;
