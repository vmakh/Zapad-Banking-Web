import { useI18n } from "../../i18n/I18nProvider";
import { cn } from "../ui/utils";
import { Link } from "react-router";
import { ArrowDownLeftIcon as ArrowDownLeft } from "@phosphor-icons/react/dist/csr/ArrowDownLeft";
import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import type { ProfileSlug } from "../../data/types";
import { paymentsPath } from "../../utils/paths";
import { IconScaleSlot } from "./IconScaleSlot";

export function DashboardPaymentsCta({
  profileSlug,
  isBusiness,
}: {
  profileSlug: ProfileSlug;
  isBusiness: boolean;
}) {
  const { t } = useI18n();
  const sendBg = "bg-secondary";
  const sendIconClass = "text-primary-text";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <Link
        to={paymentsPath(profileSlug, "send")}
        className="group flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-white border border-slate-200/60 hover:border-slate-300  transition-field focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <IconScaleSlot className="size-12 sm:size-14 rounded-lg shrink-0" innerClassName={cn(sendBg)}>
          <ArrowUpRight className={cn("size-6 sm:size-7", sendIconClass)} />
        </IconScaleSlot>
        <div className="min-w-0 flex-1">
          <div className="text-base sm:text-lg font-semibold text-slate-900">{t("Send")}</div>
          <p className="text-sm font-normal text-slate-500 mt-0.5">{t("Send money to a recipient")}</p>
        </div>
      </Link>
      <Link
        to={paymentsPath(profileSlug, "receive")}
        className="group flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-white border border-slate-200/60 hover:border-slate-300  transition-field focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <IconScaleSlot className="size-12 sm:size-14 rounded-lg shrink-0" innerClassName="bg-secondary">
          <ArrowDownLeft className="size-6 sm:size-7 text-primary-text" />
        </IconScaleSlot>
        <div className="min-w-0 flex-1">
          <div className="text-base sm:text-lg font-semibold text-slate-900">{t("Receive")}</div>
          <p className="text-sm font-normal text-slate-500 mt-0.5">{t("Share IBAN or payment link")}</p>
        </div>
      </Link>
    </div>
  );
}
