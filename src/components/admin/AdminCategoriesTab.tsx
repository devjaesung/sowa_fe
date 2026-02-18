import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HiOutlineDotsVertical } from "react-icons/hi";
import type { FormEvent } from "react";
import type { Category } from "../../api/types";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import TextInput from "../ui/TextInput";
import type { CategoryEditorMode, CategoryFormState } from "./types";

const smallButtonClass = "h-9 px-3 text-sm";

interface AdminCategoriesTabProps {
  categoryList: Category[];
  categoryEditorMode: CategoryEditorMode;
  categoryEditId: number | null;
  categoryForm: CategoryFormState;
  onOpenCreate: () => void;
  onCloseEditor: () => void;
  onChangeForm: (next: CategoryFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onReorder: (nextList: Category[]) => void;
}

export default function AdminCategoriesTab({
  categoryList,
  categoryEditorMode,
  categoryEditId,
  categoryForm,
  onOpenCreate,
  onCloseEditor,
  onChangeForm,
  onSubmit,
  onEdit,
  onDelete,
  onReorder,
}: AdminCategoriesTabProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categoryList.findIndex(
      (item) => item.id === Number(active.id),
    );
    const newIndex = categoryList.findIndex(
      (item) => item.id === Number(over.id),
    );

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    onReorder(arrayMove(categoryList, oldIndex, newIndex));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          드래그로 순서 변경, 편집 버튼으로 인라인 수정이 가능합니다.
        </p>
        <Button type="button" className="h-10 px-4" onClick={onOpenCreate}>
          카테고리 추가
        </Button>
      </div>

      {categoryEditorMode === "create" ? (
        <form
          className="grid gap-3 rounded-xl border border-line bg-card-soft p-4 md:grid-cols-3"
          onSubmit={onSubmit}
        >
          <div>
            <FieldLabel required>카테고리명</FieldLabel>
            <TextInput
              className="mt-2"
              value={categoryForm.name}
              onChange={(event) =>
                onChangeForm({ ...categoryForm, name: event.target.value })
              }
            />
          </div>
          <div>
            <FieldLabel>순서</FieldLabel>
            <TextInput
              className="mt-2"
              value={categoryForm.order}
              onChange={(event) =>
                onChangeForm({ ...categoryForm, order: event.target.value })
              }
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="h-10 px-4">
              생성
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 px-4"
              onClick={onCloseEditor}
            >
              닫기
            </Button>
          </div>
        </form>
      ) : null}

      <div className="space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categoryList.map((category) => category.id)}
            strategy={verticalListSortingStrategy}
          >
            {categoryList.map((category) => (
              <div key={category.id} className="space-y-2">
                <SortableCategoryRow
                  category={category}
                  onEdit={() => onEdit(category)}
                  onDelete={() => onDelete(category.id)}
                />
                {categoryEditorMode === "edit" &&
                categoryEditId === category.id ? (
                  <form
                    className="grid gap-3 rounded-xl border border-line bg-card p-4 md:grid-cols-3"
                    onSubmit={onSubmit}
                  >
                    <div>
                      <FieldLabel required>카테고리명</FieldLabel>
                      <TextInput
                        className="mt-2"
                        value={categoryForm.name}
                        onChange={(event) =>
                          onChangeForm({
                            ...categoryForm,
                            name: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>순서</FieldLabel>
                      <TextInput
                        className="mt-2"
                        value={categoryForm.order}
                        onChange={(event) =>
                          onChangeForm({
                            ...categoryForm,
                            order: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button type="submit" className="h-10 px-4">
                        수정 저장
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 px-4"
                        onClick={onCloseEditor}
                      >
                        닫기
                      </Button>
                    </div>
                  </form>
                ) : null}
              </div>
            ))}
          </SortableContext>
        </DndContext>
        {categoryList.length === 0 ? (
          <p className="text-sm text-text-muted">등록된 카테고리가 없습니다.</p>
        ) : null}
      </div>
    </div>
  );
}

function SortableCategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex flex-col gap-3 rounded-xl border border-line bg-card-soft p-4 md:flex-row md:items-center md:justify-between ${
        isDragging ? "z-10 opacity-60 shadow-lg" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-grab rounded-md border border-line bg-card p-2 text-center text-text-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="카테고리 순서 드래그"
        >
          <HiOutlineDotsVertical />
        </button>
        <div className="text-sm text-text-main">
          #{category.id} {category.name}
          <span className="ml-2 text-text-muted">
            순서 {category.order ?? 0}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className={smallButtonClass}
          onClick={onEdit}
        >
          편집
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={smallButtonClass}
          onClick={onDelete}
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
