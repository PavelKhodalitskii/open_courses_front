import {useAuth} from "@/contexts/AuthContext"
import { useState } from "react";

const Header = () => {
    const {user, logout} = useAuth();
    // const {logged_in, set_logged_in} = useState(user ? true : false);

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex space-x-6">
                    <a href="#" className="text-gray-700 font-medium">Курсы</a>
                    <a href="#" className="text-gray-700 font-medium">Моё обучение</a>
                    <a href="#" className="text-gray-700 font-medium">Преподавание</a>
                    <a href="/my_courses/" className="text-gray-900 font-semibold border-b-2 border-gray-900">Мои курсы</a>
                </div>
                <div className="flex items-center space-x-4">
                    <span>
                    { user ? 
                        <div className="flex flex-row gap-2">
                            <span>{user.first_name}</span>
                            <span onClick={logout}>Выйти</span>
                        </div>
                    : 
                        <a href='/login/'>Войти</a>
                    }
                    </span>
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;