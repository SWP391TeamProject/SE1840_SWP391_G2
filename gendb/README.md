# Tool tạo database

## Chuẩn bị dữ liệu cào
- Giải nén cache.zip
- `cache`: chứa dữ liệu đã cào

![](./img/1.png)

## Tạo data
- Cấu hình: `src/config.ts`
- Chạy lệnh `npm run gen`

## Tạo database
- Drop database trước khi chạy
![](./img/2.png)
- Chỉnh `DbGenService` nếu bị lỗi đường dẫn