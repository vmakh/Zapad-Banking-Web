import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";
import { I18nProvider, useI18n } from "./i18n/I18nProvider";

export default function App() {
  const { t } = useI18n();
  return <I18nProvider><RouterProvider router={router} /><Toaster containerAriaLabel={t("Notifications")} theme="light" position="top-right" richColors closeButton toastOptions={{ closeButtonAriaLabel: t("Close") }} /></I18nProvider>;
}
