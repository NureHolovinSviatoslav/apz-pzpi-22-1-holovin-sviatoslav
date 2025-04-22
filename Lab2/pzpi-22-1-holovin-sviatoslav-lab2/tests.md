# Report generation

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/locations/2/report \
  -H "Authorization: BEARER "
```

# With auth

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin"
  }'
```

`-H "Authorization: BEARER <token>" \`

# User

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: BEARER " \
  -d '{
    "username": "admin",
    "role": "admin",
    "password": "admin"
  }'
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/users \
  -H "Authorization: BEARER "
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/users/newuser \
   -H "Authorization : BEARER "
```

```bash
curl -X PATCH https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/users/newuser \
  -H "Content-Type: application/json" \
  -H "Authorization: BEARER " \
  -d '{
    "role": "manager"
  }'
```

```bash
curl -X DELETE https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/users/newuser \
   -H "Authorization: BEARER "
```

# Location

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Центральний склад",
    "address": "вул. Хрещатик, 22, Київ"
  }'
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/locations \
  -H "Authorization: BEARER "

```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/locations/1
```

```bash
curl -X PATCH https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/locations/1 \
  -H "Content-Type: application/json" \
  -d '{
    "address": "вул. Хрещатик, 25, Київ"
  }'
```

```bash
curl -X DELETE https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/locations/1
```

# Inventory

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventories \
  -H "Content-Type: application/json" \
  -H "Authorization: BEARER " \
  -d '{
    "location_id": 1,
    "max_quantity": 100
  }'
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventories
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventories/1
```

```bash
curl -X PATCH https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "max_quantity": 150
  }'
```

```bash
curl -X DELETE https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventories/1
```

# Vaccine

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/vaccines \
  -H "Content-Type: application/json" \
  -H "Authorization: BEARER " \
  -d '{
    "name": "Вакцина проти грипу",
    "description": "Щорічна вакцинація від грипу",
    "min_temperature": 2,
    "max_temperature": 8,
    "min_humidity": 30,
    "max_humidity": 50
  }'
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/vaccines
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/vaccines/1
```

```bash
curl -X PATCH https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/vaccines/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Оновлений опис вакцини проти грипу"
  }'
```

```bash
curl -X DELETE https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/vaccines/1
```

# InventoryItem

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventoryItems \
  -H "Content-Type: application/json" \
  -H "Authorization: BEARER " \
  -d '{
    "inventory_id": 1,
    "vaccine_id": 1,
    "quantity": 50
  }'
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventoryItems
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventoryItems/1
```

```bash
curl -X PATCH https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventoryItems/1 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 60
  }'
```

```bash
curl -X DELETE https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/inventoryItems/1
```

# Order

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: BEARER " \
  -d '{
    "username": "newuser",
    "order_status": "pending",
    "items": [
      {
        "vaccine_id": 1,
        "quantity": 10
      }
    ]
  }'
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/orders
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/orders/1
```

```bash
curl -X PATCH https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "order_status": "completed",
    "items": [
      {
        "vaccine_id": 1,
        "quantity": 15
      }
    ]
  }'
```

```bash
curl -X DELETE https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/orders/1
```

# SensorData

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/sensorData \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": 1,
    "temperature": 22.5,
    "humidity": 60.0
  }'
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/sensorData
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/sensorData/1
```

# Notification

```bash
curl -X POST https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+380123456789",
    "message": "Температура перевищила допустимий рівень",
    "notification_type": "warning"
  }'
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/notifications
```

```bash
curl -X GET https://arkpz-pzpi-22-1-holovin-sviatoslav.onrender.com/notifications/1
```
