import { useState } from 'react';

const ProfileImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profile_image', selectedFile);
        formData.append('user_id', 1); // replace with dynamic user ID

        try {
            const response = await fetch('/api/users/upload_profile_picture', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setUploadStatus('File uploaded successfully!');
                console.log('File uploaded:', result.image_url);
            } else {
                setUploadStatus('File upload failed: ' + result.error);
            }
        } catch (err) {
            setUploadStatus('Error: ' + err.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default ProfileImageUpload;
