// client/src/App.js
import React from 'react';
import './App.css';
import FileUpload from './FileUpload';
import FileList from './FileList';

function App() {
  return (
    <div className="App flex flex-col md:flex-row lg:flex-row xl:flex-row">
      <FileUpload />
      <div className='h-screen  w-1 bg-gray-300'>
      </div>
      <FileList/>
    </div>
  );
}

export default App;
