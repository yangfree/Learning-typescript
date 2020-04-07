// 链接io服务
const socket = io("ws://localhost:3002");

// 登陆功能
$("#loginPhotos li").on("click", function () {
  $(this).addClass("actived").siblings().removeClass("actived");
});

$("#loginBtn").on("click", function () {
  // 获取用户名称
  const username = $("#username").val().trim();
  if (!username) {
    alert("请输入用户名");
    return false;
  }
  // 获取用户头像
  let avatar = $("#loginPhotos li.actived img").attr("src");
  console.log(username, avatar);
  // 链接io服务器
  socket.emit("login", {
    username: username,
    avatar: avatar,
  });
});

// 监听登陆成功和失败
socket.on("loginError", (data) => {
  alert(data.msg);
});
socket.on("loginSuccess", (data) => {
  $("#loginBox").fadeOut(300);
  $("#chatList").fadeIn(300);
  // console.log(data);
  $("#chatList .my-photo").attr("src", data.avatar);
  $("#chatList .my-username").text(data.username);
});

// 监听添加新用户
socket.on("addUser", (data) => {
  $("#users").html(`
    <div class="broadcast">${data.username}加入了群聊</div>
    `);
});

// 监听聊天室人数
socket.on("userList", (data) => {
  $(".list-right .title").text(`多人聊天室(${data.length})`);
});
