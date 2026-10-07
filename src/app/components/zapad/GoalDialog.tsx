import { cn } from "../ui/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useGoals, saveGoal, allocateGoal, unallocatedSavings } from "../../data/goals";
import type { ProfileKind } from "../../data/types";
import { formatMoney } from "../../utils/format";
import { usePrivacy } from "../../contexts/PrivacyContext";

export function GoalDialog({kind,goalId,onClose}:{kind:ProfileKind;goalId?:string;onClose:()=>void}) {
 const goals=useGoals(kind),goal=goals.find(g=>g.id===goalId);
 const {isPrivate}=usePrivacy();
 const [mode,setMode]=useState<"details"|"edit"|"add"|"release">(goal?"details":"edit");
 const [name,setName]=useState(goal?.name??"");
 const [target,setTarget]=useState(String(goal?.target??""));
 const [amount,setAmount]=useState("");
 const [error,setError]=useState("");
 const brand=kind==="business"?"bg-brand-business hover:bg-brand-business-dark":"bg-brand-personal hover:bg-brand-personal-dark";
 const available=unallocatedSavings(kind);
 const changeMode=(next:typeof mode)=>{setMode(next);setError("");setAmount("");};
 const money=(value:number)=>isPrivate?"•••":formatMoney(value);
 const submit=()=>{
  const issue=mode==="edit"?saveGoal(kind,name,target,goal?.id):allocateGoal(kind,goal!.id,amount,mode as "add"|"release");
  if(issue){setError(issue);return;}
  toast.success(mode==="edit"?(goal?"Goal updated":"Goal created"):mode==="add"?"Added to goal":"Released to savings",{description:"Saved on this device. No money moved between bank accounts."});
  if(!goal){onClose();return;}changeMode("details");
 };
 return <Dialog open onOpenChange={open=>!open&&onClose()}><DialogContent className="sm:max-w-lg">
  <DialogHeader><DialogTitle className="wrap-anywhere">{mode==="edit"?(goal?"Edit goal":"Create a savings goal"):mode==="add"?"Add to goal":mode==="release"?"Release from goal":goal?.name}</DialogTitle><DialogDescription>Organise your existing EUR savings. Changes are saved in this browser.</DialogDescription></DialogHeader>
  {goal && mode==="details" ? <>
   <div className="goal-balance"><span>Saved toward your goal</span><strong>{money(goal.current)}</strong><span>of {money(goal.target)}</span></div>
   <div className="goal-progress" role="progressbar" aria-label="Goal progress" aria-valuenow={Math.min(100,Math.round(goal.current/goal.target*100))} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${Math.min(100,goal.current/goal.target*100)}%`}} /></div>
   <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-600"><span>{Math.round(goal.current/goal.target*100)}% complete</span><span>{money(Math.max(0,goal.target-goal.current))} to go</span></div>
   <p className="text-sm text-slate-600">Unallocated savings: <strong>{money(available)}</strong>. Your total savings balance stays the same.</p>
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Button variant="outline" disabled={goal.current===0} onClick={()=>changeMode("release")}>Release money</Button><Button className={cn(brand, "text-white")} disabled={available<=0||goal.current>=goal.target} onClick={()=>changeMode("add")}>Add money</Button></div>
   {available<=0&&<p className="text-sm text-slate-600">All savings are allocated. Release money from a goal before adding more.</p>}
   {goal.current>=goal.target&&<p role="status" className="text-sm text-emerald-700">Goal reached. You can increase your target or release the savings.</p>}
   <Button variant="ghost" onClick={()=>changeMode("edit")}>Edit goal</Button>
  </> : <form onSubmit={e=>{e.preventDefault();submit();}} className="space-y-5">
   {mode==="edit"?<>
    <div className="space-y-2"><Label htmlFor="goal-name">Goal name</Label><Input id="goal-name" maxLength={60} value={name} onChange={e=>{setName(e.target.value);setError("");}} placeholder="e.g. Summer holiday" autoFocus /></div>
    <div className="space-y-2"><Label htmlFor="goal-target">Target amount (EUR)</Label><Input id="goal-target" inputMode="decimal" value={target} onChange={e=>{setTarget(e.target.value);setError("");}} placeholder="3000.00" /></div>
    {!goal&&<p className="text-sm text-slate-600">Start with €0. You can allocate savings after creating your goal.</p>}
   </>:<>
    <p className="text-sm text-slate-600">{goal?.name} · {mode==="add"?`${money(available)} available to allocate`:`${money(goal?.current??0)} available to release`}</p>
    <div className="space-y-2"><Label htmlFor="goal-amount">Amount (EUR)</Label><Input id="goal-amount" inputMode="decimal" autoFocus value={amount} onChange={e=>{setAmount(e.target.value);setError("");}} aria-invalid={!!error} aria-describedby={error?"goal-error":undefined} placeholder="0.00" /></div>
    <p className="text-sm text-slate-600">This changes your goal allocation, not your bank balance.</p>
   </>}
   {error&&<p id="goal-error" role="alert" className="text-sm text-red-700">{error}</p>}
   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Button type="button" variant="outline" onClick={()=>goal?changeMode("details"):onClose()}>Cancel</Button><Button type="submit" className={cn(brand, "text-white")}>{mode==="edit"?(goal?"Save goal":"Create goal"):mode==="add"?"Confirm allocation":"Confirm release"}</Button></div>
  </form>}
 </DialogContent></Dialog>;
}
