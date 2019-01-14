/*
 * @Author: tangxm
 * @Date: 2018-11-23 13:46:22
 * @LastEditors: tangxm
 * @LastEditTime: 2018-11-28 15:29:48
 */
// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;
// mock一组数据
var gameName = ['モバイルゲーム','インペリアルサガ','FGO','白猫プロジェクト','パズドラ(パズル＆ドラゴンズ)','PCゲーム']
const bannerList = function() {
    let bannerList = [];
    for (let i = 0; i < 6; i++) {
        let str = {
            title: Random.csentence(5, 10), //  Random.csentence( min, max )
            imgUrl: Random.dataImage('800x200', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
            linkUrl: Random.url('http', 'm.5173.com'), 
            author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
            date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
        }
        bannerList.push(str)
    }
    return bannerList
}
const homeGameList = function() {
    let pcList = [],mList = [];
    for (let i = 0; i < 4; i++) {
        let str = {
            gameName: gameName[Math.floor(Math.random()*gameName.length)],
            imgUrl: Random.dataImage('68x68', 'PCGame'),
            gameType: '1', 
            gameId: Random.date() + ' ' + Random.time()
        }
        pcList.push(str)
    }
    for (let i = 0; i < 6; i++) {
        let str1 = {
            gameName: gameName[Math.floor(Math.random()*gameName.length)],
            imgUrl: Random.dataImage('107x85', 'MGame'),
            gameType: '2', 
            gameId: Random.date() + ' ' + Random.time()
        }
        mList.push(str1)
    }
    return {
        pcList:pcList,
        mList:mList
    }
}
const homeHistoryList = function() {
    let sList=[];
    for (let i = 0; i < 4; i++) {
        let str = {
            gameName: 'ガチャ限600↑アーサー艦隊 ルシフ ァ艦隊 アリス艦隊 マナ2体 パンド',
            description: 'モバイルゲーム > モンスターストライク(モンスト)',
            imgUrl: Random.dataImage('237x422', 'historyList'),
            gameType: '1',
            like:Random.boolean(),
            likeNum:Random.integer(0,999),
            price:Random.integer(0,99999),
            saleType:Random.integer(0,1),
            gameId: Random.date() + ' ' + Random.time()
        }
        sList.push(str)
    }
    return sList
}
const historyList = function() {
  let sList=[];
  for (let i = 0; i < 20; i++) {
    let str = {
      gameName: 'ガチャ限600↑アーサー艦隊 ルシフ ァ艦隊 アリス艦隊 マナ2体 パンド',
      description: 'モバイルゲーム > モンスターストライク(モンスト)',
      imgUrl: Random.dataImage('237x422', 'historyList'),
      gameType: '1',
      like:Random.boolean(),
      likeNum:Random.integer(0,999),
      price:Random.integer(0,99999),
      saleType:Random.integer(0,1),
      gameId: Random.date() + ' ' + Random.time(),
    }
    sList.push(str)
  }
  return {
    list:sList,
    total:50
  }
}

const searchList = function() {
  let sList=[];
  for (let i = 0; i < 6; i++) {
    let str = {
      gameName: gameName[Math.floor(Math.random()*gameName.length)],
      description: 'モバイルゲーム > モンスターストライク(モンスト)',
      imgUrl: Random.dataImage('237x422', 'searchList'),
      gameType: '1',
      gameId: Random.date() + ' ' + Random.time(),
    }
    sList.push(str)
  }
  
  return sList
}

export{
  bannerList,
  homeGameList,
  homeHistoryList,
  historyList,
  searchList
}
