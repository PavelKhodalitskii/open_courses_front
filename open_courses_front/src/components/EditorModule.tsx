import { ModuleWithMaterials } from "@/dataclasses/course"
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import EditorMaterial from "@/components/EditorMaterial";

interface ModuleProps {
    index: number;
    module: ModuleWithMaterials;
}

const EditorModule = ({ index, module }: ModuleProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpandToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Draggable draggableId={`module-${module.id}`} index={index}>
            {(provided) => (
                <div className="flex flex-col gap-5 p-5 rounded-md border  border-gray-400" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div className="flex row gap-2">
                        <span className="cursor-grab">≡</span> {/* Иконка для перетаскивания */}
                        <span>Модуль {index + 1}: {module.title}</span>

                        <div className="ml-auto flex row items-center space-x-2">
                            <button className="text-gray-500 hover:text-gray-700 p-1 rounded" onClick={handleExpandToggle}>
                                {isExpanded ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                )}
                            </button>
                            <button 
                                className="text-gray-500 hover:text-gray-700 p-1 rounded"
                                // onClick={handleEditModule}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button 
                                className="text-gray-500 hover:text-gray-700 p-1 rounded"
                                // onClick={handleDeleteModule}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    </div>
                    {isExpanded && (
                        <div>
                            <Droppable droppableId={`materials-${module.id}`} type="material">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                                        {module.materials.length != 0 ? module.materials.map((material, materialIndex) => (
                                            <EditorMaterial
                                                key={material.id}
                                                material={material}
                                                index={materialIndex}
                                            />
                                        )) : <h3>Вы не добавили ни одного материала!</h3>}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default EditorModule;
