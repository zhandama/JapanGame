import Vue from 'vue'
import Router from 'vue-router'
const Home = r => require.ensure([], () => r(require('@/page/home')), 'home')
const IndexPage = r => require.ensure([], () => r(require('@/page/index')), 'home')
const HistoryPage = r => require.ensure([], () => r(require('@/page/history')), 'home')
const Search = r => require.ensure([], () => r(require('@/page/search')), 'home')
const Message = r => require.ensure([], () => r(require('@/page/message')), 'chat')
const Chat = r => require.ensure([], () => r(require('@/page/chat')), 'chat')
const SiteInfo = r => require.ensure([], () => r(require('@/page/siteInfo')), 'home')
import {sellRouter} from './sell.js'
import {buyRouter,buyRouters} from './buy.js'
import {userRouter,userRouters} from './user.js'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  },
  routes: [
    {path: '/', name: 'Home', component: Home, meta: { keepAlive: true }},
    {path: '/index.html', name: 'Home1', component: Home},
    {path: '/search', name: 'Search', component: Search},
    {path: '/history', components: {default:IndexPage}, children: [{path: '', name: 'History', component: HistoryPage}]},
    {path: '/message', name: 'Message', component: Message,meta: {requireAuth: true}},
    {path: '/chat', components: {default:IndexPage},children: [{path: '',name: 'Chat', component: Chat}]},
    {path: '/siteinfo', components: {default:IndexPage}, children: [{path: '', name: 'SiteInfo', component: SiteInfo}]},
    sellRouter,
    buyRouter,
    buyRouters,
    userRouter,
    userRouters
  ]
})
