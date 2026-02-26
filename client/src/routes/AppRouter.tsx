import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Landing } from '../pages/Landing';
import { Dashboard } from '../pages/Dashboard';
import { Upload } from '../pages/Upload';
import { Summary } from '../pages/Summary';
import { Chatbot } from '../pages/Chatbot';
import { Rights } from '../pages/Rights';
import { Search } from '../pages/Search';
import { Lawyers } from '../pages/Lawyers';
import { History } from '../pages/History';
import { Feedback } from '../pages/Feedback';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Landing /> },
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
        ],
    },
    {
        path: '/',
        element: <DashboardLayout />,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'upload', element: <Upload /> },
            { path: 'summary', element: <Summary /> },
            { path: 'chatbot', element: <Chatbot /> },
            { path: 'rights', element: <Rights /> },
            { path: 'search', element: <Search /> },
            { path: 'lawyers', element: <Lawyers /> },
            { path: 'history', element: <History /> },
            { path: 'feedback', element: <Feedback /> },
        ],
    },
]);
