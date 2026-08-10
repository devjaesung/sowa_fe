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
import { useMemo, type ChangeEvent, type FormEvent } from "react";
import type { Category, Portfolio, PortfolioImage } from "../../api/types";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import Select from "../ui/Select";
import TextArea from "../ui/TextArea";
import TextInput from "../ui/TextInput";
import type { PortfolioEditorMode, PortfolioFormState } from "./types";
import { resolveAssetUrl } from "../../shared/assetUrl";

interface AdminPortfolioTabProps {
  portfolioList: Portfolio[];
  categoryList: Category[];
  portfolioEditorMode: PortfolioEditorMode;
  portfolioForm: PortfolioFormState;
  onOpenCreate: () => void;
  onCloseEditor: () => void;
  onChangeForm: (next: PortfolioFormState) => void;
  onSubmitCreate: (event: FormEvent<HTMLFormElement>) => void;
  onSubmitUpdate: () => void;
  onEdit: (item: Portfolio) => void;
  onDelete: (id: number) => void;
  onDeleteImage: (imageId: number) => void;
  onReorder: (nextList: Portfolio[]) => void;
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
  onDeleteImage,
  onReorder,
}: AdminPortfolioTabProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const parentCategoryOptions = useMemo(
    () => categoryList.filter((c) => c.parent == null).map((c) => ({ label: c.name, value: String(c.id) })),
    [categoryList],
  );

  const subCategoryOptions = useMemo(() => {
    if (!portfolioForm.parent_category_id) return [];
    return categoryList
      .filter((c) => c.parent === Number(portfolioForm.parent_category_id))
      .map((c) => ({ label: c.name, value: String(c.id) }));
  }, [categoryList, portfolioForm.parent_category_id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = portfolioList.findIndex((item) => item.id === Number(active.id));
    const newIndex = portfolioList.findIndex((item) => item.id === Number(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

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
          className="grid gap-4 rounded-xl border border-line bg-card-soft p-4 md:grid-cols-2"
          onSubmit={(e) => {
            if (portfolioEditorMode === "create") {
              onSubmitCreate(e);
            } else {
              e.preventDefault();
              onSubmitUpdate();
            }
          }}
        >
          {/* 대분류 */}
          <div>
            <FieldLabel>대분류</FieldLabel>
            <Select
              className="mt-2"
              value={portfolioForm.parent_category_id}
              placeholder="대분류 선택"
              options={parentCategoryOptions}
              onChange={(value) =>
                onChangeForm({ ...portfolioForm, parent_category_id: value, category_id: "" })
              }
            />
          </div>

          {/* 소분류 */}
          <div>
            <FieldLabel>소분류</FieldLabel>
            <Select
              className="mt-2"
              value={portfolioForm.category_id}
              placeholder={portfolioForm.parent_category_id ? "소분류 선택" : "대분류를 먼저 선택하세요"}
              options={subCategoryOptions}
              onChange={(value) => onChangeForm({ ...portfolioForm, category_id: value })}
            />
          </div>

          {/* 제목 */}
          <div>
            <FieldLabel required>타이틀</FieldLabel>
            <TextInput
              className="mt-2"
              value={portfolioForm.title}
              onChange={(e) => onChangeForm({ ...portfolioForm, title: e.target.value })}
            />
          </div>

          {/* 순서 */}
          <div>
            <FieldLabel>순서</FieldLabel>
            <TextInput
              className="mt-2"
              value={portfolioForm.order}
              onChange={(e) => onChangeForm({ ...portfolioForm, order: e.target.value })}
            />
          </div>

          <div>
            <FieldLabel>YEAR</FieldLabel>
            <TextInput
              className="mt-2"
              value={portfolioForm.year}
              inputMode="numeric"
              maxLength={4}
              placeholder="예: 2026"
              onChange={(e) =>
                onChangeForm({
                  ...portfolioForm,
                  year: e.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
            />
          </div>

          <div>
            <FieldLabel>LOCATION</FieldLabel>
            <TextInput
              className="mt-2"
              value={portfolioForm.location}
              maxLength={200}
              placeholder="예: 서울특별시 강남구"
              onChange={(e) => onChangeForm({ ...portfolioForm, location: e.target.value })}
            />
          </div>

          <div>
            <FieldLabel>AREA</FieldLabel>
            <TextInput
              className="mt-2"
              value={portfolioForm.area}
              maxLength={100}
              placeholder="예: 32평, 105㎡"
              onChange={(e) => onChangeForm({ ...portfolioForm, area: e.target.value })}
            />
          </div>

          {/* 메인 노출 */}
          <label className="flex items-end gap-2 pb-2 text-sm text-text-main">
            <input
              type="checkbox"
              checked={portfolioForm.is_featured}
              onChange={(e) =>
                onChangeForm({ ...portfolioForm, is_featured: e.target.checked })
              }
            />
            메인 노출
          </label>

          {/* 설명 */}
          <div className="md:col-span-2">
            <FieldLabel>설명</FieldLabel>
            <TextArea
              className="mt-2 min-h-24"
              value={portfolioForm.description}
              onChange={(e) => onChangeForm({ ...portfolioForm, description: e.target.value })}
            />
          </div>

          {/* 편집 모드: 기존 이미지 목록 */}
          {portfolioEditorMode === "edit" && portfolioForm.existingImages.length > 0 && (
            <div className="md:col-span-2">
              <FieldLabel>현재 이미지</FieldLabel>
              <div className="mt-2 flex flex-wrap gap-3">
                {portfolioForm.existingImages.map((img) => (
                  <ExistingImageThumb
                    key={img.id}
                    image={img}
                    onDelete={() => onDeleteImage(img.id)}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-text-muted">
                첫 번째 이미지가 썸네일로 사용됩니다.
              </p>
            </div>
          )}

          {/* 이미지 업로드 */}
          <div className="md:col-span-2">
            <FieldLabel>
              이미지 파일 추가{" "}
              <span className="font-normal text-text-subtle">
                (여러 장 선택 가능
                {portfolioEditorMode === "create" ? ", 첫 번째가 썸네일" : ""})
              </span>
            </FieldLabel>
            <TextInput
              className="mt-2"
              type="file"
              accept="image/*"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const files = Array.from(e.target.files ?? []);
                onChangeForm({ ...portfolioForm, images: files });
              }}
            />
            {portfolioForm.images.length > 0 && (
              <p className="mt-1 text-xs text-text-muted">
                {portfolioForm.images.length}장 선택됨:{" "}
                {portfolioForm.images.map((f) => f.name).join(", ")}
              </p>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button type="submit" className="h-10 px-4">
              {portfolioEditorMode === "create" ? "생성" : "수정 저장"}
            </Button>
            {portfolioEditorMode === "edit" && (
              <Button
                type="button"
                variant="ghost"
                className="h-10 px-4 text-rose-700 hover:text-rose-800"
                onClick={() => {
                  if (!portfolioForm.id) return;
                  onDelete(Number(portfolioForm.id));
                }}
              >
                작품 삭제
              </Button>
            )}
            <Button type="button" variant="outline" className="h-10 px-4" onClick={onCloseEditor}>
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
          <p className="text-sm text-text-muted">등록된 포트폴리오가 없습니다.</p>
        ) : null}
      </div>
    </div>
  );
}

function ExistingImageThumb({
  image,
  onDelete,
}: {
  image: PortfolioImage;
  onDelete: () => void;
}) {
  const src = resolveAssetUrl(image.image);
  return (
    <div className="group relative h-20 w-20 overflow-hidden rounded-lg border border-line">
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center bg-surface text-xs text-text-subtle">
          없음
        </div>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
        aria-label="이미지 삭제"
      >
        <span className="text-xl font-bold text-white">×</span>
      </button>
    </div>
  );
}

function SortablePortfolioCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Portfolio;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const previewImageSrc = resolveAssetUrl(item.thumbnail);

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
        {previewImageSrc ? (
          <img src={previewImageSrc} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-subtle">
            이미지 없음
          </div>
        )}
      </div>

      <div className="space-y-1 px-4 py-3">
        <p className="text-sm font-medium text-text-main">{item.title}</p>
        {item.year || item.location || item.area ? (
          <p className="text-xs text-text-muted">
            {[item.year, item.location, item.area].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        <p className="text-xs text-text-muted">
          #{item.id} | {item.category?.name ?? "-"} | 이미지 {item.images.length}장 | 순서{" "}
          {item.order ?? 0}
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
