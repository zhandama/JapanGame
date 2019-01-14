const IndexPage = r => require.ensure([], () => r(require('@/page/index')), 'home')
const Sell = r => require.ensure([], () => r(require('@/page/sell/sell')), 'sell')
const Create = r => require.ensure([], () => r(require('@/page/sell/create')), 'sell')

export const sellRouter = {
  path: '/sell',
  components: {
    default: IndexPage
  },
  children:[
    {path: '',name: 'Sell',component: Sell},
    {path: 'create',name: 'Create',component: Create,meta: {requireAuth: true}}
  ],
}
