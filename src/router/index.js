import { createRouter, createWebHistory } from 'vue-router'
import RegistrationView from '../Pages/RegistrationPage.vue'
import AuthorizationView from '../Pages/AuthorizationPage.vue'


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