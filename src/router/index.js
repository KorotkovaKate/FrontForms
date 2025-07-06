import { createRouter, createWebHistory } from 'vue-router'
import RegistrationView from '../Pages/RegistrationPage.vue'
import AuthorizationView from '../Pages/AuthorizationPage.vue'
import AllTemplates from '../Pages/AllTemplatePage.vue'
import AllUsers from '../Pages/AdminPanelPage.vue'
import CreateTemplate from '../Pages/CreateTemplatePage.vue'
import Statistics from '../Pages/StatisticPage.vue'


const routes = [
    {
        path: '/',
        redirect: '/reg',
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
    },
    {
        path: '/admin_panel',
        name: 'AdminPanel',
        component: AllUsers
    },
    {
        path: '/all_templates',
        name: 'AllTemplates',
        component: AllTemplates
    },
    {
        path: '/create_template',
        name: 'CreateTemplate',
        component: CreateTemplate
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router