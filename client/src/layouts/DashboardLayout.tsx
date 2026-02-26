
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="lg:pl-64 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
