import { supabase } from "../lib/supabase-client";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragCancelEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useCallback, useMemo } from "react"; // merged into one line
import debounce from "lodash/debounce";
import { type Category } from "../types/notea";
import { type ReactNode } from "react";

interface DragDropProviderProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  children: ReactNode;
  onDragStart?: () => void;
  onDragStop?: () => void;
}

export const DragDropProvider = ({
  categories,
  setCategories,
  children,
  onDragStart,
  onDragStop
}: DragDropProviderProps) => {
  // 👇 Tracks the ID of the category currently being dragged
  const [activeId, setActiveId] = useState<string | null>(null);

  // 👇 Get the full category object from the ID (used for overlay rendering)
  const draggedCategory = categories.find((cat) => cat.id === activeId);

  // 👇 Set up drag sensors (only activate drag after moving 8px)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 👇 Debounced function to update category positions in Supabase
  const debouncedUpdatePositions = useMemo(() => {
    return debounce(async (items: { id: string; position: number }[]) => {
      const updates = items.map(({ id, position }) =>
        supabase.from("categories").update({ position }).eq("id", id)
      );
      const results = await Promise.all(updates);
      const hasError = results.some((r) => r.error);
      if (hasError) {
        console.error("Failed to update one or more category positions.");
      }
    }, 1000);
  }, []);

    // 👇 Called when drag starts — we capture the dragged category ID
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    onDragStart?.();
  };

  // 👇 Clear activeId if drag is cancelled
  const handleDragCancel = (event: DragCancelEvent) => {
    setActiveId(null);
    onDragStop?.(); // 👈 restore expansion
  };

  // 👇 Called when drag ends — reorder items and update Supabase
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null); // Clear the dragged item ID
      onDragStop?.(); // 👈 restore expansion

      if (!over || active.id === over.id) return;

      const oldIndex = categories.findIndex((cat) => cat.id === active.id);
      const newIndex = categories.findIndex((cat) => cat.id === over.id);
      const reordered = arrayMove(categories, oldIndex, newIndex);
      const updated = reordered.map((cat, idx) => ({
        ...cat,
        position: idx,
      }));

      setCategories(updated);
      debouncedUpdatePositions(
        updated.map((cat) => ({ id: cat.id, position: cat.position }))
      );
    },
    [categories, setCategories, debouncedUpdatePositions]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* 👇 This makes all category IDs sortable */}
      <SortableContext
        items={categories.map((cat) => cat.id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>

      {/* 👇 DragOverlay ensures dragged category keeps consistent size/appearance */}
      <DragOverlay>
        {draggedCategory ? (
          <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-md">
            <span className="text-sm font-medium text-gray-800">
              {draggedCategory.name}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
