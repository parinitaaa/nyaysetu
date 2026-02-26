

const PagePlaceholder = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
            <p className="text-slate-500">This feature is currently under active development. Stay tuned!</p>
        </div>
    </div>
);

export const Login = () => <PagePlaceholder title="Login" />;
export default Login;
