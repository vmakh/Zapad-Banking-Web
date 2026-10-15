import { useI18n } from "../i18n/I18nProvider";
import { cn } from "../components/ui/utils";
import { useState } from "react";
import { toast } from "sonner";
import { readDemo, writeDemo, resetDemoProfile } from "../utils/demoStorage";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { LanguageSwitcher } from "../components/zapad/LanguageSwitcher";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/csr/CaretRight";
import { EyeIcon as Eye } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeSlashIcon as EyeOff } from "@phosphor-icons/react/dist/csr/EyeSlash";
import { ShieldIcon as Shield } from "@phosphor-icons/react/dist/csr/Shield";
import { useAppProfile } from "../hooks/useAppProfile";
import { usePrivacy } from "../contexts/PrivacyContext";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";

export function SettingsPage() {
  const { t, intlLocale } = useI18n();
  const { profile, profileSlug, isBusiness } = useAppProfile();
  const { isPrivate, togglePrivacy } = usePrivacy();
  const [resetOpen,setResetOpen]=useState(false);
  const [preferences,setPreferences]=useState<Record<string,boolean>>(()=>{
    const saved=readDemo<unknown>("notifications:"+profile.kind,{});
    return Object.fromEntries(Object.entries({tx:true,security:true,marketing:false}).map(([key,value])=>[key,saved&&typeof saved==="object"&&typeof (saved as Record<string,unknown>)[key]==="boolean"?(saved as Record<string,boolean>)[key]:value]));
  });
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-primary-foreground";

  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div>
        <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">{t("Settings")}</h1>
        <p className="text-base font-normal text-slate-500 mt-1.5">{t("Preferences for {name}", { name: profile.name })}
        </p>
      </div>

      <Card className="p-6 md:p-8 border-slate-200/60 rounded-4xl space-y-6">
        <div className="space-y-2">
          <Label id="language-label" className="text-xs font-medium uppercase tracking-widest text-slate-500">{t("Language")}</Label>
          <LanguageSwitcher />
          <p className="text-sm text-slate-500">{t("The language is shared by both profiles and saved on this device.")}</p>
        </div>

        <div id="notifications" tabIndex={-1} className="border-t border-slate-100 pt-6 space-y-3 scroll-mt-24">
          <h2 className="font-semibold text-slate-900">{t("Notifications")}</h2>
          <p className="text-sm text-slate-600">{t("Demo preferences saved on this device. No notifications are sent.")}</p>
          {[
            { id: "tx", label: "Transaction alerts", default: true },
            { id: "security", label: "Security alerts", default: true },
            { id: "marketing", label: "Product updates", default: false },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <Label htmlFor={`notification-${item.id}`} className="font-semibold text-slate-700">
                {t(item.label)}
              </Label>
              <Switch id={`notification-${item.id}`} checked={preferences[item.id]} onCheckedChange={checked=>{const next={...preferences,[item.id]:checked};if(writeDemo("notifications:"+profile.kind,next)){setPreferences(next);toast.success(t("Preference saved"));}else toast.error(t("Your browser could not save this preference"));}} />
            </div>
          ))}
        </div>

        <div id="security" tabIndex={-1} className="border-t border-slate-100 pt-6 space-y-4 scroll-mt-24">
          <h2 className="font-semibold text-slate-900">{t("Privacy & security")}</h2>
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border">
            <div className="flex min-w-0 items-center gap-3">
              <div data-slot="functional-icon" className="size-10 shrink-0 rounded-lg bg-muted text-muted-foreground flex items-center justify-center" aria-hidden="true">
                {isPrivate ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </div>
              <div>
                <p className="font-medium text-slate-900">{t("Hide balances")}</p>
                <p className="text-sm font-normal text-slate-500">{t("Mask amounts across the app")}</p>
              </div>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={togglePrivacy}
              aria-label={t("Mask balances across the app")}
            />
          </div>

          <Link
            to={profilePath(profileSlug, "help")}
            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border hover:bg-muted transition-colors group"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div data-slot="functional-icon" className="size-10 shrink-0 rounded-lg bg-muted text-muted-foreground flex items-center justify-center" aria-hidden="true">
                <Shield className="size-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{t("Security help")}</p>
                <p className="text-sm font-normal text-slate-500">{t("Read support information")}</p>
              </div>
            </div>
            <ChevronRight className="size-5 shrink-0 text-slate-400 group-hover:text-slate-600" />
          </Link>
        </div>
      </Card>
      <Card className="p-6 md:p-8 space-y-4"><h2 className="text-lg font-semibold">{t("Demo workspace")}</h2><p className="text-sm text-slate-600">{t("Goals, card controls, notes, notification preferences, saved recipients, transfer drafts and local previews for this profile are saved in this browser. Reset them to explore the original sample again.")}</p><Button variant="outline" onClick={()=>setResetOpen(true)}>{t("Reset saved changes")}</Button></Card>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}><DialogContent><DialogHeader><DialogTitle>{t("Reset {name}’s demo?", { name: profile.name })}</DialogTitle><DialogDescription>{t("This removes saved goals, card controls, notes, notification preferences, recipients, transfer drafts and local previews for this profile. Your other profile is unchanged.")}</DialogDescription></DialogHeader><div data-form-actions className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Button variant="outline" onClick={()=>setResetOpen(false)}>{t("Keep changes")}</Button><Button onClick={()=>{if(resetDemoProfile(profile.kind)) window.location.reload();else toast.error(t("Your browser could not reset the demo"));}}>{t("Reset demo")}</Button></div></DialogContent></Dialog>
    </div>
  );
}
