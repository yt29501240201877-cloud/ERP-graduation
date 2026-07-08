# 🦋 Flugur ERP

**The Future of Accounting ERP Systems**

A next-generation, cloud-native Enterprise Resource Planning system purpose-built for the modern accounting landscape. Flugur connects Finance, Sales, HR, and Operations on a single source of truth — a unified Digital Nervous System that eliminates data lag, spreadsheet risk, and departmental silos.

[![Status](https://img.shields.io/badge/status-testing%20%2F%20initial%20deployment-yellow)]()
[![Version](https://img.shields.io/badge/version-1.0--preliminary-blue)]()
[![License](https://img.shields.io/badge/license-TBD-lightgrey)]()

---

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem](#-the-problem)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Data Model](#-data-model)
- [Security](#-security)
- [Prophet AI Forecasting](#-prophet-ai-forecasting)
- [Project Status](#-project-status)
- [Dependencies](#-dependencies)

---

## 🚀 Overview

Modern enterprises run on a patchwork of disconnected tools — spreadsheets, isolated databases, and department-specific applications. That fragmentation slows decisions, threatens data integrity, and complicates compliance.

Flugur ERP solves this with a normalized **General Ledger hub**, a **Zero-Trust security pipeline**, a **real-time cross-departmental notification engine**, and an integrated **AI forecasting module (Prophet AI)** for predictive financial analytics.

Flugur is scoped for mid-to-large enterprises that need:

- Integrated financial management across multiple legal entities and currencies
- A cloud-native, highly scalable relational architecture
- Real-time cross-departmental data propagation and notifications
- AI-driven predictive financial forecasting
- Zero-trust security with full audit traceability
- Compliance with GAAP, IFRS, and SOX

## ⚠️ The Problem

Siloed legacy systems suffer from three compounding failure modes:

| Failure Mode | Impact |
|---|---|
| **Data Velocity Collapse** | Manual entry and batch processing cause reactive, after-the-fact financial steering |
| **Spreadsheet Vulnerabilities** | Untraceable, access-uncontrolled files are prone to costly errors and compliance risk |
| **Departmental Silos** | Decisions made on incomplete information, with no cross-functional visibility |

## 🏗️ Architecture

Flugur is built around the concept of a **Digital Nervous System** — every financial event propagates in real time to all relevant stakeholders, organized around four pillars:

- **Core Operations** — the General Ledger and associated financial modules
- **Uncompromising Security** — zero-trust authentication, encryption, and RBAC
- **Cross-Functional Unity** — real-time notification engine bridging all departments
- **Boundless Scalability** — cloud-native infrastructure with 10X capacity scaling

### Operational Process Flow

```
Authentication & Access   → Login → USERS validation → JWT issued → REFRESH_TOKENS
Operational Logging       → Permission check (ROLES/USER_ROLES) → AUDIT_LOGS
Operational Data          → AP process → VENDORS validated → AP_INVOICES recorded
The Central Hub (GL)      → Journal headers/lines generated → posted to GL_ACCOUNTS
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | **React.js** | Component-based SPA with SSR for dashboards and reporting |
| Backend | **Node.js + Express.js** | RESTful API server for business logic and orchestration |
| Backend | **JWT + bcrypt** | Stateless auth tokens and secure password hashing |
| Database | **MongoDB** | Primary database for all financial ledger entities |
| Database | **Redis** | In-memory caching for sessions and real-time notification queues |
| AI Module | **Prophet** (Meta) | Time-series forecasting for predictive financial analytics |
| Cloud | **AWS** (EC2, RDS, S3) | Scalable infrastructure; 10X transaction capacity |
| Security | **AES-256** | Data-at-rest encryption for sensitive financial records |

## 🗃️ Data Model

The schema is organized into three functional domains around a central General Ledger hub:

| Module | Description | Key Entities |
|---|---|---|
| **General Ledger** | Central repository for all financial transactions | `GL_ACCOUNTS`, `JOURNAL_HEADERS`, `JOURNAL_LINES`, `ACCOUNTING_PERIODS` |
| **Accounts Payable** | Vendor invoices, payment scheduling, cash outflow | `VENDORS`, `AP_INVOICES`, `JOURNAL_HEADERS` |
| **Accounts Receivable** | Customer billing, collections, incoming cash flow | `CUSTOMERS`, `AR_INVOICES`, `JOURNAL_HEADERS` |
| **Asset Management** | Tracking and depreciation of assets | `GL_ACCOUNTS`, `JOURNAL_LINES` |
| **Reporting & Analytics** | P&L, balance sheets, AI forecasting | All ledger entities + AI layer |
| **Authentication & RBAC** | Zero-trust security pipeline | `USERS`, `USER_ROLES`, `ROLES`, `REFRESH_TOKENS`, `AUDIT_LOGS` |

**12 core tables** are fully defined and migrated.

## 🔐 Security

### Zero-Trust Authentication Pipeline

1. **User Login** — bcrypt-hashed credentials over TLS
2. **MFA Challenge** — authenticator app or SMS OTP
3. **Token Generation** — signed JWT with configurable expiry; refresh tokens in `REFRESH_TOKENS`
4. **RBAC Mapping** — every API endpoint validates role claims via `ROLES`/`USER_ROLES`

### Vault Guarantees

- 🔒 **Centralized Protection** — single encrypted repository, no disparate local files
- 🎚️ **Role-Based Access** — granular control prevents internal fraud
- 📝 **Audit Readiness** — immutable transaction logs in `AUDIT_LOGS`
- ⚖️ **Regulatory Alignment** — automatic updates for GAAP, IFRS, SOX

## 🤖 Prophet AI Forecasting

A dedicated analytics microservice built on Meta's open-source [Prophet](https://github.com/facebook/prophet) library. It ingests AP/AR cash-flow feeds and the General Ledger hub to surface forward-looking forecasts in the Advanced Reporting dashboard.

- **Automated Trend Detection** — surfaces structural shifts in revenue without manual mining
- **Seasonality Modeling** — isolates overlapping seasonal patterns (holidays, fiscal quarters, industry cycles)
- **Outlier Immunity** — filters anomalous shocks to keep forecasts statistically reliable

## ✅ Project Status

Flugur ERP is currently in **testing and initial deployment**. The following are implemented and validated:

- Complete entity-relationship data model (12 core tables)
- Zero-Trust authentication pipeline (Login → MFA → JWT → RBAC)
- General Ledger: journal entry creation, posting, real-time balance updates
- Accounts Payable: vendor management, invoicing, GL auto-posting
- Accounts Receivable: customer management, AR invoice lifecycle
- Automated bank reconciliation engine
- Real-time cross-departmental notification engine
- Prophet AI forecasting microservice
- Automated P&L and balance sheet generation
- AES-256 at-rest / TLS in-transit encryption across all endpoints
- Immutable `AUDIT_LOGS` write pipeline

## 📦 Dependencies

| Package | License | Purpose |
|---|---|---|
| React.js | MIT | Frontend UI framework |
| Node.js + Express.js | MIT | Backend API server |
| MongoDB | SSPL | Primary database |
| Redis | BSD 3-Clause | Session caching & pub/sub |
| jsonwebtoken | MIT | JWT generation/verification |
| bcrypt | MIT | Password hashing |
| Prophet (Meta) | MIT | AI time-series forecasting |
| Axios | MIT | HTTP client |

---

<p align="center">
  <em>Flugur ERP — The Future of Accounting ERP Systems</em><br>
  Preliminary Defense Submission · Version 1.0 · June 2026
</p>
