import { createRouter, createWebHistory } from 'vue-router'
import RegistrationView from '../Pages/RegistrationPage.vue'
import AuthorizationView from '../Pages/AuthorizationPage.vue'
import AllTemplates from '../Pages/AllTemplatePage.vue'
import AllUsers from '../Pages/AdminPanelPage.vue'
import CreateTemplate from '../Pages/CreateTemplatePage.vue'
import Statistics from '../Pages/StatisticPage.vue'
import FormFiller from '../Pages/FillTemplatePage.vue'
import TemplatePreview from '../Pages/TemplatePreviewPage.vue'


const routes = [
    {
        path: '/',
        redirect: '/reg',
    },
    {
        path: '/reg',
        name: 'Registration',
        component: RegistrationView,
    },
    {
        path: '/auth',
        name: 'Authorization',
        component: AuthorizationView
    },
    {
        path: '/admin_panel',
        name: 'AdminPanel',
        component: AllUsers,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/all_templates',
        name: 'AllTemplates',
        component: AllTemplates,
        meta: { requiresAuth: true }
    },
    {
        path: '/create_template',
        name: 'CreateTemplate',
        component: CreateTemplate,
        meta: { requiresAuth: true }
    },
    {
        path: '/statistics/:templateId',
        name: 'Statistics',
        component: Statistics,
        meta: { requiresAuth: true }
    },
    {
        path: '/fill_form/:id',
        name: 'FillForm',
        component: FormFiller,
        meta: { requiresAuth: true }
    },
    {
        path: '/preview_page/:id',
        name: 'TemplatePreview',
        component: TemplatePreview,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem('token')
    const userRole = sessionStorage.getItem('userRole')

    if (to.meta['requiresAuth'] && !token) {
        return next('/auth')
    }

    if (to.meta['requiresAdmin'] && userRole !== 'Admin')
    {
        return next('/all_templates')
    }

    next()
})

export default router