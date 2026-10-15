import { localizedMerchant } from "../i18n/display";
import { useI18n } from "../i18n/I18nProvider";
import { Link, useSearchParams } from "react-router";
import { getTransactions } from "../data/transactions";
import { profilePath } from "../utils/paths";
import { cn } from "../components/ui/utils";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { ChatCircleIcon as MessageCircle } from "@phosphor-icons/react/dist/csr/ChatCircle";
import { PhoneIcon as Phone } from "@phosphor-icons/react/dist/csr/Phone";
import { EnvelopeSimpleIcon as Mail } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { toast } from "sonner";
import { useAppProfile } from "../hooks/useAppProfile";
import { PAGE_MAX_WIDTH } from "../utils/paths";

const FAQ = [
  {
    q: "How do I preview a transfer?",
    a: "Open Payments → New recipient for an IBAN, or choose a saved recipient. Review the full details before confirming a local preview. Find its reference in Activity → Local previews; no money is sent.",
  },
  {
    q: "Where can I view sample statements?",
    a: "Go to Statements in the sidebar or tap a statement notification in your Inbox. You can filter by account and month. Open a sample statement and choose Download CSV to save its posted activity.",
  },
  {
    q: "How do I freeze my card?",
    a: "Open Cards, select your card, and tap Freeze to preview the frozen state. This only changes a demo preference on this device and cannot protect or block a real card.",
  },
  {
    q: "What are the transfer limits?",
    a: "The preview checks your entered amount against the selected demo account balance. Real bank transfer limits are not represented.",
  },
];

export function HelpPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const { profile, isBusiness } = useAppProfile();
  const transaction = getTransactions(profile.kind).find(tx => tx.id === params.get("transaction"));
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-primary-foreground";

  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div>
        <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">
          {t("Help & support")}
        </h1>
        <p className="text-base font-normal text-slate-500 mt-1.5">
          {t("Demo help and support previews for {name}", { name: profile.name })}
        </p>
      </div>

      {params.has("transaction") && <section data-bank-surface className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold">{t("Unrecognized payment")}</h2>
        <p className="text-sm">{transaction ? localizedMerchant(transaction.merchant) : t("Transaction unavailable")} · {t("Reference {reference}", { reference: `ZB-${profile.kind === "business" ? "B" : "P"}-${params.get("transaction")}` })}</p>
        <p className="text-sm text-muted-foreground">{t("Check the merchant name and any pending authorization first. If you suspect misuse, freeze the relevant card and contact your bank through a verified channel. This prototype cannot file a dispute, contact support or protect a real card.")}</p>
        <Button variant="outline" asChild><Link to={profilePath(profile.kind,"cards")}>{t("Manage cards")}</Link></Button>
        <Button variant="ghost" asChild><Link to={profilePath(profile.kind,`transactions?transaction=${encodeURIComponent(params.get("transaction") ?? "")}`)}>{t("Back to transaction")}</Link></Button>
      </section>}
      <Card className="p-6 md:p-8 border-slate-200/60 rounded-4xl">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">{t("Frequently asked questions")}</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="font-medium text-slate-900 text-left">
                {t(item.q)}
              </AccordionTrigger>
              <AccordionContent className="text-sm font-normal text-slate-500 leading-relaxed">
                {t(item.a)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-6 border-slate-200/60 rounded-4xl">
          <div className="flex items-center gap-4 mb-3">
            <div data-slot="functional-icon" className={cn("size-12 rounded-lg", brandBg, brandText, "flex items-center justify-center")}>
              <Phone className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{t("Phone")}</h3>
              <p className="text-sm font-normal text-slate-500">{t("Support channel preview")}</p>
            </div>
          </div>
          <p className="text-lg font-medium text-slate-900 mb-4">{t("Phone support is not connected")}</p>
          <Button variant="outline" className="w-full h-12 px-6 font-medium rounded-lg" onClick={() => toast.info(t("Phone support is unavailable in this demo."))}>
            {t("Preview phone support")}
          </Button>
        </Card>

        <Card className="p-6 border-slate-200/60 rounded-4xl">
          <div className="flex items-center gap-4 mb-3">
            <div data-slot="functional-icon" className={cn("size-12 rounded-lg", brandBg, brandText, "flex items-center justify-center")}>
              <MessageCircle className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{t("Live chat")}</h3>
              <p className="text-sm font-normal text-slate-500">{t("Mock in-app chat")}</p>
            </div>
          </div>
          <p className="text-sm font-normal text-slate-500 mb-4">
            {t("Explore the support entry point. No agent is connected in this prototype.")}
          </p>
          <Button
            className={cn("w-full font-medium rounded-lg", brandBg, brandText)}
            onClick={() => toast.info(t("Support preview"), { description: t("Live chat is not connected in this demo.") })}
          >
            {t("Start chat")}
          </Button>
        </Card>

        <Card className="p-6 border-slate-200/60 rounded-4xl md:col-span-2">
          <div className="flex items-center gap-4 mb-3">
            <div data-slot="functional-icon" className="size-12 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Mail className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{t("Email")}</h3>
              <p className="text-sm font-normal text-slate-500">{t("Non-urgent requests")}</p>
            </div>
          </div>
          <p className="font-medium text-slate-900">{t("Email support is not connected in this demo")}</p>
        </Card>
      </div>
    </div>
  );
}
