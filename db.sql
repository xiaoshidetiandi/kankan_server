SET NAMES UTF8;
DROP DATABASE IF EXISTS my_pro;
CREATE DATABASE my_pro CHARSET=UTF8;
USE my_pro;
-- #1:创建user表
CREATE TABLE user(
  id INT PRIMARY KEY AUTO_INCREMENT,
  -- 用户昵称
  userName VARCHAR(50) ,
  -- 手机号,及用户登录账号
  phone CHAR(11),
  -- 用户密码
  pwd  VARCHAR(32),
  -- 用户头像
  userHeadPic VARCHAR(50),
  -- 用户观看历史
  playHistory VARCHAR(2500),
  -- 用户收藏
  collect VARCHAR(2500) 
);
-- INSERT INTO user VALUES(null,"超级用户","17784726905","123456","","","");
-- #2:创建movie 电影表
CREATE TABLE movie(
  id INT PRIMARY KEY AUTO_INCREMENT,
  -- 电影名字
  movieNmme VARCHAR(30),
  -- 电影介绍
  movieIntr VARCHAR(500),
  -- 电影类型 科幻,战斗,动作
  movieType VARCHAR(50),
  -- 电影上映时间
  movieTime VARCHAR(10),
  -- 电影分数,0~10分
  movieScore VARCHAR(3),
  -- 电影语言类型 BD 国语
  movieLanguageType VARCHAR(5),
  -- 电影语言 英语 日语 国语
  movieLanguage VARCHAR(5),
  -- 电影导演名字
  movieDirect VARCHAR(30),
  -- 拍摄国家 
  movieCountry VARCHAR(30),
  -- 电影播放次数
  moviePlay INT,
  -- 电影时长 xxx分钟
  movieTimeLength VARCHAR(10),
  -- 电影图片
  moviePic VARCHAR(300),
  -- 电影资源地址
  movieResource VARCHAR(50),
  -- 资源更新时间
  resourceUp DATETIME
);


