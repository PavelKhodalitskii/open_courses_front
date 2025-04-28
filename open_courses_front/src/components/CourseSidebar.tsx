import { CourseWithModules } from "@/dataclasses/course";
import User from "@/dataclasses/user";


interface CourseSidebarProps {
    course: CourseWithModules;
    user: User;
    onPublish: () => void;
}

const CourseSidebar = ({ course, onPublish }: CourseSidebarProps) => {
    return (
        <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-gray-200 p-4 mb-4 rounded">
                <h2 className="text-sm text-gray-600 mb-1">{course.title}</h2>
                <p className="text-xs text-gray-500">{course.description}</p>
            </div>

            <nav className="space-y-1">
                <a href="#" className="block bg-[#00D07D] text-black px-4 py-3 rounded font-medium">
                    Редактор курса
                </a>
                <a href="#" className="block bg-gray-300 hover:bg-gray-200 px-4 py-3 rounded font-medium">
                    Объявления
                </a>
                <a href="#" className="block bg-gray-300 hover:bg-gray-200 px-4 py-3 rounded font-medium">
                    Аналитика
                </a>
                <a href="#" className="block bg-gray-300 hover:bg-gray-200 px-4 py-3 rounded font-medium">
                    Преподаватели
                </a>
                <a href="#" className="block bg-gray-300 hover:bg-gray-200 px-4 py-3 rounded font-medium">
                    Учащиеся
                </a>
            </nav>

            <div className="mt-auto pt-6">
                <button
                    className="w-full bg-[#00D07D] text-black py-3 rounded font-medium hover:bg-gray-800 transition"
                    onClick={onPublish}
                >
                    {course.is_published ? "Опубликовано" : "Опубликовать"}
                </button>
            </div>
        </div>
    );
};

export default CourseSidebar;