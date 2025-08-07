import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, PanelLeft } from "lucide-react";
import SidebarComponent from "../components/SidebarComponent";
import NoteItem from "../components/NoteItem";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";

import type { Note, Category } from "../types/notea";

const Notes = () => {
  const {
    categories,
    setCategories,
    addNewCategory,
    toggleActiveCategory,
    renameCategory,
    deleteCategory,
    notes,
    deleteNote,
    changeNoteCategory,
    profile,
    logout
  } = useAuth();

  const [activeCategoryNotes, setActiveCategoryNotes] = useState<Note[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const activeCategory = categories.find((cat: Category) => cat.is_active);

  // Extract preview text from rich HTML content
  const getPreview = (content: string, maxLength: number = 150) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const divs = Array.from(doc.querySelectorAll("div"));
    const firstDivWithText = divs.find((div) => div.textContent?.trim());
    let text = firstDivWithText?.textContent?.trim() || doc.body.textContent?.trim() || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Resize logic
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); // close sidebar if switching to desktop
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter notes by active category
  useEffect(() => {
    if (!activeCategory || activeCategory.name === "General") {
      setActiveCategoryNotes(notes);
    } else {
      setActiveCategoryNotes(notes.filter((note: Note) => note.category_id === activeCategory.id));
    }
  }, [activeCategory, notes]);

  // Sidebar props
  const sidebarProps = {
    setIsSidebarOpen,
    notes,
    deleteNote,
    categories,
    setCategories,
    addNewCategory,
    toggleActiveCategory,
    activeCategory,
    renameCategory,
    deleteCategory,
    profile,
    logout
  };

  return (

    <div className="w-screen bg-white dark:bg-transparent flex">
      {isMobile ? (
        <>
          {/* Sidebar overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          {/* Sidebar drawer */}
          <div
            className={`fixed top-0 left-0 z-50 h-full w-64  border-r border-gray-200 shadow transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <SidebarComponent {...sidebarProps} />
          </div>
        </>
      ) : (
        <SidebarComponent {...sidebarProps} />
      )}

      <div className="w-full flex flex-col h-screen">
        {/* Header */}
        {isMobile ? (
          <div className="bg-white border-b border-gray-200 px-5 py-4 relative">
            <div className="flex justify-between items-center w-full mb-3 pr-3">
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="shadow-xs p-1 rounded"
                >
                  <PanelLeft className="w-5 h-5 text-gray-900" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">{activeCategory?.name}</h1>
              </div>
              <span className="text-sm bg-gray-200 text-blue-900 px-2 py-1 rounded-full">
                {activeCategoryNotes.length}
              </span>
            </div>
            <div className="flex gap-3 mb-1">
              <div className="relative flex-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  className=" border-gray-200 dark:border-[#30363D] focus:border-blue-500 focus:ring-blue-500"
                // value={searchTerm}
                // onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <Link to="/editor" className="flex-1">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4" />
                  Note
                </Button>
              </Link>
            </div>
          </div>

        ) : (
          <div className=" border-b border-gray-200 dark:border-[#30363D] px-8 py-6 relative">
            <div className="flex items-center justify-between mt-0.5 mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-300">{activeCategory?.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activeCategoryNotes.length}{" "}
                  {activeCategoryNotes.length === 1 ? "note" : "notes"}
                </p>
              </div>
              <Link to="/editor">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  <Plus className="h-4 w-4" />
                  Create Note
                </Button>
              </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-10 border-gray-200 dark:border-[#30363D] focus:border-blue-500 focus:ring-blue-500"
              // value={searchTerm}
              // onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
        )}


        {/* Notes Grid */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeCategoryNotes.length === 0 ? (
            <p className="text-gray-500 text-center mt-20">No notes in this category.</p>
          ) : (
            <NoteItem
              categories={categories}
              activeCategoryNotes={activeCategoryNotes}
              changeNoteCategory={changeNoteCategory}
              deleteNote={deleteNote}
              getPreview={getPreview}
              isMobile
            />
          )}
        </div>
      </div>
    </div >
  );
};

export default Notes;
