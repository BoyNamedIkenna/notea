import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router";
import type { Note } from "../types/notea"
import { ArrowLeft, Save, Trash2, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import RichTextEditor from "../components/TextEditor";
import ConfirmationModal from "../components/ConfirmationModal";


const Editor = () => {
    const { categories, notes, createNote, updateNote, deleteNote } = useAuth();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const note = notes.find((note: Note) => note.id === id);
    //const { toast } = useToast();
    const [title, setTitle] = useState(note ? note.title : "");
    const [content, setContent] = useState(note ? note.content : "");
    const [isLoading, setIsLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'delete' | 'rename' | 'save' | null;
        noteId: string | null;
        noteName: string;
        newName?: string;
    }>({
        isOpen: false,
        type: null,
        noteId: null,
        noteName: '',
    });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const cleanEditorContent = (html: string): string => {
        // Remove divs that contain only whitespace, line breaks, or &nbsp;
        return html.replace(/<div>(\s|&nbsp;|<br>)*<\/div>/g, '').trim();
    }


    const saveNote = () => {
        setIsLoading(true);
        const cleanedContent = cleanEditorContent(content);
        if (!title.trim() && !cleanedContent) {
            if (!title.trim())
                setIsLoading(false);
            navigate("/notes");
            return;
        }
        if (!id) {
            createNote(title, content)
                .then(() => {
                    console.log("Note saved successfully");
                    setTitle("");
                    setContent("");
                    setIsLoading(false);
                    navigate("/notes");
                })
                .catch((error: string) => {
                    console.error("Error saving note:", error);
                    //toast({ title: "Failed to save note", description: error.message, variant: "destructive" });
                });
        }
        else {
            updateNote(id, title, content)
                .then(() => {
                    //toast({ title: "Note updated successfully", variant: "success" });
                    setIsLoading(false);
                    navigate("/notes");
                })
                .catch((error: string) => {
                    console.error("Error updating note:", error);
                    //toast({ title: "Failed to update note", description: error.message, variant: "destructive" });
                });
        }
    };

    const handleDeleteNote = (noteId: string, noteName: string) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            noteId,
            noteName,
        })
    }

    const handleSaveNote = (noteId: string, noteName: string) => {
        setConfirmModal({
            isOpen: true,
            type: 'save',
            noteId,
            noteName,
        })
    }

    const handleConfirmAction = () => {
        if (confirmModal.type === 'delete' && confirmModal.noteId) {
            deleteNote(confirmModal.noteId);
        } else if (confirmModal.type === 'save' && confirmModal.noteId) {
            saveNote();
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
        <div className="min-h-screen w-screen  bg-gray-100">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link to="/notes">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Notes
                                </Button>
                            </Link>
                            <div className="h-4 w-px bg-gray-300" />
                            {!isMobile &&
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <FileText className="h-4 w-4" />
                                    <span>{id ? 'Editing Note' : 'New Note'}</span>
                                </div>
                            }
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <Button
                                onClick={() => id ? handleSaveNote(id, title) : saveNote()}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                            >
                                <Save className="h-4 w-4 mr-1" />
                                {isLoading ? "Saving..." : "Save"}
                            </Button>
                            {id && (
                                <Button
                                    onClick={() => handleDeleteNote(id, title)}
                                    variant="ghost"
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Editor Content */}
            <div className="max-w-4xl min-h-screen  mx-auto px-6 lg:px-8 py-8 mb-5">
                <div className="bg-white  rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    {/* Title Input */}
                    <div className="border-b border-gray-100 p-8 pb-4">
                        <Input
                            type="text"
                            placeholder="Note title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-2xl sm:text-3xl font-semibold border-none shadow-none p-0 focus:ring-0 focus:outline-none placeholder:text-gray-300 bg-transparent"
                        />
                    </div>

                    {/* Rich Text Editor */}

                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Start writing your note..."
                    />
                </div>
            </div>
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={
                    confirmModal.type === 'delete'
                        ? 'Delete Note'
                        : 'Save Changes'
                }
                description={
                    confirmModal.type === 'delete'
                        ? <>
                            Are you sure you want to delete "
                            <span className="text-red-600 font-semibold">
                                {confirmModal.noteName}
                            </span>
                            "? This action cannot be undone.
                        </>
                        :
                        <>
                            Are you sure you want to save these changes to "
                            <span className="text-green-600 font-semibold">
                                {confirmModal.noteName}
                            </span>
                            " ?
                        </>
                }
                confirmText={confirmModal.type === 'delete' ? 'Delete' : 'Save'}
                variant={confirmModal.type === 'delete' ? 'destructive' : 'save'}
            />
        </div>
    );
};

export default Editor;