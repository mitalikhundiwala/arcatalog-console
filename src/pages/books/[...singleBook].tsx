import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import UpdateBookComponent from '../../components/books/Update';
import { Box } from '@chakra-ui/core';

const UpdateBookPage: FunctionComponent<{}> = () => {
    const router = useRouter();
    const slug = router.query.singleBook || [];
    if (slug[1] != 'update') {
        return <p>Not Found!</p>;
    }
    return (
        <Box className="row">
            <Box className="col-12 col-md-8 col-lg-6">
                <UpdateBookComponent bookId={slug[0]} />
            </Box>
        </Box>
    );
};

export default UpdateBookPage;
