# Modal Component

A reusable, accessible modal component with consistent styling and functionality across the application.

## Features

- ✅ **Theme-aware styling** (dark/light mode)
- ✅ **Framer Motion animations** for smooth transitions
- ✅ **Keyboard support** (Escape key to close)
- ✅ **Click outside to close** (configurable)
- ✅ **Multiple sizes** (sm, md, lg, xl, full)
- ✅ **Accessible** with proper focus management
- ✅ **Body scroll lock** when modal is open
- ✅ **Backdrop blur** effect

## Usage

```tsx
import Modal from "../shared/components/Modal";

// Basic usage
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="My Modal"
>
  <p>Modal content goes here</p>
</Modal>

// With custom size
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Large Modal"
  size="xl"
>
  <p>Large modal content</p>
</Modal>

// Without close button
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  showCloseButton={false}
>
  <p>Modal without close button</p>
</Modal>

// Prevent closing on overlay click
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  closeOnOverlayClick={false}
>
  <p>Modal that can't be closed by clicking outside</p>
</Modal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Function called when modal should close |
| `title` | `string` | - | Optional title displayed in header |
| `children` | `ReactNode` | - | Modal content |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Modal size |
| `showCloseButton` | `boolean` | `true` | Whether to show close button |
| `closeOnOverlayClick` | `boolean` | `true` | Whether clicking overlay closes modal |
| `className` | `string` | `""` | Additional CSS classes |

## Sizes

- `sm`: `max-w-sm` (384px)
- `md`: `max-w-md` (448px)
- `lg`: `max-w-lg` (512px)
- `xl`: `max-w-2xl` (672px)
- `full`: `max-w-4xl` (896px)

## Examples

### Form Modal
```tsx
<Modal
  isOpen={showFormModal}
  onClose={() => setShowFormModal(false)}
  title="Create New Item"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    <input type="text" placeholder="Name" />
    <button type="submit">Submit</button>
  </form>
</Modal>
```

### Confirmation Modal
```tsx
<Modal
  isOpen={showConfirmModal}
  onClose={() => setShowConfirmModal(false)}
  title="Confirm Action"
  size="sm"
>
  <p>Are you sure you want to delete this item?</p>
  <div className="flex space-x-3 mt-4">
    <button onClick={handleConfirm}>Yes, Delete</button>
    <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
  </div>
</Modal>
```

### Full-screen Modal
```tsx
<Modal
  isOpen={showFullModal}
  onClose={() => setShowFullModal(false)}
  title="Full Screen Content"
  size="full"
>
  <div className="h-96">
    <p>Large content that needs full screen</p>
  </div>
</Modal>
```

## Best Practices

1. **Always provide an `onClose` handler** - even if you don't show the close button
2. **Use appropriate sizes** - don't use `full` for simple confirmations
3. **Keep content focused** - modals should have a single purpose
4. **Handle loading states** - disable buttons during async operations
5. **Test keyboard navigation** - ensure Tab and Escape work correctly

## Accessibility

- Modal is properly focused when opened
- Escape key closes the modal
- Body scroll is locked when modal is open
- Screen readers can access modal content
- Proper ARIA attributes are applied 