# Implementation Plan - Vendor Route to Customer (At-Home Bookings)

I will implement a feature allowing vendors to see a live route to the customer's location for "At-Home" bookings.

## Proposed Changes

### Backend

#### Models
*   **`Address` Model**: Add `geo` field to store latitude/longitude.
*   **`Booking` Model**: Add `geo` field to store the snapshot of the service location.

#### Controllers
*   **`address.controller.ts`**: Update `addAddress` and `updateAddress` to accept and save `geo` data.
*   **`booking.controller.ts`**: In `createBooking`, when `type` is `at-home`, fetch the selected user address and copy its `geo` data to the new booking record.

### Frontend

#### Customer App
*   **`AddressDialog.tsx`**:
    *   Integrate `LocationPicker` (reused from Vendor registration) to allow users to pin their exact home location.
    *   Update form state to include `geo` coordinates.
*   **`useAddressStore.ts`**: Update `Address` interface and API requests to handle `geo`.

#### Vendor App
*   **`VendorBookingDetail.tsx`**:
    *   Import `MapRoute`.
    *   For `at-home` bookings, render the `MapRoute` component.
    *   Pass the booking's `geo` (customer location) as the destination.
    *   The map will display the route from the Vendor's current device location (origin) to the Customer's home (destination).

## Verification Plan

### Manual Verification
1.  **Customer Side**:
    *   Go to Profile -> Addresses.
    *   Add a new address: Verify the Map Picker appears.
    *   Pin a location and save.
    *   Book a service "At Home" using this address.
2.  **Vendor Side**:
    *   Login as the vendor.
    *   Open the new booking details.
    *   Verify a map appears showing the route to the pinned location.
    *   Check if the "Navigate" button opens Google Maps with coordinates.
