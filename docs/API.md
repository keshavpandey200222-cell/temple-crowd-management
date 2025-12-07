# API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register User
**POST** `/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919999999999",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "visitor"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Bookings

### Get Available Slots
**GET** `/bookings/slots/available?date=2024-01-15&type=regular`

Response:
```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "slot_time": "09:00:00",
        "max_bookings": 200,
        "available_slots": 150,
        "price": 0
      }
    ]
  }
}
```

### Create Booking
**POST** `/bookings` (Protected)

Request:
```json
{
  "slotDate": "2024-01-15",
  "slotTime": "09:00:00",
  "bookingType": "regular",
  "numberOfPeople": 2
}
```

### Get User Bookings
**GET** `/bookings/my-bookings` (Protected)

### Cancel Booking
**PUT** `/bookings/:bookingId/cancel` (Protected)

## Crowd Monitoring

### Get Current Crowd Status
**GET** `/crowd/current`

Response:
```json
{
  "success": true,
  "data": {
    "zones": [
      {
        "zone_id": "uuid",
        "zone_name": "Main Darshan Hall",
        "current_occupancy": 350,
        "max_capacity": 500,
        "alert_level": "green"
      }
    ]
  }
}
```

### Get Zone Status
**GET** `/crowd/zone/:zoneId`

### Update Crowd Count
**POST** `/crowd/update` (Admin/Staff only)

Request:
```json
{
  "zoneId": "uuid",
  "occupancyCount": 400
}
```

## Queue Management

### Get All Queues
**GET** `/queues`

### Get Queue Status
**GET** `/queues/:queueId/status`

### Join Queue
**POST** `/queues/:queueId/join` (Protected)

### Leave Queue
**POST** `/queues/:queueId/leave` (Protected)

## Analytics (Admin Only)

### Get Daily Analytics
**GET** `/analytics/daily?date=2024-01-15`

### Get Crowd Predictions
**GET** `/analytics/predictions`

### Get Revenue Report
**GET** `/analytics/revenue?startDate=2024-01-01&endDate=2024-01-31`

## WebSocket Events

Connect to: `ws://localhost:5000`

### Events to Listen:

- `crowd:update` - Real-time crowd updates
- `queue:update` - Queue status changes
- `zone:update` - Zone status changes
- `alert` - Emergency alerts

### Events to Emit:

- `join:crowd-updates` - Subscribe to crowd updates
- `join:queue-updates` - Subscribe to queue updates
- `join:zone-updates` - Subscribe to zone updates

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error
