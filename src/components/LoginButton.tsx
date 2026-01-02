import { useAuth } from '../context/AuthContext';

export default function LoginButton() {
    const { signInWithGoogle } = useAuth();

    return (
        <button 
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-3 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-medium border border-gray-200"
        >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Sign in with Google
        </button>
    );
}
