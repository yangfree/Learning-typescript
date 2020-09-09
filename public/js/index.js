// 链接io服务
const socket = io("ws://localhost:3002");
let username, avatar;

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
  username = data.username;
  avatar = data.avatar;
});

// 监听添加新用户
socket.on("addUser", (data) => {
  $("#users").append(`
    <div class="broadcast">${data.username}加入了群聊</div>
    `);
  scrollIntoView();
});

// 监听聊天室人数
socket.on("userList", (data) => {
  $(".list-right .title").text(`多人聊天室(${data.length})`);
  $("#userList").html("");
  data.forEach((item) => {
    let li = `
    <li>
        <div class="img">
            <img src="${item.avatar}" alt="" />
        </div>
        <p>${item.username}</p>
    </li> `;
    $("#userList").append(li);
  });
});

// 监听用户离开的消息
socket.on("delUser", (data) => {
  $("#users").append(`
    <div class="broadcast">${data.username}离开了群聊</div>
    `);
  scrollIntoView();
});

// 聊天功能
$("#btnSend").on("click", function () {
  let content = $("#msgSend").val().trim();
  $("#msgSend").val("");
  if (!content) {
    alert("请输入内容");
    return false;
  }
  socket.emit("sendMsg", {
    msg: content,
    username: username,
    avatar: avatar,
  });
});
// 监听聊天的消息
socket.on("receiveMsg", (data) => {
  // 判断是否是自己的消息
  if (data.username === username) {
    $("#users").append(`
    <div class='message-content'>
        <div class="my-user">
              <div class="word">
                ${data.msg}
              </div>
              <div class="img">
                <img src="${data.avatar}" alt="" />
              </div>
            </div>
            </div>
        `);
  } else {
    $("#users").append(`
    <div class='message-content'>
        <div class="other-user">
              <div class="img">
                <img src="${data.avatar}" alt="" />
              </div>
              <div class="word">
                ${data.username} | 
                ${data.msg}
              </div>
            </div>
            </div>
        `);
  }

  scrollIntoView();
});

// 当前元素的底部滚动到可视区, 有兼容问题.
function scrollIntoView() {
  $("#users").children(":last").get(0).scrollIntoView(false);
}
// 发送图片
$("#file").on("change", function () {
  console.log(this.files[0]);
  let file = this.files[0];
  //H5的fileReader
  let fr = new FileReader();
  fr.readAsDataURL(file);
  fr.onload = () => {
    socket.emit("sendImage", {
      username: username,
      avatar: avatar,
      img: fr.result,
    });
  };
});
//监听图片聊天信息
socket.on("receiveImage", (data) => {
  console.log(data);
  // 判断是否是自己的消息
  if (data.username === username) {
    $("#users").append(`
      <div class='message-content'>
        <div class="my-user">
              <div class="word">
                <img src="${data.img}">
              </div>
              <div class="img">
                <img src="${data.avatar}" alt="" />
              </div>
          </div>
        </div>
        `);
  } else {
    $("#users").append(`
     <div class='message-content'>
        <div class="other-user">
              <div class="img">
                <img src="${data.avatar}" alt="" />
              </div>
              <div class="word">
                <span>${data.username}</span>
                <img src="${data.img}">
              </div>
            </div>
        </div>
        `);
  }

  // 保证所有的图片加载完成后在滚动到底部
  $("#users img:last").on("load", function () {
    scrollIntoView();
  });
});
