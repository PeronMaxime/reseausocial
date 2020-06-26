import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import connect from '@/components/connect'
import admin from '@/components/admin'
import register from '@/components/register'
import successRegister from '@/components/successRegister'
import check from '@/components/check'
import profil from '@/components/profil'
import messages from '@/components/messages'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/connect',
      name: 'connect',
      component: connect
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/successRegister',
      name: 'successRegister',
      component: successRegister
    },
    {
      path: '/check/:id',
      name: 'check',
      component: check
    },
    {
      path: '/profil/:id',
      name: 'profil',
      component: profil
    },
    {
      path: '/messages',
      name: 'messages',
      component: messages
    }
  ],
  mode: 'history'
})
