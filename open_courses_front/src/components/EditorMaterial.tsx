import {type Material} from "@/dataclasses/course";
import { Draggable } from "react-beautiful-dnd";

interface MaterialProps {
    index: number;
    material: Material;
};

const EditorMaterial = ({ material, index }: MaterialProps) => {
    return (
        <Draggable draggableId={`material-${material.id}`} index={index}>
            {(provided) => (
                <div className="flex row gap-5 p-5 rounded-md border  border-gray-400" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <span>Материал: {index}</span>
                    <p>{material.title}</p>
                </div>
            )}
        </Draggable>
    );
};

export default EditorMaterial;
