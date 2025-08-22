## Tổng quan

Hệ thống Admin Management cung cấp các API để quản lý người dùng, bao gồm xem danh sách, chi tiết, chặn/bỏ chặn, thay đổi vai trò và thống kê người dùng.

**Base URL:** `http://localhost:8080`  
**API Prefix:** `/api/admin`  
**Authentication:** Bearer Token (JWT)  
**Required Role:** `ROLE_ADMIN`

---

## Authentication

### Login để lấy JWT Token

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "admin_password"
}
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Đăng nhập thành công"
    },
    "data": "eyJhbGciOiJSUzI1NiJ9.eyJpZCI6InVzZXJfaWQiLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.token_signature"
}
```

**Headers cho tất cả Admin API:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## 1. User Management APIs

### 1.1. Lấy danh sách người dùng

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 0 | Số trang (bắt đầu từ 0) |
| `size` | integer | No | 10 | Số lượng bản ghi trên mỗi trang |
| `search` | string | No | - | Từ khóa tìm kiếm theo tên hiển thị |
| `status` | string | No | - | Lọc theo trạng thái ("active", "inactive") |

**Request Example:**
```
GET /api/admin/users?page=0&size=10&search=john&status=active
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Lấy danh sách người dùng thành công"
    },
    "data": {
        "content": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "john.doe@example.com",
                "displayName": "John Doe",
                "phoneNumber": "0123456789",
                "birthday": "1990-01-15",
                "avatarUrl": "/uploads/avatar/john_avatar.jpg",
                "status": "active",
                "role": "ROLE_USER",
                "isBlocked": false,
                "lastLoginAt": "2024-01-15T10:30:00",
                "loginCount": 25,
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-15T10:30:00"
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 10,
            "totalElements": 150,
            "totalPages": 15,
            "first": true,
            "last": false,
            "numberOfElements": 10
        }
    }
}
```

**Error Responses:**
```json
{
    "status": {
        "code": "01",
        "success": false,
        "displayMessage": "Lỗi khi lấy danh sách người dùng: [error_message]"
    }
}
```

### 1.2. Lấy thông tin chi tiết người dùng

**Endpoint:** `GET /api/admin/users/{userId}`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | UUID của người dùng |

**Request Example:**
```
GET /api/admin/users/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Lấy thông tin người dùng thành công"
    },
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john.doe@example.com",
        "displayName": "John Doe",
        "phoneNumber": "0123456789",
        "birthday": "1990-01-15",
        "avatarUrl": "/uploads/avatar/john_avatar.jpg",
        "status": "active",
        "role": "ROLE_USER",
        "isBlocked": false,
        "lastLoginAt": "2024-01-15T10:30:00",
        "loginCount": 25,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T10:30:00"
    }
}
```

**Error Responses:**
```json
{
    "status": {
        "code": "02",
        "success": false,
        "displayMessage": "Không tìm thấy người dùng: User not found"
    }
}
```

### 1.3. Chặn/Bỏ chặn người dùng

**Endpoint:** `PUT /api/admin/users/{userId}/block`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | UUID của người dùng |

**Request Body:**
```json
{
    "isBlocked": true,
    "reason": "Vi phạm quy tắc cộng đồng - Spam tin nhắn"
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `isBlocked` | boolean | Yes | `true` để chặn, `false` để bỏ chặn |
| `reason` | string | No | Lý do chặn/bỏ chặn |

**Request Example:**
```
PUT /api/admin/users/550e8400-e29b-41d4-a716-446655440000/block
Content-Type: application/json

{
    "isBlocked": true,
    "reason": "Vi phạm quy tắc cộng đồng"
}
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Đã chặn người dùng thành công"
    },
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john.doe@example.com",
        "displayName": "John Doe",
        "isBlocked": true,
        "lastLoginAt": "2024-01-15T10:30:00",
        "loginCount": 25,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T11:00:00"
    }
}
```

**Error Responses:**
```json
{
    "status": {
        "code": "04",
        "success": false,
        "displayMessage": "Không tìm thấy người dùng: User not found"
    }
}
```

### 1.4. Thay đổi vai trò người dùng

**Endpoint:** `PUT /api/admin/users/{userId}/role`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | UUID của người dùng |

**Request Body:**
```json
{
    "role": "ROLE_ADMIN"
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | string | Yes | Vai trò mới: `"ROLE_USER"` hoặc `"ROLE_ADMIN"` |

**Role Values:**
- `ROLE_USER`: Người dùng thường
- `ROLE_ADMIN`: Quản trị viên

**Request Example:**
```
PUT /api/admin/users/550e8400-e29b-41d4-a716-446655440000/role
Content-Type: application/json

{
    "role": "ROLE_ADMIN"
}
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Đã thay đổi vai trò người dùng thành công"
    },
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john.doe@example.com",
        "displayName": "John Doe",
        "role": "ROLE_ADMIN",
        "isBlocked": false,
        "lastLoginAt": "2024-01-15T10:30:00",
        "loginCount": 25,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T11:30:00"
    }
}
```

**Error Responses:**
```json
{
    "status": {
        "code": "06",
        "success": false,
        "displayMessage": "Không tìm thấy người dùng: User not found"
    }
}
```

---

## 2. Statistics API

### 2.1. Lấy thống kê người dùng

**Endpoint:** `GET /api/admin/statistics/users`

**Request Example:**
```
GET /api/admin/statistics/users
```

**Response:**
```json
{
    "status": {
        "code": "00",
        "success": true,
        "displayMessage": "Lấy thống kê người dùng thành công"
    },
    "data": {
        "totalUsers": 150,
        "activeUsers": 120,
        "blockedUsers": 5,
        "newUsersToday": 3,
        "adminUsers": 2
    }
}
```

**Statistics Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `totalUsers` | integer | Tổng số người dùng trong hệ thống |
| `activeUsers` | integer | Số người dùng đang hoạt động (status = "active" và không bị chặn) |
| `blockedUsers` | integer | Số người dùng bị chặn |
| `newUsersToday` | integer | Số người dùng đăng ký mới hôm nay |
| `adminUsers` | integer | Số quản trị viên |

---

## 3. Data Models

### 3.1. AdminUserResponse

```json
{
    "id": "string (UUID)",
    "email": "string",
    "displayName": "string",
    "phoneNumber": "string",
    "birthday": "string (YYYY-MM-DD)",
    "avatarUrl": "string (URL)",
    "status": "string (active|inactive)",
    "role": "string (ROLE_USER|ROLE_ADMIN)",
    "isBlocked": "boolean",
    "lastLoginAt": "string (ISO 8601 datetime)",
    "loginCount": "integer",
    "createdAt": "string (ISO 8601 datetime)",
    "updatedAt": "string (ISO 8601 datetime)"
}
```

### 3.2. UserStatisticsResponse

```json
{
    "totalUsers": "integer",
    "activeUsers": "integer",
    "blockedUsers": "integer",
    "newUsersToday": "integer",
    "adminUsers": "integer"
}
```

### 3.3. BlockUserRequest

```json
{
    "isBlocked": "boolean",
    "reason": "string (optional)"
}
```

### 3.4. ChangeUserRoleRequest

```json
{
    "role": "string (ROLE_USER|ROLE_ADMIN)"
}
```

---

## 4. Error Codes

| Code | Description |
|------|-------------|
| `00` | Success |
| `01` | Error getting user list |
| `02` | User not found |
| `03` | Error getting user details |
| `04` | User not found (block operation) |
| `05` | Error blocking/unblocking user |
| `06` | User not found (role operation) |
| `07` | Error changing user role |
| `08` | Error getting user statistics |

---

## 5. HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | Request thành công |
| `400 Bad Request` | Dữ liệu request không hợp lệ |
| `401 Unauthorized` | Token không hợp lệ hoặc thiếu |
| `403 Forbidden` | Không có quyền truy cập (không phải admin) |
| `404 Not Found` | Resource không tồn tại |
| `500 Internal Server Error` | Lỗi server |

---

## 6. Pagination

Tất cả API trả về danh sách đều hỗ trợ pagination với cấu trúc:

```json
{
    "content": [...], 
    "pageable": {
        "pageNumber": 0,        
        "pageSize": 10,         
        "totalElements": 150,   
        "totalPages": 15,       
        "first": true,          
        "last": false,          
        "numberOfElements": 10  
    }
}
```