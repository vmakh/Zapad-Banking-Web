import { useSyncExternalStore } from "react";
import { getAccounts } from "./accounts";
import { readDemo, writeDemo } from "../utils/demoStorage";
import { allocationError, goalError } from "../utils/goalRules";
import { Plane, Shield, Monitor, Building2 } from "lucide-react";
import type { ProfileKind, SavingsGoal } from "./types";
const personalGoals: SavingsGoal[] = [
 {id:"vacation",name:"Holiday goal",icon:Plane,iconBg:"bg-sky-100",iconColor:"text-sky-600",current:1840,target:3000,barColor:"from-sky-400 to-blue-500"},
 {id:"emergency",name:"Emergency fund",icon:Shield,iconBg:"bg-teal-100",iconColor:"text-teal-700",current:760,target:1000,barColor:"from-emerald-400 to-teal-500"},
];
const businessGoals: SavingsGoal[] = [
 {id:"tax",name:"Tax reserve",icon:Building2,iconBg:"bg-amber-100",iconColor:"text-amber-700",current:16220,target:30000,barColor:"from-amber-400 to-orange-500"},
 {id:"equipment",name:"Hardware upgrade",icon:Monitor,iconBg:"bg-sky-100",iconColor:"text-sky-600",current:2400,target:5000,barColor:"from-sky-400 to-blue-500"},
];

const cache: Partial<Record<ProfileKind, SavingsGoal[]>> = {};
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export function savingsTotal(kind: ProfileKind) {
 return getAccounts(kind).filter(a => a.type === "Savings account" && a.currency === "EUR").reduce((sum,a) => sum+a.balance,0);
}
export function getGoals(kind: ProfileKind): SavingsGoal[] {
 if (!cache[kind]) {
  const seeds = kind === "business" ? businessGoals : personalGoals;
  const stored = readDemo<unknown>("goals:"+kind, null);
  const valid = Array.isArray(stored) && stored.length <= 50 && stored.every(g => g && typeof g.id === "string" && /^[a-zA-Z0-9-]+$/.test(g.id) && typeof g.name === "string" && typeof g.target === "number" && !goalError(g.name,String(g.target),g.current) && Number.isFinite(g.current) && g.current >= 0) && new Set(stored.map(g=>g.id)).size === stored.length && stored.reduce((sum,g)=>sum+g.current,0) <= savingsTotal(kind)+0.001;
  cache[kind] = valid ? stored.map(g => ({...(seeds.find(seed=>seed.id===g.id) ?? seeds[0]), id:g.id, name:g.name, target:g.target, current:g.current})) : seeds.map(g=>({...g}));
 }
 return cache[kind]!;
}
export function useGoals(kind: ProfileKind) { return useSyncExternalStore(subscribe,()=>getGoals(kind)); }
export function getGoalById(kind: ProfileKind,id:string) {return getGoals(kind).find(g=>g.id===id);}
export function unallocatedSavings(kind: ProfileKind) { return Math.max(0,Math.round((savingsTotal(kind)-getGoals(kind).reduce((sum,g)=>sum+g.current,0))*100)/100); }
function commit(kind: ProfileKind, goals: SavingsGoal[]) {
 if (!writeDemo("goals:"+kind,goals.map(({id,name,target,current})=>({id,name,target,current})))) return "Your browser could not save this change. Allow local storage and try again.";
 cache[kind] = goals; listeners.forEach(listener=>listener()); return "";
}
export function saveGoal(kind: ProfileKind, name: string, target: string, id?: string) {
 const goals=getGoals(kind); const existing=goals.find(g=>g.id===id);
 if (id && !existing) return "This goal no longer exists.";
 if (!id && goals.length>=50) return "This demo supports up to 50 goals.";
 const error=goalError(name,target,existing?.current??0); if(error) return error;
 const goal={...(existing??goals[0]??personalGoals[0]),id:existing?.id??crypto.randomUUID(),name:name.trim(),target:Number(target),current:existing?.current??0};
 return commit(kind,existing?goals.map(g=>g.id===id?goal:g):[...goals,goal]);
}
export function allocateGoal(kind: ProfileKind, id: string, amount: string, mode: "add"|"release") {
 const goals=getGoals(kind),goal=goals.find(g=>g.id===id);if(!goal)return "This goal no longer exists.";
 const error=allocationError(amount,mode,goal.current,goal.target,unallocatedSavings(kind));if(error)return error;
 return commit(kind,goals.map(g=>g.id===id?{...g,current:(Math.round(g.current*100)+(mode==="add"?1:-1)*Math.round(Number(amount)*100))/100}:g));
}
