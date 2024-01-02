const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // 引入 cors 套件
const path1 = require('path');

const multer = require('multer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));
// 設定允許跨域請求的來源
const corsOptions = {
  origin: 'http://127.0.0.1:3001', // 指定前端域名或 IP 地址
  methods: ['GET', 'POST'], // 允許的 HTTP 方法
};

// 使用 cors 中介軟體
app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '50mb'}));

app.use(express.static(path1.join(__dirname, 'uploads')));
const fileCount = 0;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      // 讀取目錄中的文件列表，獲取文件數量
      fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          cb(err, null);
          return;
        }

        const fileCount = files.length;
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const newFileNumber = (fileCount + 1).toString().padStart(3, '0'); // 将数字格式化为带有前导零的字符串
        const newFileName = `image_${newFileNumber}${fileExtension}`;
        cb(null, newFileName);

      });
    }
});

const upload = multer({
  dest: 'uploads/', // 設定圖片上傳的目錄
  storage: storage // 設定儲存方式
});



app.post('/upload-image', upload.single('image'), (req, res) => {
  // req.file 是上傳的圖片檔案，可以根據需求進行處理
  if (req.file) {
    res.status(200).send('Image uploaded successfully.');
  } else {
    res.status(400).send('No image file uploaded.');
  }
});

app.use(express.static(path.join(__dirname, 'public')));


var down = 0;
app.post('/get-images', async (req, res) => {
  try {
    // 讀取目錄中的文件列表，獲取文件名稱
    fs.readdir(path.join(__dirname, 'uploads'), async (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return res.status(500).send('Error reading directory');
      }

      const imageNames = files
        .filter(file => file.startsWith('image_') && file.endsWith('.jpg'))
        .map(file => file);
      selectedImageNames = imageNames.slice(0, 1);
      var upper = imageNames.length;
      //console.log(upper);
      var piece = 14;
	  var forward = 3
      var dummy = down + piece;
      console.log('down='+down);
      
      if (dummy <= upper) {
        console.log('if');
        selectedImageNames = imageNames.slice(down, down + piece);
        console.log(selectedImageNames);
      } else {
        down = upper - piece;
        console.log('else');
        selectedImageNames = imageNames.slice(down, upper);
        console.log(selectedImageNames);
      }

      console.log(selectedImageNames.length);
      const imageDataArray = []; // 創建空數組來存儲圖片數據

      // 逐個讀取圖片數據，將其添加到 imageDataArray 中
      for (const imageName of selectedImageNames) {
        const imagePath = path.join(__dirname, 'uploads', imageName);
        const imageData = await fs.promises.readFile(imagePath);
        imageDataArray.push(imageData);
      }
      //console.log(imageDataArray);
      down = down + forward;
      res.json(imageDataArray);
    });
  } catch (err) {
    console.error('Error reading images:', err);
    res.status(500).send('Error reading images');
  }
});


// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });




//receive data from client---------------------------------------------------------

const file_dir = 'current_photo';
var current_file_name = "";

app.use(express.static(path1.join(__dirname, file_dir)));
const r_fileCount = 0;
const r_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file_dir);
  },
  filename: (req, file, cb) => {
    // 讀取目錄中的文件列表，獲取文件數量
    fs.readdir(path.join(__dirname, file_dir), (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        cb(err, null);
        return;
      }

      const r_fileCount = files.length;
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const newFileNumber = (r_fileCount + 1).toString().padStart(3, '0'); // 将数字格式化为带有前导零的字符串
      const newFileName = `image_${newFileNumber}${fileExtension}`;
      current_file_name = newFileName;
      cb(null, newFileName);
      
    });
  }
});


const r_upload = multer({
  dest: 'uploads/', // 設定圖片上傳的目錄
  storage: r_storage // 設定儲存方式
});




app.post('/client-upload-image', r_upload.single('image'), (req, res) => {
  // req.file 是上傳的圖片檔案，可以根據需求進行處理
  console.log('current_file_name = ' + current_file_name);
  if (req.file) {
    res.status(200).send(current_file_name);
  } else {
    res.status(400).send('No image file uploaded.');
  }
});

app.use(express.static(path.join(__dirname, 'public')));


// --- adapt to sdapi
// const sdapihost = 'http://localhost:7860';
const sdapihost = 'http://ai.printii.com';
const adaptGet = async (route, req, res) => {
  try{
    const response = await axios.get(`${sdapihost}${route}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if(response.status !== 200) {
      res.status(response.status).send({message: 'Network Error'});
      return;
    }

    res.send(response.data);
  }catch(err){
    console.error(err.message);
    res.status(500).send({message: 'Internal Server Error'});
  }
}

const adaptPost = async (route, req, res) => {
  try { 
    console.log(req.body);
    const response = await axios.post(`${sdapihost}${route}`, req.body, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  
    if(response.status !== 200) {
      res.status(response.status).send({message: 'Network Error'});
      return;
    }
  
    res.send(response.data);

  } catch(err) {
    console.error(err.message);
    res.status(500).send({message: 'Internal Server Error'});
  }
}

app.post('/sdapi/v1/img2img', (req, res) => 
  adaptPost('/sdapi/v1/img2img', req, res));

app.post('/sdapi/v1/extra-single-image', (req, res) => 
  adaptPost('/sdapi/v1/extra-single-image', req, res));

app.post('/reactor/image', (req, res) => 
  adaptPost('/reactor/image', req, res));

app.get('/sdapi/v1/sd-models', (req, res) => 
  adaptGet('/sdapi/v1/sd-models', req, res));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
