# Posture Policy Documentation

## Policy Name

<CLASS>-<PLATFORM>-<TYPE>-<SCOPE>-<TAGS>-<TITLE>

---

## Policy Intent

- **Type**: BASELINE_DIFF | CUSTOM_RULE

---

## Description

- **Purpose**: TODO: Brief explanation of the rule intent.
- **Context**: TODO: Why this rule exists (risk, configuration hardening, compliance, etc.).
- **Owner**: TODO: Department or person responsible.
- **Source**: TODO: Origin of requirement (internal standard, CIS benchmark, audit finding).

---

## Posture Logic

- **Check Schedule**: TODO: How often the posture rule runs (cron/scheduled/API-triggered).
- **Target Configuration**: TODO: Setting, object, or control being evaluated.
- **Expected Value**: TODO: Secure value or configuration.
- **Allowed Deviations**: TODO: Documented exceptions (if any).

---

## Severity

- **Level**: Low | Medium | High | Critical
- **Impact**: Security | Compliance | Business

---

## Remediation Action

- **Type**: AUTO | SEMI_AUTO | MANUAL | NONE
- **Description**: TODO: How the issue is remediated when detected.

---

## Evidence Captured

* TODO: Screenshots
* TODO: API responses
* TODO: Configuration dumps

---

## Audit & Monitoring

- **Findings**: TODO: What is captured as a posture finding.
- **Reports**: TODO: Reporting cadence.
- **Review**: TODO: Responsible review team.

---

## Related Policies

* [object Object]

## Last Platform Snapshot

```json
{
"ruleId": "xxxxxxx",
"settingPath": "TODO",
"observedValue": "TODO",
"expectedValue": "TODO",
"lastEvaluated": "TODO timestamp"
}

```

## Use Cases / Links

* TODO: link a specific use case

## Notes

* Versioning is managed in Git history.
* Deprecation is managed via tags (e.g., STATDeprecated).