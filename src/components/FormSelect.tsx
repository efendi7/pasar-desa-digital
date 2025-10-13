'use client';

import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
} from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  label: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  className,
}: FormSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'block w-full text-sm text-gray-900 bg-white rounded-lg border appearance-none text-left focus:outline-none focus:ring-0 flex justify-between items-center px-2.5 pb-1.5 pt-3',
              open ? 'border-green-500' : 'border-gray-300',
              className
            )}
          >
            <span className={selected ? '' : 'text-gray-400'}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50">
          <Command>
            <CommandInput placeholder={`Cari ${label.toLowerCase()}...`} />
            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      opt.value === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Floating Label - sejajar dengan FormInput */}
      <label
        className={cn(
          'absolute text-sm text-gray-500 duration-300 transform bg-white px-2 pointer-events-none origin-[0] start-1',
          selected || open
            ? '-translate-y-3 scale-75 top-1 text-green-600'
            : 'scale-100 -translate-y-1/2 top-1/2'
        )}
      >
        {label}
      </label>
    </div>
  );
}