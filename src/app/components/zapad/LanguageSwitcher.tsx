import { toast } from "sonner";
import { useI18n } from "../../i18n/I18nProvider";
import { locales } from "../../i18n/locales";
import { t as translateCurrent } from "../../i18n/runtime";
import { buttonVariants } from "../ui/button";
import { cn } from "../ui/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, t, setLocale } = useI18n();
  const selectedLanguage = locales.find(item => item.id === locale)!;
  const onChange = (value: string) => {
    if (!setLocale(value)) toast.info(translateCurrent("Language changed for this visit. Your browser could not save the preference."));
  };
  if (compact) return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-11 shrink-0 rounded-full text-slate-600")} aria-label={`${t("Change language")}: ${selectedLanguage.name}`} title={selectedLanguage.name}>
          <span className="text-xs font-semibold" lang={locale} aria-hidden="true">{selectedLanguage.short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto">
        <DropdownMenuRadioGroup value={locale} onValueChange={onChange}>
          {locales.map(item => <DropdownMenuRadioItem key={item.id} value={item.id} lang={item.id}>{item.name}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  return <Select value={locale} onValueChange={onChange}>
    <SelectTrigger aria-labelledby="language-label" className="h-12 px-3 rounded-lg font-medium"><SelectValue /></SelectTrigger>
    <SelectContent>{locales.map(item => <SelectItem key={item.id} value={item.id} lang={item.id}>{item.name}</SelectItem>)}</SelectContent>
  </Select>;
}
