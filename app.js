const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 3002;
const users = [];

server.listen(port, () => {
  console.log(`Server runing in http://localhost:${port}.`);
});

app.use(require("express").static("public"));

app.get("/", (req, res) => {
  res.redirect("index.html");
});

io.on("connection", (socket) => {
  console.log("新用户链接了");
  // 用户登陆
  socket.on("login", (data) => {
    //   console.log(data);
    let user = users.find((item) => data.username === item.username);
    if (user) {
      socket.emit("loginError", { msg: "登陆失败,用户名称已存在!" });
    } else {
      users.push(data);
      // 告诉用户登陆成功
      socket.emit("loginSuccess", data);
      // 广播给所有的用户有新用户进来
      io.emit("addUser", data);
      // 广播给所有用户当前聊天室用户数
      io.emit("userList", users);
      // 存储用户信息 登出等时候会更新状态
      socket.username = data.username;
      socket.avatar = data.avatar;
    }
  });
  // 用户断开链接
  socket.on("disconnect", () => {
    let id = users.findIndex((item) => {
      item.username === socket.username;
    });
    users.splice(id, 1);
    io.emit("delUser", {
      username: socket.username,
      avatar: socket.avatar,
    });
    io.emit("userList", users);
  });

  //监听聊天消息
  socket.on("sendMsg", (data) => {
    // console.log(data);
    io.emit("receiveMsg", data);
  });
  //接受图片信息
  socket.on("sendImage", (data) => {
    // console.log(data);
    io.emit("receiveImage", data);
  });
});
