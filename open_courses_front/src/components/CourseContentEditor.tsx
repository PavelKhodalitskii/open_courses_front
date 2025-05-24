import { Course, CourseWithModules, Module, ModuleWithMaterials, UpdateStatus } from "@/dataclasses/course";
import { useState } from "react";
import { Droppable, DropResult } from "react-beautiful-dnd";

import EditorModule from "@/components/EditorModule"
import apiClient from "@/api/client";
import { GenericModalForm } from "./GenericModalForm";
import moduleFields, { ModuleForm } from "@/forms/course_forms";

interface CourseContentEditorProps {
    course: CourseWithModules;
}

const CourseContentEditor = ({ course }: CourseContentEditorProps) => {
    const [isAddModuleModalOpen, setAddModuleModalOpen] = useState(false);
    const [itemDeletedEffect, setItemDeletedEffect] = useState(false);

    function handleAddModule(data: ModuleForm): void | Promise<void> {
        let newModule: ModuleWithMaterials = {
            id: Number(String(course.id) + String((course.modules[course.modules.length - 1]?.id + 1 | 0))),
            name: data.name,
            description: data.description,
            order_index: (course.modules[course.modules.length - 1]?.order_index + 1 | 1),
            update_status: UpdateStatus.CREATED,
            course: course.id,
            materials: [],
        }
        course.modules.push(newModule)
    }

    function handleDeleteModule(moduleIndex: number) {
        const newModules = [...course.modules];
        
        if (!course.deleted_modules) course.deleted_modules = Array();
        course.deleted_modules.push(newModules[moduleIndex])
        newModules.splice(moduleIndex, 1);

        const updatedModules = newModules.map((module, index) => {
            if (index > moduleIndex) {
                return { ...module, order_index: module.order_index - 1, update_status: UpdateStatus.UPDATED };
            }
            return module;
        });
        course.modules = updatedModules;
        setItemDeletedEffect(true);
    }

    return (
        <div className="flex-1">
            <Droppable droppableId="modules-list" type="module">
                {(provided) => (
                    <div className="space-y-4 mb-4" ref={provided.innerRef} {...provided.droppableProps}>
                        {course.modules ? course.modules.map((module, index) => (
                            <EditorModule
                                key={`module-${module.id}`}
                                module={module}
                                index={index}
                                course={course}
                                onDelete={handleDeleteModule}
                            />
                        )) : <h3>Вы пока не создали модуль!</h3>}
                        {provided.placeholder}

                        {/* Кнопка добавить модуль */}
                        <div>
                            <button
                                className="w-full flex items-center justify-center py-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition"
                                onClick={() => setAddModuleModalOpen(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                <span className="text-gray-600 font-medium">Добавить модуль</span>
                            </button>
                        </div>
                    </div>
                )}
            </Droppable>

            <GenericModalForm<ModuleForm>
                isOpen={isAddModuleModalOpen}
                onClose={() => setAddModuleModalOpen(false)}
                onSubmit={handleAddModule}
                title="Добавить новый модуль"
                fields={moduleFields}
                submitButtonText="Добавить модуль"
            />
        </div>
    );
};

export default CourseContentEditor;
