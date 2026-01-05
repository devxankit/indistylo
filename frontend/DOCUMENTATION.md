# IndiStylo Frontend Documentation

## Architecture Overview
IndiStylo is built with React 19, TypeScript, and Vite. It follows a module-based architecture with separate folders for `user` and `vendor` modules.

### Core Technologies
- **React 19**: UI Library
- **Zustand**: State Management
- **React Router DOM v7**: Routing
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Sonner**: Toast Notifications
- **Lucide React**: Icons
- **Vitest**: Unit Testing

## Directory Structure
```
src/
├── components/          # Shared UI components (Shadcn/UI)
├── hooks/              # Global custom hooks
├── lib/                # Shared utilities and libraries
├── module/
│   ├── user/           # Customer-facing module
│   │   ├── components/ # User-specific components
│   │   ├── pages/      # User-facing pages
│   │   ├── services/   # API client and services
│   │   └── store/      # Zustand stores for user module
│   └── vendor/         # Partner-facing module
│       ├── vendor-components/
│       ├── vendor-pages/
│       └── store/
├── App.tsx             # Root component & Routing
└── main.tsx            # Entry point
```

## Key Components

### UI Components (Shadcn/UI)
Located in `src/components/ui/`.
- `Button`: Versatile button component with multiple variants.
- `Card`: Container for grouping content.
- `Carousel`: Image and content slider using Embla Carousel.
- `Dialog`: Modal dialogs for forms and alerts.

### User Module Components
- `Header`: Main navigation header for the user module.
- `BottomNav`: Tab-based navigation for mobile and top navigation for desktop.
- `AddressDialog`: CRUD interface for managing user addresses.
- `SlotPicker`: Date and time selection for bookings.

## State Management (Zustand)

### `useUserStore`
Manages core user state:
- `name`: User's full name.
- `isLoggedIn`: Authentication status.
- `userPhone`: Logged-in user's phone number.
- `location`: Currently selected service location.
- `points`: ISP loyalty points.

### `useCartStore`
Manages the shopping cart:
- `items`: List of services/products in the cart.
- `addItem`, `removeItem`, `clearCart`: Cart operations.
- `getTotal`: Calculates the total price including fees.

## API Integration
The application uses a centralized API client in `src/module/user/services/apiClient.ts`.

### `userService`
- `getProfile()`: Fetches user profile data.
- `updateProfile(data)`: Updates user information.
- `getAddresses()`: Retrieves saved addresses.

### `authService`
- `sendOtp(phone)`: Triggers OTP delivery.
- `verifyOtp(phone, otp)`: Verifies OTP and returns a session token.

## Testing
Unit tests are written with Vitest.
- Run tests: `npm test`
- Example test: `src/module/user/store/useUserStore.test.ts`

## Styling Guidelines
- Use Tailwind CSS classes for all styling.
- Follow the color palette defined in `index.css`.
- Use the `cn()` utility for conditional class merging.
