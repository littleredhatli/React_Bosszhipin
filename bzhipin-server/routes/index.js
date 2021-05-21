var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models')
const filter = {password: 0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册一个路由：用户注册
/*
获取请求参数
处理
返回响应数据
 */
// router.post('/register', function (req, res, next){
//   console.log(111)
//   const {username, password} = req.body;
//   if(username == 'admin'){
//     res.send({code:1, msg:'此用户已存在'});
//   }else{
//     res.send({code: 0, data: {id: 'abc', username, password}});
//   }
// })

//注册的路由
router.post('/register', function (req, res) {
  const {username, password, type} = req.body;
  //处理：判断用户是否已经存在。如果存在，返回错误信息；如果不存在，保存
  UserModel.findOne({username}, function (error, user) {
    if(user){
      res.send({code:1, msg:'此用户已存在'});
    }else{
      new UserModel({username, type, password: md5(password)}).save(function (error, user) {
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24}) //持久化cookie，浏览器会保存在本地文件
        const data = {username, type, _id: user._id}; //返回包含user的json数据，响应数据中不要携带password
        res.send({code:0, data})
      })
    }
  })
})

//登录的路由
router.post('/login', function (req, res) {
  const {username, password} = req.body;
  //根据username和password查询users
  UserModel.findOne({username, password: md5(password)}, filter, function (error, user) {
    if(user){
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
      res.send({code: 0, data: user})
    }else{
      res.send({code:1, msg:'用户名或密码不正确'})
    }
  })
})

//更新用户新的路由
router.post('/update', function (req,res) {
  const userid = req.cookies.userid;
  if(!userid){
    return res.send({code:1, msg: '请先登录'});
  }
  const user = req.body;
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {
    if(!oldUser){
      res.clearCookie('userid');
      res.send({code:1, msg: '请先登录'});
    }else{
      const {_id, username, type} = oldUser;
      const data = Object.assign({_id, username, type}, user);
      res.send({code: 0, data})
    }
  })
})

//获取用户信息的路由（根据cookie中的userid）
router.get('/user', function (req, res) {
  const userid = req.cookies.userid;
  if(!userid){
    return res.send({code: 1, msg: '请先登录'});
  }
  UserModel.findOne({_id: userid}, filter, function (error, user) {
    res.send({code: 0, data: user});
  })
})

//获取用户列表，根据用户类型
router.get('/userlist', function (req,res) {
  const {type} = req.query;
  UserModel.find({type}, filter, function (error, users) {
    res.send({code:0, data: users});
  })
})

//获取当前用户所有相关信息列表
router.get('/msglist', function (req, res) {
  const userid = req.cookies.userid;
  UserModel.find(function (error, userDocs) {
    // 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对
    const users = {};
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, header: doc.header}
    })
    /*查询 userid 相关的所有聊天信息
    参数 1: 查询条件
    参数 2: 过滤条件
    参数 3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (error, chatMsgs) {
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

//修改指定消息为已读
router.post('/readmsg', function (req, res) {
  const from = req.body.from;
  const to = req.cookies.userid;
  /*更新数据库中的 chat 数据
  参数 1: 查询条件
  参数 2: 更新为指定的数据对象
  参数 3: 是否 1 次更新多条, 默认只更新一条
  参数 4: 更新完成的回调函数
  */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (error, doc) {
    res.send({code: 0, data: doc.nModified}) //更新的数量
  })
})

module.exports = router;
