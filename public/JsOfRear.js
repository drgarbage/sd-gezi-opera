const gap = 25;
const photosContainer = document.getElementById('photos__container');
const photos = document.getElementsByClassName('photo');

function cascadeDisplay() {
    const photosContainerWidth = photosContainer.offsetWidth;
    const photoWidth = photos[0].offsetWidth;
    // 計算一列最多有幾欄
    const columnsCount = parseInt((photosContainerWidth) / (photoWidth + gap));
    const fistRowPhotosHeightArray = [];
    // 進行照片排序
    for (let i = 0; i < photos.length; i++) {
        // 放上第一列的照片
        if (i < columnsCount) {
            photos[i].style.top = 0;
            photos[i].style.left = (photoWidth + gap) * i + 'px';
            // 紀錄第一列的照片高
            fistRowPhotosHeightArray.push(photos[i].offsetHeight);
        } else {
            // 放上第二列開始的照片
            // 找出第一列的最小高度
            let minHeight = Math.min(...fistRowPhotosHeightArray);
            // 紀錄最小高度的index，以取得對應到第一列的位置，來決定left要移動多少
            let index = fistRowPhotosHeightArray.indexOf(minHeight);
            // 調整接續的photo位置，放到目前最小高度的地方
            photos[i].style.top = minHeight + gap + 'px';
            // 取得對應到第一列photo的left位置
            photos[i].style.left = photos[index].offsetLeft + 'px';
            // 最後!!再把原本儲存在陣列裡面為最小高度的值，更新上最新的高度(原本的高度+新的高度+間隔)
            fistRowPhotosHeightArray[index] = fistRowPhotosHeightArray[index] + photos[i].offsetHeight + gap;

        }
    }
}
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 畫面一進來
window.onload = function () {
    cascadeDisplay();
    fetchImages();

}

// 畫面寬度有變動
window.onresize = function () {
    cascadeDisplay();
}


// 使用 Fetch API 請求圖片
//http://ai-twins.co:10017/get-images
function fetchImages() {
    fetch('/get-images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ /* 可以加入需要的請求資料 */ })
    })
        .then(response => response.json())
        .then(imageDataArray => {
			//-------------照片大小---------------
			var minheight = 400;
			var maxheight = 600;
            const fragment = document.createDocumentFragment();
			
            imageDataArray.forEach(imageData => {

                const imageElement = document.createElement('img'); // 使用 <img> 元素
                //imageElement.classList.add('photo'); // 增加自定義的 CSS class
                imageElement.style.height = getRandom(minheight, maxheight) + 'px';
                //console.log(imageData);
                // 創建一個 Blob 物件，使用從伺服器取得的圖片資料和類型
                var u8Arr = new Uint8Array(imageData.data);
                const blob = new Blob([u8Arr], { type: 'image/jpeg' });

                // 使用 FileReader 來將 Blob 讀取成 Data URL (Base64 格式)
                const reader = new FileReader();
                reader.onload = function (event) {
                    const base64Data = event.target.result; // 這裡的 base64Data 就是 Data URL
                    imageElement.src = base64Data; // 設定圖片的 Data URL

                    //console.log(base64Data);
                };
                reader.readAsDataURL(blob); // 開始讀取 Blob
                const photoInfo = document.createElement('div');
                photoInfo.classList.add('photo');
                ;
                photoInfo.appendChild(imageElement);
                fragment.appendChild(photoInfo);
            });

            photosContainer.innerHTML = ''; // 清空容器內的內容
            photosContainer.appendChild(fragment);
            //fragment.scrollIntoView({ behavior: 'smooth', block: 'end' });

            cascadeDisplay();
            const images = document.querySelectorAll('.photo img');
            //console.log(images);
            images.forEach(image => {
                // 在这里添加事件监听器或其他处理
                image.addEventListener('click', function () {
                    // 处理图片点击事件的逻辑
                    console.log('Image clicked:', image);
                    const newImage = new Image();
                    newImage.classList.add('image-popup');
                    // 设置新图片的属性，如 src、width 和 height，以复制原始图片的属性
                    newImage.src = image.src;
                    newImage.style.width = image.style.width;
                    newImage.style.height = image.style.height;
                    clearImages();
                    document.getElementById('popup').appendChild(newImage);
                    openPopup();
                });
            });
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
}

function openPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

// 关闭弹出窗口
function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

function clearImages() {
    const divElement = document.getElementById('popup'); // 替换 'yourDivId' 为你的 <div> 元素的 id
    const imgElements = divElement.getElementsByTagName('img');

    for (let i = imgElements.length - 1; i >= 0; i--) {
        const img = imgElements[i];
        img.parentNode.removeChild(img);
    }
}
document.getElementById('overlay').addEventListener('click', closePopup);
//function ImagePopup() {
//    const images = photosContainer.querySelectorAll('.photo');
//    console.log(images);
//
//    // 这里可以继续处理获取到的图片元素
//    images.forEach(image => {
//        // 在这里添加事件监听器或其他处理
//        image.addEventListener('click', function () {
//            // 处理图片点击事件的逻辑
//            console.log('Image clicked:', image);
//            // 打开弹出窗口或执行其他操作
//        });
//    });
//}


//设置滚动速度（每次滚动的像素数）

const scrollSpeed = 1;
var dummy = 0;
var count = 0;
// 创建滚动函数
function autoScroll() {
    // 获取当前滚动位置
    const currentScrollTop = photosContainer.scrollTop;

    // 计算下一个滚动位置
    const nextScrollTop = currentScrollTop + scrollSpeed;

    // 检查是否已经滚动到底部
    //if (nextScrollTop >= photos.clientHeight - photosContainer.clientHeight) {
    if (nextScrollTop == dummy) {
        count = count + 1
        if (count >= 30) {
            console.log(nextScrollTop)
            console.log(dummy)
            // 如果已经滚动到底部，停止滚动
            fetchImages();
            //clearInterval(scrollInterval);
        }
        else {
            // 否则，继续滚动
            dummy = nextScrollTop;
            //console.log(nextScrollTop)
            //console.log(photos.clientHeight)
            //console.log(photosContainer.clientHeight)
            photosContainer.scrollTop = nextScrollTop;
        }


    } else {
        // 否则，继续滚动
        dummy = nextScrollTop;
        count = 0
        //console.log(nextScrollTop)
        //console.log(photos.clientHeight)
        //console.log(photosContainer.clientHeight)
        photosContainer.scrollTop = nextScrollTop;
    }
}

// 设置滚动的时间间隔（毫秒）
const scrollIntervalTime = 60;

// 开始滚动
const scrollInterval = setInterval(autoScroll, scrollIntervalTime);


setInterval(fetchImages,50000);
