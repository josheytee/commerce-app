# 🏪 Ojalanta Backend (NestJS) — Project Guide & Conventions

A scalable **multi-vendor marketplace backend** built with NestJS, Sequelize, and PostgreSQL.

This document defines **architecture, structure, naming conventions, and standards** to ensure consistency across the codebase.

---

# 🧠 Core Philosophy

- Structure by **domain + role**, not by file type
- Keep **APIs consistent** (response, errors, pagination)
- Write code that is **predictable and scalable**
- Prefer **clarity over cleverness**

---

# 📁 Project Structure

```bash
src/
  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.module.ts
      dto/

    storefront/
      products/
      categories/
      vendors/

    vendor/
      onboarding/
      store/
      products/
      orders/

    admin/
      vendors/
      products/
      users/
      orders/

    user/
      profile/

  common/
    filters/
    interceptors/
    middleware/
    decorators/
    utils/
    constants/

  database/
    models/
    migrations/
    seeders/

  config/
    database.config.ts
    app.config.ts

  main.ts
```

---

# 🧩 Module Design

Each module should contain:

```bash
feature/
  feature.controller.ts
  feature.service.ts
  feature.module.ts
  dto/
  entities/ (or models)
```

---

# 🎯 Naming Conventions

## 📦 Files (Kebab Case)

```bash
user-profile.controller.ts
vendor-products.service.ts
create-vendor.dto.ts
```

---

## 🧱 Classes (PascalCase)

```ts
UserProfileController;
VendorProductsService;
CreateVendorDto;
```

---

## 🔤 Variables & Functions (camelCase)

```ts
const userId = 1;
const getUserProfile = () => {};
```

---

## 🔐 Constants (UPPER_CASE)

```ts
export const MAX_LOGIN_ATTEMPTS = 5;
```

---

## 🧠 Enums

```ts
export enum VendorStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
}
```

---

# 🧭 Controller Naming

Format:

```ts
<Domain>(<Feature>Controller);
```

### Examples:

```ts
AuthController;
StorefrontProductsController;
VendorProductsController;
AdminVendorsController;
```

---

# 🧠 Service Naming

```ts
<Domain>(<Feature>Service);
```

Examples:

```ts
AuthService;
VendorProductsService;
AdminVendorsService;
```

---

# 🧩 Module Naming

```ts
<Domain>(<Feature>Module);
```

Examples:

```ts
AuthModule;
VendorProductsModule;
AdminVendorsModule;
```

---

# 🌐 Route Naming

Follow REST conventions:

```ts
/auth/gilno / products / vendor / products / admin / vendors;
```

---

# 🏷 Swagger Tag Structure

Use:

```ts
@ApiTags('<Domain> - <Feature>')
```

Examples:

```ts
@ApiTags('Auth')
@ApiTags('Storefront - Products')
@ApiTags('Vendor - Products')
@ApiTags('Admin - Vendors')
```

---

# 📡 API Response Standard

All responses must follow:

```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": {},
  "meta": {}
}
```

---

## ✅ Success Response

```ts
export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  meta: MetaDto;
}
```

---

## ❌ Error Response

```json
{
  "success": false,
  "message": "Bad request",
  "data": null,
  "meta": {}
}
```

---

# 📄 Pagination Format

```json
{
  "data": {
    "total": 100,
    "items": []
  }
}
```

---

# 🔄 Interceptors

Use for:

- Response formatting
- Logging
- Transformation

Example:

```ts
ResponseInterceptor;
```

---

# 🚨 Exception Handling

Use global filter:

```ts
AllExceptionsFilter;
```

Handles:

- HTTP errors
- Sequelize errors
- Custom errors

---

# 🆔 Request Tracing

Every request should include:

```ts
requestId;
```

Middleware:

```ts
RequestIdMiddleware;
```

---

# 📦 DTO Guidelines

## ✅ Naming

```ts
CreateVendorDto;
UpdateVendorDto;
LoginDto;
```

---

## ✅ Rules

- Always use `class-validator`
- Always use Swagger decorators
- Separate:

  - Request DTOs
  - Response DTOs

---

# 🔐 Auth Structure

```bash
auth/
  login
  register
  refresh-token
```

---

# 🏪 Domain Separation

Think of system as:

### 1. Storefront (Public)

- products
- categories
- vendors

### 2. Vendor (Seller)

- products
- orders
- onboarding

### 3. Admin

- manage vendors
- manage users
- manage platform

---

# 🧪 Validation Rules

- Never trust client input
- Always validate DTOs
- Use global pipes

```ts
ValidationPipe;
```

---

# 🗄 Database Conventions

## Tables (snake_case)

```sql
vendors
vendor_kycs
vendor_payouts
```

---

## Columns

```sql
business_name
created_at
updated_at
```

---

# 🔗 Relationships

- Use foreign keys
- Keep relations simple for MVP

---

# 📦 Environment Variables

Use `.env`

```env
PORT=3000
DATABASE_URL=
JWT_SECRET=
```

---

# 🧠 Clean Code Rules

- Keep functions small
- Avoid deep nesting
- Prefer early returns
- One responsibility per function

---

# ⚠️ Things to Avoid

❌ Mixing admin/vendor/storefront logic
❌ Huge controllers
❌ Unstructured responses
❌ No validation
❌ Hardcoded values

---

# 🚀 Deployment Notes

- Use environment variables
- Enable logging
- Disable Swagger in production or protect it

---

# 📈 Future Improvements

- Role-based access control (RBAC)
- API versioning (`/v1`, `/v2`)
- Caching (Redis)
- Queue system (BullMQ)
- File storage (S3/Cloudinary)

---

# 🎯 Final Principle

> Consistency > Perfection

A consistent codebase:

- scales faster
- is easier to debug
- is easier for teams to work with

---

# 🙌 Contribution Guide

Before adding new code:

- Follow naming conventions
- Use DTOs
- Add Swagger docs
- Maintain response structure

---

**Welcome to building Ojalanta 🚀**
