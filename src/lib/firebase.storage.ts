import { firebase } from './firebase.auth';
console.log(firebase);
const storage = firebase.storage();
const storageRef = storage.ref();

export default class FirebaseStorageService {
    static uploadFile(file: File): Promise<string> {
        console.log(file);
        const metadata = {
            contentType: 'image/jpeg'
        };
        const uploadTask = storageRef
            .child('images/' + file.name)
            .put(file, metadata);
        const promise = new Promise<string>((resolve, reject) => {
            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log('error::', error);
                    reject(error);
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    // switch (error.code) {
                    //     case 'storage/unauthorized':
                    //         // User doesn't have permission to access the object
                    //         reject(error.code);
                    //         break;
                    //     case 'storage/canceled':
                    //         // User canceled the upload
                    //         break;
                    //     case 'storage/unknown':
                    //         // Unknown error occurred, inspect error.serverResponse
                    //         break;
                    // }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then(function (downloadURL: string) {
                            console.log('File available at', downloadURL);
                            resolve(downloadURL);
                        });
                }
            );
        });

        return promise;
    }
}
