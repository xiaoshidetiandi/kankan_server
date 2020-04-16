//功能:服务器程序
//1:引入四个模块
const express = require("express"); //web服务器模块
const mysql = require("mysql"); //mysql模块
const session = require("express-session"); //session模块
const cors = require("cors"); //跨域
// npm i body-parser    下载body-parser模块的指令 如果需要用post和delete请求就必须下载
const bodyParser = require("body-parser"); //引入body-parser模块
//2:引入连接池文件
const pool = require("./pool");
//3:创建web服务器
var server = express();
//4:配置跨域模块
//4.1:允许程序列表 脚手架
//4.2:每次请求验证
server.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);
//配置 body-parser 如果需要用到post和delete就必须配置这个
console.log("配置body-parser");
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
//5:指定静态资源目录 public
server.use(express.static("public"));
//6:配置session对象
server.use(
  session({
    secret: "128位安全字符串", //加密条件
    resave: true, //每次请求更新数据
    saveUninitialized: true, //保存初始化数据
  })
);
//7:为服务器绑定监听端口 4000
server.listen(4000);
console.log("服务器起动.......");

// 查询用户名是否已存在--注册
server.get("/selectUserName", (req, res) => {
  // console.log("运行 查询用户名是否已存在--注册 接口");
  //1:获取脚手架传递用户名和密码
  var userName = req.query.userName;
  // console.log("userName:", userName);
  //2:创建sql语法并且将用户名和密码加入
  var sql = "SELECT userName FROM user WHERE userName=?";
  //3:执行sql语法并且获取返回结果
  pool.query(sql, [userName], (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    if (result.length == 0) {
      // console.log("该用户名可用");
      res.send({
        code: 0,
        msg: "该用户不存在",
      });
    } else {
      // console.log("该用户名已被占用");
      res.send({
        code: 1,
        msg: "该用户已存在",
      });
    }
  });
});

// 查询手机号是否已经被注册--注册
server.post("/selectUserPhone", (req, res) => {
  //1:获取脚手架传递用户名和密码
  var phone = req.body.phone;
  // console.log(phone);
  //2:创建sql语法并且将用户名和密码加入
  var sql = "SELECT phone FROM user WHERE phone=?";
  //3:执行sql语法并且获取返回结果
  pool.query(sql, [phone], (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    // console.log(result.length);
    if (result.length == 0) {
      // console.log("该手机号尚未被注册");
      res.send({
        code: 0,
        msg: "该手机号尚未被注册",
      });
    } else {
      // console.log("该手机号已被占用");
      res.send({
        code: 1,
        msg: "该手机号已被占用",
      });
    }
  });
});

//功能一:用户注册
server.post("/register", (req, res) => {
  //1:获取脚手架传递用户名和密码
  console.log("运行用户注册接口");
  var userNname = req.body.userNname;
  var phone = req.body.phone;
  var pwd = req.body.pwd;
  console.log(userNname);
  console.log(phone);
  console.log(pwd);
  // //2:创建sql语法并且将用户名和密码加入
  var sql = `INSERT INTO user VALUES(null,"${userNname}","${phone}",md5("${pwd}"),"","","")`;
  // //3:执行sql语法并且获取返回结果
  pool.query(sql, (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    if (result.affectedRows != 0) {
      console.log("注册成功");
      res.send({
        code: 1,
        msg: "注册成功",
      });
    } else {
      console.log("注册失败");
      res.send({
        code: -1,
        msg: "注册失败",
      });
    }
  });
});

// 用户登录
server.post("/login", (req, res) => {
  //1:获取脚手架传递用户名和密码
  console.log("运行用户登录接口");
  var phone = req.body.phone;
  var pwd = req.body.pwd;
  // console.log(phone);
  // console.log(pwd);
  // // //2:创建sql语法并且将用户名和密码加入
  var sql =
    "SELECT id,userName,userHeadPic,playHistory,collect FROM user WHERE phone=? AND pwd=md5(?)";
  // // //3:执行sql语法并且获取返回结果
  pool.query(sql, [phone, pwd], (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    console.log(result);
    if (result.length == 0) {
      res.send({
        code: -1,
        msg: "登录失败,用户名或者密码错误",
      });
    } else {
      req.session.uid = result[0].id;
      res.send({
        code: 1,
        msg: "登录成功",
        data: result,
      });
    }
  });
});

// 分类页获取数据
server.get("/selectClassify", (req, res) => {
  console.log("运行 分类页数据--注册 接口");
  var key = req.query.key;
  var start = req.query.start;
  // console.log("搜查:", key);
  // console.log("start:", start);
  //2:创建sql语法并且将用户名和密码加入
  var sql = `SELECT id,movieNmme,movieType,movieTime,movieScore,movieLanguage,movieDirect,movieCountry,movieTimeLength,moviePic FROM movie WHERE movieType LIKE "%${key}%" LIMIT ${start},${6}`;
  //3:执行sql语法并且获取返回结果
  pool.query(sql, [start], (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

//推荐页 获取数据
server.get("/recommend", (req, res) => {
  console.log("运行 获取推荐页数据 -- 接口");
  //1:获取脚手架传递用户名和密码
  var start = req.query.start;
  // console.log("搜查:", key);
  // console.log("start:", start);
  //2:创建sql语法并且将用户名和密码加入
  var sql = `SELECT id,movieNmme,movieType,movieTime,movieScore,movieLanguage,movieDirect,movieCountry,movieTimeLength,moviePic FROM movie LIMIT ${start},${6}`;
  //3:执行sql语法并且获取返回结果
  pool.query(sql, [start], (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});
// 详情页数据获取
server.get("/detail", (req, res) => {
  console.log("运行 获取详情页数据 -- 接口");
  //1:获取脚手架传递用户名和密码
  var mid = req.query.mid;
  // console.log("搜查:", key);
  // console.log("start:", start);
  //2:创建sql语法并且将用户名和密码加入
  var sql =
    "SELECT movieNmme,movieIntr,movieType,movieTime,movieScore,movieLanguage,movieDirect,movieCountry,moviePlay,movieTimeLength,moviePic,movieResource,resourceUp FROM movie WHERE id=?";
  //3:执行sql语法并且获取返回结果
  pool.query(sql, [mid], (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

// 电影播放次数的增加
server.get("/addPlay", (req, res) => {
  console.log("增加电影播放次数");
  var mid = req.query.mid;
  var sql = "UPDATE movie SET moviePlay=moviePlay+1 WHERE id=?";
  //3:执行sql语法并且获取返回结果
  pool.query(sql, [mid], (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    res.send({ code: 1, msg: "成功加1" });
  });
});

// 电影搜索,根据电影名字
server.get("/searchMovies", (req, res) => {
  console.log("搜索电影");

  var movieNmme = req.query.movieNmme;
  var start = req.query.start;
  console.log(movieNmme);
  var sql = `SELECT id,movieNmme,movieType,movieTime,movieScore,movieLanguage,movieDirect,movieCountry,movieTimeLength,moviePic FROM movie WHERE movieNmme LIKE "%${movieNmme}%" LIMIT ${start},${6}`;
  //3:执行sql语法并且获取返回结果
  pool.query(sql, (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

// 用户播放历史变更

server.post("/setPlayHistory", (req, res) => {
  //1:获取脚手架传递用户名和密码
  console.log("执行播放历史变更！");

  var id = req.body.id;
  var str = req.body.str;
  console.log("id:", id);
  console.log("str:", typeof str);
  var sql = `UPDATE user SET playHistory="${str}" WHERE id=${id}`;
  console.log(sql);
  // // //3:执行sql语法并且获取返回结果
  pool.query(sql, (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    console.log(result);
    if (result.length == 0) {
      res.send({
        code: -1,
        msg: "修改失败",
      });
    } else {
      res.send({
        code: 1,
        msg: "ok",
        data: result,
      });
    }
  });
});

// 用户收藏
server.post("/setCollect", (req, res) => {
  //1:获取脚手架传递用户名和密码
  console.log("执行用户收藏变更！");

  var id = req.body.id;
  var str = req.body.str;
  console.log("id:", id);
  console.log("str:", typeof str);
  var sql = `UPDATE user SET collect="${str}" WHERE id=${id}`;
  console.log(sql);
  // // //3:执行sql语法并且获取返回结果
  pool.query(sql, (err, result) => {
    //3.1:如果出现严重错误抛出
    if (err) throw err;
    console.log(result);
    if (result.length == 0) {
      res.send({
        code: -1,
        msg: "修改失败",
      });
    } else {
      res.send({
        code: 1,
        msg: "ok",
        data: result,
      });
    }
  });
});
