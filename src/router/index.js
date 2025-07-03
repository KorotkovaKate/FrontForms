import { createRouter, createWebHistory } from 'vue-router'
import RegistrationView from '../pages/RegistrationPage.vue'
import AuthorizationView from '../pages/AuthorizationPage.vue'


const routes = [
    {
        path: '/',
        redirect: '/reg'
    },
    {
        path: '/reg',
        name: 'Registration',
        component: RegistrationView
    },
    {
        path: '/auth',
        name: 'Authorization',
        component: AuthorizationView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router