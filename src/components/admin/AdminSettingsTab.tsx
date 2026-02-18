import type { ChangeEvent, FormEvent } from "react";
import type { SiteSettings } from "../../api/types";
import Button from "../ui/Button";
import FieldLabel from "../ui/FieldLabel";
import TextInput from "../ui/TextInput";
import type { SettingsFormState } from "./types";

interface AdminSettingsTabProps {
  settings: SiteSettings | undefined;
  settingsForm: SettingsFormState;
  onChangeForm: (next: SettingsFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AdminSettingsTab({ settings, settingsForm, onChangeForm, onSubmit }: AdminSettingsTabProps) {
  return (
    <div className="space-y-5">
      <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        <div>
          <FieldLabel>사이트 타이틀</FieldLabel>
          <TextInput
            className="mt-2"
            value={settingsForm.site_title ?? settings?.site_title ?? ""}
            onChange={(event) => onChangeForm({ ...settingsForm, site_title: event.target.value })}
          />
        </div>
        <div>
          <FieldLabel>히어로 타이틀</FieldLabel>
          <TextInput
            className="mt-2"
            value={settingsForm.hero_title ?? settings?.hero_title ?? ""}
            onChange={(event) => onChangeForm({ ...settingsForm, hero_title: event.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <FieldLabel>히어로 서브타이틀</FieldLabel>
          <TextInput
            className="mt-2"
            value={settingsForm.hero_subtitle ?? settings?.hero_subtitle ?? ""}
            onChange={(event) => onChangeForm({ ...settingsForm, hero_subtitle: event.target.value })}
          />
        </div>
        <div>
          <FieldLabel>로고 이미지</FieldLabel>
          <TextInput
            className="mt-2"
            type="file"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChangeForm({ ...settingsForm, logo_image: event.target.files?.[0] ?? null })
            }
          />
        </div>
        <div>
          <FieldLabel>히어로 이미지</FieldLabel>
          <TextInput
            className="mt-2"
            type="file"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChangeForm({ ...settingsForm, hero_image: event.target.files?.[0] ?? null })
            }
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" className="h-10 px-4">설정 저장</Button>
        </div>
      </form>

      <SettingsCard settings={settings} />
    </div>
  );
}

function SettingsCard({ settings }: { settings: SiteSettings | undefined }) {
  if (!settings) {
    return <p className="text-sm text-text-muted">설정 데이터 없음</p>;
  }

  return (
    <div className="rounded-xl border border-line bg-card-soft p-4 text-sm text-text-main">
      <p>site_title: {settings.site_title}</p>
      <p>hero_title: {settings.hero_title}</p>
      <p>hero_subtitle: {settings.hero_subtitle}</p>
      <p>logo_image: {settings.logo_image || "-"}</p>
      <p>hero_image: {settings.hero_image || "-"}</p>
      <p className="text-text-muted">updated_at: {settings.updated_at}</p>
    </div>
  );
}
