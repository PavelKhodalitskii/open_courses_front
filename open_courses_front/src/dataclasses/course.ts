export type Course = {
    id: number;
    title: string;
    description: string;
    is_published: boolean;
    image_url?: string | null;
};

export type Module = {
    id: number;
    title: string;
    description: string;
    order_index: number;
};

export type Material = {
    id: number;
    title: string;
    order_index: number;
};

export type ModuleWithMaterials = Module & {
    materials: Material[];
};

export type CourseWithModules = Course & {
    modules: ModuleWithMaterials[];
};
  