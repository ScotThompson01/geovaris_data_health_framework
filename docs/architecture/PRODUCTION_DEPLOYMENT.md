# GeoVaris Data Health Framework™
## Production Deployment Architecture

### Purpose

This document describes the production deployment architecture for the GeoVaris Data Health Framework™ (GDHF).

The production environment provides secure internet access to GDHF using Vercel, Microsoft Entra ID, Auth.js, and Neon PostgreSQL.

---

## Production Application

Production URL:

https://app.geovaris.com

The production application is deployed from the `main` branch of the GeoVaris Data Health Framework GitHub repository.

---

## Production Architecture

```text
GitHub Repository
       |
       | main branch
       v
Vercel Production
       |
       v
app.geovaris.com
       |
       v
Microsoft Entra ID
       |
       v
Auth.js Authorization
       |
       v
GeoVaris Data Health Framework
       |
       v
Neon PostgreSQL