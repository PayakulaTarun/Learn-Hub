import LoginButton from '@/components/LoginButton';
import Header from '@/components/Header';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-500 mb-8">Sign in to continue your learning journey.</p>
                    
                    <div className="flex justify-center">
                        <LoginButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
