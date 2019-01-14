const IndexPage = r => require.ensure([], () => r(require('@/page/index')), 'home')
const User = r => require.ensure([], () => r(require('@/page/user/user')), 'user')
const Info = r => require.ensure([], () => r(require('@/page/user/info')), 'user')
const Login = r => require.ensure([], () => r(require('@/page/user/login')), 'user')
const Register = r => require.ensure([], () => r(require('@/page/user/register')), 'user')
const Collection = r => require.ensure([], () => r(require('@/page/user/collection')), 'user')
const PhoneVerif = r => require.ensure([], () => r(require('@/page/user/phoneVerif')), 'user')
const EmailVerif = r => require.ensure([], () => r(require('@/page/user/emailVerif')), 'user')
const PhoneCode = r => require.ensure([], () => r(require('@/page/user/phoneCode')), 'user')
const PutForward = r => require.ensure([], () => r(require('@/page/user/putForward')), 'user')
const PutForwardHistory = r => require.ensure([], () => r(require('@/page/user/putForwardHistory')), 'user')
const Help = r => require.ensure([], () => r(require('@/page/user/help')), 'user')
const HelpList = r => require.ensure([], () => r(require('@/page/user/helpList')), 'user')
const Feedback = r => require.ensure([], () => r(require('@/page/user/feedback')), 'user')

const Ordersell = r => require.ensure([], () => r(require('@/page/user/seller/orderSell')), 'user')
const Orderbuy = r => require.ensure([], () => r(require('@/page/user/buyer/orderBuy')), 'user')
const OrderInfo = r => require.ensure([], () => r(require('@/page/user/buyer/orderInfo')), 'user')
const OrderRefund = r => require.ensure([], () => r(require('@/page/user/buyer/orderRefund')), 'user')

export const userRouter = {
  path: '/user',
  name: 'User',
  components: {
    default: User
  }
}
export const userRouters = {
  path: '/user',
  components: {
    default: IndexPage
  },
  children:[
    {path: 'info',name: 'Info',component: Info,meta: {requireAuth: true}},
    {path: 'login',name: 'Login',component: Login},
    {path: 'register',name: 'Register',component: Register},
    {path: 'phoneverif',name: 'PhoneVerif',component: PhoneVerif},
    {path: 'phonecode',name: 'PhoneCode',component: PhoneCode},
    {path: 'emailverif',name: 'EmailVerif',component: EmailVerif},
    {path: 'collection',name: 'Collection',component: Collection,meta: {requireAuth: true}},
    {path: 'putforward',name: 'PutForward',component: PutForward,meta: {requireAuth: true}},
    {path: 'putforwardhistory',name: 'PutForwardHistory',component: PutForwardHistory,meta: {requireAuth: true}},
    {path: 'ordersell',name: 'OrderSell',component: Ordersell,meta: {requireAuth: true}},
    {path: 'orderbuy',name: 'OrderBuy',component: Orderbuy,meta: {requireAuth: true}},
    {path: 'orderinfo',name: 'OrderInfo',component: OrderInfo,meta: {requireAuth: true}},
    {path: 'orderrefund',name: 'OrderRefund',component: OrderRefund,meta: {requireAuth: true}},
    {path: 'help',name: 'Help',component: Help},
    {path: 'helpList',name: 'HelpList',component: HelpList},
    {path: 'feedback',name: 'Feedback',component: Feedback,meta: {requireAuth: true}},
  ]
}
