/*
 * @Author: tangxm
 * @Date: 2018-11-23 13:46:22
 * @LastEditors: tangxm
 * @LastEditTime: 2018-12-27 14:46:41
 */
// 引入mockjs
const Mock = require('mockjs');
import  * as home from './home.js'
import  * as sell from './sell.js'
import  * as user from './user.js'

// home.js--首页接口模拟
Mock.mock('/api/banner', 'get', home.bannerList);
Mock.mock('/api/homeGame', 'get', home.homeGameList);
Mock.mock('/api/homeHistory', 'get', home.homeHistoryList);
Mock.mock('/api/history', 'get', home.historyList);
Mock.mock('/api/search', 'get', home.searchList);

// sell.js--出售接口模拟
Mock.mock('/api/gameList', 'get', sell.gameList);
Mock.mock('/api/pyList', 'get', sell.pyList);

// user.js--用户接口模拟
Mock.mock('/api/userInfo', 'get', user.userInfo);