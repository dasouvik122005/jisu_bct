import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Register } from './register/register';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Settings } from './settings/settings';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path:'', component:Home},
    { path: 'home', component: Home },
    { path: 'about', component: About },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'settings', component: Settings, canActivate: [authGuard] },
];
