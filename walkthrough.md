# Walkthrough - Vendor Route to Customer (At-Home Bookings)

I have implemented the live vendor-to-customer route feature for "At-Home" bookings.

## Changes

### Backend
*   **Models**: Updated `Address` and `Booking` models to store precise `geo` coordinates (GeoJSON Point).
*   **Controllers**:
    *   `Address`: Now extracts and saves `geo` coordinates when adding/updating addresses.
    *   `Booking`: Copies the `geo` coordinates from the user's address to the booking record upon creation.

### Frontend
*   **Customer App**:
    *   Updated `useAddressStore` to handle `geo` data.
    *   Integrated `LocationPicker` into `AddressDialog`. Customers can now drag a map to pin their exact location.
*   **Vendor App**:
    *   Updated `useVendorBookingStore` to fetch `geo` data.
    *   Updated `VendorBookingDetail` to display a live `MapRoute` for "At-Home" bookings, showing the path from the vendor's location to the customer's pinned location.

## Verification

### Automated Tests
*   N/A (Manual verification required for map interactions)

### Manual Verification
1.  **Customer**:
    *   Go to **Profile > Addresses**.
    *   Add a new address. Verify the map appears.
    *   Pin a location and save.
    *   Book a "Home Service" using this address.
2.  **Vendor**:
    *   Login and view the new booking.
    *   Verify the **Customer Location** map card appears below service details.
    *   Ensure the route is drawn from your current location to the customer's pin.
