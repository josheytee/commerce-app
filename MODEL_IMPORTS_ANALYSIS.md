# Model File Imports Analysis

Comprehensive list of all .model.ts files in the codebase and their importers.

---

## 1. **address.model**

- `src/modules/user/customer/customer.model.ts` (line 10)
- `src/modules/vendor/store/models/store.model.ts` (line 17)
- `src/infrastructure/database/database.module.ts` (line 10)

## 2. **attribute.model**

- `src/modules/vendor/products/attribute/models/attribute_values.model.ts` (line 10)
- `src/modules/vendor/products/attribute/models/product_attribute.model.ts` (line 11)
- `src/modules/vendor/products/dto/create-product.dto.ts` (line 2)
- `src/infrastructure/database/database.module.ts` (line 13)
- `src/modules/vendor/products/attribute/attribute.module.ts` (line 5)

## 3. **attribute_values.model**

- (No importers found - links imported by other models)

## 4. **audit-log.model**

- `src/infrastructure/database/database.module.ts` (line 23)

## 5. **cart.model**

- `src/modules/user/customer/customer.model.ts` (line 11)
- `src/modules/storefront/cart/models/cart-item.model.ts` (line 8)
- `src/modules/storefront/cart/cart.service.ts` (line 5)
- `src/modules/storefront/cart/cart.module.ts` (line 5)
- `src/modules/storefront/cart/cart.controller.ts` (line 14)
- `src/infrastructure/database/database.module.ts` (line 11)

## 6. **cart-item.model**

- `src/modules/storefront/cart/cart.module.ts` (line 6)

## 7. **category.model**

- `src/modules/vendor/onboarding/vendor.service.ts` (line 15)
- `src/modules/vendor/onboarding/vendor.model.ts` (line 25)
- `src/modules/vendor/store/store.module.ts` (line 13)
- `src/modules/storefront/categories/category.module.ts` (line 4)
- `src/modules/storefront/categories/category.repository.ts` (line 4)
- `src/modules/storefront/categories/category.service.ts` (line 2)
- `src/infrastructure/database/database.module.ts` (line 24)

## 8. **city.model**

- `src/infrastructure/database/database.module.ts` (line 7)

## 9. **country.model**

- `src/infrastructure/database/database.module.ts` (line 9)

## 10. **customer.model**

- `src/modules/vendor/store/models/store-customer.model.ts` (line 9)
- `src/modules/vendor/store/models/store.model.ts` (line 19)
- `src/modules/user/customer/customer.module.ts` (line 5)
- `src/modules/user/customer/customer.service.ts` (line 3)
- `src/modules/user/customer/customer.controller.ts` (line 11)
- `src/infrastructure/database/models/order.model.ts` (line 14)
- `src/infrastructure/database/database.module.ts` (line 27)
- `src/modules/storefront/cart/models/cart.model.ts` (line 9)

## 11. **inventory.model**

- `src/modules/vendor/products/product.model.ts` (line 11)
- `src/modules/vendor/inventory/inventory.controller.ts` (line 11)
- `src/modules/vendor/inventory/inventory.module.ts` (line 3)
- `src/modules/vendor/inventory/inventory.service.ts` (line 3)
- `src/modules/vendor/store/models/store.model.ts` (line 13)
- `src/infrastructure/database/database.module.ts` (line 4)

## 12. **media.model**

- `src/modules/vendor/media/media.service.ts` (line 4)
- `src/modules/vendor/media/services/media-upload.service.ts` (line 9)
- `src/modules/vendor/media/media.repository.ts` (line 5)
- `src/modules/vendor/media/media.module.ts` (line 3)
- `src/modules/vendor/onboarding/vendor.service.ts` (line 13)
- `src/modules/vendor/onboarding/vendor.model.ts` (line 21)
- `src/modules/vendor/onboarding/vendor.repository.ts` (line 9)
- `src/infrastructure/database/database.module.ts` (line 16)
- `src/modules/vendor/onboarding/vendor.model copy.ts` (line 21)

## 13. **order.model** (Database models)

- `src/infrastructure/database/models/order-item.model.ts` (line 13)

## 14. **order-item.model** (Database models)

- (No importers found in active code)

## 15. **password-reset.model**

- `src/modules/user/password-reset/password-reset.service.ts` (line 4)
- `src/modules/user/password-reset/password-reset.module.ts` (line 6)
- `src/infrastructure/database/database.module.ts` (line 21)

## 16. **permission.model**

- `src/modules/user/role/role.service.ts` (line 7)
- `src/modules/user/role/role.module.ts` (line 9)
- `src/modules/user/permission/permission.model.ts` (line 13, 14)
- `src/modules/user/permission/permission.module.ts` (line 5)
- `src/modules/user/permission/permission.service.ts` (line 3)
- `src/modules/vendor/vendor.module.ts` (line 8)
- `src/modules/vendor/store/store.module.ts` (line 14)
- `src/modules/user/user-vendor-role/user-vendor-role.service.ts` (line 4)
- `src/modules/user/user-vendor-role/user-vendor-role.repository.ts` (line 8)
- `src/modules/user/user-vendor-role/user-vendor-role.model.ts` (line 15)
- `src/infrastructure/database/database.module.ts` (line 19)

## 17. **product.model**

- `src/modules/vendor/products/product.service.ts` (line 3)
- `src/modules/vendor/products/product.controller.ts` (line 13)
- `src/modules/vendor/products/product.module.ts` (line 3)
- `src/modules/vendor/inventory/inventory.model.ts` (line 11)
- `src/modules/vendor/section/section.service.ts` (line 4)
- `src/modules/vendor/section/section.model.ts` (line 13)
- `src/modules/storefront/cart/models/cart-item.model.ts` (line 9)
- `src/infrastructure/database/database.module.ts` (line 29)
- `src/infrastructure/database/models/product.model.ts` (line 26)
- `src/infrastructure/database/models/order-item.model.ts` (line 13)

## 18. **product_attribute.model**

- `src/modules/vendor/products/product.service.ts` (line 5)
- `src/modules/vendor/products/attribute/models/attribute.model.ts` (line 10)
- `src/modules/vendor/products/attribute/product_attribute.service.ts` (line 3)
- `src/modules/vendor/products/attribute/product_attribute.module.ts` (line 5)
- `src/infrastructure/database/database.module.ts` (line 12)

## 19. **rating.model**

- `src/modules/user/rating/rating.service.ts` (line 7)
- `src/infrastructure/database/database.module.ts` (line 14)

## 20. **review.model**

- `src/modules/user/review/review.module.ts` (line 5)
- `src/modules/user/review/review.controller.ts` (line 15)
- `src/modules/user/review/review.service.ts` (line 11)
- `src/infrastructure/database/database.module.ts` (line 15)

## 21. **role.model**

- `src/modules/user/role/role.service.ts` (line 5)
- `src/modules/user/role/role.repository.ts` (line 5)
- `src/modules/user/role/role.module.ts` (line 7)
- `src/modules/user/role/role.controller.ts` (line 13)
- `src/modules/user/role/models/role.model.ts` (line 14, 15, 17)
- `src/modules/user/permission/permission.module.ts` (line 4)
- `src/modules/vendor/vendor.module.ts` (line 6)
- `src/modules/vendor/store/store.module.ts` (line 11)
- `src/modules/vendor/store/store.repository.ts` (line 6)
- `src/modules/vendor/store/models/user-store-role.model.ts` (line 10)
- `src/modules/vendor/onboarding/onboarding.module.ts` (line 6)
- `src/modules/vendor/store/models/store.model.ts` (line 21)
- `src/modules/user/user-vendor-role/user-vendor-role.repository.ts` (line 5)
- `src/modules/user/user-vendor-role/user-vendor-role.model.ts` (line 12)
- `src/modules/auth/interfaces/authenticated-user.interface.ts` (line 1)
- `src/infrastructure/database/database.module.ts` (line 17)

## 22. **section.model**

- `src/modules/vendor/products/product.model.ts` (line 12)
- `src/modules/vendor/store/models/store.model.ts` (line 16)
- `src/modules/vendor/section/section.controller.ts` (line 12)
- `src/modules/vendor/section/section.module.ts` (line 3)
- `src/modules/vendor/section/section.service.ts` (line 3)
- `src/infrastructure/database/database.module.ts` (line 6)

## 23. **session.model**

- `src/modules/auth/session/session.controller.ts` (line 12)
- `src/modules/auth/session/session.service.ts` (line 3)
- `src/modules/auth/session/session.module.ts` (line 6)
- `src/infrastructure/database/database.module.ts` (line 20)

## 24. **state.model**

- `src/infrastructure/database/database.module.ts` (line 8)

## 25. **store.model**

- `src/modules/vendor/inventory/inventory.model.ts` (line 10)
- `src/modules/vendor/products/product.model.ts` (line 13)
- `src/modules/vendor/store/store.repository.ts` (line 4)
- `src/modules/vendor/store/store.module.ts` (line 3)
- `src/modules/vendor/store/store.controller.ts` (line 13)
- `src/modules/vendor/store/store.service.ts` (line 2)
- `src/modules/vendor/store/models/store-customer.model.ts` (line 8)
- `src/modules/vendor/onboarding/vendor.model.ts` (line 23)
- `src/modules/vendor/section/section.model.ts` (line 12)
- `src/modules/user/role/models/role.model.ts` (line 17)
- `src/modules/auth/interfaces/authenticated-user.interface.ts` (line 3)
- `src/infrastructure/database/database.module.ts` (line 25)
- `src/modules/vendor/onboarding/vendor.model copy.ts` (line 23)

## 26. **store-customer.model**

- `src/modules/vendor/store/models/store.model.ts` (line 14)
- `src/infrastructure/database/database.module.ts` (line 26)

## 27. **two-factor-auth.model**

- `src/modules/user/two-factor-auth/two-factor-auth.service.ts` (line 4)
- `src/modules/user/two-factor-auth/two-factor-auth.controller.ts` (line 12)
- `src/modules/user/two-factor-auth/two-factor-auth.module.ts` (line 6)
- `src/infrastructure/database/database.module.ts` (line 22)

## 28. **user.model**

- `src/modules/user/customer/customer.model.ts` (line 12)
- `src/modules/vendor/store/store.repository.ts` (line 6)
- `src/modules/vendor/onboarding/vendor.model.ts` (line 19)
- `src/modules/user/role/models/role.model.ts` (line 16)
- `src/modules/vendor/store/models/user-store-role.model.ts` (line 8)
- `src/modules/auth/session/session.service.ts` (line 5)
- `src/modules/auth/session/session.model.ts` (line 13)
- `src/modules/user/user/user.controller.ts` (line 13)
- `src/modules/user/user-vendor-role/user-vendor-role.module.ts` (line 3)
- `src/modules/user/user-vendor-role/user-vendor-role.model.ts` (line 13)
- `src/modules/user/password-reset/password-reset.model.ts` (line 12)
- `src/modules/user/two-factor-auth/two-factor-auth.model.ts` (line 12)
- `src/infrastructure/database/database.module.ts` (line 18)
- `src/modules/vendor/onboarding/vendor.model copy.ts` (line 19)

## 29. **user-store-role.model**

- `src/modules/vendor/store/models/store.model.ts` (line 20)
- `src/infrastructure/database/database.module.ts` (line 30)

## 30. **user-vendor-role.model**

- `src/modules/user/role/role.service.ts` (line 8)
- `src/modules/user/role/role.module.ts` (line 10)
- `src/modules/user/permission/permission.model.ts` (line 14)
- `src/modules/user/permission/permission.module.ts` (line 6)
- `src/modules/user/permission/permission.service.ts` (line 4)
- `src/modules/vendor/vendor.module.ts` (line 9)
- `src/modules/vendor/store/store.module.ts` (line 15)
- `src/modules/user/user-vendor-role/user-vendor-role.service.ts` (line 3)
- `src/modules/user/user-vendor-role/user-vendor-role.model.ts` (line 14, 16)
- `src/modules/user/user-vendor-role/user-vendor-role.repository.ts` (line 6)
- `src/modules/vendor/products/product.module.ts` (line 7)
- `src/modules/vendor/onboarding/vendor.model.ts` (line 20)
- `src/infrastructure/database/database.module.ts` (line 31)
- `src/modules/vendor/onboarding/vendor.model copy.ts` (line 20)

## 31. **user-vendor-role-permission.model**

- `src/modules/user/role/role.service.ts` (line 8)
- `src/modules/user/permission/permission.model.ts` (line 13)
- `src/modules/user/permission/user-vendor-role-permission.model.ts` (line 12, 13)
- `src/modules/user/permission/permission.service.ts` (line 5)
- `src/modules/user/user-vendor-role/user-vendor-role.service.ts` (line 5)
- `src/modules/user/user-vendor-role/user-vendor-role.model.ts` (line 16)
- `src/infrastructure/database/database.module.ts` (line 32)

## 32. **vendor.model**

- `src/modules/user/role/role.service.ts` (line 6)
- `src/modules/user/role/role.module.ts` (line 8)
- `src/modules/user/role/models/role.model.ts` (line 14)
- `src/modules/vendor/vendor.controller.ts` (line 13)
- `src/modules/vendor/vendor.module.ts` (line 7)
- `src/modules/vendor/store/store.repository.ts` (line 5)
- `src/modules/vendor/store/store.module.ts` (line 12)
- `src/modules/vendor/products/product.model.ts` (line 12)
- `src/modules/vendor/onboarding/vendor.service.ts` (line 7)
- `src/modules/vendor/onboarding/vendor.repository.ts` (line 4)
- `src/modules/vendor/store/models/store.model.ts` (line 18)
- `src/modules/vendor/section/section.model.ts` (line 12)
- `src/modules/vendor/onboarding/onboarding.module.ts` (line 5)
- `src/modules/user/permission/permission.module.ts` (line 7)
- `src/modules/user/user-vendor-role/user-vendor-role.module.ts` (line 4)
- `src/modules/user/user-vendor-role/user-vendor-role.model.ts` (line 14)
- `src/modules/storefront/categories/category.model.ts` (line 9)
- `src/modules/admin/vendors/admin-vendor.controller.ts` (line 13)
- `src/modules/auth/interfaces/authenticated-user.interface.ts` (line 2)
- `src/infrastructure/database/database.module.ts` (line 28)
- `src/modules/vendor/onboarding/vendor.model copy.ts` (line 19)

---

## Summary Statistics

- **Total Unique Model Files**: 32
- **Most Imported Model**: `role.model` (17 importers)
- **Second Most Imported**: `vendor.model` (21 importers)
- **Third Most Imported**: `user.model` (14 importers)
- **Least Imported**: Various single-file imports

## Key Observations

1. **Central database module**: `src/infrastructure/database/database.module.ts` imports almost all models (28+ models)
2. **Heavy reliance on vendor-related models**: vendor.model, store.model, product.model
3. **User role and permission system**: Multiple models related to user roles and permissions
4. **Cross-cutting imports**: Models frequently import other models, creating dependencies between domains
5. **Commented import**: Found commented import in `vendor.repository.ts` line 171
