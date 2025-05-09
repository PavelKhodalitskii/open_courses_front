import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import apiClient from "@/api/client";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/dataclasses/course";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormData = {
    name: string;
    description: string;
};

const CoursesList = () => {
    const {user, logout} = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    const navigate = useNavigate();

    const [isModuleCreateDialogOpen, setIsModuleCreateDialogOpen] = useState(false);
    const [coursesList, setCoursesList] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleGoToEditor = (course_id: number) => {
        return navigate(`/my_courses/${course_id}/edit`)
    }

    const handleCreateCorse = async (data: FormData) => {
        try {
            const response = await apiClient.post("/courses/course/", JSON.stringify({...data, author: user.id}),
            {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setIsModuleCreateDialogOpen(false);
        }
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
            <main className="flex flex-col items-center">
                {loading ? (
                    <div>Загрузка...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : coursesList.length === 0 ? (
                    <div>У вас пока нет курсов</div>
                ) : (
                    <div className="flex flex-col items-center gap-10 mt-20 p-10">
                        <div className="w-full flex flex-row justify-between">
                            <h1>Мои курсы</h1>
                            {/* <Button className="bg-[#00D07D]">Добавить курс</Button> */}
                            {/* Модальное окно для создания курса */}
                            <Dialog open={isModuleCreateDialogOpen} onOpenChange={setIsModuleCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#00D07D] w-full md:w-auto">
                                        Добавить курс
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Создать новый курс</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(handleCreateCorse)} className="flex flex-col items-start gap-5 w-full">
                                        <div className='flex flex-col gap-2 w-full'>
                                            <Label htmlFor="name">Название</Label>
                                            <Input
                                                type='text'
                                                id='name'
                                                placeholder='Как купить москивч за 10т.р?'
                                                {...register("name", { required: "Поле названия курса обязательно" })}
                                                className='w-full bg-gray-100'
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                            )}
                                        </div>
                                        <div className='flex flex-col gap-2 w-full'>
                                            <Label htmlFor="description">Описание</Label>
                                            <Input
                                                type='text'
                                                id='description'
                                                placeholder='Опишите курс'
                                                {...register("description", { required: "Поле описания курса обязательно" })}
                                                className='w-full bg-gray-100'
                                            />
                                            {errors.description && (
                                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                            )}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                className="bg-[#00D07D]"
                                                onClick={() => { }}
                                            >
                                                Создать
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="flex flex-col gap-5 self-center w-250">
                            {coursesList.map((course) => (
                                <div key={`${course.id}`} className="p-10 border-1 border-gray-300 rounded-xl w-full hover:bg-gray-200" onClick={() => { handleGoToEditor(course.id); }}>
                                    <h2>{course.title}</h2>
                                    <span>{course.is_published ? "Опубликован" : "Черновик"}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
                }
            </main >
        </div >
    );
};

export default CoursesList;
