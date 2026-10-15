import { useI18n } from "../../i18n/I18nProvider";
import { Link } from "react-router";
import { useAppProfile } from "../../hooks/useAppProfile";
import { profilePath } from "../../utils/paths";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";

interface ExchangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExchangeModal({ open, onOpenChange }: ExchangeModalProps) {
  const { t } = useI18n();
  const { profileSlug } = useAppProfile();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Currency exchange")}</DialogTitle>
          <DialogDescription>{t("Choose accounts and review illustrative rates on the exchange page. This demo does not convert real money.")}</DialogDescription>
        </DialogHeader>
        <Button asChild>
          <Link to={profilePath(profileSlug, "exchange")} onClick={() => onOpenChange(false)}>{t("Open exchange")}</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
