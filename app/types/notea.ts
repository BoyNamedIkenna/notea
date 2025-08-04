export interface Profile {
    user_id: string;
    user_name: string;
}

export interface Category {
    id: string;
    user_id: string;
    name: string;
    is_active: boolean;
    updated_at: Date;
    position: number;
}

export interface Note {
    id: string;
    user_id: string;
    category_id: string;
    title: string;
    content: string;
    updated_at: Date;
}

export interface SidebarProps {
    setIsSidebarOpen:React.Dispatch<React.SetStateAction<boolean>>
    notes: Note[];
    deleteNote: (id: string) => Promise<void>;
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    addNewCategory: (newCategoryName: string) => Promise<void>;
    toggleActiveCategory: (categoryId: string) => Promise<void>;
    renameCategory: (categoryId: string, newName: string) => Promise<void>;
    deleteCategory: (categoryId: string) => Promise<void>;
    activeCategory?: Category;
    profile: Profile | null;
    logout:() => Promise<void>
}

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive" | "save" | "rename";
    isLoading?: boolean;
}