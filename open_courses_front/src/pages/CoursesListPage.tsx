import { useEffect, useState } from "react";

import apiClient from "@/api/client";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/dataclasses/course";
import { useNavigate } from "react-router-dom";


const CoursesList = () => {
    // const {user, logout} = useAuth();
    const navigate = useNavigate();

    const [coursesList, setCoursesList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleGoToEditor = (course_id: number) => {
        return navigate(`/my_courses/${course_id}/edit`)
    }

    const fetchUsersCoursesList = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/courses/users_courses/",
                {
                    headers: { "Content-Type": "application/json" },
                });

            const courses = response.data.map((course: any) => ({
                id: course.id,
                title: course.name,
                description: course.description,
                is_published: course.is_published,
            }));
            setCoursesList(courses);
            setError(null);
        } catch (err) {
            setError("Не удалось загрузить список курсов");
            console.error("Ошибка при загрузке курсов:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsersCoursesList();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            {loading ? (
                <div>Загрузка...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : coursesList.length === 0 ? (
                <div>У вас пока нет курсов</div>
            ) : (
                <div className="flex flex-col gap-5 self-center">
                    {coursesList.map((course) => (
                        <div onClick={() => {handleGoToEditor(course.id);}}>
                            <h2>{course.title}</h2>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoursesList;
