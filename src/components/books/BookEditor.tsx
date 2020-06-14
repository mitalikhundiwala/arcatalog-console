import { Field, FormikProps } from 'formik';
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Button,
    CircularProgress
} from '@chakra-ui/core';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import CreatableSelect from 'react-select/creatable';
import { FunctionComponent, createRef } from 'react';
import * as Yup from 'yup';
import firebaseStorageService from '../../lib/firebase.storage';
import { Upload } from 'antd';

const GET_AUTHORS = gql`
    query getAuthors {
        getAuthors {
            id
            name
        }
    }
`;

const GET_CATEGORIES = gql`
    query getCategories {
        getCategories {
            id
            name
        }
    }
`;

const BookEditor: FunctionComponent<FormikProps<any>> = (props) => {
    const { loading, data, error } = useQuery(GET_AUTHORS);
    const {
        loading: categoryLoading,
        data: categoryData,
        error: categoryError
    } = useQuery(GET_CATEGORIES);

    const authorOptions = () => {
        const authors = data?.getAuthors.map((author) => {
            return {
                value: author.id,
                label: author.name
            };
        });
        return authors;
    };

    const categoryOptions = () => {
        const categories = categoryData?.getCategories.map((category) => {
            return {
                value: category.id,
                label: category.name
            };
        });
        return categories;
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
            <Field name="category">
                {({ field, form }) => {
                    console.log(field);
                    return (
                        <FormControl
                            isInvalid={
                                form.errors.category && form.touched.category
                            }
                        >
                            <FormLabel htmlFor="category">Category</FormLabel>
                            <CreatableSelect
                                {...field}
                                onChange={(option) =>
                                    form.setFieldValue(field.name, option)
                                }
                                options={categoryOptions()}
                                id="category"
                            />

                            <FormErrorMessage>
                                {form.errors.category}
                            </FormErrorMessage>
                        </FormControl>
                    );
                }}
            </Field>
            <Field name="frontCoverImage">
                {({ field, form }) => {
                    return (
                        <FormControl>
                            <FormLabel htmlFor="frontCoverImage">
                                Front Cover Image
                            </FormLabel>
                            <Upload
                                listType="picture-card"
                                fileList={field.value}
                                onChange={(info) => {
                                    console.log(info);
                                    let fileList = [...info.fileList];
                                    fileList = fileList.slice(-1);
                                    fileList = fileList.map((file) => {
                                        if (file.response) {
                                            file.url = file.response.url;
                                        }
                                        return file;
                                    });
                                    form.setFieldValue(
                                        'frontCoverImage',
                                        fileList
                                    );
                                }}
                                customRequest={({
                                    onSuccess,
                                    onError,
                                    file
                                }) => {
                                    firebaseStorageService
                                        .uploadFile(file)
                                        .then((url) => {
                                            onSuccess(
                                                {
                                                    // name: file.name,
                                                    status: 'done',
                                                    url
                                                },
                                                file
                                            );
                                        });
                                }}
                            >
                                <Button>Upload</Button>
                            </Upload>
                        </FormControl>
                    );
                }}
            </Field>
            <Field name="backCoverImage">
                {({ field, form }) => {
                    return (
                        <FormControl>
                            <FormLabel htmlFor="backCoverImage">
                                Back Cover Image
                            </FormLabel>
                            <Upload
                                listType="picture-card"
                                fileList={field.value}
                                onChange={(info) => {
                                    console.log(info);
                                    let fileList = [...info.fileList];
                                    fileList = fileList.slice(-1);
                                    fileList = fileList.map((file) => {
                                        if (file.response) {
                                            file.url = file.response.url;
                                        }
                                        return file;
                                    });
                                    form.setFieldValue(
                                        'backCoverImage',
                                        fileList
                                    );
                                }}
                                customRequest={({
                                    onSuccess,
                                    onError,
                                    file
                                }) => {
                                    firebaseStorageService
                                        .uploadFile(file)
                                        .then((url) => {
                                            onSuccess(
                                                {
                                                    name: 'jkhsdf.weqqw',
                                                    status: 'done',
                                                    url
                                                },
                                                file
                                            );
                                        });
                                }}
                            >
                                <Button>Upload</Button>
                            </Upload>
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
