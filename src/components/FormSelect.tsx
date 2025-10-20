"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string; // ✅ ubah jadi string aja
}

interface FormSelectProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void; // ✅ ubah ke string
  options: Option[];
  placeholder?: string;
  className?: string;
}


export function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Pilih...",
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
              "block w-full text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 rounded-lg border appearance-none text-left focus:outline-none focus:ring-0 flex justify-between items-center px-2.5 pb-1.5 pt-3 transition-colors",
              open
                ? "border-green-500 dark:border-green-400"
                : "border-gray-300 dark:border-zinc-700",
              className
            )}
          >
            <span
              className={cn(
                selected ? "" : "text-gray-400 dark:text-zinc-500"
              )}
            >
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="w-4 h-4 opacity-50 dark:text-zinc-400" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg">
          <Command className="dark:bg-zinc-900 dark:text-white">
            <CommandInput
              placeholder={`Cari ${label.toLowerCase()}...`}
              className="dark:bg-zinc-800 dark:text-white"
            />
            <CommandEmpty className="text-gray-500 dark:text-zinc-400">
              Tidak ditemukan.
            </CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                  className="dark:hover:bg-zinc-800 dark:text-white"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-green-600 dark:text-green-400",
                      opt.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Floating Label */}
      <label
        className={cn(
          "absolute text-sm text-gray-500 dark:text-zinc-400 duration-300 transform bg-white dark:bg-zinc-800 px-2 pointer-events-none origin-[0] start-1 transition-all",
          selected || open
            ? "-translate-y-3 scale-75 top-1 text-green-600 dark:text-green-400"
            : "scale-100 -translate-y-1/2 top-1/2"
        )}
      >
        {label}
      </label>
    </div>
  );
}
