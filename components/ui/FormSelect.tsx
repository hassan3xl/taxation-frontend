"use client";

import React, { useState } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import {
  UseFormRegister,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  label?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  placeholder?: string;
  error?: FieldError;
  success?: string;
  disabled?: boolean;
  options: Option[];
  multiple?: boolean;
  validation?: object;
  className?: string;
  [key: string]: any;
}

export function FormSelect<T extends FieldValues>({
  name,
  register,
  label,
  icon: Icon,
  placeholder,
  error,
  success,
  disabled = false,
  options = [],
  multiple = false,
  validation = {},
  className = "",
  ...props
}: FormSelectProps<T>) {
  const [focused, setFocused] = useState(false);

  const getContainerClasses = () => {
    const base =
      "relative flex items-center rounded-lg transition-all duration-200 border";
    const state = error
      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
      : success
      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
      : focused
      ? "border-ring bg-background/60 ring-2 ring-ring/10 shadow-sm"
      : "border-input bg-background hover:border-ring/50";
    const disabledState = disabled ? "opacity-50 cursor-not-allowed" : "";
    return cn(base, state, disabledState);
  };

  const getIconClasses = () =>
    error
      ? "text-red-500 dark:text-red-400"
      : success
      ? "text-green-500 dark:text-green-400"
      : "text-muted-foreground";

  const fieldClass = cn(
    "flex-1 px-4 py-2.5 bg-transparent outline-none text-foreground placeholder:text-muted-foreground appearance-none cursor-pointer pr-10",
    className
  );

  return (
    <div className="mb-6 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-foreground text-left"
        >
          {label}
        </label>
      )}
      <div className={getContainerClasses()}>
        {Icon && <Icon size={20} className={cn("ml-4", getIconClasses())} />}
        <select
          id={name}
          {...register(name, validation)}
          disabled={disabled}
          multiple={multiple}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={fieldClass}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
          <X size={14} className="mr-1" /> {error.message}
        </p>
      )}
      {success && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
          <Check size={14} className="mr-1" /> {success}
        </p>
      )}
    </div>
  );
}
