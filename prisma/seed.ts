import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

async function main() {
  const dbUrl = new URL(process.env.DATABASE_URL!);
  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1),
    allowPublicKeyRetrieval: true,
  });

  const prisma = new PrismaClient({ adapter });

  console.log("Seeding with PrismaMariaDb directly using config object...");

  const games = [
    {
      name: "Dragon Slayer Online",
      slug: "dragon-slayer-online",
      category: "RPG",
      thumbnail:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      description: "Hành trình tiêu diệt rồng trong thế giới mở kỳ ảo.",
      giftcodes: {
        create: [
          {
            code: "DRAGON2026",
            description: "100 Kim Cương + 10 Vé Quay",
            isActive: true,
          },
          {
            code: "SLAYERFREE",
            description: "Trang bị bậc S ngẫu nhiên",
            isActive: true,
          },
          {
            code: "OPENBETA",
            description: "Cánh Ánh Sáng vĩnh viễn",
            isActive: true,
          },
        ],
      },
    },
    {
      name: "Cyber Strike",
      slug: "cyber-strike",
      category: "FPS",
      thumbnail:
        "https://images.unsplash.com/photo-1552824236-07764a663af3?auto=format&fit=crop&q=80&w=800",
      description: "Battlefield bối cảnh tương lai với vũ khí tối tân.",
      giftcodes: {
        create: [
          {
            code: "CYBER2026",
            description: "Skin súng M4A1 Neon",
            isActive: true,
          },
          {
            code: "STRIKEFIRST",
            description: "Băng đạn mở rộng + 5000 Vàng",
            isActive: true,
          },
        ],
      },
    },
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: game,
    });
  }

  console.log("Seeding finished.");

  // Seed Admin User
  console.log("Seeding admin user...");
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "admin_password", // Should be hashed in real apps
      role: "ADMIN",
    },
  });
  console.log("Admin user seeded.");

  // Seed Blog Posts
  console.log("Seeding blog posts...");
  const posts = [
    {
      title: "Hướng dẫn nhận giftcode Dragon Slayer Online",
      slug: "huong-dan-nhan-giftcode-dragon-slayer",
      content: `## Cách nhận giftcode Dragon Slayer Online

Dragon Slayer Online là một trong những tựa game RPG hấp dẫn nhất hiện nay. Để giúp các bạn chơi game thêm phê hơn, mình sẽ hướng dẫn chi tiết cách nhận giftcode trong trò chơi này.

### Các bước nhận giftcode chi tiết

1. **Mở trò chơi Dragon Slayer Online** - Khởi động game trên thiết bị của bạn
2. **Đi tới menu Cài đặt** - Tìm nút Settings hoặc Cài đặt trong menu chính
3. **Chọn "Nhập giftcode"** - Tìm mục Redeem Code hoặc Nhập giftcode
4. **Nhập mã giftcode** - Copy và paste hoặc gõ mã giftcode vào ô trống
5. **Nhấn "Xác nhận"** - Bấm nút Confirm để nhận phần thưởng ngay lập tức

### Giftcode hiện tại tháng 2/2026

- **DRAGON2026** → 100 Kim Cương + 10 Vé Quay
- **SLAYERFREE** → Trang bị bậc S ngẫu nhiên
- **OPENBETA** → Cánh Ánh Sáng vĩnh viễn

> **Lưu ý:** Hãy nhanh chân để nhận những phần thưởng hấp dẫn này trước khi hết hạn!

### Mẹo nhận giftcode hiệu quả

- Kiểm tra định kỳ website chính thức để cập nhật giftcode mới
- Theo dõi kênh Discord của game để nhận thông báo giftcode
- Giftcode thường có thời hạn sử dụng, nên nhập ngay khi có
- Một tài khoản chỉ có thể nhập một lần cho mỗi giftcode`,
      excerpt:
        "Hướng dẫn chi tiết cách nhận giftcode trong Dragon Slayer Online để có thêm kim cương và vé quay",
      thumbnail:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      authorId: adminUser.id,
      published: true,
      metaTitle: "Hướng dẫn nhận giftcode Dragon Slayer Online",
      metaDescription:
        "Cách nhận giftcode trong Dragon Slayer Online - Tất cả các giftcode hợp lệ và cách sử dụng",
      keywords: "giftcode, dragon slayer, nhận quà, kim cương",
    },
    {
      title: "Top 5 giftcode Cyber Strike không nên bỏ lỡ",
      slug: "top-5-giftcode-cyber-strike",
      content: `## Top 5 giftcode Cyber Strike tháng 2/2026

Cyber Strike là tựa game FPS hành động mạnh mẽ với đồ họa hiện đại và gameplay quốc tế. Dưới đây là 5 giftcode tốt nhất mà bạn không nên bỏ lỡ để boost tài khoản.

### Danh sách giftcode tốt nhất

1. **CYBER2026** → Skin súng M4A1 Neon (Giá trị cao)
2. **STRIKEFIRST** → Băng đạn mở rộng + 5000 Vàng (Lợi ích tức thì)
3. **WELCOME2026** → Vũ khí bắt đầu tặng kèm (Dành cho newbie)
4. **FREEFPS2026** → 10 Ticket chiến đấu miễn phí (Replayability)
5. **CYBERNEON** → Bộ trang phục Neon đầy đủ (Cosmetic tuyệt đẹp)

### Lợi ích khi sử dụng giftcode

- **Trang bị chiến đấu miễn phí** - Bắt đầu mạnh mẽ hơn những người chơi mới
- **Tăng tốc độ kiếm tiền trong game** - Bạn có thể rank up nhanh hơn
- **Mở khóa các tính năng đặc biệt** - Truy cập skin độc quyền và items hiếm
- **Tiết kiệm tiền thực** - Không cần chi tiêu ngoài cho cosmetics

### Cách nhập giftcode Cyber Strike

Mở menu chính → Tìm mục "Giftcode" hoặc "Redeem" → Nhập code → Nhấn Confirm → Nhận thưởng trong email

> Nhớ nhập code **nhanh chóng** vì giftcode có thời hạn sử dụng!

### Cập nhật giftcode thường xuyên

Hãy ghé lại website của chúng tôi để cập nhật danh sách giftcode mới nhất mỗi tuần. Chúng tôi luôn cộng đồng nhanh nhất biết về các code mới được phát hành.`,
      excerpt:
        "Tổng hợp 5 giftcode Cyber Strike tốt nhất giúp bạn nhanh chóng nâng cấp nhân vật",
      thumbnail:
        "https://images.unsplash.com/photo-1552824236-07764a663af3?auto=format&fit=crop&q=80&w=800",
      authorId: adminUser.id,
      published: true,
      metaTitle: "Top 5 giftcode Cyber Strike",
      metaDescription:
        "Danh sách giftcode Cyber Strike miễn phí - Nhận skin, vũ khí và items quý giá",
      keywords: "cyber strike, giftcode, skin, fps game",
    },
    {
      title: "Cách tìm kiếm giftcode game hợp lệ an toàn",
      slug: "cach-tim-kiem-giftcode-an-toan",
      content: `## Hướng dẫn tìm kiếm giftcode game an toàn và hợp lệ

Không phải tất cả giftcode trên mạng đều an toàn và hợp lệ. Bài viết này sẽ hướng dẫn bạn cách tìm kiếm giftcode game một cách an toàn, hiệu quả và tránh những rủi ro tiềm ẩn.

### Những điều cần lưu ý khi nhận giftcode

1. **Chỉ sử dụng giftcode từ các nguồn chính thức** - Các trang web chính thức của nhà phát hành game hoặc các đối tác uy tín
2. **Kiểm tra định kỳ** - Giftcode có thể hết hạn bất kỳ lúc nào, nên cập nhật thường xuyên
3. **Tránh các trang web lạ hoặc đáng ngờ** - Chúng có thể chứa virus, malware hoặc phishing scam
4. **Không chia sẻ thông tin cá nhân** - Không bao giờ cung cấp mật khẩu hoặc thông tin nhạy cảm khi nhận giftcode
5. **Đọc kỹ điều khoản** - Một số giftcode có điều kiện sử dụng đặc biệt

### Các nguồn giftcode đáng tin cậy

- **Website chính thức của trò chơi** - Luôn là nguồn tin tức và giftcode chính thức
- **Kênh Discord chính thức** - Thường thông báo giftcode mới trước tiên
- **Trang Facebook/Twitter chính thức** - Cập nhật liên tục các sự kiện và mã
- **Các tạp chí game uy tín** - Các tờ báo uy tín về gaming
- **GiftCode Center** - Cộng đồng chia sẻ giftcode hợp pháp

### Cảnh báo về các trang web giả mạo

> ⚠️ **Hãy cảnh báo các bạn** - Có rất nhiều trang web giả mạo cung cấp giftcode giả. Nếu sử dụng giftcode không hợp lệ, tài khoản game của bạn có thể bị khóa vĩnh viễn!

### Dấu hiệu nhận biết giftcode giả

- Trang web yêu cầu đăng nhập hoặc thông tin cá nhân
- Giftcode quá dài hoặc có ký tự lạ
- Hứa hẹn phần thưởng quá lớn (có thể là scam)
- Tên miền website không giống chính thức
- Yêu cầu thanh toán để nhận giftcode
- Phải tham gia nhóm hoặc theo dõi để nhận code

### Các bước để xác minh giftcode

1. Kiểm tra tên miền website một cách cẩn thận
2. Tìm kiếm tên website trên Google để xem có báo cáo giả mạo không
3. Kiểm tra chứng chỉ SSL (khóa)
4. Xem lịch sử website trên Wayback Machine
5. Liên hệ trực tiếp với nhà phát hành nếu không chắc chắn

### Kết luận

Chúc bạn may mắn với những giftcode hợp lệ! Hãy luôn cẩn thận khi tìm kiếm code trên mạng và chỉ sử dụng từ các nguồn đáng tin cậy. Bảo vệ tài khoản game của bạn là ưu tiên hàng đầu.`,
      excerpt:
        "Những cách an toàn để tìm kiếm và sử dụng giftcode game, tránh những rủi ro không cần thiết",
      thumbnail:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      authorId: adminUser.id,
      published: true,
      metaTitle: "Cách tìm kiếm giftcode game an toàn",
      metaDescription:
        "Hướng dẫn tìm kiếm giftcode game an toàn, tránh scam và các trang web giả mạo",
      keywords: "giftcode, an toàn, hướng dẫn, game",
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log("Blog posts seeded.");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
