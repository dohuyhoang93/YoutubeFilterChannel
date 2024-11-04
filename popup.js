// Lấy danh sách kênh từ local storage và hiển thị
function loadChannels() {
    chrome.storage.local.get("allowedChannels", (data) => {
      const channels = data.allowedChannels || [];
      const channelList = document.getElementById("channelList");
      channelList.innerHTML = "";
  
      channels.forEach((channel) => {
        const li = document.createElement("li");
        li.textContent = channel;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Xóa";
        removeBtn.onclick = () => removeChannel(channel);
        li.appendChild(removeBtn);
        channelList.appendChild(li);
      });
    });
  }
  
  // Thêm kênh vào danh sách
  function addChannel() {
    const channelInput = document.getElementById("channelInput");
    const channelName = channelInput.value.trim();
    if (channelName) {
      chrome.storage.local.get("allowedChannels", (data) => {
        const channels = data.allowedChannels || [];
        if (!channels.includes(channelName)) {
          channels.push(channelName);
          chrome.storage.local.set({ allowedChannels: channels }, loadChannels);
        }
        channelInput.value = "";
      });
    }
  }
  
  // Xóa kênh khỏi danh sách
  function removeChannel(channel) {
    chrome.storage.local.get("allowedChannels", (data) => {
      const channels = data.allowedChannels || [];
      const updatedChannels = channels.filter((c) => c !== channel);
      chrome.storage.local.set({ allowedChannels: updatedChannels }, loadChannels);
    });
  }
  
  document.getElementById("addChannel").addEventListener("click", addChannel);
  loadChannels();
  