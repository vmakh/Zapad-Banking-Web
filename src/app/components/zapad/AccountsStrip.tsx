import { CurrencyMark } from "./CurrencyIcon";
import { Link } from "react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { usePrivacy } from "../../contexts/PrivacyContext";
import type { BankAccount, ProfileSlug } from "../../data/types";
import { accountPath, profilePath } from "../../utils/paths";
import { formatMoney } from "../../utils/format";
export function AccountsStrip({accounts, profileSlug}: {accounts: BankAccount[]; profileSlug: ProfileSlug}) {
 const {isPrivate} = usePrivacy();
 return <section className="dashboard-accounts" aria-label="Accounts">
  <div className="accounts-heading"><h2>Accounts</h2><Link to={profilePath(profileSlug,"accounts?open=new")}><Plus size={16}/>Add account</Link></div>
  <div data-section="accounts">{accounts.map(a => <Link key={a.id} to={accountPath(profileSlug,a.id)} className="account-row">
   <CurrencyMark currency={a.currency} /><span className="account-name">{a.name}<small>{a.ibanShort}</small></span>
   <strong>{isPrivate ? "••••••" : formatMoney(a.balance,a.currency)}</strong><ArrowUpRight size={16}/>
  </Link>)}</div>
 </section>;
}
