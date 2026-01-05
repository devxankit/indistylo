# IndiStylo Frontend Documentation

## Architecture
The application is built with React 19, Vite, and TypeScript. It uses a module-based structure:
- `src/module/user`: Customer-facing pages and components.
- `src/module/vendor`: Vendor-facing management interface.
- `src/components/ui`: Shared UI components (shadcn/ui based).

## State Management
We use **Zustand** for lightweight and performant state management:
- `useUserStore`: Handles authentication and user profile state.
- `useCartStore`: Manages the service cart and pricing calculations.
- `useAddressStore`: Manages user addresses.
- `useBookingStore`: Tracks user bookings.

## Key Components

### User Module

#### `AddressDialog`
- **Path**: `src/module/user/components/AddressDialog.tsx`
- **Props**:
  - `open: boolean`: Controls visibility.
  - `onOpenChange: (open: boolean) => void`: Visibility change callback.
- **Description**: Full address management UI with validation.

#### `SlotPicker`
- **Path**: `src/module/user/components/SlotPicker.tsx`
- **Props**:
  - `onSelect: (date: string, time: string) => void`: Callback when a slot is chosen.
  - `selectedDate?: string`: Currently selected date.
  - `selectedTime?: string`: Currently selected time.
- **Description**: Interactive calendar and time-slot selection.

#### `ReviewDialog`
- **Path**: `src/module/user/components/ReviewDialog.tsx`
- **Props**:
  - `open: boolean`: Controls visibility.
  - `onOpenChange: (open: boolean) => void`: Visibility change callback.
  - `booking: { id, salonName, service }`: Booking context for the review.
  - `onSubmit: (review: { rating, comment }) => void`: Submission handler.

## API Integration
The service layer is located in `src/module/user/services/`.
- `apiClient.ts`: Base fetch wrapper with error handling.
- `userService.ts`: User profile and address APIs.
- `bookingService.ts`: Booking and schedule APIs.

## Testing
We use **Vitest** and **React Testing Library**.
- Run tests: `npm test`
- Configuration: `vitest.config.ts`

## Responsive Design
- Mobile-first approach using Tailwind CSS.
- Navigation switches between `BottomNav` (mobile) and `TopNav` (desktop) automatically in `App.tsx`.
