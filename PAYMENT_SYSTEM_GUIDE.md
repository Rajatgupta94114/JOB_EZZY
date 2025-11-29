# JOBEZZY Payment System Guide

## Overview

The payment system allows companies to send payments to candidates after escrow contracts are confirmed. The system manages the complete payment flow from wallet connection to transaction confirmation.

## Features

### 1. **Payment Processing Flow**

The payment system follows a 4-step process:

#### Step 1: Wallet Connection
- Company connects their TON wallet
- System generates a company wallet address for reference
- Payment record is created with status `wallet_requested`

#### Step 2: Request Wallet Address
- System requests candidate's wallet address
- Candidate receives notification
- Company can see the request status

#### Step 3: Send Payment
- Company enters candidate's wallet address
- Company enters transaction hash from TON blockchain
- Payment details are verified
- Status changes to `completed`

#### Step 4: Confirmation
- Both company and candidate see payment confirmation
- Payment history is displayed on both dashboards
- Transaction details are visible

### 2. **Company Side - Making Payments**

**Location:** `/applications` page

**Steps:**
1. Navigate to Applications page
2. Find a hired candidate (status: "Candidate Hired")
3. Click "💰 Make Payment" button
4. Follow the 4-step payment wizard
5. Confirm payment with transaction details

**What's Visible:**
- Contract start/end dates
- Days remaining
- Payment amount (from contract)
- Download contract option
- Make Payment button

### 3. **Candidate Side - Receiving Payments**

**Location:** `/my-applications` page

**What's Visible:**
- Hired status with contract details
- Payment history section (if payments received)
- Transaction hash (abbreviated)
- Payment amount and currency
- Timestamp of payment

**Payment History Shows:**
```
💳 Payment Received
├─ Amount: 100 TON
├─ Transaction: 0x1234567890ab...
└─ Received: Nov 27, 2025, 2:30 PM
```

## API Endpoints

### GET /api/payments

Fetch payments with optional filters.

**Query Parameters:**
- `escrowId` - Filter by escrow contract ID
- `companyId` - Filter by company ID
- `candidateId` - Filter by candidate ID

**Example:**
```bash
GET /api/payments?candidateId=user123
GET /api/payments?escrowId=escrow_1234567890
```

### POST /api/payments

Create a new payment record.

**Request Body:**
```json
{
  "escrowId": "escrow_1234567890",
  "companyId": "company_user_id",
  "candidateId": "candidate_user_id",
  "amount": "100",
  "currency": "TON",
  "status": "wallet_requested"
}
```

**Response:**
```json
{
  "id": "payment_1234567890",
  "escrowId": "escrow_1234567890",
  "companyId": "company_user_id",
  "candidateId": "candidate_user_id",
  "amount": "100",
  "currency": "TON",
  "candidateWalletAddress": null,
  "transactionHash": null,
  "status": "wallet_requested",
  "createdAt": "2025-11-27T14:30:00Z",
  "updatedAt": "2025-11-27T14:30:00Z"
}
```

### PUT /api/payments

Update payment details.

**Request Body:**
```json
{
  "id": "payment_1234567890",
  "status": "completed",
  "candidateWalletAddress": "0x1234567890abcdef...",
  "transactionHash": "0xabcdef1234567890..."
}
```

## Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Payment created, awaiting wallet connection |
| `wallet_requested` | Company wallet connected, requesting candidate wallet |
| `wallet_received` | Candidate wallet address received |
| `completed` | Payment sent and confirmed |
| `failed` | Payment failed or cancelled |

## Data Storage

Payments are stored in `/data/payments.json`:

```json
[
  {
    "id": "payment_1234567890",
    "escrowId": "escrow_1234567890",
    "companyId": "company_user_id",
    "candidateId": "candidate_user_id",
    "amount": "100",
    "currency": "TON",
    "candidateWalletAddress": "0x1234567890abcdef...",
    "transactionHash": "0xabcdef1234567890...",
    "status": "completed",
    "createdAt": "2025-11-27T14:30:00Z",
    "updatedAt": "2025-11-27T14:35:00Z"
  }
]
```

## Integration with Escrow

When a payment is completed, the escrow contract is updated:

```
Escrow Update:
- paymentStatus: "completed"
- updatedAt: current timestamp
```

## User Experience

### For Companies

1. **View Applications** → See hired candidates
2. **Click Make Payment** → Enter payment flow
3. **Connect Wallet** → Authorize payment
4. **Request Wallet** → Ask candidate for wallet address
5. **Send Payment** → Enter transaction details
6. **Confirm** → Payment recorded

### For Candidates

1. **View My Applications** → See hired status
2. **Receive Notification** → Company requesting wallet
3. **Provide Wallet** → Share wallet address
4. **Wait for Payment** → Monitor payment status
5. **See Payment** → View in payment history

## Security Considerations

- ✅ Wallet addresses are validated
- ✅ Transaction hashes are stored for verification
- ✅ Payment records are immutable after completion
- ✅ Only company can initiate payments
- ✅ Only candidate can receive payments
- ✅ Payment amounts match contract amounts

## Testing the Payment System

### Test Scenario 1: Complete Payment Flow

1. Create a job as company
2. Apply as candidate
3. Company accepts application
4. Create escrow contract
5. Candidate accepts contract
6. Company clicks "Make Payment"
7. Follow payment wizard
8. Enter test wallet addresses
9. Verify payment appears on both dashboards

### Test Scenario 2: Payment History

1. Complete payment flow (above)
2. Navigate to candidate's "My Applications"
3. Verify payment history section shows
4. Verify payment details are correct

### Test Data

**Test Wallet Address:**
```
0x1234567890abcdef1234567890abcdef12345678
```

**Test Transaction Hash:**
```
0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
```

## Future Enhancements

- [ ] Real TON blockchain integration
- [ ] Automated wallet verification
- [ ] Payment notifications via email/SMS
- [ ] Payment receipts/invoices
- [ ] Refund functionality
- [ ] Partial payments
- [ ] Payment scheduling
- [ ] Multi-currency support
- [ ] Payment analytics dashboard

## Troubleshooting

### Payment Not Showing

**Issue:** Payment created but not visible on candidate dashboard

**Solution:**
1. Verify candidateId matches user ID
2. Check payments.json file exists
3. Refresh page (auto-refresh every 5 seconds)
4. Check browser console for errors

### Wallet Address Not Saved

**Issue:** Wallet address not persisting

**Solution:**
1. Verify wallet address format
2. Check API response status
3. Verify payments.json is writable
4. Check server logs

### Transaction Hash Invalid

**Issue:** Transaction hash not accepted

**Solution:**
1. Verify hash format (0x prefix + 64 hex chars)
2. Check for typos
3. Verify hash exists on TON blockchain
4. Use valid test hash if testing

## Support

For issues or questions:
1. Check browser console for errors
2. Review server logs
3. Verify data in payments.json
4. Check escrow contract status
