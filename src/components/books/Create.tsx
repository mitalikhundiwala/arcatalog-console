import { Formik } from 'formik';
import gql from 'graphql-tag';
import Router from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';
import BookEditor, { BookSchema } from './BookEditor';
import { Heading } from '@chakra-ui/core';

const ADD_BOOK_MUTATION = gql`
    mutation createBook(
        $title: String!
        $author: [String!]!
        $category: String
        $frontCoverImage: String
        $backCoverImage: String
    ) {
        createBook(
            title: $title
            author: $author
            category: $category
            frontCoverImage: $frontCoverImage
            backCoverImage: $backCoverImage
        ) {
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
        <>
            <Heading mb="8">Add Book</Heading>
            <Formik
                initialValues={{
                    title: undefined,
                    author: undefined,
                    category: undefined,
                    frontCoverImage: [],
                    backCoverImage: []
                }}
                validationSchema={BookSchema}
                onSubmit={async (values, actions) => {
                    console.log('values::', values);
                    await createBook({
                        variables: {
                            title: values.title?.trim(),
                            author: values.author?.map(
                                (author) => author.label
                            ),
                            category: values.category.value,
                            frontCoverImage: values?.frontCoverImage?.[0]?.url,
                            backCoverImage: values?.backCoverImage?.[0]?.url
                        }
                    });
                }}
            >
                {(props) => <BookEditor {...props} />}
            </Formik>
        </>
    );
};

export default CreateBook;
