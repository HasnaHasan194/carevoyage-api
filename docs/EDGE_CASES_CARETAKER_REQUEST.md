# Caretaker Request – Edge Cases and How They Are Handled

This document describes how the **Request Caretaker** feature handles business rules and edge cases without breaking existing booking, payment, or caretaker flows.

---

## 1. When to show "Request Caretaker"

- **Rule:** Only show when caretaker selection is required and no caretakers are available.
- **Handling:**  
  - Frontend (Step 4): The "Request Caretaker" block is shown only when `requiresCaretaker === true` and `!caretakersList?.length`.  
  - If the user did not require a caretaker (Step 3: "No"), they never see the caretaker list or the request button.

---

## 2. Deduplication (same user + package)

- **Rule:** Prevent duplicate requests for the same user and package.
- **Handling:**  
  - **Backend:** `CreateCaretakerRequestUseCase` calls `findPendingByClientAndPackage(clientId, packageId)` before creating. If a **pending** request already exists, it returns without creating a new one and without throwing. The API still returns 200 and "Caretaker request sent."  
  - **Frontend:** After a successful request, `caretakerRequestSent` is set to `true`, so the button is replaced by "Request sent. The agency will be notified." to avoid duplicate clicks.  
  - Result: Idempotent behaviour for refresh/resubmit and double-click.

---

## 3. Scoped to the correct agency

- **Rule:** Requests must be scoped to the agency that owns the package.
- **Handling:**  
  - **Create:** The request is created with `agencyId: pkg.agencyId` (from the package). The notification email is sent to the agency user (via `agency.userId` → user email).  
  - **List:** Agency sees only its own requests; `ListCaretakerRequestsUseCase` uses `findByAgencyId(agencyId)` where `agencyId` comes from the authenticated agency.  
  - **Fulfill:** `FulfillCaretakerRequestUseCase` checks `request.agencyId === agencyId`; if not, it throws `NOT_AGENCY_REQUEST`. Only the owning agency can fulfill.

---

## 4. Do not block payment

- **Rule:** Do not block the payment flow when caretaker is optional.
- **Handling:**  
  - In Step 4, when there are no caretakers, the user still sees **"Skip to payment summary"**. They can proceed to payment without a caretaker.  
  - Requesting a caretaker is an additional action; it does not gate checkout.

---

## 5. Multiple caretaker requests for the same package

- **Rule:** Multiple clients can request a caretaker for the same package.
- **Handling:**  
  - Deduplication is per **client + package** (one pending per user per package). Different clients can each create one pending request for the same package.  
  - Agency sees all requests in the list (pending and fulfilled) and can fulfill each one independently.

---

## 6. Caretaker becomes AVAILABLE after a request was sent

- **Rule:** No special behaviour required; request remains valid.
- **Handling:**  
  - The request is already stored and the agency has been emailed.  
  - When the caretaker becomes AVAILABLE, the client can return to the package and book with a caretaker as usual.  
  - The existing request stays in the list; the agency can still mark it as fulfilled and notify the client, or leave it and the client may book without using the request.

---

## 7. User refreshes page and resends request

- **Rule:** Avoid duplicate requests and confusing errors.
- **Handling:**  
  - **Backend:** As in §2, `findPendingByClientAndPackage` prevents a second pending request. The second call returns success without creating a new row or sending another email.  
  - **Frontend:** After the first success, the UI shows "Request sent..." so the user does not see the button again unless they leave and come back; even then, the backend remains idempotent.

---

## 8. Agency deletes caretaker while requests are pending

- **Rule:** Requests are for the package, not a specific caretaker. Agency can still fulfill (e.g. after inviting a new one or setting another to AVAILABLE).
- **Handling:**  
  - Requests do not reference a caretaker until **fulfill**.  
  - Agency can invite a new caretaker or set another to AVAILABLE, then use "Fulfill & notify client" (with optional message).  
  - `fulfilledByCaretakerId` is optional; if the agency later deletes that caretaker, the request remains fulfilled and the client has already been notified.

---

## 9. Package or user deleted after request was created

- **Rule:** Keep requests visible for auditing; handle missing package/user gracefully.
- **Handling:**  
  - **List:** `ListCaretakerRequestsUseCase` loads package and client user per request. If the package is missing, it uses `"Unknown package"`; if the client user is missing, it uses `"Unknown"` and empty email. The request still appears in the agency list.  
  - **Fulfill:** Fulfillment only needs `request` and `agencyId`; it does not depend on package or client still existing. If the client user is missing, the fulfillment email is skipped (no email address), but the request is still marked fulfilled.

---

## 10. Fulfill called twice (e.g. duplicate click or race)

- **Rule:** Only pending requests can be fulfilled.
- **Handling:**  
  - `FulfillCaretakerRequestUseCase` checks `request.status === "pending"`. If the request is already fulfilled (or cancelled), it throws `NOT_PENDING`.  
  - The second call does not update the request again and the client is not emailed twice.

---

## Summary table

| Edge case / rule                         | Where it’s handled                    | Behaviour |
|------------------------------------------|---------------------------------------|-----------|
| Show Request only when required + none   | Frontend Step 4                       | Conditional UI |
| Duplicate (same user + package)           | Create use case + frontend state      | Idempotent; no second row |
| Agency scope                             | Create (agencyId from package), List, Fulfill | Only owning agency sees/fulfills |
| Don’t block payment                      | Frontend Step 4                       | Skip to payment always available |
| Multiple requests same package            | Per client+package dedup             | Allowed for different clients |
| Caretaker becomes AVAILABLE later         | No extra logic                        | Request remains; client can book normally |
| Refresh and resend                       | Create use case dedup                 | 200, no duplicate request |
| Agency deletes caretaker while pending   | Optional fulfilledByCaretakerId        | Agency can fulfill with new/other caretaker |
| Package/user deleted                     | List use case                         | "Unknown package" / "Unknown"; request still listed |
| Double fulfill                           | Fulfill use case                      | NOT_PENDING on second call |
