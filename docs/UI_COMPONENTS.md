# UI component registry

Generated with npm run generate:ui-registry. React/Vite, Tailwind 4. Alias @/ maps to src/. Use shared cn() from @/app/components/ui/utils. Theme: src/styles/theme.css and src/styles/design-system.css.

## Exported components (267)

| Назва | Шлях імпорту (від src) | Ключові Props / успадкований API | Використання |
| --- | --- | --- | --- |
| ImageWithFallback | `@/app/components/figma/ImageWithFallback` | React.ImgHTMLAttributes<HTMLImageElement> | Image With Fallback; API — [джерело](../src/app/components/figma/ImageWithFallback.tsx#L7) |
| RootLayout | `@/app/components/layout/RootLayout` | Немає | Root Layout; API — [джерело](../src/app/components/layout/RootLayout.tsx#L13) |
| ProfileRedirect | `@/app/components/routing/ProfileRedirect` | Немає | Profile Redirect; API — [джерело](../src/app/components/routing/ProfileRedirect.tsx#L16) |
| Accordion | `@/app/components/ui/accordion` | React.ComponentProps<typeof AccordionPrimitive.Root> | Розкривні секції; API — [джерело](../src/app/components/ui/accordion.tsx#L9) |
| AccordionItem | `@/app/components/ui/accordion` | React.ComponentProps<typeof AccordionPrimitive.Item> | Розкривні секції; API — [джерело](../src/app/components/ui/accordion.tsx#L15) |
| AccordionTrigger | `@/app/components/ui/accordion` | React.ComponentProps<typeof AccordionPrimitive.Trigger> | Розкривні секції; API — [джерело](../src/app/components/ui/accordion.tsx#L28) |
| AccordionContent | `@/app/components/ui/accordion` | React.ComponentProps<typeof AccordionPrimitive.Content> | Розкривні секції; API — [джерело](../src/app/components/ui/accordion.tsx#L50) |
| AlertDialog | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Root> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L9) |
| AlertDialogTrigger | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Trigger> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L15) |
| AlertDialogPortal | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Portal> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L23) |
| AlertDialogOverlay | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Overlay> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L31) |
| AlertDialogContent | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Content> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L47) |
| AlertDialogHeader | `@/app/components/ui/alert-dialog` | React.ComponentProps<"div"> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L66) |
| AlertDialogFooter | `@/app/components/ui/alert-dialog` | React.ComponentProps<"div"> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L79) |
| AlertDialogTitle | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Title> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L95) |
| AlertDialogDescription | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Description> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L108) |
| AlertDialogAction | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Action> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L121) |
| AlertDialogCancel | `@/app/components/ui/alert-dialog` | React.ComponentProps<typeof AlertDialogPrimitive.Cancel> | Підтвердження важливої дії; API — [джерело](../src/app/components/ui/alert-dialog.tsx#L133) |
| Alert | `@/app/components/ui/alert` | React.ComponentProps<"div"> & VariantProps<typeof alertVariants> | Повідомлення про стан; API — [джерело](../src/app/components/ui/alert.tsx#L22) |
| AlertTitle | `@/app/components/ui/alert` | React.ComponentProps<"div"> | Повідомлення про стан; API — [джерело](../src/app/components/ui/alert.tsx#L37) |
| AlertDescription | `@/app/components/ui/alert` | React.ComponentProps<"div"> | Повідомлення про стан; API — [джерело](../src/app/components/ui/alert.tsx#L50) |
| AspectRatio | `@/app/components/ui/aspect-ratio` | React.ComponentProps<typeof AspectRatioPrimitive.Root> | Стабільне співвідношення сторін; API — [джерело](../src/app/components/ui/aspect-ratio.tsx#L5) |
| Avatar | `@/app/components/ui/avatar` | React.ComponentProps<typeof AvatarPrimitive.Root> | Зображення користувача та fallback; API — [джерело](../src/app/components/ui/avatar.tsx#L8) |
| AvatarImage | `@/app/components/ui/avatar` | React.ComponentProps<typeof AvatarPrimitive.Image> | Зображення користувача та fallback; API — [джерело](../src/app/components/ui/avatar.tsx#L24) |
| AvatarFallback | `@/app/components/ui/avatar` | React.ComponentProps<typeof AvatarPrimitive.Fallback> | Зображення користувача та fallback; API — [джерело](../src/app/components/ui/avatar.tsx#L37) |
| Badge | `@/app/components/ui/badge` | React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean } | Позначка стану; API — [джерело](../src/app/components/ui/badge.tsx#L28) |
| Breadcrumb | `@/app/components/ui/breadcrumb` | React.ComponentProps<"nav"> | Навігаційний шлях; API — [джерело](../src/app/components/ui/breadcrumb.tsx#L7) |
| BreadcrumbList | `@/app/components/ui/breadcrumb` | React.ComponentProps<"ol"> | Навігаційний шлях; API — [джерело](../src/app/components/ui/breadcrumb.tsx#L11) |
| BreadcrumbItem | `@/app/components/ui/breadcrumb` | React.ComponentProps<"li"> | Навігаційний шлях; API — [джерело](../src/app/components/ui/breadcrumb.tsx#L24) |
| BreadcrumbLink | `@/app/components/ui/breadcrumb` | React.ComponentProps<"a"> & { asChild?: boolean; } | Навігаційний шлях; API — [джерело](../src/app/components/ui/breadcrumb.tsx#L34) |
| BreadcrumbPage | `@/app/components/ui/breadcrumb` | React.ComponentProps<"span"> | Навігаційний шлях; API — [джерело](../src/app/components/ui/breadcrumb.tsx#L52) |
| BreadcrumbSeparator | `@/app/components/ui/breadcrumb` | React.ComponentProps<"li"> | Навігаційний шлях; API — [джерело](../src/app/components/ui/breadcrumb.tsx#L65) |
| BreadcrumbEllipsis | `@/app/components/ui/breadcrumb` | React.ComponentProps<"span"> | Навігаційний шлях; API — [джерело](../src/app/components/ui/breadcrumb.tsx#L83) |
| Button | `@/app/components/ui/button` | React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean; } | Дія або посилання з варіантами; API — [джерело](../src/app/components/ui/button.tsx#L39) |
| Calendar | `@/app/components/ui/calendar` | React.ComponentProps<typeof DayPicker> | Вибір дати; API — [джерело](../src/app/components/ui/calendar.tsx#L10) |
| Card | `@/app/components/ui/card` | React.ComponentProps<"div"> | Картка вмісту; API — [джерело](../src/app/components/ui/card.tsx#L5) |
| CardHeader | `@/app/components/ui/card` | React.ComponentProps<"div"> | Картка вмісту; API — [джерело](../src/app/components/ui/card.tsx#L18) |
| CardTitle | `@/app/components/ui/card` | React.ComponentProps<"div"> | Картка вмісту; API — [джерело](../src/app/components/ui/card.tsx#L31) |
| CardDescription | `@/app/components/ui/card` | React.ComponentProps<"div"> | Картка вмісту; API — [джерело](../src/app/components/ui/card.tsx#L41) |
| CardAction | `@/app/components/ui/card` | React.ComponentProps<"div"> | Картка вмісту; API — [джерело](../src/app/components/ui/card.tsx#L51) |
| CardContent | `@/app/components/ui/card` | React.ComponentProps<"div"> | Картка вмісту; API — [джерело](../src/app/components/ui/card.tsx#L64) |
| CardFooter | `@/app/components/ui/card` | React.ComponentProps<"div"> | Картка вмісту; API — [джерело](../src/app/components/ui/card.tsx#L74) |
| Carousel | `@/app/components/ui/carousel` | React.ComponentProps<"div"> & CarouselProps | Карусель; API — [джерело](../src/app/components/ui/carousel.tsx#L45) |
| CarouselContent | `@/app/components/ui/carousel` | React.ComponentProps<"div"> | Карусель; API — [джерело](../src/app/components/ui/carousel.tsx#L135) |
| CarouselItem | `@/app/components/ui/carousel` | React.ComponentProps<"div"> | Карусель; API — [джерело](../src/app/components/ui/carousel.tsx#L156) |
| CarouselPrevious | `@/app/components/ui/carousel` | React.ComponentProps<typeof Button> | Карусель; API — [джерело](../src/app/components/ui/carousel.tsx#L174) |
| CarouselNext | `@/app/components/ui/carousel` | React.ComponentProps<typeof Button> | Карусель; API — [джерело](../src/app/components/ui/carousel.tsx#L204) |
| ChartContainer | `@/app/components/ui/chart` | React.ComponentProps<"div"> & { config: ChartConfig; children: React.ComponentProps< typeof RechartsPrimitive.ResponsiveContainer >["children"]; } | Графік і підказки Recharts; API — [джерело](../src/app/components/ui/chart.tsx#L37) |
| ChartStyle | `@/app/components/ui/chart` | { id: string; config: ChartConfig } | Графік і підказки Recharts; API — [джерело](../src/app/components/ui/chart.tsx#L72) |
| ChartTooltip | `@/app/components/ui/chart` | API RechartsPrimitive.Tooltip | Графік і підказки Recharts; API — [джерело](../src/app/components/ui/chart.tsx#L105) |
| ChartTooltipContent | `@/app/components/ui/chart` | React.ComponentProps<typeof RechartsPrimitive.Tooltip> & React.ComponentProps<"div"> & { hideLabel?: boolean; hideIndicator?: boolean; indicator?: "line" &#124; "dot" &#124; "dashed"; nameKey?: string; labelKey?: string; } | Графік і підказки Recharts; API — [джерело](../src/app/components/ui/chart.tsx#L107) |
| ChartLegend | `@/app/components/ui/chart` | API RechartsPrimitive.Legend | Графік і підказки Recharts; API — [джерело](../src/app/components/ui/chart.tsx#L251) |
| ChartLegendContent | `@/app/components/ui/chart` | React.ComponentProps<"div"> & Pick<RechartsPrimitive.LegendProps, "payload" &#124; "verticalAlign"> & { hideIcon?: boolean; nameKey?: string; } | Графік і підказки Recharts; API — [джерело](../src/app/components/ui/chart.tsx#L253) |
| Checkbox | `@/app/components/ui/checkbox` | React.ComponentProps<typeof CheckboxPrimitive.Root> | Вибір логічного значення; API — [джерело](../src/app/components/ui/checkbox.tsx#L9) |
| Collapsible | `@/app/components/ui/collapsible` | React.ComponentProps<typeof CollapsiblePrimitive.Root> | Згортання вмісту; API — [джерело](../src/app/components/ui/collapsible.tsx#L5) |
| CollapsibleTrigger | `@/app/components/ui/collapsible` | React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger> | Згортання вмісту; API — [джерело](../src/app/components/ui/collapsible.tsx#L11) |
| CollapsibleContent | `@/app/components/ui/collapsible` | React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> | Згортання вмісту; API — [джерело](../src/app/components/ui/collapsible.tsx#L22) |
| Command | `@/app/components/ui/command` | React.ComponentProps<typeof CommandPrimitive> | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L16) |
| CommandDialog | `@/app/components/ui/command` | React.ComponentProps<typeof Dialog> & { title?: string; description?: string; } | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L32) |
| CommandInput | `@/app/components/ui/command` | React.ComponentProps<typeof CommandPrimitive.Input> | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L56) |
| CommandList | `@/app/components/ui/command` | React.ComponentProps<typeof CommandPrimitive.List> | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L78) |
| CommandEmpty | `@/app/components/ui/command` | React.ComponentProps<typeof CommandPrimitive.Empty> | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L94) |
| CommandGroup | `@/app/components/ui/command` | React.ComponentProps<typeof CommandPrimitive.Group> | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L106) |
| CommandSeparator | `@/app/components/ui/command` | React.ComponentProps<typeof CommandPrimitive.Separator> | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L122) |
| CommandItem | `@/app/components/ui/command` | React.ComponentProps<typeof CommandPrimitive.Item> | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L135) |
| CommandShortcut | `@/app/components/ui/command` | React.ComponentProps<"span"> | Пошук і список команд; API — [джерело](../src/app/components/ui/command.tsx#L151) |
| ContextMenu | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Root> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L9) |
| ContextMenuTrigger | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Trigger> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L15) |
| ContextMenuGroup | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Group> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L23) |
| ContextMenuPortal | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Portal> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L31) |
| ContextMenuSub | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Sub> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L39) |
| ContextMenuRadioGroup | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L45) |
| ContextMenuSubTrigger | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean; } | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L56) |
| ContextMenuSubContent | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.SubContent> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L80) |
| ContextMenuContent | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Content> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L96) |
| ContextMenuItem | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Item> & { inset?: boolean; variant?: "default" &#124; "destructive"; } | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L114) |
| ContextMenuCheckboxItem | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L137) |
| ContextMenuRadioItem | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L163) |
| ContextMenuLabel | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean; } | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L187) |
| ContextMenuSeparator | `@/app/components/ui/context-menu` | React.ComponentProps<typeof ContextMenuPrimitive.Separator> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L207) |
| ContextMenuShortcut | `@/app/components/ui/context-menu` | React.ComponentProps<"span"> | Контекстне меню; API — [джерело](../src/app/components/ui/context-menu.tsx#L220) |
| Dialog | `@/app/components/ui/dialog` | API DialogPrimitive.Root | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L10) |
| DialogTrigger | `@/app/components/ui/dialog` | React.ElementRef<typeof DialogPrimitive.Trigger>; React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L12) |
| DialogPortal | `@/app/components/ui/dialog` | API DialogPrimitive.Portal | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L20) |
| DialogClose | `@/app/components/ui/dialog` | React.ElementRef<typeof DialogPrimitive.Close>; React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L22) |
| DialogOverlay | `@/app/components/ui/dialog` | React.ElementRef<typeof DialogPrimitive.Overlay>; React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L30) |
| DialogContent | `@/app/components/ui/dialog` | React.ElementRef<typeof DialogPrimitive.Content>; React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L46) |
| DialogHeader | `@/app/components/ui/dialog` | HTMLDivElement; React.ComponentPropsWithoutRef<"div"> | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L75) |
| DialogFooter | `@/app/components/ui/dialog` | HTMLDivElement; React.ComponentPropsWithoutRef<"div"> | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L88) |
| DialogTitle | `@/app/components/ui/dialog` | React.ElementRef<typeof DialogPrimitive.Title>; React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L104) |
| DialogDescription | `@/app/components/ui/dialog` | React.ElementRef<typeof DialogPrimitive.Description>; React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> | Модальне вікно; API — [джерело](../src/app/components/ui/dialog.tsx#L117) |
| Drawer | `@/app/components/ui/drawer` | React.ComponentProps<typeof DrawerPrimitive.Root> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L8) |
| DrawerTrigger | `@/app/components/ui/drawer` | React.ComponentProps<typeof DrawerPrimitive.Trigger> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L14) |
| DrawerPortal | `@/app/components/ui/drawer` | React.ComponentProps<typeof DrawerPrimitive.Portal> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L20) |
| DrawerClose | `@/app/components/ui/drawer` | React.ComponentProps<typeof DrawerPrimitive.Close> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L26) |
| DrawerOverlay | `@/app/components/ui/drawer` | React.ComponentProps<typeof DrawerPrimitive.Overlay> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L32) |
| DrawerContent | `@/app/components/ui/drawer` | React.ComponentProps<typeof DrawerPrimitive.Content> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L48) |
| DrawerHeader | `@/app/components/ui/drawer` | React.ComponentProps<"div"> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L75) |
| DrawerFooter | `@/app/components/ui/drawer` | React.ComponentProps<"div"> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L85) |
| DrawerTitle | `@/app/components/ui/drawer` | React.ComponentProps<typeof DrawerPrimitive.Title> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L95) |
| DrawerDescription | `@/app/components/ui/drawer` | React.ComponentProps<typeof DrawerPrimitive.Description> | Висувна панель; API — [джерело](../src/app/components/ui/drawer.tsx#L108) |
| DropdownMenu | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Root> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L9) |
| DropdownMenuPortal | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Portal> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L15) |
| DropdownMenuTrigger | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Trigger> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L23) |
| DropdownMenuContent | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Content> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L34) |
| DropdownMenuGroup | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Group> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L54) |
| DropdownMenuItem | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean; variant?: "default" &#124; "destructive"; } | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L62) |
| DropdownMenuCheckboxItem | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L85) |
| DropdownMenuRadioGroup | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L111) |
| DropdownMenuRadioItem | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L122) |
| DropdownMenuLabel | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean; } | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L146) |
| DropdownMenuSeparator | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Separator> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L166) |
| DropdownMenuShortcut | `@/app/components/ui/dropdown-menu` | React.ComponentProps<"span"> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L179) |
| DropdownMenuSub | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.Sub> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L195) |
| DropdownMenuSubTrigger | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean; } | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L201) |
| DropdownMenuSubContent | `@/app/components/ui/dropdown-menu` | React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> | Меню дій; API — [джерело](../src/app/components/ui/dropdown-menu.tsx#L225) |
| Form | `@/app/components/ui/form` | API FormProvider | Поля react-hook-form; API — [джерело](../src/app/components/ui/form.tsx#L19) |
| FormField | `@/app/components/ui/form` | ControllerProps<TFieldValues, TName> | Поля react-hook-form; API — [джерело](../src/app/components/ui/form.tsx#L32) |
| FormItem | `@/app/components/ui/form` | React.ComponentProps<"div"> | Поля react-hook-form; API — [джерело](../src/app/components/ui/form.tsx#L76) |
| FormLabel | `@/app/components/ui/form` | React.ComponentProps<typeof LabelPrimitive.Root> | Поля react-hook-form; API — [джерело](../src/app/components/ui/form.tsx#L90) |
| FormControl | `@/app/components/ui/form` | React.ComponentProps<typeof Slot> | Поля react-hook-form; API — [джерело](../src/app/components/ui/form.tsx#L107) |
| FormDescription | `@/app/components/ui/form` | React.ComponentProps<"p"> | Поля react-hook-form; API — [джерело](../src/app/components/ui/form.tsx#L126) |
| FormMessage | `@/app/components/ui/form` | React.ComponentProps<"p"> | Поля react-hook-form; API — [джерело](../src/app/components/ui/form.tsx#L139) |
| HoverCard | `@/app/components/ui/hover-card` | React.ComponentProps<typeof HoverCardPrimitive.Root> | Додатковий вміст при наведенні; API — [джерело](../src/app/components/ui/hover-card.tsx#L8) |
| HoverCardTrigger | `@/app/components/ui/hover-card` | React.ComponentProps<typeof HoverCardPrimitive.Trigger> | Додатковий вміст при наведенні; API — [джерело](../src/app/components/ui/hover-card.tsx#L14) |
| HoverCardContent | `@/app/components/ui/hover-card` | React.ComponentProps<typeof HoverCardPrimitive.Content> | Додатковий вміст при наведенні; API — [джерело](../src/app/components/ui/hover-card.tsx#L22) |
| InputOTP | `@/app/components/ui/input-otp` | React.ComponentProps<typeof OTPInput> & { containerClassName?: string; } | Код підтвердження; API — [джерело](../src/app/components/ui/input-otp.tsx#L9) |
| InputOTPGroup | `@/app/components/ui/input-otp` | React.ComponentProps<"div"> | Код підтвердження; API — [джерело](../src/app/components/ui/input-otp.tsx#L29) |
| InputOTPSlot | `@/app/components/ui/input-otp` | React.ComponentProps<"div"> & { index: number; } | Код підтвердження; API — [джерело](../src/app/components/ui/input-otp.tsx#L39) |
| InputOTPSeparator | `@/app/components/ui/input-otp` | React.ComponentProps<"div"> | Код підтвердження; API — [джерело](../src/app/components/ui/input-otp.tsx#L69) |
| Input | `@/app/components/ui/input` | HTMLInputElement; React.ComponentPropsWithoutRef<"input"> | Однорядкове поле; API — [джерело](../src/app/components/ui/input.tsx#L5) |
| Label | `@/app/components/ui/label` | React.ComponentProps<typeof LabelPrimitive.Root> | Підпис поля; API — [джерело](../src/app/components/ui/label.tsx#L8) |
| Menubar | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Root> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L9) |
| MenubarMenu | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Menu> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L25) |
| MenubarGroup | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Group> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L31) |
| MenubarPortal | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Portal> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L37) |
| MenubarRadioGroup | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.RadioGroup> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L43) |
| MenubarTrigger | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Trigger> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L51) |
| MenubarContent | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Content> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L67) |
| MenubarItem | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean; variant?: "default" &#124; "destructive"; } | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L91) |
| MenubarCheckboxItem | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L114) |
| MenubarRadioItem | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.RadioItem> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L140) |
| MenubarLabel | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean; } | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L164) |
| MenubarSeparator | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Separator> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L184) |
| MenubarShortcut | `@/app/components/ui/menubar` | React.ComponentProps<"span"> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L197) |
| MenubarSub | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.Sub> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L213) |
| MenubarSubTrigger | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean; } | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L219) |
| MenubarSubContent | `@/app/components/ui/menubar` | React.ComponentProps<typeof MenubarPrimitive.SubContent> | Панель меню; API — [джерело](../src/app/components/ui/menubar.tsx#L243) |
| NavigationMenu | `@/app/components/ui/navigation-menu` | React.ComponentProps<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean; } | Навігаційне меню; API — [джерело](../src/app/components/ui/navigation-menu.tsx#L8) |
| NavigationMenuList | `@/app/components/ui/navigation-menu` | React.ComponentProps<typeof NavigationMenuPrimitive.List> | Навігаційне меню; API — [джерело](../src/app/components/ui/navigation-menu.tsx#L32) |
| NavigationMenuItem | `@/app/components/ui/navigation-menu` | React.ComponentProps<typeof NavigationMenuPrimitive.Item> | Навігаційне меню; API — [джерело](../src/app/components/ui/navigation-menu.tsx#L48) |
| NavigationMenuTrigger | `@/app/components/ui/navigation-menu` | React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> | Навігаційне меню; API — [джерело](../src/app/components/ui/navigation-menu.tsx#L65) |
| NavigationMenuContent | `@/app/components/ui/navigation-menu` | React.ComponentProps<typeof NavigationMenuPrimitive.Content> | Навігаційне меню; API — [джерело](../src/app/components/ui/navigation-menu.tsx#L85) |
| NavigationMenuViewport | `@/app/components/ui/navigation-menu` | React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> | Навігаційне меню; API — [джерело](../src/app/components/ui/navigation-menu.tsx#L102) |
| NavigationMenuLink | `@/app/components/ui/navigation-menu` | React.ComponentProps<typeof NavigationMenuPrimitive.Link> | Навігаційне меню; API — [джерело](../src/app/components/ui/navigation-menu.tsx#L124) |
| NavigationMenuIndicator | `@/app/components/ui/navigation-menu` | React.ComponentProps<typeof NavigationMenuPrimitive.Indicator> | Навігаційне меню; API — [джерело](../src/app/components/ui/navigation-menu.tsx#L140) |
| Pagination | `@/app/components/ui/pagination` | React.ComponentProps<"nav"> | Пагінація; API — [джерело](../src/app/components/ui/pagination.tsx#L11) |
| PaginationContent | `@/app/components/ui/pagination` | React.ComponentProps<"ul"> | Пагінація; API — [джерело](../src/app/components/ui/pagination.tsx#L23) |
| PaginationItem | `@/app/components/ui/pagination` | React.ComponentProps<"li"> | Пагінація; API — [джерело](../src/app/components/ui/pagination.tsx#L36) |
| PaginationLink | `@/app/components/ui/pagination` | { isActive?: boolean; } & Pick<React.ComponentProps<typeof Button>, "size"> & React.ComponentProps<"a"> | Пагінація; API — [джерело](../src/app/components/ui/pagination.tsx#L45) |
| PaginationPrevious | `@/app/components/ui/pagination` | React.ComponentProps<typeof PaginationLink> | Пагінація; API — [джерело](../src/app/components/ui/pagination.tsx#L68) |
| PaginationNext | `@/app/components/ui/pagination` | React.ComponentProps<typeof PaginationLink> | Пагінація; API — [джерело](../src/app/components/ui/pagination.tsx#L85) |
| PaginationEllipsis | `@/app/components/ui/pagination` | React.ComponentProps<"span"> | Пагінація; API — [джерело](../src/app/components/ui/pagination.tsx#L102) |
| Popover | `@/app/components/ui/popover` | React.ComponentProps<typeof PopoverPrimitive.Root> | Спливний вміст; API — [джерело](../src/app/components/ui/popover.tsx#L8) |
| PopoverTrigger | `@/app/components/ui/popover` | React.ComponentProps<typeof PopoverPrimitive.Trigger> | Спливний вміст; API — [джерело](../src/app/components/ui/popover.tsx#L14) |
| PopoverContent | `@/app/components/ui/popover` | React.ComponentProps<typeof PopoverPrimitive.Content> | Спливний вміст; API — [джерело](../src/app/components/ui/popover.tsx#L20) |
| PopoverAnchor | `@/app/components/ui/popover` | React.ComponentProps<typeof PopoverPrimitive.Anchor> | Спливний вміст; API — [джерело](../src/app/components/ui/popover.tsx#L42) |
| Progress | `@/app/components/ui/progress` | React.ComponentProps<typeof ProgressPrimitive.Root> | Прогрес; API — [джерело](../src/app/components/ui/progress.tsx#L8) |
| RadioGroup | `@/app/components/ui/radio-group` | React.ComponentProps<typeof RadioGroupPrimitive.Root> | Вибір одного варіанта; API — [джерело](../src/app/components/ui/radio-group.tsx#L9) |
| RadioGroupItem | `@/app/components/ui/radio-group` | React.ComponentProps<typeof RadioGroupPrimitive.Item> | Вибір одного варіанта; API — [джерело](../src/app/components/ui/radio-group.tsx#L22) |
| ResizablePanelGroup | `@/app/components/ui/resizable` | React.ComponentProps<typeof ResizablePrimitive.PanelGroup> | Панелі зі змінним розміром; API — [джерело](../src/app/components/ui/resizable.tsx#L9) |
| ResizablePanel | `@/app/components/ui/resizable` | React.ComponentProps<typeof ResizablePrimitive.Panel> | Панелі зі змінним розміром; API — [джерело](../src/app/components/ui/resizable.tsx#L25) |
| ResizableHandle | `@/app/components/ui/resizable` | React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & { withHandle?: boolean; } | Панелі зі змінним розміром; API — [джерело](../src/app/components/ui/resizable.tsx#L31) |
| ScrollArea | `@/app/components/ui/scroll-area` | React.ComponentProps<typeof ScrollAreaPrimitive.Root> | Область прокручування; API — [джерело](../src/app/components/ui/scroll-area.tsx#L8) |
| ScrollBar | `@/app/components/ui/scroll-area` | React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> | Область прокручування; API — [джерело](../src/app/components/ui/scroll-area.tsx#L31) |
| NativeSelect | `@/app/components/ui/select` | React.ComponentProps<"select"> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L14) |
| Select | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.Root> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L33) |
| SelectGroup | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.Group> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L39) |
| SelectValue | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.Value> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L45) |
| SelectTrigger | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "sm" &#124; "default"; } | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L51) |
| SelectContent | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.Content> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L77) |
| SelectLabel | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.Label> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L113) |
| SelectItem | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.Item> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L126) |
| SelectSeparator | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.Separator> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L150) |
| SelectScrollUpButton | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.ScrollUpButton> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L163) |
| SelectScrollDownButton | `@/app/components/ui/select` | React.ComponentProps<typeof SelectPrimitive.ScrollDownButton> | Вибір зі списку; API — [джерело](../src/app/components/ui/select.tsx#L181) |
| Separator | `@/app/components/ui/separator` | React.ComponentProps<typeof SeparatorPrimitive.Root> | Роздільник; API — [джерело](../src/app/components/ui/separator.tsx#L8) |
| Sheet | `@/app/components/ui/sheet` | API SheetPrimitive.Root | Бічна модальна панель; API — [джерело](../src/app/components/ui/sheet.tsx#L10) |
| SheetTrigger | `@/app/components/ui/sheet` | React.ElementRef<typeof SheetPrimitive.Trigger>; React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger> | Бічна модальна панель; API — [джерело](../src/app/components/ui/sheet.tsx#L12) |
| SheetClose | `@/app/components/ui/sheet` | React.ElementRef<typeof SheetPrimitive.Close>; React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close> | Бічна модальна панель; API — [джерело](../src/app/components/ui/sheet.tsx#L25) |
| SheetContent | `@/app/components/ui/sheet` | React.ElementRef<typeof SheetPrimitive.Content>; React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & { side?: "top" &#124; "right" &#124; "bottom" &#124; "left"; } | Бічна модальна панель; API — [джерело](../src/app/components/ui/sheet.tsx#L56) |
| SheetHeader | `@/app/components/ui/sheet` | HTMLDivElement; React.HTMLAttributes<HTMLDivElement> | Бічна модальна панель; API — [джерело](../src/app/components/ui/sheet.tsx#L95) |
| SheetFooter | `@/app/components/ui/sheet` | HTMLDivElement; React.HTMLAttributes<HTMLDivElement> | Бічна модальна панель; API — [джерело](../src/app/components/ui/sheet.tsx#L108) |
| SheetTitle | `@/app/components/ui/sheet` | React.ElementRef<typeof SheetPrimitive.Title>; React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> | Бічна модальна панель; API — [джерело](../src/app/components/ui/sheet.tsx#L121) |
| SheetDescription | `@/app/components/ui/sheet` | React.ElementRef<typeof SheetPrimitive.Description>; React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> | Бічна модальна панель; API — [джерело](../src/app/components/ui/sheet.tsx#L134) |
| SidebarProvider | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void; } | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L56) |
| Sidebar | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> & { side?: "left" &#124; "right"; variant?: "sidebar" &#124; "floating" &#124; "inset"; collapsible?: "offcanvas" &#124; "icon" &#124; "none"; } | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L158) |
| SidebarTrigger | `@/app/components/ui/sidebar` | React.ComponentProps<typeof Button> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L260) |
| SidebarRail | `@/app/components/ui/sidebar` | React.ComponentProps<"button"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L286) |
| SidebarInset | `@/app/components/ui/sidebar` | React.ComponentProps<"main"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L311) |
| SidebarInput | `@/app/components/ui/sidebar` | React.ComponentProps<typeof Input> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L325) |
| SidebarHeader | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L339) |
| SidebarFooter | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L350) |
| SidebarSeparator | `@/app/components/ui/sidebar` | React.ComponentProps<typeof Separator> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L361) |
| SidebarContent | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L375) |
| SidebarGroup | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L389) |
| SidebarGroupLabel | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> & { asChild?: boolean } | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L400) |
| SidebarGroupAction | `@/app/components/ui/sidebar` | React.ComponentProps<"button"> & { asChild?: boolean } | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L421) |
| SidebarGroupContent | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L444) |
| SidebarMenu | `@/app/components/ui/sidebar` | React.ComponentProps<"ul"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L458) |
| SidebarMenuItem | `@/app/components/ui/sidebar` | React.ComponentProps<"li"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L469) |
| SidebarMenuButton | `@/app/components/ui/sidebar` | React.ComponentProps<"button"> & { asChild?: boolean; isActive?: boolean; tooltip?: string &#124; React.ComponentProps<typeof TooltipContent>; } & VariantProps<typeof sidebarMenuButtonVariants> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L502) |
| SidebarMenuAction | `@/app/components/ui/sidebar` | React.ComponentProps<"button"> & { asChild?: boolean; showOnHover?: boolean; } | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L552) |
| SidebarMenuBadge | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L584) |
| SidebarMenuSkeleton | `@/app/components/ui/sidebar` | React.ComponentProps<"div"> & { showIcon?: boolean; } | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L606) |
| SidebarMenuSub | `@/app/components/ui/sidebar` | React.ComponentProps<"ul"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L644) |
| SidebarMenuSubItem | `@/app/components/ui/sidebar` | React.ComponentProps<"li"> | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L659) |
| SidebarMenuSubButton | `@/app/components/ui/sidebar` | React.ComponentProps<"a"> & { asChild?: boolean; size?: "sm" &#124; "md"; isActive?: boolean; } | Бічна навігація; API — [джерело](../src/app/components/ui/sidebar.tsx#L673) |
| Skeleton | `@/app/components/ui/skeleton` | React.ComponentProps<"div"> | Стан завантаження; API — [джерело](../src/app/components/ui/skeleton.tsx#L3) |
| Slider | `@/app/components/ui/slider` | React.ComponentProps<typeof SliderPrimitive.Root> | Вибір діапазону; API — [джерело](../src/app/components/ui/slider.tsx#L8) |
| Toaster | `@/app/components/ui/sonner` | ToasterProps | Toast-повідомлення; API — [джерело](../src/app/components/ui/sonner.tsx#L6) |
| Switch | `@/app/components/ui/switch` | React.ComponentProps<typeof SwitchPrimitive.Root> | Перемикач; API — [джерело](../src/app/components/ui/switch.tsx#L8) |
| Table | `@/app/components/ui/table` | React.ComponentProps<"table"> | Табличні дані; API — [джерело](../src/app/components/ui/table.tsx#L7) |
| TableHeader | `@/app/components/ui/table` | React.ComponentProps<"thead"> | Табличні дані; API — [джерело](../src/app/components/ui/table.tsx#L22) |
| TableBody | `@/app/components/ui/table` | React.ComponentProps<"tbody"> | Табличні дані; API — [джерело](../src/app/components/ui/table.tsx#L32) |
| TableFooter | `@/app/components/ui/table` | React.ComponentProps<"tfoot"> | Табличні дані; API — [джерело](../src/app/components/ui/table.tsx#L42) |
| TableRow | `@/app/components/ui/table` | React.ComponentProps<"tr"> | Табличні дані; API — [джерело](../src/app/components/ui/table.tsx#L55) |
| TableHead | `@/app/components/ui/table` | React.ComponentProps<"th"> | Табличні дані; API — [джерело](../src/app/components/ui/table.tsx#L68) |
| TableCell | `@/app/components/ui/table` | React.ComponentProps<"td"> | Табличні дані; API — [джерело](../src/app/components/ui/table.tsx#L81) |
| TableCaption | `@/app/components/ui/table` | React.ComponentProps<"caption"> | Табличні дані; API — [джерело](../src/app/components/ui/table.tsx#L94) |
| Tabs | `@/app/components/ui/tabs` | React.ComponentProps<typeof TabsPrimitive.Root> | Вкладки; API — [джерело](../src/app/components/ui/tabs.tsx#L8) |
| TabsList | `@/app/components/ui/tabs` | React.ComponentProps<typeof TabsPrimitive.List> | Вкладки; API — [джерело](../src/app/components/ui/tabs.tsx#L21) |
| TabsTrigger | `@/app/components/ui/tabs` | React.ComponentProps<typeof TabsPrimitive.Trigger> | Вкладки; API — [джерело](../src/app/components/ui/tabs.tsx#L37) |
| TabsContent | `@/app/components/ui/tabs` | React.ComponentProps<typeof TabsPrimitive.Content> | Вкладки; API — [джерело](../src/app/components/ui/tabs.tsx#L53) |
| Textarea | `@/app/components/ui/textarea` | React.ComponentProps<"textarea"> | Багаторядкове поле; API — [джерело](../src/app/components/ui/textarea.tsx#L5) |
| ToggleGroup | `@/app/components/ui/toggle-group` | React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants> | Група перемикачів; API — [джерело](../src/app/components/ui/toggle-group.tsx#L17) |
| ToggleGroupItem | `@/app/components/ui/toggle-group` | React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants> | Група перемикачів; API — [джерело](../src/app/components/ui/toggle-group.tsx#L43) |
| Toggle | `@/app/components/ui/toggle` | React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants> | Кнопка-перемикач; API — [джерело](../src/app/components/ui/toggle.tsx#L31) |
| TooltipProvider | `@/app/components/ui/tooltip` | React.ComponentProps<typeof TooltipPrimitive.Provider> | Коротка підказка; API — [джерело](../src/app/components/ui/tooltip.tsx#L8) |
| Tooltip | `@/app/components/ui/tooltip` | React.ComponentProps<typeof TooltipPrimitive.Root> | Коротка підказка; API — [джерело](../src/app/components/ui/tooltip.tsx#L21) |
| TooltipTrigger | `@/app/components/ui/tooltip` | React.ComponentProps<typeof TooltipPrimitive.Trigger> | Коротка підказка; API — [джерело](../src/app/components/ui/tooltip.tsx#L31) |
| TooltipContent | `@/app/components/ui/tooltip` | React.ComponentProps<typeof TooltipPrimitive.Content> | Коротка підказка; API — [джерело](../src/app/components/ui/tooltip.tsx#L37) |
| AccountsStrip | `@/app/components/zapad/AccountsStrip` | {accounts: BankAccount[]; profileSlug: ProfileSlug} | Accounts Strip; API — [джерело](../src/app/components/zapad/AccountsStrip.tsx#L8) |
| BalanceHero | `@/app/components/zapad/BalanceHero` | { isBusiness: boolean; primaryAccount: BankAccount; profileKind: ProfileKind; accounts: BankAccount[]; onAccountChange: (id: string) => void; } | Balance Hero; API — [джерело](../src/app/components/zapad/BalanceHero.tsx#L11) |
| CurrencyFlag | `@/app/components/zapad/CurrencyIcon` | { currency: string } | Currency Flag; API — [джерело](../src/app/components/zapad/CurrencyIcon.tsx#L8) |
| CurrencyMark | `@/app/components/zapad/CurrencyIcon` | { currency: string } | Currency Mark; API — [джерело](../src/app/components/zapad/CurrencyIcon.tsx#L14) |
| DashboardPaymentsCta | `@/app/components/zapad/DashboardPaymentsCta` | { profileSlug: ProfileSlug; isBusiness: boolean; } | Dashboard Payments Cta; API — [джерело](../src/app/components/zapad/DashboardPaymentsCta.tsx#L8) |
| ExchangeModal | `@/app/components/zapad/ExchangeModal` | open: boolean; onOpenChange: (open: boolean) => void; | Exchange Modal; API — [джерело](../src/app/components/zapad/ExchangeModal.tsx#L56) |
| ExpenseAnalytics | `@/app/components/zapad/ExpenseAnalytics` | { business: boolean; transactionsHref?: string; compact?: boolean; } | Expense Analytics; API — [джерело](../src/app/components/zapad/ExpenseAnalytics.tsx#L54) |
| GoalDialog | `@/app/components/zapad/GoalDialog` | {kind:ProfileKind;goalId?:string;onClose:()=>void} | Goal Dialog; API — [джерело](../src/app/components/zapad/GoalDialog.tsx#L13) |
| IconScaleSlot | `@/app/components/zapad/IconScaleSlot` | { className?: string; innerClassName?: string; innerStyle?: CSSProperties; children: ReactNode; } | Icon Scale Slot; API — [джерело](../src/app/components/zapad/IconScaleSlot.tsx#L8) |
| PaymentCard | `@/app/components/zapad/PaymentCard` | name: string; last4: string; expiry: string; holder?: string; isPrivate?: boolean; frozen?: boolean; | Payment Card; API — [джерело](../src/app/components/zapad/PaymentCard.tsx#L13) |
| PreviewHistory | `@/app/components/zapad/PreviewHistory` | {kind:ProfileKind;accountId?:string} | Preview History; API — [джерело](../src/app/components/zapad/PreviewHistory.tsx#L16) |
| ProductPreviewDialog | `@/app/components/zapad/ProductPreviewDialog` | {open:boolean;onClose:()=>void;title:string;options:ProductOption[];maximum?:number;initialAmount?:string;savings?:string;direction?:"deposit"&#124;"withdraw";explanation:string;details?:(amount:number)=>Array<[string,string]>} | Product Preview Dialog; API — [джерело](../src/app/components/zapad/ProductPreviewDialog.tsx#L17) |
| QuickActions | `@/app/components/zapad/QuickActions` | Немає | Quick Actions; API — [джерело](../src/app/components/zapad/QuickActions.tsx#L18) |
| ReceiveSheet | `@/app/components/zapad/ReceiveSheet` | { open: boolean; onClose: () => void; profileKind: ProfileKind; initialAccountId?: string; } | Receive Sheet; API — [джерело](../src/app/components/zapad/ReceiveSheet.tsx#L23) |
| RightPanel | `@/app/components/zapad/RightPanel` | { business: boolean; profileSlug: ProfileSlug; profileKind: ProfileKind; compact?: boolean; } | Right Panel; API — [джерело](../src/app/components/zapad/RightPanel.tsx#L28) |
| AlertsCard | `@/app/components/zapad/RightPanel` | { business: boolean; profileSlug: ProfileSlug; compact?: boolean; } | Alerts Card; API — [джерело](../src/app/components/zapad/RightPanel.tsx#L50) |
| CardWidget | `@/app/components/zapad/RightPanel` | { business: boolean; profileSlug: ProfileSlug; profileKind: ProfileKind; compact?: boolean; } | Card Widget; API — [джерело](../src/app/components/zapad/RightPanel.tsx#L142) |
| SavingsGoals | `@/app/components/zapad/SavingsGoals` | { profileKind: ProfileKind; profileSlug: ProfileSlug; maxGoals?: number; viewAllHref?: string; compact?: boolean; } | Savings Goals; API — [джерело](../src/app/components/zapad/SavingsGoals.tsx#L92) |
| SidebarContent | `@/app/components/zapad/Sidebar` | { active: string; onChange: (id: string) => void; profileSlug: ProfileSlug; isBusiness?: boolean; onItemClick?: () => void; className?: string; } | Sidebar Content; API — [джерело](../src/app/components/zapad/Sidebar.tsx#L79) |
| Sidebar | `@/app/components/zapad/Sidebar` | { active: string; onChange: (id: string) => void; profileSlug: ProfileSlug; isBusiness?: boolean; } | Sidebar; API — [джерело](../src/app/components/zapad/Sidebar.tsx#L247) |
| TopBar | `@/app/components/zapad/TopBar` | { profile: Profile; profileSlug: ProfileSlug; onProfileChange: (slug: ProfileSlug) => void; onMenuClick?: () => void; } | Top Bar; API — [джерело](../src/app/components/zapad/TopBar.tsx#L41) |
| TransactionDetailsSheet | `@/app/components/zapad/TransactionDetailsSheet` | transaction: Tx &#124; null; open: boolean; onOpenChange: (open: boolean) => void; isBusiness: boolean; | Transaction Details Sheet; API — [джерело](../src/app/components/zapad/TransactionDetailsSheet.tsx#L33) |
| TransactionExtras | `@/app/components/zapad/TransactionExtras` | {transaction:Transaction;business:boolean;isPrivate:boolean} | Transaction Extras; API — [джерело](../src/app/components/zapad/TransactionExtras.tsx#L19) |
| Transactions | `@/app/components/zapad/Transactions` | { profileKind: ProfileKind; limit?: number; account?: BankAccount; viewAllHref?: string; compact?: boolean; } | Transactions; API — [джерело](../src/app/components/zapad/Transactions.tsx#L15) |
| TransferModal | `@/app/components/zapad/TransferModal` | open: boolean; onOpenChange: (open: boolean) => void; initialRecipient?: string; initialSource?: string; type?: "send" &#124; "transfer" &#124; "pay" | Transfer Modal; API — [джерело](../src/app/components/zapad/TransferModal.tsx#L27) |
