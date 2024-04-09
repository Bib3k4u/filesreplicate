import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedFile || !fileType || uploading) {
        console.error('Please select a file and file type or file is already uploading');
        return;
      }

      setUploading(true); // Start upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await axios.post(`http://localhost:5000/upload?type=${fileType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded:', res.data);
      setUploadSuccess(true); // Set upload success flag
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false); // Reset uploading state
    }
  };

  const handlePopupClose = () => {
    setUploadSuccess(false); // Close popup
  };

  return (
    <div className="flex justify-center items-center w-full h-full pt-10">
      <div className="w-1/2 mx-auto">
        <h2 className="text-3xl mb-4 font-bold">Upload File</h2>
        <input type="file" onChange={handleFileChange} className="border border-gray-400 p-2 rounded-md mb-4 w-full" />
        <select value={fileType} onChange={handleFileTypeChange} className="border border-gray-400 p-2 rounded-md mb-4 w-full">
          <option value="">Select File Type</option>
          <option value="pdf">PDF</option>
          <option value="zip">ZIP</option>
          <option value="excel">Excel</option>
          <option value="doc">Doc</option>
          <option value="others">Others</option>
        </select>
        <button onClick={handleSubmit} disabled={uploading} className="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded w-full">
          {uploading ? 'Uploading File...' : 'Upload'}
        </button>
        {uploadSuccess && (
          <div className="bg-green-500 text-white rounded-md p-4 mt-4">
            File uploaded successfully!
            <button onClick={handlePopupClose} className="float-right text-white font-bold px-2">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;