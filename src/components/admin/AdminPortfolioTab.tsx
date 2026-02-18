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
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HiOutlineDotsVertical } from "react-icons/hi";
import type { ChangeEvent, FormEvent } from "react";
import type { Category, PortfolioImage } from "../../api/types";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import TextInput from "../ui/TextInput";
import type { PortfolioEditorMode, PortfolioFormState } from "./types";

interface AdminPortfolioTabProps {
  portfolioList: PortfolioImage[];
  categoryList: Category[];
  portfolioEditorMode: PortfolioEditorMode;
  portfolioForm: PortfolioFormState;
  onOpenCreate: () => void;
  onCloseEditor: () => void;
  onChangeForm: (next: PortfolioFormState) => void;
  onSubmitCreate: (event: FormEvent<HTMLFormElement>) => void;
  onSubmitUpdate: () => void;
  onEdit: (item: PortfolioImage) => void;
  onDelete: (id: number) => void;
  onReorder: (nextList: PortfolioImage[]) => void;
}

export default function AdminPortfolioTab({
  portfolioList,
  categoryList,
  portfolioEditorMode,
  portfolioForm,
  onOpenCreate,
  onCloseEditor,
  onChangeForm,
  onSubmitCreate,
  onSubmitUpdate,
  onEdit,
  onDelete,
  onReorder,
}: AdminPortfolioTabProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = portfolioList.findIndex(
      (item) => item.id === Number(active.id),
    );
    const newIndex = portfolioList.findIndex(
      (item) => item.id === Number(over.id),
    );

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    onReorder(arrayMove(portfolioList, oldIndex, newIndex));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          카드를 드래그해 순서를 바꾸고, hover 시 수정/삭제할 수 있습니다.
        </p>
        <Button type="button" className="h-10 px-4" onClick={onOpenCreate}>
          포트폴리오 추가
        </Button>
      </div>

      {portfolioEditorMode ? (
        <form
          className="grid gap-3 rounded-xl border border-line bg-card-soft p-4 md:grid-cols-2"
          onSubmit={(event) => {
            if (portfolioEditorMode === "create") {
              onSubmitCreate(event);
              return;
            }

            event.preventDefault();
            onSubmitUpdate();
          }}
        >
          <div>
            <FieldLabel>카테고리</FieldLabel>
            <Select
              className="mt-2"
              value={portfolioForm.category_id}
              placeholder="카테고리 선택"
              options={categoryList.map((category) => ({
                label: category.name,
                value: String(category.id),
              }))}
              onChange={(value) =>
                onChangeForm({ ...portfolioForm, category_id: value })
              }
            />
          </div>
          <div>
            <FieldLabel required>타이틀</FieldLabel>
            <TextInput
              className="mt-2"
              value={portfolioForm.title}
              onChange={(event) =>
                onChangeForm({ ...portfolioForm, title: event.target.value })
              }
            />
          </div>
          <div>
            <FieldLabel>순서</FieldLabel>
            <TextInput
              className="mt-2"
              value={portfolioForm.order}
              onChange={(event) =>
                onChangeForm({ ...portfolioForm, order: event.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>설명</FieldLabel>
            <TextArea
              className="mt-2 min-h-24"
              value={portfolioForm.description}
              onChange={(event) =>
                onChangeForm({
                  ...portfolioForm,
                  description: event.target.value,
                })
              }
            />
          </div>
          <div>
            <FieldLabel>
              {portfolioEditorMode === "create"
                ? "이미지 파일 (필수)"
                : "이미지 파일 (선택)"}
            </FieldLabel>
            <TextInput
              className="mt-2"
              type="file"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChangeForm({
                  ...portfolioForm,
                  image: event.target.files?.[0] ?? null,
                })
              }
            />
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm text-text-main">
            <input
              type="checkbox"
              checked={portfolioForm.is_featured}
              onChange={(event) =>
                onChangeForm({
                  ...portfolioForm,
                  is_featured: event.target.checked,
                })
              }
            />
            메인 노출
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button type="submit" className="h-10 px-4">
              {portfolioEditorMode === "create" ? "생성" : "수정 저장"}
            </Button>
            {portfolioEditorMode === "edit" ? (
              <Button
                type="button"
                variant="ghost"
                className="h-10 px-4"
                onClick={() => {
                  if (!portfolioForm.id) {
                    return;
                  }
                  onDelete(Number(portfolioForm.id));
                }}
              >
                삭제
              </Button>
            ) : null}
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={portfolioList.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            {portfolioList.map((item) => (
              <SortablePortfolioCard
                key={item.id}
                item={item}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
        {portfolioList.length === 0 ? (
          <p className="text-sm text-text-muted">
            등록된 포트폴리오가 없습니다.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SortablePortfolioCard({
  item,
  onEdit,
  onDelete,
}: {
  item: PortfolioImage;
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
  } = useSortable({ id: item.id });

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative overflow-hidden rounded-xl border border-line bg-card-soft shadow-sm ${
        isDragging ? "z-10 opacity-70 shadow-xl" : ""
      }`}
    >
      <button
        type="button"
        className="absolute left-3 top-3 z-10 cursor-grab rounded-md border border-white/70 bg-white/90 p-1 text-text-muted active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="포트폴리오 순서 드래그"
      >
        <HiOutlineDotsVertical />
      </button>

      <div className="aspect-4/3 bg-surface">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-subtle">
            이미지 없음
          </div>
        )}
      </div>
      <div className="space-y-1 px-4 py-3">
        <p className="text-sm font-medium text-text-main">{item.title}</p>
        <p className="text-xs text-text-muted">
          #{item.id} | {item.category?.name ?? "-"} | 순서 {item.order ?? 0}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-black/35 p-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 border-white bg-white/95 px-3 text-sm"
            onClick={onEdit}
          >
            수정
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-9 bg-white/95 px-3 text-sm text-rose-700 hover:text-rose-800"
            onClick={onDelete}
          >
            삭제
          </Button>
        </div>
      </div>
    </article>
  );
}
