// authcontext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback
} from "react";
import { supabase } from "~/lib/supabase-client";
import type { Profile } from "../types/profile";
import type { Category, Note } from "../types/notea";

// --- Types ---
type State = {
  profile: Profile | null;
  categories: Category[];
  notes: Note[];
  loading: boolean;
};

type Action =
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

const initialState: State = {
  profile: null,
  categories: [],
  notes: [],
  loading: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
      };
    case "SET_NOTES":
      return { ...state, notes: action.payload };
    case "ADD_NOTE":
      return { ...state, notes: [...state.notes, action.payload] };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// --- Context ---
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) dispatch({ type: "SET_PROFILE", payload: data });
  }, []);

  useEffect(() => {
    fetchProfile().finally(() => dispatch({ type: "SET_LOADING", payload: false }));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => dispatch({ type: "SET_PROFILE", payload: data }));
      } else {
        dispatch({ type: "SET_PROFILE", payload: null });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  useEffect(() => {
    if (!state.profile) return;

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", state.profile?.user_id)
        .order("position", { ascending: true });

      if (!error && data) dispatch({ type: "SET_CATEGORIES", payload: data });
    };

    fetchCategories();
  }, [state.profile]);

  useEffect(() => {
    if (!state.profile) return;

    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", state.profile?.user_id);

      if (!error && data) dispatch({ type: "SET_NOTES", payload: data });
    };

    fetchNotes();
  }, [state.profile]);

  // --- Actions ---
  const addNewCategory = async (name: string) => {
    if (!state.profile) return;
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, user_id: state.profile.user_id, is_active: true })
      .select()
      .single();
    if (!error && data) dispatch({ type: "ADD_CATEGORY", payload: data });
  };

  const toggleActiveCategory = async (id: string) => {
  // Optimistically update UI first
  const updatedCategories = state.categories.map(cat =>
    cat.id === id ? { ...cat, is_active: true } : { ...cat, is_active: false }
  );
  dispatch({ type: "SET_CATEGORIES", payload: updatedCategories });

  // Then perform Supabase update in the background
  const { error } = await supabase
    .from("categories")
    .update({ is_active: true })
    .eq("id", id);

  // Optionally reset others to false in Supabase (if needed)
  await supabase
    .from("categories")
    .update({ is_active: false })
    .neq("id", id);

  if (error) {
    console.error("Failed to update active category", error);
    // Optionally: Revert the optimistic update if needed
  }
};


  const renameCategory = async (id: string, newName: string) => {
    const { data, error } = await supabase
      .from("categories")
      .update({ name: newName })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) dispatch({ type: "UPDATE_CATEGORY", payload: data });
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) dispatch({ type: "DELETE_CATEGORY", payload: id });
  };

  const createNote = async (title: string, content: string) => {
    if (!state.profile) return;
    const category = state.categories.find(c => c.is_active);
    const { data, error } = await supabase
      .from("notes")
      .insert({
        title: title.trim() || null,
        content,
        category_id: category?.id,
        user_id: state.profile.user_id,
        updated_at: new Date()
      })
      .select()
      .single();
    if (!error && data) dispatch({ type: "ADD_NOTE", payload: data });
  };

  const updateNote = async (id: string, title: string, content: string) => {
    const { data, error } = await supabase
      .from("notes")
      .update({ title, content, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) dispatch({ type: "UPDATE_NOTE", payload: data });
  };

  const changeNoteCategory = async (noteId: string, categoryId: string) => {
    const { data, error } = await supabase
      .from("notes")
      .update({ category_id: categoryId })
      .eq("id", noteId)
      .select()
      .single();
    if (!error && data) dispatch({ type: "UPDATE_NOTE", payload: data });
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) dispatch({ type: "DELETE_NOTE", payload: id });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: "SET_PROFILE", payload: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setProfile: (p: Profile | null) => dispatch({ type: "SET_PROFILE", payload: p }),
        addNewCategory,
        toggleActiveCategory,
        renameCategory,
        deleteCategory,
        createNote,
        updateNote,
        changeNoteCategory,
        deleteNote,
        logout
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);