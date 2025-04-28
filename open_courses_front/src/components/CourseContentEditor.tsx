import { Course, CourseWithModules } from "@/dataclasses/course";
import { useState } from "react";
import { Droppable, DropResult } from "react-beautiful-dnd";

import Module from "@/components/Module"

interface CourseContentEditorProps {
    course: CourseWithModules;
}

const CourseContentEditor = ({ course }: CourseContentEditorProps) => {
    const [isAddModuleModalOpen, setAddModuleModalOpen] = useState(false);

    function onSave() {
        console.log("Курс сохранен");
    }

    return (
        <div className="flex-1">
            <Droppable droppableId="modules-list" type="module">
                {(provided) => (
                    <div className="space-y-4 mb-4" ref={provided.innerRef} {...provided.droppableProps}>
                        {course.modules ? course.modules.map((module, index) => (
                            <Module
                                key={`module-${module.id}`}
                                module={module}
                                index={index}
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

            {/* Кнопка сохранения курса */}
            <div className="flex justify-end mt-6">
                <button
                    className="bg-gray-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                    onClick={onSave}
                >
                    Сохранить
                </button>
            </div>

            {/* Add Module Modal
            <AddModuleModal
                isOpen={isAddModuleModalOpen}
                onClose={() => setAddModuleModalOpen(false)}
                onSubmit={handleAddModule}
            /> */}
        </div>
    );
};

export default CourseContentEditor;
