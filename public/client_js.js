document.getElementById('uploadButton').addEventListener('click', () => {
    //var current_file_name = "";
    const fileInput = document.getElementById('imageInput');
    const messageDiv = document.getElementById('message');

    if (fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const formData = new FormData();
        formData.append('image', imageFile);

        fetch('http://localhost:3001/client-upload-image', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(message => {
                //current_file_name = "http://aigc.ai-twins.co/" + message;
                console.log('上傳成功:', "http://aigc.ai-twins.co/" + message);
                document.cookie = "uploadflag=" + 1;
                document.cookie = "current_file_name=" + "http://aigc.ai-twins.co/" + message;
                messageDiv.textContent = '上傳成功!';
                //fileInput.value = ''; // 清空輸入欄
                openPopup();
            })
            .catch(error => {
                console.error('上傳失敗:', error);
                messageDiv.textContent = '';
            });
    } else {
        messageDiv.textContent = '請選擇一張圖片來上傳。';
    }
    //console.log('current_file_name = ' + current_file_name);
});

//预览图片
document.getElementById('imageInput').addEventListener('change', function (e) {
    const fileInput = e.target;
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');

    if (fileInput.files.length > 0) {
        const imageFile = fileInput.files[0];
        const imageUrl = URL.createObjectURL(imageFile); // 使用URL.createObjectURL创建临时URL

        // 设置预览图片的src属性为选择的图片URL
        previewImage.src = imageUrl;

        // 显示预览 div
        imagePreview.style.display = 'block';
    } else {
        // 如果没有选择图片，隐藏预览 div
        imagePreview.style.display = 'none';
        previewImage.src = ''; // 清空预览图片
    }
});
document.getElementById('agree').addEventListener('click', () => {
    closePopup();
});
//document.getElementById('disagree').addEventListener('click', () => {
//    closePopup();
//});

openPopup();
function openPopup() {
    console.log('cookie' + getCookieValue('uploadflag'));
    if (getCookieValue('uploadflag') == null || getCookieValue('uploadflag') == 0) {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    }
    else {
        document.cookie = "uploadflag=" + 0;
        console.log(getCookieValue('uploadflag'));
        console.log("不是第一次進入網頁");
        

        openPopup_upload();
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    }

}

// 关闭弹出窗口
function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

function openPopup_upload() {
    // 获取对要清除的 div 的引用
    const pop_win = document.getElementById('popup');

    // 清除 div 内的所有内容
    pop_win.innerHTML = '';

    // 创建一个新的 <h1> 元素
    const newH1 = document.createElement('h1');
    const newH2 = document.createElement('h1');
    const button = document.createElement('input');
    // 设置新的 <h1> 文本
    newH1.textContent = '上傳成功!'; // 请将'新的标题文本' 替换为您想要的标题文本
    newH1.style.fontSize = '50px';
    newH2.textContent = '您的魔幻AI換臉劇照將於5分鐘內出現於!';
    //調整字體大小
    newH1.style.fontSize = '30px';
    newH2.style.position = 'relative';
    const new_web_address = document.createElement('a');
    new_web_address.href = getCookieValue('current_file_name');
    new_web_address.textContent = getCookieValue('current_file_name');

    button.type = 'button';
    button.value = '確定';
    button.style.position = 'relative';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%)';
    button.style.width = '100px';
    button.style.height = '50px';
    button.onclick = closePopup;

    // 将新的 <h1> 元素添加到 div 中
    pop_win.appendChild(newH1);
    pop_win.appendChild(newH2);
    pop_win.appendChild(new_web_address);
    pop_win.appendChild(button);
    // document.getElementById('overlay').style.display = 'block';
    // document.getElementById('popup_upload').style.display = 'block';
}

// 关闭弹出窗口
function closePopup_upload() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup_upload').style.display = 'none';
}
//document.getElementById('popup').addEventListener('click', closePopup);

//Cookie 

function getCookieValue(cookieName) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const [name, value] = cookie.split("=");
        if (name === cookieName) {
            return value;
        }
    }
    return null; // 如果找不到特定名稱的 cookie，返回 null 或其他適當的值
}

