import { Formik, Field, FormikProps } from 'formik';
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
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useToast } from '@chakra-ui/core';
import CreatableSelect from 'react-select/creatable';
import { FunctionComponent } from 'react';
import * as Yup from 'yup';

const GET_AUTHORS = gql`
    query getAuthors {
        getAuthors {
            id
            name
        }
    }
`;

const BookEditor: FunctionComponent<FormikProps<any>> = (props) => {
    const { loading, data, error } = useQuery(GET_AUTHORS);

    const authorOptions = () => {
        const authors = data.getAuthors.map((author) => {
            return {
                value: author.id,
                label: author.name
            };
        });
        return authors;
    };

    if (!data && loading)
        return <CircularProgress isIndeterminate></CircularProgress>;

    return (
        <form onSubmit={props.handleSubmit}>
            <Field name="title">
                {({ field, form }) => (
                    <FormControl
                        isInvalid={form.errors.title && form.touched.title}
                    >
                        <FormLabel htmlFor="title">Title</FormLabel>
                        <Input {...field} id="title" placeholder="Title" />
                        <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                    </FormControl>
                )}
            </Field>
            <Field name="author">
                {({ field, form }) => {
                    console.log(field);
                    return (
                        <FormControl
                            isInvalid={
                                form.errors.author && form.touched.author
                            }
                        >
                            <FormLabel htmlFor="author">Author Name</FormLabel>
                            <CreatableSelect
                                {...field}
                                isMulti
                                onChange={(option) =>
                                    form.setFieldValue(field.name, option)
                                }
                                options={authorOptions()}
                                id="author"
                            />

                            <FormErrorMessage>
                                {form.errors.author}
                            </FormErrorMessage>
                        </FormControl>
                    );
                }}
            </Field>
            <Button
                mt={4}
                type="submit"
                isLoading={props.isSubmitting}
                loadingText="Submitting"
            >
                Submit
            </Button>
        </form>
    );
};

export const BookSchema = Yup.object().shape({
    title: Yup.string().min(2, 'Too Short!').required('Required'),
    author: Yup.array().required('Required').nullable()
});

export default BookEditor;
