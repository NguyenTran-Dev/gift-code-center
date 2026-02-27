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

Tạo file `.env.local` ở thư mục gốc của project. Bạn có thể copy từ file `.env.example`:

```bash
cp .env.example .env.local
```

Sau đó chỉnh sửa `.env.local` theo cấu hình của bạn:

```bash
# Database
DATABASE_URL="mysql://user:user_password@localhost:3339/giftcode_db"

# JWT
JWT_SECRET="your-secret-key-here"

# Application
NEXT_PUBLIC_API_BASE_URL="http://localhost:3001"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"

# Docker Configuration (nếu sử dụng Docker)
MYSQL_VERSION=8.0
MYSQL_CONTAINER_NAME=giftcode_mysql
MYSQL_DATABASE=giftcode_db
MYSQL_ROOT_PASSWORD=root_password
MYSQL_USER=user
MYSQL_PASSWORD=user_password
MYSQL_PORT=3339
```

**Lưu ý**:

- Thay thế giá trị `JWT_SECRET` bằng một khóa bí mật mạnh cho production
- Nếu thay đổi `MYSQL_PORT`, hãy cập nhật `DATABASE_URL` tương ứng
- Tất cả các giá trị docker-compose đều có thể cấu hình thông qua biến môi trường

### Bước 3: Thiết lập Database

#### Tùy chọn A: Sử dụng Docker (Khuyên dùng)

```bash
# Sao chép file cấu hình mẫu (nếu chưa có)
cp .env.example .env.local

# Chạy MySQL container với các biến môi trường từ .env.local
docker-compose up -d

# Chờ database khởi động (khoảng 10-15 giây)
docker-compose logs db
```

**Tùy chỉnh Docker**: Nếu muốn thay đổi port, password hoặc tên database, chỉ cần sửa các biến trong `.env.local`:

```bash
# Ví dụ: Thay đổi port MySQL
MYSQL_PORT=3307

# Thay đổi password
MYSQL_PASSWORD=your-secure-password

# Cập nhật DATABASE_URL để khớp
DATABASE_URL="mysql://user:your-secure-password@localhost:3307/giftcode_db"
```

Sau đó khởi động lại container:

```bash
docker-compose down
docker-compose up -d
```

#### Tùy chọn B: MySQL cài đặt cục bộ

Đảm bảo MySQL đang chạy và tạo database theo thông tin trong `.env.local`:

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

## Cấu hình Biến Môi trường (Environment Variables)

### Biến Cơ Bản (Bắt buộc)

| Biến           | Mô tả                       | Ví dụ                                              |
| -------------- | --------------------------- | -------------------------------------------------- |
| `DATABASE_URL` | Kết nối cơ sở dữ liệu MySQL | `mysql://user:password@localhost:3339/giftcode_db` |
| `JWT_SECRET`   | Khóa bí mật cho JWT token   | `your-secret-key-here`                             |

### Biến Docker (Tùy chọn)

Những biến này dùng để cấu hình MySQL container thông qua `docker-compose`:

| Biến                   | Mặc định         | Mô tả                    |
| ---------------------- | ---------------- | ------------------------ |
| `MYSQL_VERSION`        | `8.0`            | Phiên bản MySQL          |
| `MYSQL_CONTAINER_NAME` | `giftcode_mysql` | Tên container            |
| `MYSQL_DATABASE`       | `giftcode_db`    | Tên database             |
| `MYSQL_USER`           | `user`           | Tên user MySQL           |
| `MYSQL_PASSWORD`       | `user_password`  | Password MySQL           |
| `MYSQL_ROOT_PASSWORD`  | `root_password`  | Password root MySQL      |
| `MYSQL_PORT`           | `3339`           | Port MySQL (external)    |
| `RESTART_POLICY`       | `always`         | Chính sách khởi động lại |

### Biến Ứng dụng (Tùy chọn)

| Biến                       | Mô tả                               | Ví dụ                   |
| -------------------------- | ----------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | URL API frontend                    | `http://localhost:3001` |
| `NEXT_PUBLIC_SITE_URL`     | URL website                         | `http://localhost:3001` |
| `NODE_ENV`                 | Môi trường (development/production) | `development`           |
| `ADMIN_PASSWORD`           | Mật khẩu admin                      | Được tạo từ script      |

### Cách Sử Dụng

**Phương pháp 1: Tệp .env.local**

```bash
# Sao chép từ template
cp .env.example .env.local

# Chỉnh sửa .env.local
nano .env.local

# Docker sẽ tự động đọc từ .env.local
docker-compose up -d
```

**Phương pháp 2: Command line**

```bash
# Chỉ định biến khi chạy
MYSQL_PORT=3307 MYSQL_PASSWORD=new_pass docker-compose up -d
```

**Phương pháp 3: File .env riêng cho docker**

```bash
# Tạo file .env.docker
cat > .env.docker << EOF
MYSQL_VERSION=8.0
MYSQL_DATABASE=giftcode_db
MYSQL_USER=user
MYSQL_PASSWORD=user_password
MYSQL_ROOT_PASSWORD=root_password
MYSQL_PORT=3339
EOF

# Sử dụng file .env.docker
docker-compose --env-file .env.docker up -d
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
