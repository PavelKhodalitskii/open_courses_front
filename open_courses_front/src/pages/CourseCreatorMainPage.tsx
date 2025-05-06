import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CourseSidebar from "@/components/CourseSidebar";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

import { CourseWithModules, type Course } from "@/dataclasses/course";

import CourseContentEditor from "@/components/CourseContentEditor";
import apiClient from "@/api/client";

const CourseCreator = () => {
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
                    title: module.name,
                    description: module.description,
                    order_index: module.order_index,
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
                }))
            };
            setCourse(getted_course);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setLoading(false);
        }
    }

    const saveCourse = async () => {
        try {
            const data: Course = {
                id: course.id,
                title: course.title,
                description: course.description,
            };
            const response = await apiClient.post("/auths/session_based_auths/login/", JSON.stringify(data),
                {
                    headers: { "Content-Type": "application/json" },
                });
        } catch (error) {
            console.error("Ошибка:", error);
        }
    }

    useEffect(() => {
        fetchCourseData();
    }, []);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === 'module') {
            const newModules = [...course.modules];
            const [moved] = newModules.splice(source.index, 1);
            newModules.splice(destination.index, 0, moved);

            setCourse({
                ...course,
                modules: newModules.map((m, i) => ({ ...m, order_index: i + 1 }))
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
                </main>
            )}
        </div>
    );
};

export default CourseCreator;