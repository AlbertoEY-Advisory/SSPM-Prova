# SSPM Policy Naming Standard

**Version:** 1.0
**Owner:** TBD
**Scope:** SaaS Security Posture Management (SSPM) policies across supported SaaS platforms (e.g., M365, Google Workspace, Salesforce, Slack, etc.).

This document defines the naming convention to be used for all SSPM policies stored in this repository.
The goal is to ensure **consistency**, **readability**, **clear separation between baseline deviations and custom security rules**.

---

## Purpose

This standard ensures **consistent and machine-parsable naming** for SSPM policies. It supports:

* **Traceability** of security posture changes
* **Clear differentiation** between baseline exceptions and custom controls

---

## Naming Syntax

Below is the SSPM naming structure adapted to posture management use cases.

---

## Core Structure (mandatory)

```
<CLASS>-<PLATFORM>-<TYPE>-<SCOPE>-<TAGS>-<TITLE>
```

Where:

* `TAGS` is optional and used only when it adds operational value
* `TITLE` is mandatory and always written in **PascalCase**

---

## 1. CLASS

High-level intent of the policy:

* **BASE** → Baseline deviation (muted/ignored default control)
* **CUST** → Custom rule (organization-defined posture check)

---

## 2. PLATFORM

Standardized 3–5 character code for the target SaaS platform:

Common examples:

* **M365** → Microsoft 365
* **GWS** → Google Workspace
* **SLSF** → Salesforce
* **SLK** → Slack
* **BOX** → Box
* **GIT** → GitHub
* **OKT** → Okta
* **AWS** → Amazon Web Services
* **SNOW** → ServiceNow
* **WDAY** → Workday
* **MLT** → Multi-platform / Generic

---

## 3. TYPE

Technical nature of the posture rule:

* **IGNORE** → Explicitly ignores/mutes a default vendor rule
* **MODIFY** → Alters vendor-recommended default behavior
* **ENFORCE** → Enforces a required configuration state
* **DETECT** → Passive posture monitoring only

---

## 4. SCOPE

Target population or configuration boundary:

* **ALL** → Global / tenant-wide
* **USR** → User-level
* **ADM** → Admin / privileged users
* **EXT** → External / guest users
* **APP** → Application-specific
* **API** → API / integrations
* **DEV** → Developer / CI/CD identities
* **SVC** → Service accounts
* **GRP** → Group-scoped

---

## 5. OPTIONAL TAGS

Tags are included **inline (without brackets)** and treated as atomic fields.

Examples:

```
T1566
Enabled
High
EMEA
```

Available tag types:

| Tag type | Description          | Examples                                   |
| -------- | -------------------- | ------------------------------------------ |
| ATT&CK   | MITRE ATT&CK mapping | T1059, T1566, T1027                        |
| STAT     | Operational status   | Draft, Test, Enabled, Disabled, Deprecated |
| IMP      | Risk/Impact level    | Low, Medium, High, Critical                |
| GEO      | Geographic scope     | GLB, EMEA, NA, APAC                        |

**Tags are optional** and should only be added when they provide real operational value.

---

## 6. TITLE

A short, clear description of the posture rule in **PascalCase**, without spaces or special characters.

Examples:

* `LegacyAuthDisabled`
* `ExternalSharingRestricted`
* `InactiveAdminsRemoved`
* `ThirdPartyAppsBlocked`

---

## Regex Validation Rule

```regex
^(BASE|CUST)-[A-Z0-9]{3,5}-(IGNORE|MODIFY|ENFORCE|DETECT)-[A-Z]{2,4}(?:-[A-Z0-9&]+)?-[A-Z][A-Za-z0-9]+$
```

---

## Versioning

Policy versioning is **not part of the policy name** and must be tracked through:

* Git commit history
* Pull requests
* SSPM platform metadata (where applicable)

---

## Contribution Guidelines

1. Create a branch (feature/fix) for each change.
2. Follow the SSPM naming standard.
3. Validate names using the regex.
4. Submit a pull request including use case linkage and mandatory fields.

---

## Governance & Lifecycle

* Each SSPM rule must have a documented owner.
* Baseline deviations and custom rules must include **use case link** in policy document.
* Deprecated rules must be clearly tagged or removed.

---

## Examples

| Purpose                          | SSPM Naming                                        |
| -------------------------------- | -------------------------------------------------- |
| Ignore default weak MFA check    | `BASE-M365-IGNORE-ALL-LegacyMfaAllowed`            |
| Ignore guest sharing alert       | `BASE-GWS-IGNORE-EXT-GuestSharingMuted`            |
| Custom check for inactive admins | `CUST-M365-CHECK-ADM-InactiveAdminsOver90Days`     |
| Enforce secure OAuth apps        | `CUST-OKT-ENFORCE-APP-ApprovedOauthAppsOnly`       |
| Detect risky API integrations    | `CUST-SLSF-DETECT-API-RiskyThirdPartyIntegrations` |


---
