import { normalizeDecimalInput } from "../../utils/decimalInput";
import { localizedGoalName } from "../../i18n/display";
import { useI18n } from "../../i18n/I18nProvider";
import { cn } from "../ui/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import { useGoals, saveGoal, allocateGoal, unallocatedSavings } from "../../data/goals";
import type { ProfileKind } from "../../data/types";
import { formatMoney } from "../../utils/format";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { allocationError, goalError } from "../../utils/goalRules";

export function GoalDialog({kind,goalId,onClose}:{kind:ProfileKind;goalId?:string;onClose:()=>void}) {
  const { t } = useI18n();
 const goals=useGoals(kind),goal=goals.find(g=>g.id===goalId);
 const {isPrivate}=usePrivacy();
 const [mode,setMode]=useState<"details"|"edit"|"add"|"release">(goal?"details":"edit");
 const [name,setName]=useState(goal?.name??"");
 const [target,setTarget]=useState(String(goal?.target??""));
 const [amount,setAmount]=useState("");
 const [error,setError]=useState("");
 const [invalidField,setInvalidField]=useState<"name"|"target"|"amount"|null>(null);
 const [focusRequest,setFocusRequest]=useState<{field:"name"|"target"|"amount"}|null>(null);
 useEffect(()=>{if(focusRequest) document.getElementById(`goal-${focusRequest.field}`)?.focus();},[focusRequest]);
 const brand=kind==="business"?"bg-brand-business hover:bg-brand-business-dark":"bg-brand-personal hover:bg-brand-personal-dark";
 const available=unallocatedSavings(kind);
 const titleRef=useRef<HTMLHeadingElement>(null);
 const changeMode=(next:typeof mode)=>{
  setMode(next);setError("");setInvalidField(null);setAmount("");
  requestAnimationFrame(()=>{
   if(next==="details") titleRef.current?.focus();
   else document.getElementById(next==="edit"?"goal-name":"goal-amount")?.focus();
  });
 };
 const money=(value:number)=>isPrivate?"•••":formatMoney(value);
 const submit=()=>{
  const issue=mode==="edit"?saveGoal(kind,name,normalizeDecimalInput(target),goal?.id):allocateGoal(kind,goal!.id,normalizeDecimalInput(amount),mode as "add"|"release");
  if(issue){
   setError(issue);
   const validation=mode==="edit"?goalError(name,normalizeDecimalInput(target),goal?.current??0):allocationError(normalizeDecimalInput(amount),mode as "add"|"release",goal!.current,goal!.target,available);
   const field=validation===issue?(mode==="edit"?(!name.trim()||name.trim().length>60?"name":"target"):"amount"):null;
   setInvalidField(field);
   if(field) setFocusRequest({field});
   return;
  }
  toast.success(t(mode==="edit"?(goal?"Goal updated":"Goal created"):mode==="add"?"Added to goal":"Released to savings"),{description:t("Saved on this device. No money moved between bank accounts.")});
  if(!goal){onClose();return;}changeMode("details");
 };
 return <Dialog open onOpenChange={open=>!open&&onClose()}><DialogContent className="sm:max-w-lg">
  <DialogHeader><DialogTitle ref={titleRef} tabIndex={-1} className="wrap-anywhere">{mode==="details" && goal ? localizedGoalName(goal) : t(mode==="edit"?(goal?"Edit goal":"Create a savings goal"):mode==="add"?"Add to goal":"Release from goal")}</DialogTitle><DialogDescription>{t("Organise your existing EUR savings. Changes are saved in this browser.")}</DialogDescription></DialogHeader>
  {goal && mode==="details" ? <>
   <div className="goal-balance"><span>{t("Saved toward your goal")}</span><strong>{money(goal.current)}</strong><span>{t("of {amount}", { amount: money(goal.target) })}</span></div>
   <Progress aria-label={t("Goal progress")} value={Math.min(100,Math.round(goal.current/goal.target*100))} />
   <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-600"><span>{t("{progress}% complete", { progress: Math.round(goal.current/goal.target*100) })}</span><span>{t("{amount} to go", { amount: money(Math.max(0,goal.target-goal.current)) })}</span></div>
   <p className="text-sm text-slate-600">{t("Unallocated savings: {amount}. Your total savings balance stays the same.", { amount: money(available) })}</p>
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Button variant="outline" disabled={goal.current===0} onClick={()=>changeMode("release")}>{t("Release money")}</Button><Button className={cn(brand, "text-primary-foreground")} disabled={available<=0||goal.current>=goal.target} onClick={()=>changeMode("add")}>{t("Add money")}</Button></div>
   {available<=0&&<p className="text-sm text-slate-600">{t("All savings are allocated. Release money from a goal before adding more.")}</p>}
   {goal.current>=goal.target&&<p role="status" className="text-sm text-emerald-700">{t("Goal reached. You can increase your target or release the savings.")}</p>}
   <Button variant="ghost" onClick={()=>changeMode("edit")}>{t("Edit goal")}</Button>
  </> : <form onSubmit={e=>{e.preventDefault();submit();}} className="space-y-5">
   {mode==="edit"?<>
    <div className="space-y-2"><Label htmlFor="goal-name">{t("Goal name")}</Label><Input id="goal-name" maxLength={60} value={name} aria-invalid={invalidField==="name"&&!!error} aria-describedby={invalidField==="name"&&error?"goal-error":undefined} onChange={e=>{setName(e.target.value);setError("");setInvalidField(null);}} placeholder={t("e.g. Summer holiday")} /></div>
    <div className="space-y-2"><Label htmlFor="goal-target">{t("Target amount (EUR)")}</Label><Input id="goal-target" inputMode="decimal" value={target} aria-invalid={invalidField==="target"&&!!error} aria-describedby={invalidField==="target"&&error?"goal-error":undefined} onChange={e=>{setTarget(e.target.value);setError("");setInvalidField(null);}} placeholder="3000.00" /></div>
    {!goal&&<p className="text-sm text-slate-600">{t("Start with €0. You can allocate savings after creating your goal.")}</p>}
   </>:<>
    <p className="text-sm text-slate-600">{goal ? localizedGoalName(goal) : ""} · {mode==="add"?t("{amount} available to allocate", { amount: money(available) }):t("{amount} available to release", { amount: money(goal?.current??0) })}</p>
    <div className="space-y-2"><Label htmlFor="goal-amount">{t("Amount (EUR)")}</Label><Input id="goal-amount" inputMode="decimal" value={amount} onChange={e=>{setAmount(e.target.value);setError("");setInvalidField(null);}} aria-invalid={invalidField==="amount"&&!!error} aria-describedby={invalidField==="amount"&&error?"goal-error":undefined} placeholder="0.00" /></div>
    <p className="text-sm text-slate-600">{t("This changes your goal allocation, not your bank balance.")}</p>
   </>}
   {error&&<p id="goal-error" role="alert" className="text-sm text-red-700">{t(error)}</p>}
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Button type="button" variant="outline" onClick={()=>goal?changeMode("details"):onClose()}>{t("Cancel")}</Button><Button type="submit" className={cn(brand, "text-primary-foreground")}>{t(mode==="edit"?(goal?"Save goal":"Create goal"):mode==="add"?"Confirm allocation":"Confirm release")}</Button></div>
  </form>}
 </DialogContent></Dialog>;
}
