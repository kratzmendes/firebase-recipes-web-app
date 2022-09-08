
import { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import FirebaseStorageServie from "../../FirebaseStorageService";


function ImageUploadPreview({
    basePath,
    existingImageUrl,
    handleUploadFinish,
    handleUploadCancel,
}){

    const [uploadProgress, setUploadProgress] = useState(-1);// '-1' means we havo not yet started uploading
    const [imageUrl, setImageUrl] = useState("");

    const fileInputRef = useRef();

    useEffect(() => {
        if(existingImageUrl) {
            setImageUrl(existingImageUrl);

        } else {
            setUploadProgress(-1);
            setImageUrl("");
            fileInputRef.current.value = null;
        }
    },[existingImageUrl])

    async function handleFileChanged(event) {
        const files = event.target.files;
        const file = files[0];

        if(!file) {
            alert("File Select Failed. Please try again.")
            return;
        }

        const generatedFieldId = uuidv4();

        try {
            await FirebaseStorageServie.uploadFile(
                file, 
                `${basePath}/${generatedFieldId}`, 
                setUploadProgress,
                setImageUrl,
                handleUploadFinish
            )
           

        } catch (error) {
            setUploadProgress(-1);
            fileInputRef.current.value = null;
            alert(error.message);
            throw error;
        }
    }

    function handleCancelImageClick() {
        FirebaseStorageServie.deleteFile(imageUrl);
        fileInputRef.current.value = null;
        setImageUrl("");
        setUploadProgress(-1);
        handleUploadCancel();
    }

    return (
        <div
            className="image-upload-preview-container"
        >
            <input 
                type={'file'} 
                accept='image/*'
                onChange={ handleFileChanged }
                ref={fileInputRef}
                hidden={uploadProgress > -1 || imageUrl}
            />
            {
                !imageUrl && uploadProgress > -1 ? 
                (
                    <div>
                        <label
                            htmlFor="file"
                        >
                            Upload Progress:
                        </label>
                        <progress
                            id="file"
                            value={uploadProgress}
                            max = "100"
                        >
                            {uploadProgress}%
                        </progress>
                        <span>
                            {uploadProgress}%
                        </span>
                    </div>
                ) : (
                    null
                )
            }

            {
                imageUrl ? 
                    (
                        <div
                            className="image-preview"
                        >
                            <img 
                                src={imageUrl}
                                alt={imageUrl}
                                className="image"
                            />
                            <button
                                type="button"
                                onClick={handleCancelImageClick}
                                className="primary-button"
                            >
                                Cancel Image
                            </button>
                        </div>
                    ) : (
                        null
                    )
            }
        </div>
    )
}

export default ImageUploadPreview;