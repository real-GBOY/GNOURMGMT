<!-- @format -->

## GenericForm Implementation Guide

This document explains how `src/shared/components/Form/GenericForm.tsx` works end-to-end: its props, internal helpers, input-type inference, UI/UX details, validation, and extensibility. It also includes example usage patterns.

### Purpose

`GenericForm<T>` renders a fully-typed, theme-aware, animated form from a Yup schema and optional select options. It integrates with `react-hook-form` for state management and validation via `yupResolver`.

### Key Dependencies

- **react-hook-form**: form state (`useForm`), registration, submission, errors
- **@hookform/resolvers/yup**: integrates Yup validation
- **yup**: schema definition (`AnyObjectSchema`)
- **framer-motion**: subtle mount and field animations
- **lucide-react**: password visibility and error icons
- **ThemeContext**: dark/light theming (`useTheme`)

### Component Signature

```
export function GenericForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  submitButtonText = "Submit",
  className = "",
  selectOptions = {},
  context = {},
}: GenericFormProps<T>)
```

### Props

- **schema** (AnyObjectSchema): Yup object schema. Drives fields and validation.
- **defaultValues?** (Partial<T>): Initial values for the form.
- **onSubmit** ((data: T) => void | Promise<void>): Submit handler.
- **submitButtonText?** (string): Button label; defaults to "Submit".
- **className?** (string): Extra classes added to the form container.
- **selectOptions?** (Record<string, { value: string; label: string }[]>):
  - Overrides options for specific fields (e.g., for dynamic lists like teams).
  - If provided for a field, that field becomes a `select`.
- **context?** (Record<string, any>): Extra context passed to `useForm` and used for conditional UI (e.g., `context.teamsLoading`).

### Internal State and Form Setup

- Uses `useTheme()` to adapt colors for dark/light themes.
- Uses `useForm<T>` with `yupResolver(schema)` and provided `defaultValues` and `context`.
- Tracks per-field password visibility in local state: `passwordVisibility: Record<string, boolean>`.

### Field Discovery

```
const fields = Object.entries(schema.fields) as [string, SchemaField][];
```

Every key in the Yup object schema becomes a form field.

### Input Type Inference

`getInputType(fieldSchema, key, selectOptions)` determines how each field renders.

Inference order (first match wins):

1. **Explicit file-like keys**: `image`, `file`, `certificateFile`, `achievementPhoto`, `supportingDocuments` → `file`
   - `supportingDocuments` supports multiple files.
2. **Video / PDF keys**: `videoFile` → `video`; `pdfFile` → `pdf`.
3. **Password confirmation**: keys matching `confirmPassword`/`confirm_password` → `password`.
4. **Provided select options**: if `selectOptions[key]` exists and has entries → `select`.
5. **Enum detection from schema** → `select` if any valid string enum values are found via `getEnumValues()`.
6. **Common enum name patterns** (`status`, `type`, `category`, `priority`, `state`, `role`, `mode`) with Yup string type → `select`.
7. **Email detection**: if Yup tests include `email` → `email`.
8. **Password name detection**: if key contains `password` → `password`.
9. **Date/time name detection**:
   - If key contains `birth` or `dateOfBirth` → `date` (DOB-friendly)
   - Else if key contains `time` or `date` → `datetime-local`
10. **Fallbacks by Yup type**: `string` → `text`, `number` → `number`, `boolean` → `checkbox`, `date` → `date`, default → `text`.

Supporting helpers:

- `getEnumValues(fieldSchema)`: Extracts enum strings from multiple possible Yup structures: `oneOf`, `spec.oneOf`, and internal `_whitelist`; filters out Yup refs and non-strings.
- `formatSelectOption(value)`: Pretty-prints enum values (handles kebab/snake case → Title Case).
- `formatLabel(key)`: Humanizes labels (splits camelCase, special-cases `bio` and `file`).

### Rendering by Type

Each field is rendered within an animated container and themed styles. Error state adds red borders and shows a message.

- **Select**:

  - Populates options from `selectOptions[key]` if provided; otherwise from `getEnumValues(schema)`.
  - Handles `context.teamsLoading` to disable/team-specific placeholder when `key === "team"`.

- **Checkbox**:

  - Renders a single boolean toggle with the label to the right.

- **File**:

  - Accepts a wide range of file types (pdf, images, doc/docx, etc.).
  - `supportingDocuments` allows multi-file selection and renders a list preview with per-file remove.
  - All other file fields show a single-file preview with size and a clear button.
  - Uses `setValue` to store `File` or `File[]` in form state.

- **Video** and **PDF**:

  - Specialized file accept filters (`video/*` or `.pdf`).
  - Stores the selected `File` via `setValue`.

- **Date** (DOB-friendly):

  - Uses `<input type="date">`, max set to today, themed calendar indicator.

- **Datetime-local** (future-only):

  - Uses `<input type="datetime-local">`, `min` set to now, themed calendar indicator.

- **Text-like inputs** (text, email, number, password):
  - Uses a single `<input>` with placeholder and theming.
  - Password fields include a visibility toggle button (`Eye`/`EyeOff`) tied to `passwordVisibility[key]`.

### Validation and Errors

- Validation is handled entirely by Yup via `yupResolver`.
- Error messages per field are displayed under the input with an `AlertCircle` icon.
- `react-hook-form`’s `errors[key]?.message` is cast to string for display.

### Submission

- Wraps `handleSubmit(handleFormSubmit)` from `react-hook-form`.
- `handleFormSubmit` simply forwards the resolved data to the `onSubmit` prop.
- Submit button shows an animated spinner and becomes disabled when `isSubmitting` is true.

### Theming

- Consistently applies dark/light classes based on `useTheme()` (`theme === "dark" ? ... : ...`).
- Applies hover/focus states, borders, shadows, and subtle glassmorphism-like backgrounds.

### Animations

- Container fade/slide-in via `motion.div`.
- Field-level staggered slide-in (based on index) for a progressive reveal.
- Error message animates into view.
- Submit button scales on hover/tap; pulses while submitting.

### Extensibility Notes

- Add new field-type heuristics in `getInputType` to support custom inputs.
- Provide `selectOptions` for dynamic server-driven lists; omit to rely on schema enums.
- Use `context` for form-level conditional UI (e.g., per-field loading/disabled states).
- To support custom renderers per key, you could switch from a single inference function to a pluggable renderer map keyed by field name or type.

### Example Usage

```tsx
import * as yup from "yup";
import { GenericForm } from "../shared/components/Form/GenericForm";

const schema = yup.object({
	fullName: yup.string().required(),
	email: yup.string().email().required(),
	role: yup.string().oneOf(["admin", "member", "guest"]).required(),
	password: yup.string().min(8).required(),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required(),
	dateOfBirth: yup.date().required(),
	newsletter: yup.boolean().default(false),
	supportingDocuments: yup.mixed(),
});

type FormData = yup.InferType<typeof schema>;

export default function Example() {
	return (
		<GenericForm<FormData>
			schema={schema}
			defaultValues={{ newsletter: false }}
			onSubmit={async (data) => {
				// Handle submit
				console.log(data);
			}}
			submitButtonText='Create Account'
			selectOptions={{
				role: [
					{ value: "admin", label: "Admin" },
					{ value: "member", label: "Member" },
					{ value: "guest", label: "Guest" },
				],
			}}
			context={{ teamsLoading: false }}
		/>
	);
}
```

### Gotchas and Tips

- If both `selectOptions[key]` and schema enums exist, `selectOptions[key]` takes precedence.
- `confirmPassword` is forced to render as `password` input (not select), even if schema enums match.
- For DOB fields, the component automatically uses `type="date"` and caps selection to today.
- `supportingDocuments` is hardcoded to accept multiple files and previews them; other file fields accept a single file.
- If you need to control min/max for numeric fields, define it in the schema and optionally extend the renderer to read it.

### File Location

- `src/shared/components/Form/GenericForm.tsx`






