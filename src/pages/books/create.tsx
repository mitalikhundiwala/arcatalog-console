import { FunctionComponent } from 'react';
import CreateBookComponent from '../../components/books/Create';
import { Box } from '@chakra-ui/core';

const CreateBookPage: FunctionComponent<{}> = () => {
    return (
        <Box className="row">
            <Box className="col-12 col-md-8 col-lg-6">
                <CreateBookComponent />
            </Box>
        </Box>
    );
};

export default CreateBookPage;
