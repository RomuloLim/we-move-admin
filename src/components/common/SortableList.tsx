import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

import { Button } from '@/components/Button';

type SortableItem = {
    id: string | number;
    [key: string]: any;
};

type SortableListProps<T extends SortableItem> = {
    items: T[];
    onReorder: (items: T[]) => void;
    onRemove?: (id: string | number) => void;
    renderItem: (item: T) => React.ReactNode;
    className?: string;
};

type SortableItemComponentProps = {
    id: string | number;
    children: React.ReactNode;
    onRemove?: (id: string | number) => void;
};

function SortableItemComponent({ id, children, onRemove }: SortableItemComponentProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
            <button
                type="button"
                className="cursor-grab active:cursor-grabbing touch-none"
                {...attributes}
                {...listeners}
                aria-label="Arrastar item"
                tabIndex={0}
            >
                <GripVertical className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex-1">{children}</div>

            {onRemove && (
                <Button
                    type="button"
                    variant="tertiary"
                    size="icon-sm"
                    onClick={() => onRemove(id)}
                    aria-label="Remover item"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}

export function SortableList<T extends SortableItem>({
    items,
    onReorder,
    onRemove,
    renderItem,
    className = '',
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id.toString() === active.id);
            const newIndex = items.findIndex((item) => item.id.toString() === over.id);

            const reorderedItems = arrayMove(items, oldIndex, newIndex);
            onReorder(reorderedItems);
        }
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((item) => item.id.toString())}
                strategy={verticalListSortingStrategy}
            >
                <div className={`space-y-2 ${className}`}>
                    {items.map((item) => (
                        <SortableItemComponent key={item.id} id={item.id} onRemove={onRemove}>
                            {renderItem(item)}
                        </SortableItemComponent>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
