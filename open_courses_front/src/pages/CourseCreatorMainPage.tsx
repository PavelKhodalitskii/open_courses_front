import { DragDropContext, DropResult } from "react-beautiful-dnd";

import CourseSidebar from "@/components/CourseSidebar";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

import { CourseWithModules } from "@/dataclasses/course";
import { useContext, useState } from "react";
import CourseContentEditor from "@/components/CourseContentEditor";

const CourseCreator = () => {
    const [course, setCourse] = useState<CourseWithModules>({
        id: 0,
        title: "Говно для даунов",
        description: "Курс для кретинов и полоумных",
        is_published: false,
        modules: [
            {
                id: 123, title: 'Программирование на Python', description: "123", order_index: 1, materials: [{ id: 1, title: "Тест по математике", order_index: 1 },
                { id: 2, title: "Лекция по Биологии", order_index: 2 }]
            },
            { id: 34652, title: 'Работа на фрезерном станке', description: "123", order_index: 2 }
        ]
    });


    const { user } = useAuth();

    // const handleDragEnd = (result: DropResult) => {
    //     if (!result.destination || !course.modules) return;

    //     // Создаём копию массива модулей
    //     const newModules = [...course.modules];

    //     // Перемещаем элемент
    //     const [movedItem] = newModules.splice(result.source.index, 1);
    //     newModules.splice(result.destination.index, 0, movedItem);

    //     // Обновляем order_index у всех модулей
    //     const updatedModules = newModules.map((module, index) => ({
    //         ...module,
    //         order_index: index + 1
    //     }));

    //     // Обновляем состояние
    //     setCourse({
    //         ...course,
    //         modules: updatedModules
    //     });
    // };

    // В вашем CourseCreator или другом родительском компоненте
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        // Перетаскивание модулей
        if (type === 'module') {
            const newModules = [...course.modules];
            const [moved] = newModules.splice(source.index, 1);
            newModules.splice(destination.index, 0, moved);

            setCourse({
                ...course,
                modules: newModules.map((m, i) => ({ ...m, order_index: i + 1 }))
            });
        }

        // Перетаскивание материалов
        if (type === 'material') {
            // Находим исходный и целевой модули
            const sourceModuleId = source.droppableId.replace('materials-', '');
            const destModuleId = destination.droppableId.replace('materials-', '');

            const newModules = [...course.modules];
            const sourceModule = newModules.find(m => m.id === sourceModuleId);
            const destModule = newModules.find(m => m.id === destModuleId);

            if (sourceModule && destModule) {
                const [movedMaterial] = sourceModule.materials.splice(source.index, 1);
                destModule.materials.splice(destination.index, 0, movedMaterial);

                setCourse({ ...course, modules: newModules });
            }
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Main Content */}
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
        </div>
    );
};

export default CourseCreator;