/*使用 mongoose 操作 mongodb 的测试文件
1. 连接数据库
1.1. 引入 mongoose
1.2. 连接指定数据库(URL 只有数据库是变化的)
1.3. 获取连接对象
1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的 Model
2.1. 字义 Schema(描述文档结构)
2.2. 定义 Model(与集合对应, 可以操作集合)
3. 通过 Model 或其实例对集合数据进行 CRUD 操作
3.1. 通过 Model 实例的 save()添加数据
3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
3.4. 通过 Model 的 remove()删除匹配的数据
*/

const md5 = require('blueimp-md5')
//连接数据库
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
  header: {type: String}
})
const UserModel = mongoose.model('user', UserSchema)

//CRUD
// 3.1. 通过 Model 实例的 save()添加数据
function testSave(){
  const userModel = new UserModel({username:'Tom', password: md5('123'), type: 'student'});
  userModel.save(function (error, user) {
    console.log(error, user);
  })
}
//testSave()
// 3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
function testFind(){
  UserModel.find(function (error, users) {  //如果有匹配返回的是一个[user, user..], 如果没有一个匹配的返回[]
    console.log('find', error, users)
  })
  UserModel.findOne({username: 'Tom'}, function (error, user) { // 如果有匹配返回的是一个 user, 如果没有一个匹配的返回 null
    console.log('findOne', error, user)
  })
}
//testFind()
// 3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
function testUpdate(){
  UserModel.findByIdAndUpdate({username:'tom'}, {username:'Jack'},function (error, olduser) {
    console.log('update', error, olduser)
  })
}
//testUpdate()
// 3.4. 通过 Model 的 remove()删除匹配的数据
function testDelete(){
  UserModel.remove({username:'Tom'}, function (error, doc) {
    console.log('delete', error, doc)
  })
}
