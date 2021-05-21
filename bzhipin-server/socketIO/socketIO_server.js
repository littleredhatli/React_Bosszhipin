module.exports = function (server) {
// 得到 IO 对象
  const io = require('socket.io')(server, { cors: true });
  const ChatModel = require('../db/models').ChatModel
  //监视客户端与服务端的链接
  io.on('connection', function (socket) {
    console.log('有一个客户端连接上了服务器');

    socket.on('sendMsg', function ({from, to, content}) {
      console.log('服务器接收到消息', {from, to, content});

      //处理数据（保存消息）
      const chat_id = [from, to].sort().join('_'); //使from_to和to_from的char_id一样
      const create_time = Date.now();
      new ChatModel({from, to, content, chat_id, create_time}).save(function (error, chatMsg) {
        // 向所有连接上的客户端发消息
        io.emit('receiveMsg', chatMsg)
      })
    })
  })
}


