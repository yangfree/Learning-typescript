const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = 3002;
server.listen(port, () => {
    console.log(`Server runing in http://localhost:${port}.`);
});

app.use(require('express').static('public'));

app.get('/', (req, res) => {
    res.redirect('index.html');
})

io.on('connection', socket => {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', data => {
        console.log(data);
    })
})