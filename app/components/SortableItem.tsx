// components/SortableItem.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export const SortableItem = ({ id, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id,
    // Add activation constraint to prevent accidental drags

  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle pointer events properly
  const handlePointerDown = (e: React.PointerEvent) => {
    if (listeners?.onPointerDown) {
      
      listeners.onPointerDown(e);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      onPointerDown={handlePointerDown}
    >
      {children}
    </div>
  );
};