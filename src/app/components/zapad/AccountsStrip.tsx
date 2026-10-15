import { useI18n } from "../../i18n/I18nProvider";
import { CurrencyMark } from "./CurrencyIcon";
import { Link } from "react-router";
import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { PlusIcon as Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { usePrivacy } from "../../contexts/PrivacyContext";
import type { BankAccount, ProfileSlug } from "../../data/types";
import { accountPath, profilePath } from "../../utils/paths";
import { formatMoney } from "../../utils/format";
export function AccountsStrip({accounts, profileSlug}: {accounts: BankAccount[]; profileSlug: ProfileSlug}) {
  const { t } = useI18n();
 const {isPrivate} = usePrivacy();
 return <section className="dashboard-accounts" aria-label={t("Accounts")}>
  <div className="accounts-heading"><h2>{t("Accounts")}</h2><Link to={profilePath(profileSlug,"accounts?open=new")}><Plus size={16}/>{t("Add account")}</Link></div>
  <div data-section="accounts">{accounts.map(a => <Link key={a.id} to={accountPath(profileSlug,a.id)} className="account-row">
   <CurrencyMark currency={a.currency} /><span className="account-name">{t(a.name)}<small>{a.ibanShort}</small></span>
   <strong>{isPrivate ? "••••••" : formatMoney(a.balance,a.currency)}</strong><ArrowUpRight size={16}/>
  </Link>)}</div>
 </section>;
}
