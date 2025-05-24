// types/form.ts
import { RegisterOptions } from "react-hook-form";

export type FormFieldConfig<T> = {
    name: keyof T;
    label: string;
    type?: string;
    placeholder?: string;
    validation?: RegisterOptions;
    className?: string;
};

export type ModuleForm = {
    name: string;
    description: string;
};

const moduleFields: FormFieldConfig<ModuleForm>[] = [
    {
        name: "name",
        label: "Название модуля",
        placeholder: "Введите название модуля",
        validation: { required: "Название обязательно" },
    },
    {
        name: "description",
        label: "Описание",
        placeholder: "Введите описание модуля",
        type: "textarea",
    },
];

export default moduleFields;