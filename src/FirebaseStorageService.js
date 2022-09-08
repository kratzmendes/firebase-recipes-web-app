import {
    getAuth,
 } from 'firebase/auth';



import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';


import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL, 
    deleteObject 
} from "firebase/storage";


initializeApp(getFirebaseConfig());

// eslint-disable-next-line no-unused-vars
const auth = getAuth();

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
// eslint-disable-next-line no-unused-vars
const storageRef = ref(storage);

async function uploadFile (file, fullFilePath, progressCallback, setImageUrl, handleUploadFinish) {

    const storageRef = ref(storage, fullFilePath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    
    // Pause the upload
    //uploadTask.pause();

    // Resume the upload
    //uploadTask.resume();

    // Cancel the upload
    //uploadTask.cancel();

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                default:
                    break;
            }

            progressCallback(progress);

        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    console.log("User doesn't have permission to access the object");
                    break;
                case 'storage/canceled':
                    console.log("User canceled the upload");
                    break;

                // ...
                case 'storage/unknown':
                    console.log("Unknown error occurred, inspect error.serverResponse");
                    break;
                default:
                    console.log(`unknown error with code ${error.code}, please visit https://firebase.google.com/docs/storage/web/handle-errors`);
                    throw error;
            }
        },
        async () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadUrl);
            setImageUrl(downloadUrl);
            handleUploadFinish(downloadUrl);
            return downloadUrl;
        }
    ); 
}


//https://firebasestorage.googleapis.com/v0/b/fir-recipes-2ee87.appspot.com/o/recipes%2F40d77cba-02ac-4ff7-b113-4b8c442ad403?alt=media&token=a6f138fa-62ae-42d3-a831-63986955b9d9
async function deleteFile (fileDownloadUrl) {
    
    const decodeUrl = decodeURIComponent(fileDownloadUrl);
    const startIndex = decodeUrl.indexOf("/o/") + 3;
    const endIndex = decodeUrl.indexOf("?");
    const filePath = decodeUrl.substring(startIndex, endIndex);

    return await deleteObject(filePath).then((result) => {
        return result;
      }).catch((error) => {
        console.log( "Uh-oh, an error occurred deleting the file!")
      }); 
};

const FirebaseStorageServie = {
    uploadFile,
    deleteFile
};

export default FirebaseStorageServie;