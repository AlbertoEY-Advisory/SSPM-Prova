# Use Case Naming Convention

This document defines the naming standard for **use cases** related to CASB and SSPM policies. The goal is to ensure consistent, automation-friendly, and easily searchable naming across all repositories.

---

## Core Syntax

```
UC-<REPO>-<ID>-<TITLE>
```

Where:

* **UC** → Literal prefix indicating a *Use Case*
* **REPO** → Technology area or repository (CASB or SSPM)
* **ID** → Two‑digit progressive number (01–99)
* **TITLE** → Short PascalCase description

---

## 1. UC (Prefix)

Always set to:

```
UC
```

Indicates that the entry represents a **Use Case**, not a policy or configuration.

---

## 2. REPO

Specifies the domain or repository the use case belongs to.

Allowed values:

| Value    | Meaning                                         |
| -------- | ----------------------------------------------- |
| **CASB** | Cloud Access Security Broker use cases          |
| **SSPM** | SaaS Security Posture Management use cases      |
| **GEN**  | Cross-technology / generic use cases (optional) |

---

## 3. ID

A two‑digit, progressive identifier **unique within each REPO**.

Format:

```
01–99
```

Examples:

* `01` → First use case
* `02` → Second use case
* `10` → Tenth use case

IDs reset **per REPO**, not globally.

---

## 4. TITLE

A short, descriptive name written in **PascalCase**, without spaces, underscores, or special characters.

Examples:

* `AIFiltering`
* `ExternalSharingDisabled`
* `InactiveAdminsDetection`
* `LegacyAuthBlocked`

---

## Overview of Full Format

Example:

```
UC-CASB-01-AIFiltering
```

Breakdown:

* `UC` → Use Case
* `CASB` → Repository (CASB use case)
* `01` → Progressive identifier
* `AIFiltering` → Short, PascalCase title

---

## Examples

### CASB Use Cases

* `UC-CASB-01-AIFiltering`
* `UC-CASB-02-UnsanctionedAppsControl`
* `UC-CASB-03-DataExfiltrationAlerting`
* `UC-CASB-04-ExternalSharingMonitoring`

### SSPM Use Cases

* `UC-SSPM-01-LegacyAuthDisabled`
* `UC-SSPM-02-GuestAccessRestricted`
* `UC-SSPM-03-InactiveAdminsDetection`
* `UC-SSPM-04-ThirdPartyAppReview`

### Generic / Cross-Technology

* `UC-GEN-01-CompanywideSecurityBaseline`
* `UC-GEN-02-PrivilegedAccessHardening`

---

## Regex Validation Rule

To ensure naming compliance:

```regex
^UC-(CASB|SSPM|GEN)-[0-9]{2}-[A-Z][A-Za-z0-9]+$
```


---

