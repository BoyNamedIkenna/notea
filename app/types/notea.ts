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

export type Action =
  | { type: "SET_PROFILE"; payload: Profile | null }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "SET_NOTES"; payload: Note[] }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "UPDATE_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };


export interface SidebarProps {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    notes: Note[];
    deleteNote: (id: string) => Promise<void>;
    categories: Category[];
    dispatch: React.Dispatch<Action>;
    addNewCategory: (newCategoryName: string) => Promise<void>;
    toggleActiveCategory: (categoryId: string) => Promise<void>;
    renameCategory: (categoryId: string, newName: string) => Promise<void>;
    deleteCategory: (categoryId: string) => Promise<void>;
    activeCategory?: Category;
    profile: Profile | null;
    logout: () => Promise<void>
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