/*
包含n个操作数据库集合数据的model模块
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bzhipin');
const conn = mongoose.connection;
conn.on('connected', function (){
  console.log("数据库连接成功");
})

// 2. 得到对应特定集合的 Model
const UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  type: {type: String, required: true},
  header: {type: String},
  post: {type: String},
  info: {type: String},
  company: {type: String},
  salary: {type: String}
})
const UserModel = mongoose.model('user', UserSchema)
//向外暴露model
exports.UserModel = UserModel;


//保存消息
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的 id
  to: {type: String, required: true}, // 接收用户的 id
  chat_id: {type: String, required: true}, // from 和 to 组成的字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})
// 定义能操作 chats 集合数据的 Model
const ChatModel = mongoose.model('chat', chatSchema)
// 向外暴露 Model
exports.ChatModel = ChatModel