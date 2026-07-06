# KeyRing 🛡️
### Scoped, Time-Boxed Delegation for Aging-Parent Financial & Account Oversight

**KeyRing** is a delegation and audit layer designed to sit between "full power of attorney" and "informal password sharing" for families managing the cognitive or physical decline of aging parents. It allows parents to grant narrow, named, time-boxed access to specific domains (financial, medical, household, insurance) to multiple delegates without relinquishing dignity, control, or security.

---

## 🚀 Live Deployments
* **Frontend Application:** [https://keyring-jet.vercel.app/](https://keyring-jet.vercel.app/) (Deployed on Vercel)
* **Backend API:** [https://keyring-0edj.onrender.com](https://keyring-0edj.onrender.com) (Deployed on Render)

---

## 💡 The Problem & The Solution
When a parent starts declining, families often resort to sharing logins or signing broad, permanent Powers of Attorney (POA). 
* **Broad POA** is all-or-nothing and legal-heavy.
* **Informal password sharing** has no scope, no expiry, and no record, making it a primary vector for elder financial abuse or family disputes.

**KeyRing** introduces a **delegation layer** with:
1. **Granular Scopes & Domains:** Keep tasks partitioned. A sibling handling medical portals doesn't get access to the parent's bank accounts.
2. **Strict Time Limits:** Every grant must have an expiration date. Renewal is active, never silent or automatic.
3. **Quorum & Escalations:** Moving from view-only to paying bills requires parent consent or approval from a pre-defined sibling/co-signer quorum.
4. **Immutable Audit Trail:** All delegate actions are logged with hash chaining for tamper-evidence.

---

## 🛠️ Technology Stack
### Frontend
* **Core:** React 19 (TypeScript), Vite 8
* **Styling:** Tailwind CSS (v4)
* **Icons:** Lucide React
* **Real-time:** Socket.io-client

### Backend
* **Runtime:** Node.js, Express, TypeScript
* **Database:** MongoDB & Mongoose
* **Sockets:** Socket.io
* **Automation:** Node-cron (for checking expired grants)
* **Reports:** PDFKit & JSON2CSV (for exportable audit logs)

---

## 📂 Directory Structure
```text
KeyRing/
├── backend/                   # Node.js + Express backend service
│   ├── src/
│   │   ├── controllers/      # API Route Handlers & business logic
│   │   ├── middleware/       # Auth & validation middleware
│   │   ├── models/           # MongoDB schemas (User, Grant, Escalation, Audit)
│   │   ├── services/         # Agent roles (Intake, Grant, Escalation, Guardian)
│   │   ├── utils/            # Cron jobs, cryptography, PDF/CSV reports
│   │   └── server.ts         # Main server entrypoint
│   ├── .env                  # Environment configurations
│   ├── package.json
│   └── tsconfig.json
├── frontend/                  # React + Vite frontend service
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── App.tsx           # Main application interface and views
│   │   ├── index.css         # Styling system
│   │   └── main.tsx          # React application entrypoint
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 🔑 Key Concepts & Data Models

### 1. Grant
Represents the permission granted to a delegate. **No grant can exist without an expiry date.**
* **Scope Tiers:**
  1. `view_only`: Read balance, statement, portals. No actions.
  2. `pay_bills`: View-only plus paying recognized recurring bills up to a defined cap.
  3. `full_manage`: Complete access (add payees, one-off payments) with optional co-signing requirements.
* **Domains:** `financial`, `medical`, `household`, `insurance`, `all`.

### 2. Escalation Request
Created when a delegate needs a higher scope (e.g., changing from `view_only` to `pay_bills`). Requires approval from either the parent or a quorum of family co-signers.

### 3. Audit Log
Every single action (such as viewing a balance, paying a bill, initiating an escalation, or revoking a grant) is recorded as a hash-chained event. This prevents silent tampering and protects both the parent and the honest delegate.

---

## 🔄 Core Workflows & Lifecycle

KeyRing operates through a clear sequence of family coordination and automated enforcement:

```text
[1. Onboarding/Demo Seeding]
             │
             ▼
[2. Parent Grants Delegation] ─── (Specific scope + expiry + caps)
             │
             ▼
[3. Action Execution by Delegate]
             │
      ┌──────┴──────┐
      ▼             ▼
[Blocked by Gate]  [Approved & Executed] ───► [Tamper-Evident Audit Event]
      │                                                │
      └──────────────┬─────────────────────────────────┘
                     ▼
[4. Delegate Requests Scope Escalation]
                     │
                     ▼
[5. Co-Signer Quorum Votes (Approve/Deny)]
                     │
                     ▼
             [Permission Updated]
```

### 1. Onboarding & Seeding Demo Environment
To quickly preview KeyRing, click the **"Seed Demo Data"** action. This sets up the following family profiles (`password123`):
* **Jo (Parent):** The account owner who delegates and revokes access.
* **Priya (Primary Delegate):** Sibling managing core finances.
* **Sam & Sarah (Co-signers):** Siblings who act as voting auditors.
* **Mr. Henderson (Family Advisor):** Advisor with read-only access to audit logs.

### 2. Creating Scoped Grants
Only the user registered as the **Parent** can assign grants. Each grant holds explicit parameters:
* Target delegate and specific domain.
* Scope tier with spend caps (monthly & per-transaction).
* Expiration date. (An automated node-cron script checks every 10 seconds to flag and disable expired grants).

### 3. Guardian-Gated Execution
Every action request flows to the `GuardianAgent` policy gate.
* **Valid Requests:** Allowed, processed via the `ExecutionAgent` (communicating with simulated bank APIs), and saved in the audit log.
* **Invalid Requests:** Blocked immediately (e.g., trying to pay a bill with a `view_only` grant, or exceeding the transaction limit). A WebSocket event (`guardian_violation`) is triggered, displaying a live security alert on the dashboards of all active family members.

### 4. Quorum-Based Escalation
Delegates can request an upgraded scope. The `EscalationAgent` distributes the request:
* Co-signer siblings or the parent receive a notification on their dashboard.
* Co-signers vote (approve or deny) and leave optional justification notes.
* Once the pre-defined family quorum (e.g., 1 approval) is met, the grant scope upgrades automatically.

### 5. Cryptographic Verification & Export
Every event is recorded in a hash-chained audit ledger, where each block contains the cryptographic signature of the preceding block (`prev_event_hash`).
* Clicking **"Verify Integrity"** evaluates the whole history to confirm zero database manipulation.
* Full logs are exportable as signed **PDF Reports** or **CSV sheets**.

---

## 🤖 The Five-Agent Architecture

KeyRing structures tasks into distinct, isolated agent roles:

* **Intake Agent:** Handles family creation, sibling registrations, and defaults quorum levels.
* **Grant Agent:** Oversees creation, expiration, revocation, and renewal of Grants.
* **Escalation Agent:** Directs the scope escalation lifecycle, handling approval voting and permission changes.
* **Execution Agent:** Performs actions inside the external tool layers (simulating bank payments, balance checks).
* **Guardian Agent:** The policy enforcement gate. Intercepts all requests and approves/denies them against active grants and limits.

---

## ⚙️ Local Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [MongoDB](https://www.mongodb.com/) (Local instance or remote connection string)

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
# backend/.env
PORT=5000
MONGO_URI="your-mongodb-connection-string"
CLIENT_URL="http://localhost:5173"
```

### 3. Start Development Servers

#### Run Backend:
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000`.*

#### Run Frontend:
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📝 License
This project is prepared for hackathon demonstration. All rights reserved.