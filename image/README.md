# HonuHome - Thiết Kế CSDL (ERD) & Luồng Vận Hành Nghiệp Vụ

Tài liệu thiết kế kiến trúc cơ sở dữ liệu và quy trình vận hành quản lý nhà trọ / chung cư mini **HonuHome**.

---

## 1. Sơ Đồ Thực Thể Quan Hệ (ERD)

![Sơ đồ ERD HonuHome](./honuhome-erd.png)

### Mã Mermaid ERD:
```mermaid
erDiagram
    BUILDINGS ||--o{ ROOMS : "quản lý nhiều"
    ROOMS ||--o{ ROOM_SERVICES : "có bảng giá riêng"
    ROOMS ||--o{ CONTRACTS : "được thuê qua"
    TENANTS ||--o{ CONTRACTS : "ký kết"
    CONTRACTS ||--o{ INVOICES : "sinh ra hàng tháng"

    BUILDINGS {
        string id PK "Mã cơ sở (bld_cg)"
        string name "Tên tòa nhà (HonuHome Cầu Giấy)"
        string code "Mã quản lý (HN-CG01)"
        string address "Địa chỉ tòa nhà"
        int totalFloors "Số tầng"
        int totalRooms "Tổng số phòng"
        string managerName "Quản lý phụ trách"
        string managerPhone "SĐT quản lý"
        float defaultElectricityPrice "Đơn giá điện mặc định"
        float defaultWaterPrice "Đơn giá nước mặc định"
        string defaultWaterUnit "Cách tính (m3/người/phòng)"
    }

    ROOMS {
        string id PK "Mã phòng (r_101)"
        string buildingId FK "Thuộc cơ sở nào (FK -> BUILDINGS)"
        string roomNumber "Số phòng (P101, P202...)"
        string type "Loại: Phòng Đơn / Đôi / Ba"
        int floor "Tầng mấy"
        float basePrice "Giá thuê niêm yết (VNĐ)"
        float area "Diện tích (m²)"
        string status "Trạng thái: Trống / Đang thuê / Đang sửa"
        string coverImage "Ảnh đại diện chính"
        stringList galleryImages "Mảng ảnh chi tiết các góc phòng"
        string videoUrl "Video quay phòng thực tế (MP4 / Link)"
        stringList amenities "Tiện nghi sẵn có"
        string description "Mô tả đặc điểm phòng"
    }

    ROOM_SERVICES {
        string id PK "Mã định danh dịch vụ"
        string roomId FK "Thuộc phòng nào (FK -> ROOMS)"
        string serviceName "Tên khoản phí (Điện, Nước, Wifi, Xe...)"
        float price "Đơn giá riêng của phòng"
        string unit "Đơn vị tính (đ/kWh, đ/khối, đ/người, đ/xe...)"
        boolean isMetered "Có chốt chỉ số công tơ không"
    }

    TENANTS {
        string id PK "Mã khách thuê (t_01)"
        string fullName "Họ và tên khách thuê"
        string phone "Số điện thoại liên hệ"
        string idCardNumber "Số CCCD / CMND"
        string hometown "Quê quán"
        int age "Tuổi / Năm sinh"
        string idCardImages "Ảnh CCCD 2 mặt (nếu có)"
    }

    CONTRACTS {
        string id PK "Mã hợp đồng (HD-01)"
        string roomId FK "Phòng được thuê (FK -> ROOMS)"
        string tenantId FK "Người đại diện ký (FK -> TENANTS)"
        date startDate "Ngày bắt đầu hiệu lực"
        date endDate "Hạn kết thúc hợp đồng"
        float rentalPrice "Giá chốt theo hợp đồng"
        float depositAmount "Tiền đặt cọc"
        string depositStatus "Trạng thái cọc (Đã thu / Chưa thu)"
        int occupantsCount "Số lượng người thực tế ở"
        int vehiclesCount "Số lượng xe máy gửi"
        int paymentCycleDay "Ngày chốt tiền hàng tháng (vd: ngày 28)"
        string status "Hiệu lực / Sắp hết hạn / Đã thanh lý"
    }

    INVOICES {
        string id PK "Mã hóa đơn (INV-11-2026)"
        string contractId FK "Hợp đồng liên quan (FK -> CONTRACTS)"
        string monthYear "Kỳ hóa đơn (11/2026)"
        float roomAmount "Tiền phòng cứng"
        float electricityAmount "Tiền điện (Chỉ số Mới - Cũ) * Giá"
        float waterAmount "Tiền nước (Khối hoặc Đầu người)"
        float serviceAmount "Tổng tiền dịch vụ (Wifi, Thang máy, Xe)"
        float totalAmount "TỔNG TIỀN PHẢI THANH TOÁN"
        string status "Chưa đóng / Đã thanh toán"
        date paidDate "Ngày khách chuyển khoản"
    }
```

---

## 2. Luồng Vận Hành Dữ Liệu Thực Tế

![Sơ đồ Luồng Vận Hành](./honuhome-luong-van-hanh.png)

### Mã Mermaid Luồng:
```mermaid
flowchart LR
    A["🏢 TÒA NHÀ / CƠ SỞ<br/>(Cầu Giấy, Mỹ Đình...)"] --> B["🚪 PHÒNG CĂN HỘ<br/>(Ảnh, Video, Diện tích, Giá)"]
    B --> C["⚡ BẢNG DỊCH VỤ PHÒNG<br/>(Điện 3.5k, Nước, Wifi, Xe...)"]
    
    B --> D["📝 HỢP ĐỒNG THUÊ<br/>(Ngày BĐ - KT, Cọc, Số người, Xe)"]
    E["👤 KHÁCH THUÊ<br/>(Họ tên, SĐT, CCCD, Quê, Tuổi)"] --> D

    D --> F["🧾 HÓA ĐƠN HÀNG THÁNG<br/>(Tiền phòng + Điện nước + Dịch vụ)"]

    style A fill:#EAF2F8,stroke:#5C84BE,stroke-width:2px,color:#253F5B
    style B fill:#EAF2F8,stroke:#5C84BE,stroke-width:2px,color:#253F5B
    style C fill:#FFF9E6,stroke:#D4A017,stroke-width:2px,color:#7A5A00
    style D fill:#E8F8F5,stroke:#2ECC71,stroke-width:2px,color:#145A32
    style E fill:#F4ECF7,stroke:#8E44AD,stroke-width:2px,color:#512E5F
    style F fill:#FDEDEC,stroke:#E74C3C,stroke-width:2px,color:#78281F
```

---

## 3. Các Định Dạng Xuất File Trong Thư Mục `image/`

- **Sơ đồ ERD:**
  - `honuhome-erd.png` (Hình ảnh raster độ phân giải cao)
  - `honuhome-erd.svg` (Hình vector phóng to không vỡ nét)
- **Sơ đồ Luồng Vận Hành:**
  - `honuhome-luong-van-hanh.png`
  - `honuhome-luong-van-hanh.svg`
