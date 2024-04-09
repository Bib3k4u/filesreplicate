// server/index.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path'); // Import the 'path' module

const app = express();
app.use(cors());
app.use(express.json());

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Sequelize setup
const sequelize = new Sequelize('buszne4pqo1ve45icpu1', 'u2vzmi98dwqqyu8w', 'jJpJ2PGHEQXuEg2G0Bwc', {
  dialect: 'mysql',
  host: 'buszne4pqo1ve45icpu1-mysql.services.clever-cloud.com',
});

// Define your model
const File = sequelize.define('File', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileData: {
    type: DataTypes.BLOB('long'),
    allowNull: false,
  },
});

// Sync the model with the database
sequelize.sync();

// Routes
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const data = fs.readFileSync(file.path);

    const newFile = await File.create({
      filename: file.originalname,
      fileData: data,
    });

    fs.unlinkSync(file.path);

    res.status(201).json(newFile);
  } catch (error) {
    console.error('Error uploading file:', error); // Log the error
    console.error(error.stack); // Log the stack trace
    res.status(500).json({ message: 'Server Error' });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Get all files
app.get('/files', async (req, res) => {
    try {
      const fileList = await File.findAll();
      const fileDataList = await Promise.all(fileList.map(async file => {
        const { filename, fileData, ...rest } = file.toJSON();
        return { filename, fileData: fileData.toString('base64'), ...rest };
      }));
      res.json(fileDataList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // Get file by filename
  app.get('/files/:filename', async (req, res) => {
    const { filename } = req.params;
    try {
      const file = await File.findOne({ where: { filename } });
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
      res.send(file.fileData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  app.delete('/files/:filename', async (req, res) => {
    const { filename } = req.params;
    try {
      // Check if the file exists in the database
      const file = await File.findOne({ where: { filename } });
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
  
      // Delete the file from the storage
      // Your code to delete the file...
  
      // Delete the file record from the database
      await file.destroy();
  
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
