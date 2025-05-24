import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormFieldConfig } from "@/types/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GenericModalFormProps<T extends Record<string, any>> {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: T) => Promise<void> | void;
    title: string;
    fields: FormFieldConfig<T>[];
    defaultValues?: Partial<T>;
    submitButtonText?: string;
}

export function GenericModalForm<T extends Record<string, any>>({
    isOpen,
    onClose,
    onSubmit,
    title,
    fields,
    defaultValues,
    submitButtonText = "Сохранить",
}: GenericModalFormProps<T>) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<T>({ defaultValues });

    const handleFormSubmit = async (data: T) => {
        try {
            await onSubmit(data);
            reset();
            onClose();
        } catch (error) {
            console.error("Ошибка при отправке формы:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {fields.map((field) => (
                        <div key={String(field.name)} className="grid gap-2">
                            <Label htmlFor={String(field.name)}>{field.label}</Label>
                            <Input
                                id={String(field.name)}
                                type={field.type || "text"}
                                placeholder={field.placeholder}
                                {...register(field.name, field.validation)}
                                className={field.className}
                            />
                            {errors[field.name] && (
                                <p className="text-red-500 text-sm">
                                    {String(errors[field.name]?.message)}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    Обработка...
                                </span>
                            ) : (
                                submitButtonText
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}