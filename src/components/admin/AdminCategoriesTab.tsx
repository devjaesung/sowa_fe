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
import { useMemo, type FormEvent } from "react";
import type { Category } from "../../api/types";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import Select from "../ui/Select";
import TextInput from "../ui/TextInput";
import type { CategoryEditorMode, CategoryFormState } from "./types";

const smallButtonClass = "h-9 px-3 text-sm";

interface AdminCategoriesTabProps {
  categoryList: Category[];
  categoryEditorMode: CategoryEditorMode;
  categoryEditId: number | null;
  categoryForm: CategoryFormState;
  onOpenCreate: () => void;
  onOpenCreateChild: (parentId: number) => void;
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
  onOpenCreateChild,
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

  // 대분류 목록 (parent == null)
  const parents = useMemo(
    () => categoryList.filter((c) => c.parent == null),
    [categoryList],
  );

  // 대분류 id 셋
  const parentIdSet = useMemo(
    () => new Set(parents.map((c) => c.id)),
    [parents],
  );

  // 소분류 맵 (parentId → Category[])
  const childrenMap = useMemo(() => {
    const map = new Map<number, Category[]>();
    categoryList.forEach((c) => {
      if (c.parent != null) {
        const list = map.get(c.parent) ?? [];
        list.push(c);
        map.set(c.parent, list);
      }
    });
    return map;
  }, [categoryList]);

  // 대분류 셀렉트 옵션 (소분류 추가 폼에서 사용)
  const parentOptions = useMemo(
    () =>
      parents.map((p) => ({
        label: p.name,
        value: String(p.id),
      })),
    [parents],
  );

  const handleParentDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parents.findIndex((c) => c.id === Number(active.id));
    const newIndex = parents.findIndex((c) => c.id === Number(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    onReorder(arrayMove(parents, oldIndex, newIndex));
  };

  const CategoryForm = (
    <form
      className="grid gap-3 rounded-xl border border-line bg-card-soft p-4 md:grid-cols-3"
      onSubmit={onSubmit}
    >
      <div>
        <FieldLabel required>카테고리명</FieldLabel>
        <TextInput
          className="mt-2"
          value={categoryForm.name}
          onChange={(e) => onChangeForm({ ...categoryForm, name: e.target.value })}
        />
      </div>
      <div>
        <FieldLabel>상위 카테고리 (없으면 대분류)</FieldLabel>
        <Select
          className="mt-2"
          value={categoryForm.parent}
          placeholder="대분류 (없음)"
          options={parentOptions}
          onChange={(value) => onChangeForm({ ...categoryForm, parent: value })}
        />
      </div>
      <div>
        <FieldLabel>순서</FieldLabel>
        <TextInput
          className="mt-2"
          value={categoryForm.order}
          onChange={(e) => onChangeForm({ ...categoryForm, order: e.target.value })}
        />
      </div>
      <div className="flex items-end gap-2 md:col-span-3">
        <Button type="submit" className="h-10 px-4">
          {categoryEditorMode === "edit" ? "수정 저장" : "생성"}
        </Button>
        <Button type="button" variant="outline" className="h-10 px-4" onClick={onCloseEditor}>
          닫기
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          대분류는 드래그로 순서 변경, 편집 버튼으로 수정이 가능합니다.
        </p>
        <Button type="button" className="h-10 px-4" onClick={onOpenCreate}>
          대분류 추가
        </Button>
      </div>

      {categoryEditorMode === "create" ? CategoryForm : null}

      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleParentDragEnd}
        >
          <SortableContext
            items={parents.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {parents.map((parent) => {
              const children = childrenMap.get(parent.id) ?? [];
              const isEditingThis = categoryEditorMode === "edit" && categoryEditId === parent.id;

              return (
                <div key={parent.id} className="space-y-1">
                  {/* 대분류 행 */}
                  <SortableCategoryRow
                    category={parent}
                    badge="대분류"
                    onEdit={() => onEdit(parent)}
                    onDelete={() => onDelete(parent.id)}
                    onAddChild={() => onOpenCreateChild(parent.id)}
                  />

                  {/* 대분류 편집 폼 */}
                  {isEditingThis ? CategoryForm : null}

                  {/* 소분류 목록 */}
                  {children.length > 0 && (
                    <div className="ml-8 space-y-1">
                      {children.map((child) => {
                        const isEditingChild =
                          categoryEditorMode === "edit" && categoryEditId === child.id;
                        return (
                          <div key={child.id}>
                            <ChildCategoryRow
                              category={child}
                              onEdit={() => onEdit(child)}
                              onDelete={() => onDelete(child.id)}
                            />
                            {isEditingChild ? CategoryForm : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </SortableContext>
        </DndContext>

        {/* 부모가 없는 orphan 소분류 처리 */}
        {categoryList
          .filter((c) => c.parent != null && !parentIdSet.has(c.parent!))
          .map((c) => (
            <div key={c.id}>
              <ChildCategoryRow
                category={c}
                onEdit={() => onEdit(c)}
                onDelete={() => onDelete(c.id)}
              />
              {categoryEditorMode === "edit" && categoryEditId === c.id
                ? CategoryForm
                : null}
            </div>
          ))}

        {categoryList.length === 0 ? (
          <p className="text-sm text-text-muted">등록된 카테고리가 없습니다.</p>
        ) : null}
      </div>
    </div>
  );
}

function SortableCategoryRow({
  category,
  badge,
  onEdit,
  onDelete,
  onAddChild,
}: {
  category: Category;
  badge: string;
  onEdit: () => void;
  onDelete: () => void;
  onAddChild: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category.id });

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
          className="cursor-grab rounded-md border border-line bg-card p-2 text-text-muted active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="순서 드래그"
        >
          <HiOutlineDotsVertical />
        </button>
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">
          {badge}
        </span>
        <span className="text-sm font-medium text-text-main">
          {category.name}
        </span>
        <span className="text-xs text-text-muted">순서 {category.order ?? 0}</span>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className={smallButtonClass}
          onClick={onAddChild}
        >
          소분류 추가
        </Button>
        <Button type="button" variant="outline" className={smallButtonClass} onClick={onEdit}>
          편집
        </Button>
        <Button type="button" variant="ghost" className={smallButtonClass} onClick={onDelete}>
          삭제
        </Button>
      </div>
    </div>
  );
}

function ChildCategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-card p-3 pl-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-text-subtle">└</span>
        <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-text-subtle">
          소분류
        </span>
        <span className="text-sm text-text-main">{category.name}</span>
        <span className="text-xs text-text-muted">순서 {category.order ?? 0}</span>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className={smallButtonClass} onClick={onEdit}>
          편집
        </Button>
        <Button type="button" variant="ghost" className={smallButtonClass} onClick={onDelete}>
          삭제
        </Button>
      </div>
    </div>
  );
}
