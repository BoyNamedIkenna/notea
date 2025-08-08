import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Plus, Settings, LogOut, FileText, Folder, ChevronDown, ChevronRight, EllipsisVertical, Trash2, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { SidebarProps } from '~/types/notea';
import { DragDropProvider } from './DragDropProvider';
import { SortableItem } from "./SortableItem";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import ConfirmationModal from './ConfirmationModal';


const SidebarComponent = ({
  setIsSidebarOpen,
  notes,
  deleteNote,
  categories,
  dispatch,
  addNewCategory,
  toggleActiveCategory,
  renameCategory,
  deleteCategory,
  activeCategory,
  profile,
  logout
}: SidebarProps) => {
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false)
  const [renamingCategory, setRenamingCategory] = useState<{
    id: string;
    name: string;
  } | null>(null)
  const [renameValue, setRenameValue] = useState<string>('')
  const [newCategoryName, setNewCategoryName] = useState<string>('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'rename' | null;
    categoryId: string | null;
    categoryName: string;
    newName?: string;
  }>({
    isOpen: false,
    type: null,
    categoryId: null,
    categoryName: '',
  });

  const preDragExpandedRef = useRef<Set<string> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fixed useEffect with proper timing
  useEffect(() => {
    if (renamingCategory && inputRef.current) {
      // Use setTimeout to ensure the input is rendered before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select(); // Also select all text for better UX
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [renamingCategory]);

  const generalCategory = categories.find(cat => cat.name == "General");
  const sortedCategories = categories.filter((cat => cat.name !== "General"));

  const getCategoryNotes = (categoryId: string) => {
    return notes.filter(note => note.category_id === categoryId)
  }

  const toggleOpenCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    if (newCategoryName) {
      addNewCategory(newCategoryName)
      setIsAddingCategory(false);
      console.log("success")
    }
    setNewCategoryName('')
  }

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      categoryId,
      categoryName,
    });
  }

  const handleStartRename = (categoryId: string, currentName: string) => {
    setRenamingCategory({ id: categoryId, name: currentName });
    setRenameValue(currentName);
  };

  const handleRename = () => {
    if (renamingCategory && renameValue.trim()) {
      setConfirmModal({
        isOpen: true,
        type: 'rename',
        categoryId: renamingCategory.id,
        categoryName: renamingCategory.name || '',
        newName: renameValue.trim(),
      });
    }
  };

  const handleCancelRename = () => {
    setRenamingCategory(null);
    setRenameValue('');
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelRename();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    } else if (e.key === 'Escape') {
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === 'delete' && confirmModal.categoryId) {
      deleteCategory(confirmModal.categoryId);
    } else if (confirmModal.type === 'rename' && confirmModal.categoryId && confirmModal.newName) {
      renameCategory(confirmModal.categoryId, confirmModal.newName);
      setRenamingCategory(null);
      setRenameValue('');
    }

    setConfirmModal({
      isOpen: false,
      type: null,
      categoryId: null,
      categoryName: '',
    });
  };

  const handleCloseModal = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      categoryId: null,
      categoryName: '',
    });
    setRenamingCategory(null);
    setRenameValue('');
  };

  // Called when dragging starts
  const handleDragStart = () => {
    // Save the current expanded state
    preDragExpandedRef.current = (new Set(expandedCategories));
    // Collapse all categories
    setExpandedCategories(new Set());
  };

  // Called when dragging ends or cancels
  const handleDragStop = () => {
    if (preDragExpandedRef.current) {
      setExpandedCategories(preDragExpandedRef.current);
      preDragExpandedRef.current = null;
    }
  };


  return (
    <div className="w-64  border-r border-gray-200 dark:border-[#30363D] flex flex-col h-screen">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 dark:border-[#30363D]">
        <div className="flex items-center space-x-2 mb-1">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-300">Notea</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Organize your thoughts</p>
      </div>

      {/* Categories Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* All Notes Button */}
          <button
            onClick={() => { toggleActiveCategory(generalCategory?.id || ''), setIsSidebarOpen(false) }}
            className={`group w-full flex items-center justify-between px-3 py-2 mb-4 text-sm rounded-lg transition-colors ${activeCategory?.name === 'General'
              ? 'bg-blue-50 dark:bg-[#0D1117] border dark:border-[#30363D] border-blue-200 text-blue-700 dark:text-blue-500'
              : 'text-gray-700 dark:text-gray-100  hover:text-gray-900  hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">All Notes</span>
            </div>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 dark:group-hover:bg-gray-700 px-2 py-1 rounded-full">
              {notes.length}
            </span>
          </button>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide">
              Categories
            </h2>
            <Button
              onClick={() => setIsAddingCategory(true)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Add Category Input */}
          {isAddingCategory && (
            <div className="mb-3">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={() => setIsAddingCategory(false)}
                placeholder="Category name..."
                className="h-8 text-sm"
                autoFocus
              />
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-1 p-o">
            <DragDropProvider
              categories={categories}
              dispatch={dispatch}
              onDragStart={handleDragStart}
              onDragStop={handleDragStop}
            >
              {sortedCategories.map((category) => {
                const categoryNotes = getCategoryNotes(category.id);
                const isExpanded = expandedCategories.has(category.id);

                const isRenaming = renamingCategory?.id === category.id;

                return (
                  <SortableItem key={category.id} id={category.id}>
                    {isRenaming ? (
                      <div className="flex-1 px-3 py-2">
                        <Input
                          ref={inputRef}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={handleRenameKeyPress}
                          onBlur={handleRename}
                          className="h-6 text-sm"
                        />
                      </div>
                    ) : (
                      <Collapsible key={category.id} open={isExpanded} onOpenChange={() => toggleOpenCategory(category.id)}>
                        <div className={`rounded-lg group ${activeCategory?.id === category.id ? 'bg-blue-50 dark:bg-[#0D1117] dark:border-[#30363D] border border-blue-200 dark:text-blue-500' : 'text-gray-700 dark:text-gray-100 hover:text-gray-900  hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                          <div className='flex items-center'>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className='hover:bg-transparent'>
                                {isExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </Button>
                            </CollapsibleTrigger>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleActiveCategory(category.id);
                                setIsSidebarOpen(false)
                              }}
                              className={`flex-1 flex items-center justify-between  py-2 text-sm transition-colors ${activeCategory?.id === category.id
                                ? 'text-blue-700 dark:text-blue-500'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900'
                                }`}
                            >
                              <div className="flex items-center space-x-3">
                                <Folder className="h-4 w-4" />
                                <span className="font-medium ">{category.name}</span>
                              </div>
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                {categoryNotes.length}
                              </span>
                            </button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity p-1 rounded">
                                  <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="z-50">
                                <DropdownMenuItem onClick={() => handleStartRename(category.id, category.name)}>
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteCategory(category.id, category.name)}>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <CollapsibleContent className="px-4 pb-2">
                            <div className="space-y-2 ml-4">
                              {categoryNotes.length === 0 && (
                                <p className="text-xs text-gray-400 px-2 py-1">No notes yet</p>
                              )}
                              {categoryNotes.map((note) => (
                                <div
                                  key={note.id}
                                  className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-blue-50 hover:border-blue-200 bg-gray-50  dark:hover:bg-gray-800 dark:bg-[#0D1117] border border-gray-200 dark:border-[#30363D] rounded-md transition-all duration-200 truncate"
                                >
                                  <Link to={`/editor/${note.id}`}>
                                    <button title={note.title}>
                                      <FileText className="h-3.5 w-3.5 inline mr-2 text-gray-500 dark:text-gray-400" />
                                      {note.title || "Untitled"}
                                    </button>
                                  </Link>
                                  <button onClick={() => deleteNote(note.id)}>
                                    <Trash2 className='w-4 h-4 opacity-0 hover:opacity-100 text-red-400' />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    )}
                  </SortableItem>
                );
              })}

            </DragDropProvider>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-gray-100 dark:border-[#30363D] p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white ">
              {profile?.user_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-300 truncate">{profile?.user_name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="flex-1 justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 dark:text-red-500 hover:text-red-700"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'delete'
            ? 'Delete Category'
            : 'Rename Category'
        }
        description={
          confirmModal.type === 'delete'
            ? <>
              Are you sure you want to delete "
              <span className="text-red-600 font-semibold">
                {confirmModal.categoryName}
              </span>
              "? This action cannot be undone.
            </>
            :
            <>
              Are you sure you want to rename "
              <span className="text-green-600 font-semibold">
                {confirmModal.categoryName}
              </span>
              " to
              <span className="text-green-600 font-semibold">
                {" "}{confirmModal.newName}
              </span>"?
            </>
        }
        confirmText={confirmModal.type === 'delete' ? 'Delete' : 'Rename'}
        variant={confirmModal.type === 'delete' ? 'destructive' : 'rename'}
      />
    </div>
  )

}


export default SidebarComponent