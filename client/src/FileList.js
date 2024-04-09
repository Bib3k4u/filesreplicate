import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilePdf, FaFileArchive, FaFileExcel, FaFileWord, FaFile } from 'react-icons/fa'; // Import Font Awesome icons from React Icons

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles(); // Fetch files initially

    const interval = setInterval(() => {
      fetchFiles(); // Fetch files every 3 seconds
    }, 3000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const getFileIcon = (filename) => {
    const iconSize = '24px'; // Adjust the size as needed
    const iconColor = 'black'; // Change color to red
  
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="mr-2" size={iconSize} color={iconColor} style={{ background: 'none' }} />;
      case 'zip':
        return <FaFileArchive className="mr-2" size={iconSize} color={iconColor} style={{ background: 'none' }} />;
      case 'xlsx':
      case 'xls':
        return <FaFileExcel className="mr-2" size={iconSize} color={iconColor} style={{ background: 'none' }} />;
      case 'docx':
      case 'doc':
        return <FaFileWord className="mr-2" size={iconSize} color={iconColor} style={{ background: 'none' }} />;
      default:
        return <FaFile className="mr-2" size={iconSize} color={iconColor} style={{ background: 'none' }} />;
    }
  };

  const handleFileClick = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/files/${filename}`, {
        responseType: 'blob', // Ensure response is treated as binary data
      });

      // Create a blob URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary <a> element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();

      // Cleanup
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteClick = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/files/${filename}`);
      // Remove the deleted file from the files state
      setFiles(prevFiles => prevFiles.filter(file => file.filename !== filename));
      setDeleteSuccess(true); // Set delete success flag
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handlePopupClose = () => {
    setDeleteSuccess(false); // Close popup
  };

  return (
    <div className="flex justify-center items-center pt-10 w-full h-full">
      <div className="w-1/2 mx-auto">
        <h2 className="text-3xl mb-4 font-bold">Files List</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index} className="mb-4 flex justify-between items-center">
              <button onClick={() => handleFileClick(file.filename)} className="bg-yellow-400 w-64 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded flex items-center">
                {getFileIcon(file.filename)}
                {file.filename}
              </button>
              <button onClick={() => handleDeleteClick(file.filename)} className="bg-red-500 hover:bg-red-700 text-black ml-2 font-bold py-2 px-4 rounded">
                Delete
              </button>
            </li>
          ))}
        </ul>
        {deleteSuccess && (
          <div className="bg-green-500 text-white rounded-md p-4 mt-4">
            File deleted successfully!
            <button onClick={handlePopupClose} className="float-right text-white font-bold px-2">Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;