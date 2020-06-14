import { Formik, Field } from 'formik';
import { Heading, CircularProgress } from '@chakra-ui/core';
import gql from 'graphql-tag';
import Router from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';
import BookEditor, { BookSchema } from './BookEditor';

const UPDATE_BOOK_MUTATION = gql`
    mutation updateBook(
        $id: String!
        $title: String
        $author: [String!]
        $category: String
        $frontCoverImage: String
        $backCoverImage: String
    ) {
        updateBook(
            id: $id
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

const GET_BOOK = gql`
    query getBook($id: String!) {
        getBook(id: $id) {
            id
            title
            author {
                id
                name
            }
            category {
                id
                name
            }
            frontCoverImage
            backCoverImage
        }
    }
`;

const UpdateBook = ({ bookId }) => {
    const { loading, error, data } = useQuery(GET_BOOK, {
        variables: { id: bookId }
    });

    const bookData = data?.getBook;
    console.log(bookData);

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

    let frontCoverImage = [];
    let backCoverImage = [];
    if (bookData) {
        if (bookData.frontCoverImage) {
            frontCoverImage.push({
                url: bookData.frontCoverImage,
                uid: '-1',
                // name: 'xxx.png',
                status: 'done'
            });
        }
        if (bookData.backCoverImage) {
            backCoverImage.push({
                url: bookData.backCoverImage,
                uid: '-1',
                // name: 'xxx.png',
                status: 'done'
            });
        }
        console.log('bookData', bookData);
    }

    return (
        <>
            <Heading mb="8">Update Book</Heading>
            <Formik
                initialValues={{
                    title: bookData?.title,
                    author: bookData?.author.map((author) => {
                        return {
                            value: author.id,
                            label: author.name
                        };
                    }),
                    category: {
                        value: bookData?.category?.id,
                        label: bookData?.category?.name
                    },
                    frontCoverImage: frontCoverImage,
                    backCoverImage: backCoverImage
                }}
                validationSchema={BookSchema}
                onSubmit={async (values, actions) => {
                    await updateBook({
                        variables: {
                            id: bookId,
                            title: values.title.trim(),
                            author: values.author?.map(
                                (author) => author.label
                            ),
                            category: values.category.value,
                            frontCoverImage: values.frontCoverImage?.[0]?.url,
                            backCoverImage: values.backCoverImage?.[0]?.url
                        }
                    });
                }}
            >
                {(props) => <BookEditor {...props} />}
            </Formik>
        </>
    );
};

export default UpdateBook;
