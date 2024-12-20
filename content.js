// Biến đếm số lần gọi checkChannel
let checkChannelCount = 0;

// Lấy tên kênh cần tìm từ storage, được lưu bởi popup.js
let allowedChannels = [];

// Lấy dữ liệu từ storage
chrome.storage.local.get("allowedChannels", (data) => {
  allowedChannels = data.allowedChannels || [];
  console.log("Gọi checkChannel từ: Lấy dữ liệu từ storage");
  checkChannel(); // Gọi checkChannel() ngay sau khi lấy dữ liệu từ storage
});

monitorURLChange();       // Theo dõi sự thay đổi URL

// Hàm gọi kiểm tra kênh
function checkChannel() {
  // Đảm bảo DOM đã sẵn sàng trước khi kiểm tra
  if (document.readyState === "loading") {
    // Nếu DOM chưa sẵn sàng, lắng nghe sự kiện DOMContentLoaded và gọi lại
    document.addEventListener("DOMContentLoaded", () => {
      console.log(`Gọi checkChannel sau khi DOMContentLoaded)`);
      checkChannelLogic(); // Thực hiện logic kiểm tra kênh
    }, { once: true });
  } else {
    // Nếu DOM đã sẵn sàng, thực hiện kiểm tra ngay lập tức
    console.log(`Gọi checkChannelLogic vì DOM đã load xong`);
    checkChannelLogic();
  }
}

// Hàm kiểm tra kênh
function checkChannelLogic() {
  checkChannelCount++; // Tăng biến đếm mỗi khi checkChannel được gọi
  console.log(`Lần gọi checkChannel thứ ${checkChannelCount}`);

  // Lấy channelId từ URL hiện tại
  const currentURL = new URL(location.href);
  const channelId = currentURL.pathname.split("/")[1];

  // Kiểm tra nếu channelId có trong allowedChannels
  if (allowedChannels.includes(channelId)) {
    console.log(`Channel ${channelId} is allowed, exiting checkChannelLogic.`);
    return; // Nếu channelId hợp lệ, thoát khỏi hàm
  }

  // Nếu không hợp lệ, tiếp tục kiểm tra các phần tử trên trang
  const selector = "a#header.yt-simple-endpoint.style-scope.ytd-video-description-infocards-section-renderer";

  setTimeout(() => {
    const channelContainer = document.querySelector(selector);

    if (channelContainer) {
      const channelHref = channelContainer.getAttribute("href").trim();
      let channelName = channelHref.split("/").pop(); // Lấy phần sau cùng của href
      // Kiểm tra nếu `channelName` chứa ký tự không phải ASCII (có dạng mã hóa %)
      if (channelName.includes("%")) {
        channelName = decodeURIComponent(channelName); // Giải mã nếu không phải ASCII
      }
      console.log(`Lần gọi checkChannel thứ ${checkChannelCount}: Check Channel:`, channelName);

      const isAllowed = allowedChannels.includes(channelName);
      if (isAllowed) {
        console.log(`Lần gọi checkChannel thứ ${checkChannelCount}: Allowed Channel:`, channelName);
      } else {
        console.log(`Lần gọi checkChannel thứ ${checkChannelCount}: Channel not allowed:`, channelName);
        document.body.innerHTML = "<h1>Content not allowed to access</h1>";
      }
    } else {
      console.log(`Lần gọi checkChannel thứ ${checkChannelCount}: No element containing channel name found.`);
      document.body.innerHTML = "<h1>Content not allowed to be accessed because no valid content was found - reload to try again</h1>";
    }
  }, 1000); // Chờ 1 giây để đảm bảo nội dung đã tải xong
}

// Sử dụng setInterval để kiểm tra URL mỗi giây
function monitorURLChange() {
  let lastURL = location.href;
  
  setInterval(() => {
    const currentURL = location.href;
    if (currentURL !== lastURL) {
      lastURL = currentURL;
      console.log("Gọi checkChannel từ: URL thay đổi");
      checkChannel();  // Gọi checkChannel khi URL thay đổi
    }
  }, 2000); // Kiểm tra URL mỗi 2 giây
}

// Lắng nghe sự kiện popstate khi thay đổi lịch sử (Back/Forward)
window.addEventListener("popstate", function(event) {
  console.log("Lịch sử đã thay đổi, trang có thể đã được back hoặc forward.");
  console.log("Trang hiện tại:", location.href);
  setTimeout(() => {
    console.log("Lệnh thứ hai sau 2 giây");
  }, 2000);  // Delay 2000ms (2 giây)
  // Có thể reload hoặc thực hiện các hành động khác nếu cần
  window.location.reload();  // Buộc reload trang từ server
});