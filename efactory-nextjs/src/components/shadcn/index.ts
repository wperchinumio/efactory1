// Prefixed re-exports for shadcn primitives, sourced from ui/shadcn
// This avoids naming collisions with our own UI components

export {
  Popover as ShadcnPopover,
  PopoverTrigger as ShadcnPopoverTrigger,
  PopoverContent as ShadcnPopoverContent,
  PopoverAnchor as ShadcnPopoverAnchor
} from '@/components/ui/shadcn/popover';

export {
  Command as ShadcnCommand,
  CommandDialog as ShadcnCommandDialog,
  CommandInput as ShadcnCommandInput,
  CommandList as ShadcnCommandList,
  CommandEmpty as ShadcnCommandEmpty,
  CommandGroup as ShadcnCommandGroup,
  CommandItem as ShadcnCommandItem,
  CommandSeparator as ShadcnCommandSeparator,
  CommandShortcut as ShadcnCommandShortcut
} from '@/components/ui/shadcn/command';

export { Checkbox as ShadcnCheckbox } from '@/components/ui/shadcn/checkbox';
export { Label as ShadcnLabel } from '@/components/ui/shadcn/label';
export { ScrollArea as ShadcnScrollArea } from '@/components/ui/shadcn/scroll-area';


