# Authentication System - Hệ thống xác thực

Đã cập nhật hệ thống authentication từ localStorage sang JWT token-based authentication với bcrypt password hashing.

## Các thay đổi chính:

### 1. JWT Token Authentication

- Sử dụng JWT (JSON Web Token) thay vì localStorage
- Token được lưu trong httpOnly cookies (an toàn hơn)
- Token tự động expire sau 7 ngày

### 2. Password Security

- Mật khẩu được hash bằng bcrypt (10 salt rounds)
- Không lưu plaintext password trong database
- Sử dụng `bcrypt.compare()` để verify password

### 3. Middleware Protection

- Tự động kiểm tra authentication cho tất cả `/admin` routes
- Redirect về login nếu không có token hoặc token không hợp lệ
- Tự động xóa token hết hạn

## Cấu trúc Files:

```
src/
├── middleware.ts              # Verify JWT token cho admin routes
├── lib/
│   └── auth.ts               # JWT utilities (create, verify, cookies)
├── actions/
│   └── auth-actions.ts       # Login, logout, checkAuth actions
└── app/
    └── admin/
        └── layout.tsx        # Admin layout với token-based auth

scripts/
└── hash-passwords.ts         # Script để hash password trong DB
```

## Sử dụng:

### Chạy hash passwords (chỉ chạy 1 lần):

```bash
npx tsx scripts/hash-passwords.ts
```

### Environment Variables:

Thêm vào `.env`:

```env
JWT_SECRET=your-secret-key-here
```

## API Functions:

### `loginAdmin(username, password)`

- Verify username và password
- Tạo JWT token
- Set httpOnly cookie
- Return user info

### `logoutAdmin()`

- Clear auth cookie
- Return success status

### `checkAuth()`

- Verify JWT token từ cookie
- Return user info nếu valid

## Security Features:

✅ JWT token với expiration
✅ httpOnly cookies (không thể access từ JavaScript)
✅ Password hashing với bcrypt
✅ Middleware protection cho admin routes
✅ Automatic token cleanup khi expire
✅ Secure cookie settings (httpOnly, sameSite, secure in production)

## Testing:

1. Login với username/password
2. Token sẽ được set trong cookie
3. Middleware tự động verify trên mỗi request
4. Logout sẽ clear token
5. Try access `/admin` without token → redirect to login
