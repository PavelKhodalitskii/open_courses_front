import {type Material} from "@/dataclasses/course";
import { Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

interface MaterialProps {
    index: number;
    material: Material;
};

const EditorMaterial = ({ material, index }: MaterialProps) => {
    const navigate = useNavigate();

    const handleGoToEditor = (course_id: number) => {
        return navigate(`/my_courses/${course_id}/edit/materials/lecture/${material.id}`)
    }

    return (
        <Draggable draggableId={`material-${material.id}`} index={index}>
            {(provided) => (
                <div className="flex row gap-5 p-5 rounded-md border  border-gray-400" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <span>Материал: {index}</span>
                    <p>{material.title}</p>
                    <button 
                        className="text-gray-500 hover:text-gray-700 p-1 rounded"
                        onClick={handleGoToEditor}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                </div>
            )}
        </Draggable>
    );
};

export default EditorMaterial;
