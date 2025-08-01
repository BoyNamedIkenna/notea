import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Note, Category } from "../types/notea";
import { Calendar, Edit3, EllipsisVertical, Plus, Check } from "lucide-react"
import { Button } from '../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal
} from "./ui/dropdown-menu"
import ConfirmationModal from "./ConfirmationModal";

interface NoteItemProps {
    categories: Category[];
    activeCategoryNotes: Note[];
    changeNoteCategory: (noteId: string, categoryId: string) => Promise<void>;
    deleteNote: (id: string) => void;
    getPreview: (content: string) => string;
}

const NoteItem = ({
    categories,
    activeCategoryNotes,
    changeNoteCategory,
    deleteNote,
    getPreview
}: NoteItemProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'delete' | 'rename' | null;
        noteId: string | null;
        noteName: string;
        newName?: string;
    }>({
        isOpen: false,
        type: null,
        noteId: null,
        noteName: '',
    });
    const navigate = useNavigate();
    
    const handleNoteClick = (e: React.MouseEvent, noteID: string) => {
        if (dropdownOpen) {
            e.preventDefault(); // Block navigation
        } else {
            navigate(`/editor/${noteID}`);
        }
    };
    const handleChangeCategory = (e: React.MouseEvent,noteId:string,categoryId:string) => {
            e.preventDefault(); // Block navigation
            changeNoteCategory(noteId,categoryId)
    } 
    const handleDeleteNote = (noteId: string, noteName: string) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            noteId,
            noteName,
        });
    }

    const handleConfirmAction = () => {
        if (confirmModal.type === 'delete' && confirmModal.noteId) {
            deleteNote(confirmModal.noteId);
        } else if (confirmModal.type === 'rename' && confirmModal.noteId && confirmModal.newName) {

        }

        setConfirmModal({
            isOpen: false,
            type: null,
            noteId: null,
            noteName: '',
        });
    };

    const handleCloseModal = () => {
        setConfirmModal({
            isOpen: false,
            type: null,
            noteId: null,
            noteName: '',
        });

    };
    return (
        <>
            {activeCategoryNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {activeCategoryNotes.map((note) => (
                        <div
                            key={note.id}
                            onClick={(e) => handleNoteClick(e, note.id)}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {note.title || "Untitled"}
                                    </h3>
                                    <DropdownMenu onOpenChange={setDropdownOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity  rounded"
                                            >
                                                <EllipsisVertical className="w-5 h-5 text-muted-foreground" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="z-50">
                                            <DropdownMenuItem onClick={() => {handleNoteClick}}>Edit</DropdownMenuItem>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger >
                                                    Category
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent
                                                        sideOffset={3}
                                                        alignOffset={-5}
                                                    >
                                                        {categories.map((category) => (
                                                            <DropdownMenuItem
                                                                key={category.id}
                                                                className="text-sm justify-between"
                                                                onClick={(e) => {handleChangeCategory(e,note.id,category.id)}}
                                                            >
                                                                {category.name}
                                                                {category.id === note.category_id && <Check className="w-2 h-2 text-black" />}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuItem onClick={() => { handleDeleteNote(note.id, note.title) }} >Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                                    {getPreview(note.content) || "No content"}
                                </p>

                                <div className="flex items-center text-xs text-gray-400">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>Updated {new Date(note.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Edit3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {/* {searchTerm ? "No notes found" : "No notes in this category"} */}
                        No notes in this category
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        {/* {searchTerm
                            ? "Try adjusting your search terms or create a new note"
                            : "Start writing your thoughts and ideas"} */}
                        Nothing found
                    </p>
                    <Link to="/editor">
                        <Button
                            //onClick={onCreateNote}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Note
                        </Button>
                    </Link>
                </div>
            )}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={'Delete Category'}
                description={
                    <>
                        Are you sure you want to delete "
                        <span className="text-red-600 font-semibold">
                            {confirmModal.noteName === "" ? "this note" : confirmModal.noteName}
                        </span>
                        "? This action cannot be undone.
                    </>
                }
                confirmText={'Delete'}
                variant={'destructive'}
            />
        </>
    )
}

export default NoteItem;