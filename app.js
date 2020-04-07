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
    }
  });
});
