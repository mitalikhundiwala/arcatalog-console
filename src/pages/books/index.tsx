import { FunctionComponent } from 'react';
import BookListComponent from '../../components/books';
import { Box, Heading, Flex, IconButton } from '@chakra-ui/core';
import Router from 'next/router';
import { AiOutlineFileAdd } from 'react-icons/ai';

const CreateBookPage: FunctionComponent<{}> = () => {
    return (
        <Box className="row">
            <Box className="col-12">
                <Flex align="center" justify="space-between">
                    <Heading mb="8">Books</Heading>

                    <IconButton
                        rounded="full"
                        variant="outline"
                        aria-label="Add Book"
                        icon={AiOutlineFileAdd}
                        onClick={() => {
                            Router.push({
                                pathname: '/books/create'
                            });
                        }}
                    />
                </Flex>
                <BookListComponent />
            </Box>
        </Box>
    );
};

export default CreateBookPage;
