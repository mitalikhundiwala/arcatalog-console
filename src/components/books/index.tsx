import { Box, Badge, Image, Link, CircularProgress } from '@chakra-ui/core';
import gql from 'graphql-tag';
import { default as NextLink } from 'next/link';
import { useQuery } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';

const GET_BOOKS = gql`
    query GET_BOOKS {
        getBooks {
            title
            id
            author {
                name
            }
            frontCoverImage
        }
    }
`;

const BookListComponent = () => {
    const { loading, error, data } = useQuery(GET_BOOKS);
    const toast = useToast();

    if (error) {
        console.log(error);
        toast({
            title: 'Unable to fetch books.',
            status: 'error',
            duration: 9000,
            isClosable: true
        });
    }
    if (loading) return <CircularProgress isIndeterminate></CircularProgress>;
    if (error) return <p>Error ...</p>;
    return (
        <Box className="row">
            {data.getBooks.map((book) => {
                console.log(book);
                return (
                    <Box className="col-6 col-md-4 col-lg-3" key={book.id}>
                        <Box maxW="sm" overflow="hidden" mb="8">
                            <Image
                                src={book.frontCoverImage}
                                alt={book.title}
                                width="100%"
                                fallbackSrc={'/images/book-default_.png'}
                                height="280px"
                                // objectFit="cover"
                            />

                            <Box mt="4">
                                <Box
                                    mt="1"
                                    fontWeight="semibold"
                                    as="h4"
                                    lineHeight="tight"
                                >
                                    <NextLink href={`/books/${book.id}/update`}>
                                        <Link color="primary.500">
                                            {book.title}
                                        </Link>
                                    </NextLink>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default BookListComponent;
