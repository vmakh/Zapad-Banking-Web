import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select,SelectTrigger,SelectValue,SelectContent,SelectGroup,SelectLabel,SelectItem,SelectSeparator } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup,RadioGroupItem } from '../components/ui/radio-group';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { Toggle } from '../components/ui/toggle';
import { ToggleGroup,ToggleGroupItem } from '../components/ui/toggle-group';
import { InputOTP,InputOTPGroup,InputOTPSlot,InputOTPSeparator } from '../components/ui/input-otp';
import { Calendar } from '../components/ui/calendar';
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage } from '../components/ui/form';
import { SpinnerGapIcon } from '@phosphor-icons/react/dist/csr/SpinnerGap';
import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { CheckIcon } from '@phosphor-icons/react/dist/csr/Check';
import type { DateRange } from 'react-day-picker';
import type { SpecimenProps } from './types';

export function Controls({sample,state}:SpecimenProps) {
  const disabled=state==='disabled';const invalid=state==='invalid';
  const [value,setValue]=useState(state==='filled'?'Alex Demo':'');
  const [selected,setSelected]=useState(state==='selected'?'savings':'main');
  const [open,setOpen]=useState(state==='open');
  const [checked,setChecked]=useState<boolean|'indeterminate'>(state==='indeterminate'?'indeterminate':state==='checked'||state==='on'||state==='selected');
  const [slider,setSlider]=useState(state==='range'?[25,75]:[45]);
  const [otp,setOtp]=useState(state==='filled'?'482123':'');
  const [date,setDate]=useState<Date|undefined>(state==='selected'?new Date(2026,4,15):undefined);
  const [range,setRange]=useState<DateRange|undefined>({from:new Date(2026,4,10),to:new Date(2026,4,16)});
  const [message,setMessage]=useState('');
  const form=useForm<{name:string}>({defaultValues:{name:state==='filled'?'Alex Demo':''}});
  if(sample==='button')return <div data-gallery-state={state} className="space-y-6">
    {state==='hover'||state==='focus'?<p className="text-sm text-muted-foreground">Pinned {state} specimen. Use your pointer or Tab to inspect actual interaction states.</p>:null}
    {state==='sizes'?<div className="flex flex-wrap items-center gap-3">{(['sm','default','lg','xl','2xl'] as const).map(size=><Button key={size} size={size} onClick={()=>setMessage(size)}>{size}</Button>)}<Button size="icon" aria-label="Add sample"><PlusIcon/></Button></div>:<div className="space-y-4">{(['default','secondary','outline','ghost','link','destructive'] as const).map(variant=><div key={variant} className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"><code className="text-xs text-muted-foreground">{variant}</code><Button variant={variant} disabled={disabled||state==='loading'} aria-busy={state==='loading'} onClick={()=>setMessage(`${variant} action selected`)}>{state==='loading'?<SpinnerGapIcon className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true"/>:null}{state==='loading'?'Loading…':variant==='destructive'?'Delete sample':'Continue'}</Button></div>)}</div>}
    <p role="status" className="text-sm text-muted-foreground">{message||'Actions affect only this specimen.'}</p>
  </div>;
  if(sample==='input')return <div data-gallery-state={state} className="space-y-6"><div className="space-y-2"><Label htmlFor="sample-name">Recipient name</Label><Input id="sample-name" value={value} onChange={event=>setValue(event.target.value)} disabled={disabled} aria-invalid={invalid} aria-describedby="sample-name-help" placeholder="Full name"/><p id="sample-name-help" role={invalid?'alert':undefined} className="text-sm text-muted-foreground">{invalid?'Enter the recipient’s full name.':'Illustrative input; nothing is submitted.'}</p></div><div className="space-y-2"><Label htmlFor="sample-note">Reference</Label><Textarea id="sample-note" placeholder="Payment reference" disabled={disabled} defaultValue={state==='filled'?'Invoice 2026-05':''}/></div></div>;
  if(sample==='select')return <div className="space-y-3"><Label htmlFor="sample-select">From account</Label><Select value={selected} onValueChange={setSelected} open={open} onOpenChange={setOpen} disabled={disabled}><SelectTrigger id="sample-select" aria-invalid={invalid}><SelectValue placeholder="Choose account"/></SelectTrigger><SelectContent><SelectGroup><SelectLabel>EUR accounts</SelectLabel><SelectItem value="main">Main account · EUR 28,430.18</SelectItem><SelectItem value="savings">Savings account · EUR 2,600.00</SelectItem></SelectGroup><SelectSeparator/><SelectGroup><SelectLabel>Other currencies</SelectLabel><SelectItem value="usd">USD account</SelectItem><SelectItem value="gbp" disabled>GBP account · unavailable</SelectItem></SelectGroup></SelectContent></Select><p className="text-sm text-muted-foreground">Selected value: {selected}</p></div>;
  if(sample==='checkbox')return <div className="space-y-4"><div className="flex items-center gap-3"><Checkbox id="sample-check" checked={checked} onCheckedChange={setChecked} disabled={disabled} aria-invalid={invalid}/><Label htmlFor="sample-check">Save this demo recipient</Label></div><p className="text-sm text-muted-foreground">State: {String(checked)}</p></div>;
  if(sample==='radio-group')return <RadioGroup value={selected} onValueChange={setSelected} disabled={disabled} aria-label="Funding account"><div className="flex items-center gap-3"><RadioGroupItem id="main-choice" value="main"/><Label htmlFor="main-choice">Main account</Label></div><div className="flex items-center gap-3"><RadioGroupItem id="savings-choice" value="savings"/><Label htmlFor="savings-choice">Savings account</Label></div></RadioGroup>;
  if(sample==='switch')return <div className="flex items-center gap-3"><Switch id="sample-switch" checked={checked===true} onCheckedChange={setChecked} disabled={disabled}/><Label htmlFor="sample-switch">Online card payments</Label></div>;
  if(sample==='slider')return <div className="space-y-5"><Label id="limit-label">Illustrative card limit</Label><Slider value={slider} onValueChange={setSlider} disabled={disabled} min={0} max={100} step={5} aria-labelledby="limit-label"/><output className="text-sm tabular-nums">{slider.join(' – ')}</output></div>;
  if(sample==='toggle')return <div className="space-y-5"><Toggle pressed={checked===true} onPressedChange={setChecked} disabled={disabled} aria-label="Select favourite"><CheckIcon className="size-4"/>Favourite</Toggle><ToggleGroup type="single" value={selected} onValueChange={setSelected} disabled={disabled} aria-label="Activity view"><ToggleGroupItem value="main">All</ToggleGroupItem><ToggleGroupItem value="savings">Outgoing</ToggleGroupItem><ToggleGroupItem value="incoming">Incoming</ToggleGroupItem></ToggleGroup></div>;
  if(sample==='input-otp')return <div className="space-y-4"><Label htmlFor="sample-otp">Demo confirmation code</Label><InputOTP id="sample-otp" maxLength={6} value={otp} onChange={setOtp} disabled={disabled}><InputOTPGroup>{[0,1,2].map(index=><InputOTPSlot key={index} index={index}/>)}</InputOTPGroup><InputOTPSeparator/><InputOTPGroup>{[3,4,5].map(index=><InputOTPSlot key={index} index={index}/>)}</InputOTPGroup></InputOTP><p className="text-sm text-muted-foreground">This specimen does not authenticate anyone.</p></div>;
  if(sample==='calendar')return state==='range'?<Calendar mode="range" selected={range} onSelect={setRange} defaultMonth={new Date(2026,4,1)} className="rounded-xl border w-fit"/>:<Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026,4,1)} disabled={disabled} className="rounded-xl border w-fit"/>;
  return <Form {...form}><form className="space-y-5" onSubmit={form.handleSubmit(()=>setMessage('Sample form validated. No bank request sent.'))}><FormField control={form.control} name="name" rules={{required:'Enter a recipient name.'}} render={({field})=><FormItem><FormLabel>Recipient name</FormLabel><FormControl><Input {...field} placeholder="Full name" aria-invalid={invalid||undefined}/></FormControl><FormDescription>Only the current specimen stores this value.</FormDescription><FormMessage>{invalid?'Enter a recipient name.':undefined}</FormMessage></FormItem>}/><Button type="submit">Validate sample</Button><p role="status" className="text-sm text-muted-foreground">{message}</p></form></Form>;
}
