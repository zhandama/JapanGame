const IndexPage = r => require.ensure([], () => r(require('@/page/index')), 'home')
const Buy = r => require.ensure([], () => r(require('@/page/buy/buy')), 'buy')
const Goodslist = r => require.ensure([], () => r(require('@/page/buy/goodslist')), 'buy')
const Detail = r => require.ensure([], () => r(require('@/page/buy/detail')), 'buy')
const Order = r => require.ensure([], () => r(require('@/page/buy/order')), 'buy')
const Pay = r => require.ensure([], () => r(require('@/page/buy/pay')), 'buy')

export const buyRouter = {
  path: '/buy',
  name: 'Buy',
  components: {
    default: Buy
  },
}
export const buyRouters = {
  path: '/buy',
  components: {
    default: IndexPage
  },
  children:[
    {path: 'goodslist',name: 'Goodslist',component: Goodslist, meta: { keepAlive: true }},
    {path: 'detail',name: 'Detail',component: Detail},
    {path: 'order',name: 'Order',component: Order, meta: {requireAuth: true}},
    {path: 'pay',name: 'Pay',component: Pay},
  ],
}
