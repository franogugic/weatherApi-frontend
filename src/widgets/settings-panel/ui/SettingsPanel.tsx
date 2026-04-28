import { useTranslation } from "react-i18next"

export function SettingsPanel() {
  const { t } = useTranslation()

  return (
    <div>
      <p>{t("settings.title")}</p>
    </div>
  )
}
