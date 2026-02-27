# Giftcode Center

Ứng dụng quản lý mã quà tặng (Giftcode) cho các trò chơi. Được xây dựng với [Next.js](https://nextjs.org), [Prisma](https://www.prisma.io/) và MySQL.

## Yêu cầu hệ thống

- **Node.js**: v18 trở lên
- **npm/yarn/pnpm**: Package manager
- **MySQL**: v8.0 trở lên (hoặc sử dụng Docker)
- **Docker** (tùy chọn): Để chạy database trong container

## Hướng dẫn cài đặt và Build

### Bước 1: Clone Repository và Cài đặt Dependencies

```bash
# Clone project
git clone <repo-url>
cd giftcode-center

# Cài đặt dependencies
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Bước 2: Cấu hình Biến Môi trường

Tạo file `.env.local` ở thư mục gốc của project:

```bash
# Database
DATABASE_URL="mysql://user:user_password@localhost:3306/giftcode_db"

# JWT
JWT_SECRET="your-secret-key-here"

# Application
NEXT_PUBLIC_API_BASE_URL="http://localhost:3001"
```

**Lưu ý**: Thay thế các giá trị theo cấu hình của bạn.

### Bước 3: Thiết lập Database

#### Tùy chọn A: Sử dụng Docker (Khuyên dùng)

```bash
# Chạy MySQL container
docker-compose up -d

# Chờ database khởi động (khoảng 10 giây)
```

#### Tùy chọn B: MySQL cài đặt cục bộ

Đảm bảo MySQL đang chạy và tạo database:

```sql
CREATE DATABASE giftcode_db;
CREATE USER 'user'@'localhost' IDENTIFIED BY 'user_password';
GRANT ALL PRIVILEGES ON giftcode_db.* TO 'user'@'localhost';
FLUSH PRIVILEGES;
```

### Bước 4: Khởi tạo Database Schema

```bash
# Tạo Prisma migrations
npx prisma migrate dev --name init

# Hoặc đẩy schema lên database trực tiếp (development)
npx prisma db push

# Seed dữ liệu mẫu (nếu có)
npx prisma db seed
```

### Bước 5: Chạy Development Server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **[http://localhost:3001](http://localhost:3001)**

Trang sẽ tự động cập nhật khi bạn chỉnh sửa file.

## Build cho Production

### Bước 1: Build ứng dụng

```bash
npm run build
```

Lệnh này sẽ:

- Biên dịch TypeScript
- Build Next.js project
- Tối ưu hóa assets

### Bước 2: Kiểm tra Build

```bash
npm run start
```

Ứng dụng sẽ chạy ở chế độ production tại **[http://localhost:3000](http://localhost:3000)**

### Bước 3: Chạy với PM2 (Khuyên dùng cho Production)

```bash
# Cài đặt PM2 globally (nếu chưa cài)
npm install -g pm2

# Chạy ứng dụng với PM2
pm2 start ecosystem.config.js

# Xem logs
pm2 logs giftcode-center

# Khởi động lại
pm2 restart giftcode-center

# Dừng ứng dụng
pm2 stop giftcode-center

# Xóa khỏi PM2
pm2 delete giftcode-center
```

## Các lệnh hữu ích

```bash
# Development
npm run dev              # Chạy development server

# Production
npm run build           # Build ứng dụng
npm run start           # Chạy production server

# Linting
npm run lint            # Kiểm tra code quality

# Prisma
npx prisma studio      # Mở Prisma Studio (GUI manage database)
npx prisma generate    # Generate Prisma Client
npx prisma migrate dev # Tạo migration mới
```

## Cấu trúc Project

```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── actions/          # Server actions
├── lib/              # Utility functions
└── middleware.ts     # Next.js middleware

prisma/
├── schema.prisma     # Database schema
└── seed.ts           # Database seeding

public/              # Static files
```

## Troubleshooting

### Lỗi kết nối Database

- Đảm bảo MySQL đang chạy
- Kiểm tra `DATABASE_URL` trong `.env.local`
- Nếu dùng Docker: chạy `docker-compose up -d` và chờ database khởi động

### Lỗi Prisma

```bash
# Xóa cache Prisma
rm -rf node_modules/.prisma

# Cài đặt lại Prisma Client
npx prisma generate
```

### Port bị chiếm

Nếu port 3001 đã được sử dụng, chỉnh sửa `package.json`:

```json
"dev": "next dev -p YOUR_PORT"
```
