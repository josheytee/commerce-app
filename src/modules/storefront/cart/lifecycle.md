POST /cart/items
→ reserve stock (Inventory.reserved_quantity += qty)
→ create InventoryReservation(HELD, expires_at = now+30m)
→ create CartItem

PATCH /cart/items/:id { quantity: 5 }
→ if larger: reserve delta, extend reservation
→ if smaller: release delta, shrink reservation
→ if 0: release all, delete item

DELETE /cart/items/:id
→ release reservation
→ delete item

DELETE /cart
→ release every reservation
→ delete all items

POST /orders/checkout/from-cart
→ loads cart with reservations
→ validates reservations
→ creates CheckoutSession + Orders
→ marks cart CONVERTED (reservations stay HELD until payment)

POST /webhooks/payment (success)
→ commit reservations (inventory.quantity -= qty, reserved -= qty)
→ reservation → COMMITTED

POST /webhooks/payment (failure)
→ release reservations
→ reservation → RELEASED

[cron every minute]
→ finds HELD reservations with expires_at < now
→ releases them
