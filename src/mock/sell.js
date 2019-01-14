/*
 * @Author: tangxm
 * @Date: 2018-11-23 13:46:22
 * @LastEditors: tangxm
 * @LastEditTime: 2018-11-30 16:23:08
 */
// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;
// mock一组数据
var gameName = ['モバイルゲーム','インペリアルサガ','FGO','白猫プロジェクト','パズドラ(パズル＆ドラゴンズ)','PCゲーム']
const gameList = function() {
  let sList=[];
  for (let i = 0; i < 20; i++) {
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

const pyList = function() {
    let sList=['ヲ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ', 'ャ', 'ュ', 'ョ', 'ッ', 'ー', 'ア', 'イ',
    'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ',
    'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ',
    'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル',
    'レ', 'ロ', 'ワ', 'ン' ];
    return sList
  }

export{
  gameList,
  pyList
}
