import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AlertIcon, CheckIcon, ChevronDownIcon } from "./icons";

/**
 * Form fields (SPEC 2.5, 8.1). Every field has a visible label. Errors are linked with
 * aria-describedby and aria-invalid so screen readers announce them; the form-level
 * error summary (added in phase 3) uses role="alert".
 */

type FieldState = { error?: string; success?: string; hint?: string };

const control =
  "block w-full rounded-md border bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-slate-500 " +
  "transition-colors focus:outline-none focus-visible:outline-3 focus-visible:outline-blue-500 focus-visible:outline-offset-0 " +
  "disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-muted";

function controlState({ error, success }: FieldState) {
  if (error) return "border-danger";
  if (success) return "border-success";
  return "border-slate-300 hover:border-slate-500";
}

function FieldMessages({ id, error, success, hint }: FieldState & { id: string }) {
  return (
    <>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger-700">
          <AlertIcon className="size-4 shrink-0" />
          {error}
        </p>
      )}
      {success && !error && (
        <p id={`${id}-success`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-success-700">
          <CheckIcon className="size-4 shrink-0" />
          {success}
        </p>
      )}
    </>
  );
}

function describedBy(id: string, { error, success, hint }: FieldState) {
  const ids = [hint && !error && `${id}-hint`, error && `${id}-error`, success && !error && `${id}-success`].filter(
    Boolean,
  );
  return ids.length ? ids.join(" ") : undefined;
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
      {required ? (
        <span className="text-danger-700" aria-hidden="true">
          {" "}
          *
        </span>
      ) : (
        <span className="font-normal text-muted"> (optional)</span>
      )}
    </label>
  );
}

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & FieldState & { label: string; id?: string };

export function TextField({ label, error, success, hint, required, className, id: idProp, ...props }: TextFieldProps) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { error, success, hint })}
        className={cn(control, controlState({ error, success }))}
        {...props}
      />
      <FieldMessages id={id} error={error} success={success} hint={hint} />
    </div>
  );
}

type TextareaFieldProps = Omit<ComponentProps<"textarea">, "id"> & FieldState & { label: string; id?: string };

export function TextareaField({
  label,
  error,
  success,
  hint,
  required,
  className,
  id: idProp,
  rows = 4,
  ...props
}: TextareaFieldProps) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { error, success, hint })}
        className={cn(control, controlState({ error, success }), "resize-y")}
        {...props}
      />
      <FieldMessages id={id} error={error} success={success} hint={hint} />
    </div>
  );
}

type SelectFieldProps = Omit<ComponentProps<"select">, "id"> &
  FieldState & { label: string; id?: string; options: { value: string; label: string }[]; placeholder?: string };

export function SelectField({
  label,
  error,
  success,
  hint,
  required,
  className,
  options,
  placeholder,
  id: idProp,
  ...props
}: SelectFieldProps) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { error, success, hint })}
          className={cn(control, controlState({ error, success }), "appearance-none pr-10")}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted" />
      </div>
      <FieldMessages id={id} error={error} success={success} hint={hint} />
    </div>
  );
}

type CheckboxProps = Omit<ComponentProps<"input">, "type" | "id"> & FieldState & { label: ReactNode; id?: string };

export function Checkbox({ label, error, hint, className, id: idProp, ...props }: CheckboxProps) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { error, hint })}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-slate-500 accent-navy-900"
          {...props}
        />
        <label htmlFor={id} className="cursor-pointer text-[0.9375rem] leading-snug">
          {label}
        </label>
      </div>
      <div className="pl-8">
        <FieldMessages id={id} error={error} hint={hint} />
      </div>
    </div>
  );
}

type RadioCardsProps = FieldState & {
  legend: string;
  name: string;
  options: { value: string; label: string; description?: string }[];
  defaultValue?: string;
  required?: boolean;
  multiple?: boolean;
  className?: string;
};

/** Radio cards (single choice) or checkbox cards (`multiple`), grouped in a fieldset. */
export function RadioCards({
  legend,
  name,
  options,
  defaultValue,
  required,
  multiple,
  error,
  hint,
  className,
}: RadioCardsProps) {
  const id = useId();
  return (
    <fieldset
      className={className}
      aria-describedby={describedBy(id, { error, hint })}
      aria-invalid={error ? true : undefined}
    >
      <legend className="mb-2 text-sm font-medium text-ink">
        {legend}
        {required && (
          <span className="text-danger-700" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "group relative flex cursor-pointer items-start gap-3 rounded-md border-2 bg-white p-4 transition-colors",
              "has-checked:border-blue-700 has-checked:bg-info-50 has-focus-visible:outline-3 has-focus-visible:outline-blue-500",
              error ? "border-danger" : "border-line hover:border-slate-500",
            )}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={o.value}
              defaultChecked={defaultValue === o.value}
              required={required && !multiple}
              className="mt-1 size-4 shrink-0 accent-navy-900 focus:outline-none"
            />
            <span>
              <span className="block font-medium text-ink">{o.label}</span>
              {o.description && <span className="mt-0.5 block text-sm text-muted">{o.description}</span>}
            </span>
          </label>
        ))}
      </div>
      <FieldMessages id={id} error={error} hint={hint} />
    </fieldset>
  );
}
