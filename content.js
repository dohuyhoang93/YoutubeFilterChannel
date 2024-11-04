// Hàm kiểm tra xem kênh có thuộc danh sách kênh được phép hay không
function checkChannel() {
    chrome.storage.local.get("allowedChannels", (data) => {
      const allowedChannels = data.allowedChannels || [];
      const channelLink = document.querySelector('#owner a.yt-simple-endpoint');
      const channelName = channelLink ? channelLink.getAttribute('href') : "";
  
      // Nếu kênh không nằm trong danh sách được phép, ẩn nội dung
      if (!allowedChannels.some(channel => channelName.includes(channel))) {
        document.body.innerHTML = "<h1>Video này không thuộc kênh được phép xem</h1>";
      }
    });
  }
  
  // Kiểm tra lại mỗi giây để xử lý nội dung tải động
  const checkInterval = setInterval(checkChannel, 1000);
  