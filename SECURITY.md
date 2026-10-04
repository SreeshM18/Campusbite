# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

We take the security of CampusBite seriously. If you discover a security vulnerability, please follow these guidelines:

1. **Do NOT open a public GitHub issue** to report a security vulnerability.
2. Please report security concerns through GitHub's Private Vulnerability Reporting feature under the **Security** tab of this repository:
   - [Report a security vulnerability](https://github.com/SreeshM18/Campusbite/security/advisories/new)
3. Provide detailed steps to reproduce the vulnerability, along with proof of concept if available.

### What to include in your report:
- Type of issue (e.g., Authentication Bypass, Privilege Escalation, Rate Limit Bypass, Sensitive Data Exposure)
- Step-by-step instructions to reproduce
- Affected API endpoints, parameters, or React components
- Potential impact and mitigation recommendations

We appreciate your responsible disclosure and will acknowledge your report promptly.

---

## Security Best Practices for Deployments

- Always configure strong, unique values for `JWT_SECRET` and `MONGODB_URI` in production.
- Keep the `NODE_ENV` set to `production` so secure HTTP-only SameSite cookie attributes and strict error handling are enforced.
- Restrict MongoDB Atlas network access to your production backend IP/cluster.
- Enforce HTTPS across all frontend and backend endpoints.
- Regularly review dependency updates via Dependabot and CodeQL alerts.
