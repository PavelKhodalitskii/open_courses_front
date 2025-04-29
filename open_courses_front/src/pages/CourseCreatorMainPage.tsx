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
                id: 123, 
                title: 'Программирование на Python', 
                description: "123", 
                order_index: 1, 
                materials: 
                [{ id: 1, title: "Тест по математике", order_index: 1 },
                 { id: 2, title: "Лекция по Биологии", order_index: 2 }]
            },
            { id: 34652, title: 'Работа на фрезерном станке', description: "123", order_index: 2, materials: [] }
        ]
    });


    const { user } = useAuth();

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