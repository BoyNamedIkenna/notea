import { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2
} from "lucide-react";
import { Button } from "../components/ui/button";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState("#000000");

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    updateContent();
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    executeCommand("foreColor", color);
  };

  const insertHeading = (level: number) => {
    executeCommand("formatBlock", `h${level}`);
  };

  const colors = [
    "#000000", "#374151", "#DC2626", "#EA580C", "#CA8A04",
    "#16A34A", "#2563EB", "#7C3AED", "#C026D3", "#DB2777"
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      {/* Toolbar */}
      <div className="border-b  bg-gray-50 rounded-t-xl px-2 py-3">
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <div className="flex items-center border-r border-gray-300 pr-3 mr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertHeading(1)}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertHeading(2)}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center border-r border-gray-300 pr-3 mr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("bold")}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("italic")}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("underline")}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          {/* Lists */}
          <div className="flex items-center border-r border-gray-300 pr-3 mr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("insertUnorderedList")}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("insertOrderedList")}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center border-r border-gray-300 pr-3 mr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("justifyLeft")}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("justifyCenter")}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("justifyRight")}
              className="h-8 px-2 hover:bg-white hover:shadow-sm"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 mr-2 font-medium">Color:</span>
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 transition-all duration-150 ${selectedColor === color ? "border-gray-400 shadow-sm" : "border-gray-200"
                    }`}
                  style={{ backgroundColor: color }}
                  title={`Text color: ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-8 focus:outline-none text-gray-800 [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:pointer-events-none"
        style={{
          fontSize: "16px",
          lineHeight: "1.75",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
        data-placeholder={placeholder}
      />

    </div>
  );
};

export default RichTextEditor;