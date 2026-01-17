"use client";

import React from "react";
import { Check } from "lucide-react";
import {
  UseFormRegister,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  label?: string;
  disabled?: boolean;
  error?: FieldError;
  validation?: object;
  className?: string;
  [key: string]: any;
}

export function FormCheckbox<T extends FieldValues>({
  name,
  register,
  label,
  disabled = false,
  error,
  validation = {},
  className = "",
  ...props
}: FormCheckboxProps<T>) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          {...register(name, validation)}
          disabled={disabled}
          className="sr-only peer"
          id={name}
          {...props}
        />
        <label
          htmlFor={name}
          className={cn(
            "w-6 h-6 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200",
            disabled ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          <div
            className={cn(
              "w-full h-full rounded-md flex items-center justify-center transition-colors",
              error
                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                : "border-input hover:border-ring"
            )}
          >
            <Check
              size={16}
              className="text-primary opacity-0 peer-checked:opacity-100"
            />
          </div>
        </label>
        {label && (
          <label
            htmlFor={name}
            className="text-sm select-none cursor-pointer text-foreground"
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}
