import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CourseSidebar from "@/components/CourseSidebar";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

import { CourseWithModules, type Course, UpdateStatus } from "@/dataclasses/course";

import CourseContentEditor from "@/components/CourseContentEditor";
import apiClient from "@/api/client";

const CourseCreator = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const { courseId } = useParams<{ courseId: string }>();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<CourseWithModules>();
    const { user } = useAuth();

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/courses/course/${courseId}/struct/`,
                {
                    headers: { "Content-Type": "application/json" },
                });
            const getted_course: CourseWithModules = {
                id: response.data.id,
                title: response.data.name,
                description: response.data.description,
                is_published: response.data.is_published,
                modules: response.data.modules.map((module: any) => ({
                    id: module.id,
                    name: module.name,
                    description: module.description,
                    order_index: module.order_index,
                    course: response.data.id,
                    materials: [
                        ...module.tasks.map((task: any) => ({
                            id: task.id,
                            title: task.name,
                            order_index: task.order_index,
                        })),
                        ...module.lectures.map((lecture: any) => ({
                            id: lecture.id,
                            title: lecture.name,
                            order_index: lecture.order_index,
                        }))
                    ].sort((one, another) => one.order_index - another.order_index)
                })),
                deleted_modules: []
            };
            setCourse(getted_course);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setLoading(false);
        }
    }

    const saveModules = async () => {
        if (!course) return;

        for (let module of course.modules) {
            switch (module.update_status) {
                case UpdateStatus.UPDATED:
                    try {
                        const response = await apiClient.put(`/courses/modules/${module.id}/`, JSON.stringify(module),
                            {
                                headers: { "Content-Type": "application/json" },
                            });
                    } catch (error) {
                        console.error("Ошибка:", error);
                    }
                    break;
                case UpdateStatus.CREATED:
                    try {
                        const response = await apiClient.post(`/courses/modules/`, JSON.stringify(module),
                            {
                                headers: { "Content-Type": "application/json" },
                            });
                    } catch (error) {
                        console.error("Ошибка:", error);
                    }
                    break;
            }
        }
        for (let module of course.deleted_modules) {
            console.log("DELETING")
            try {
                const response = await apiClient.delete(`/courses/modules/${module.id}/`,
                    {
                        headers: { "Content-Type": "application/json" },
                    });
            } catch (error) {
                console.error("Ошибка:", error);
            }
            break;
        }
    }

    const saveCourse = async () => {
        if (!course) return;

        setIsSyncing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await saveModules();
        setIsSyncing(false);
    }


    useEffect(() => {
        fetchCourseData();
    }, []);

    const handleDragEnd = (result: DropResult) => {
        if (!course) return;
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === 'module') {
            const newModules = [...course.modules];
            const [moved] = newModules.splice(source.index, 1);
            newModules.splice(destination.index, 0, moved);

            setCourse({
                ...course,
                modules: newModules.map((m, i) => ({ ...m, order_index: i + 1, update_status: UpdateStatus.UPDATED }))
            });
        }

        if (type === 'material') {
            const sourceModuleId = source.droppableId.replace('materials-', '');
            const destModuleId = destination.droppableId.replace('materials-', '');

            console.log("Source module: ", sourceModuleId);
            console.log("Dest module: ", destModuleId);
            console.log("Dest: ", destination.index);

            const newModules = [...course.modules];
            const sourceModule = newModules.find(m => m.id === parseInt(sourceModuleId));
            const destModule = newModules.find(m => m.id === parseInt(destModuleId));

            if (sourceModule && destModule) {
                const [movedMaterial] = sourceModule.materials.splice(source.index, 1);
                console.log(sourceModule)
                console.log(destModule)
                destModule.materials.splice(destination.index, 0, movedMaterial);

                setCourse({ ...course, modules: newModules });
            }
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Main Content */}
            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <main className="flex-1 container mx-auto px-4 py-6">
                    {/* Затемнение и спиннер */}
                    {isSyncing && (
                        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}


                    <div className="flex flex-col md:flex-row gap-6">
                        <CourseSidebar
                            course={course}
                            user={user}
                        />
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <CourseContentEditor
                                course={course}
                            />
                        </DragDropContext>
                    </div>

                    {/* Кнопка сохранения курса */}
                    <div className="fixed bottom-4 right-4">
                        <button
                            className="bg-gray-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                            onClick={saveCourse}
                        >
                            Сохранить
                        </button>
                    </div>
                </main>
            )}
        </div>
    );
};

export default CourseCreator;