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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ChevronRight, Eye, EyeOff, Shield } from "lucide-react";
import { useAppProfile } from "../hooks/useAppProfile";
import { usePrivacy } from "../contexts/PrivacyContext";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";

export function SettingsPage() {
  const { profile, profileSlug, isBusiness } = useAppProfile();
  const { isPrivate, togglePrivacy } = usePrivacy();
  const [resetOpen,setResetOpen]=useState(false);
  const [preferences,setPreferences]=useState<Record<string,boolean>>(()=>{
    const saved=readDemo<unknown>("notifications:"+profile.kind,{});
    return Object.fromEntries(Object.entries({tx:true,security:true,marketing:false}).map(([key,value])=>[key,saved&&typeof saved==="object"&&typeof (saved as Record<string,unknown>)[key]==="boolean"?(saved as Record<string,boolean>)[key]:value]));
  });
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-white";

  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div>
        <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-base font-normal text-slate-500 mt-1.5">
          Preferences for {profile.name}
        </p>
      </div>

      <Card className="p-6 md:p-8 border-slate-200/60 rounded-4xl space-y-6">
        <div className="space-y-2">
          <Label id="language-label" className="text-xs font-medium uppercase tracking-widest text-slate-500">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger aria-labelledby="language-label" className="h-12 px-3 rounded-lg font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>

            </SelectContent>
          </Select>
          <p className="text-sm text-slate-500">This prototype is available in English.</p>
        </div>

        <div id="notifications" className="border-t border-slate-100 pt-6 space-y-3 scroll-mt-24">
          <h2 className="font-semibold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-600">Demo preferences saved on this device. No notifications are sent.</p>
          {[
            { id: "tx", label: "Transaction alerts", default: true },
            { id: "security", label: "Security alerts", default: true },
            { id: "marketing", label: "Product updates", default: false },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <Label htmlFor={`notification-${item.id}`} className="font-semibold text-slate-700">
                {item.label}
              </Label>
              <Switch id={`notification-${item.id}`} checked={preferences[item.id]} onCheckedChange={checked=>{const next={...preferences,[item.id]:checked};if(writeDemo("notifications:"+profile.kind,next)){setPreferences(next);toast.success("Preference saved");}else toast.error("Your browser could not save this preference");}} />
            </div>
          ))}
        </div>

        <div id="security" className="border-t border-slate-100 pt-6 space-y-4 scroll-mt-24">
          <h2 className="font-semibold text-slate-900">Privacy & security</h2>
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border">
            <div className="flex min-w-0 items-center gap-3">
              <div className="size-10 shrink-0 rounded-lg bg-muted text-muted-foreground flex items-center justify-center" aria-hidden="true">
                {isPrivate ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </div>
              <div>
                <p className="font-medium text-slate-900">Hide balances</p>
                <p className="text-sm font-normal text-slate-500">Mask amounts across the app</p>
              </div>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={togglePrivacy}
              aria-label="Mask balances across the app"
            />
          </div>

          <Link
            to={profilePath(profileSlug, "help")}
            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border hover:bg-muted transition-colors group"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="size-10 shrink-0 rounded-lg bg-muted text-muted-foreground flex items-center justify-center" aria-hidden="true">
                <Shield className="size-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Security help</p>
                <p className="text-sm font-normal text-slate-500">Read support information</p>
              </div>
            </div>
            <ChevronRight className="size-5 shrink-0 text-slate-400 group-hover:text-slate-600" />
          </Link>
        </div>
      </Card>
      <Card className="p-6 md:p-8 space-y-4"><h2 className="text-lg font-semibold">Demo workspace</h2><p className="text-sm text-slate-600">Goals, card controls, notes and notification preferences for this profile are saved in this browser. Reset them to explore the original sample again.</p><Button variant="outline" onClick={()=>setResetOpen(true)}>Reset saved changes</Button></Card>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}><DialogContent><DialogHeader><DialogTitle>Reset {profile.name}’s demo?</DialogTitle><DialogDescription>This removes saved goals, card controls, notes and notification preferences for this profile. Your other profile is unchanged.</DialogDescription></DialogHeader><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><Button variant="outline" onClick={()=>setResetOpen(false)}>Keep changes</Button><Button onClick={()=>{if(resetDemoProfile(profile.kind)) window.location.reload();else toast.error("Your browser could not reset the demo");}}>Reset demo</Button></div></DialogContent></Dialog>
    </div>
  );
}
