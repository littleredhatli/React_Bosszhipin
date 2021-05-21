module.exports = function (server) {
// 得到 IO 对象
  const io = require('socket.io')(server, { cors: true });
  //监视客户端与服务端的链接
  io.on('connection', function (socket) {
    console.log('有一个客户端连接上了服务器');
    socket.on('sendMsg', function (data) {
      console.log('服务器接收到消息', data);
      data.name = data.name.toUpperCase()
      socket.emit('receiveMsg', data);
      console.log('服务器向客户端发消息', data);
    })
  })
}