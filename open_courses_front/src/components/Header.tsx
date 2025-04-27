import {useAuth} from "@/contexts/AuthContext"
import { useState } from "react";

const Header = () => {
    const {user, logout} = useAuth();
    const {logged_in, set_logged_in} = useState(user ? true : false);

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex space-x-6">
                    <a href="#" className="text-gray-700 font-medium">Курсы</a>
                    <a href="#" className="text-gray-700 font-medium">Моё обучение</a>
                    <a href="#" className="text-gray-900 font-semibold border-b-2 border-gray-900">Преподавание</a>
                </div>
                <div className="flex items-center space-x-4">
                    <span>
                    { user ? 
                        <div>
                            {user.username}
                            <span onClick={logout}>Выйти</span>
                        </div>
                    : 
                        <a href='login/'>Войти</a>
                    }
                    </span>
                    <button className="text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;