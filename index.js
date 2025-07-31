const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

fs.readdir('./files', (err, files) => {


  res.render('form' , { files: files  });

});
});

app.post('/submit', (req, res) => {
  const name = req.body.name; 
  const message = req.body.message;

  fs.writeFile(`./files/${name.split(" ").join("")}.txt`, `Name: ${name}\nMessage: ${message}`, (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log('Data saved to file successfully');
    }
  });
  res.redirect('/' );

});
app.get('/delete',(req, res) => {
  fs.readdir('./files', (err, files) => {

    files.map(file => {
      fs.unlink(`./files/${file}`, (err) => {
        if (err) {
          console.error('Error deleting file', err);
        } else {
          console.log(`File ${file} deleted successfully`);
        }
      });
    })
  
    res.redirect('/');
  });
});
app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;

  fs.readFile(`./files/${filename}`, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
      return res.status(404).send('File not found');
    } else {
      console.log('File read successfully');
      res.render('showFile', { filename: filename, content: data });
    }
  });
});
app.get('/edit/:filename', (req, res) => {
 
  const filename = req.params.filename;    
  res.render('edit', { filename: filename }); 
})

app.post('/edit', (req, res) => {
  const filename = req.body.filename;
  const newName = req.body.newname;

 console.log(`Editing file: ${filename} to new name: ${newName}`);

  fs.rename(`./files/${filename}`, `./files/${newName}`, (err) => {
    if (err) {
      console.error('Error renaming file', err);
      return res.status(500).send('Error renaming file');
    } else {
      console.log('File renamed successfully');
      res.redirect('/');
    }
  });
});

  
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});