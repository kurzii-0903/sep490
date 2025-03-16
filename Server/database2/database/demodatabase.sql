USE MinhXuanDatabase;
insert into BlogCategories(CategoryName)
values 
(N'Liên hệ'),
(N'Chính Sách'),
(N'Hướng Dẫn'),
(N'KIẾN THỨC AN TOÀN LAO ĐỘNG');
insert into BlogPosts(Title,Content,CategoryBlogId)
values 
(N'Địa chỉ',N'Hai bà Trưng, Hà Nội',1),
(N'Điện thoại',N'0912.423.062',1),
(N'Email',N'minhxuanbhld@gmail.com',1),
(N'Chính sách mua hàng',N'',2),
(N'Điện thoại',N'0912.423.062',2),
(N'Email',N'minhxuanbhld@gmail.com',2);
go

INSERT INTO ProductCategoryGroup(GroupName,Description) 
VALUES
(N'Trang Thiết bị bảo hộ',N''),
(N'An toàn ngành điện',N''),
(N'An toàn ngành nước',N''),
(N'Thiết bị chống ồn',N''),
(N'Thiết bị phòng độc',N''),
(N'Phòng cháy chữa cháy',N'');
go
INSERT INTO ProductCategory (CategoryName, [Description])
VALUES 
(N'Mũ bảo hộ', N'Các loại mũ bảo hộ lao động bảo vệ đầu khỏi va đập và rơi vật nặng.'),
(N'Găng tay bảo hộ', N'Găng tay bảo hộ chống cắt, cách điện, chống hóa chất.'),
(N'Kính bảo hộ', N'Kính bảo hộ chống bụi, chống tia UV, bảo vệ mắt.'),
(N'Giày bảo hộ', N'Giày bảo hộ chống đinh, chống trơn trượt, cách điện.'),
(N'Quần áo bảo hộ', N'Bộ quần áo bảo hộ chống tĩnh điện, chống hóa chất.'),
(N'Khẩu trang bảo hộ', N'Khẩu trang chống bụi mịn, chống hóa chất độc hại.'),
(N'Bịt tai chống ồn', N'Bịt tai giảm tiếng ồn khi làm việc trong môi trường công nghiệp.'),
(N'Áo phản quang', N'Áo phản quang giúp tăng khả năng nhận diện trong điều kiện ánh sáng yếu.'),
(N'Dây đai an toàn', N'Dây đai bảo vệ khi làm việc trên cao, chống ngã.'),
(N'Mặt nạ phòng độc', N'Mặt nạ bảo vệ khỏi khí độc, hơi hóa chất.'),
(N'Găng tay cách điện', N'Găng tay bảo vệ khỏi điện áp cao trong ngành điện lực.'),
(N'Mũ hàn điện tử', N'Mũ hàn tự động đổi màu kính để bảo vệ mắt.'),
(N'Tấm chắn mặt', N'Tấm chắn mặt bảo vệ khỏi hóa chất, bụi bẩn.'),
(N'Giày chống tĩnh điện', N'Giày bảo vệ linh kiện điện tử khỏi tĩnh điện.'),
(N'Bộ đồ chống hóa chất', N'Bộ đồ bảo hộ khi làm việc trong môi trường hóa chất.'),
(N'Bộ sơ cứu y tế', N'Bộ sơ cứu y tế dùng trong trường hợp khẩn cấp.'),
(N'Dây cứu sinh', N'Dây cứu sinh chịu lực cao cho công trình xây dựng.'),
(N'Áo chống đâm thủng', N'Áo bảo hộ chống đâm thủng từ vật sắc nhọn.'),
(N'Bốt bảo hộ', N'Bốt bảo hộ chống nước, chống trơn trượt.'),
(N'Túi đựng dụng cụ bảo hộ', N'Túi đựng dụng cụ bảo hộ an toàn.');

INSERT INTO Products (ProductName, CategoryId, [Description], Material, Origin, Quantity, Price, Discount, AverageRating, QualityCertificate, TotalTax)
VALUES 
(N'Mũ bảo hộ lao động ABC', 1, N'Mũ bảo hộ chống va đập, đạt tiêu chuẩn an toàn.', N'Nhựa ABS', N'Việt Nam', 100, 150000, 0.00, 4.7, N'TCVN 6407:1998', 10.00),
(N'Găng tay chống cắt cấp 5', 2, N'Găng tay bảo hộ chống cắt cấp 5, bảo vệ bàn tay khi làm việc.', N'Sợi HPPE', N'Hàn Quốc', 120, 80000, 0.00, 4.8, N'EN 388', 5.00),
(N'Kính bảo hộ chống bụi và tia UV', 3, N'Kính bảo hộ đạt tiêu chuẩn ANSI Z87.1, bảo vệ mắt.', N'Polycarbonate', N'Mỹ', 150, 120000, 0.00, 4.6, N'ANSI Z87.1', 8.00),
(N'Giày bảo hộ chống đinh và trượt', 4, N'Giày bảo hộ đạt chuẩn S3, chống đâm xuyên và trơn trượt.', N'Da tổng hợp, đế PU', N'Đức', 90, 850000, 0.00, 4.9, N'EN ISO 20345', 12.00),
(N'Quần áo bảo hộ phòng sạch', 5, N'Bộ quần áo bảo hộ chống bụi, chống tĩnh điện.', N'Vải polyester', N'Nhật Bản', 75, 450000, 0.00, 4.7, N'ISO 14644', 7.00),
(N'Khẩu trang chống bụi mịn N95', 6, N'Khẩu trang bảo vệ khỏi bụi mịn PM2.5, đạt tiêu chuẩn N95.', N'Vải không dệt', N'Việt Nam', 200, 25000, 0.00, 4.5, N'N95, NIOSH', 3.00),
(N'Bịt tai chống ồn', 7, N'Bịt tai giảm tiếng ồn hiệu quả, phù hợp môi trường công nghiệp.', N'Mút xốp, nhựa ABS', N'Pháp', 130, 95000, 0.00, 4.6, N'ANSI S3.19', 5.00),
(N'Áo phản quang', 8, N'Áo phản quang giúp tăng khả năng nhận diện trong môi trường tối.', N'Vải lưới, băng phản quang', N'Việt Nam', 180, 60000, 0.00, 4.4, N'TCVN 8856:2010', 4.00),
(N'Dây đai an toàn toàn thân', 9, N'Dây đai an toàn bảo vệ khi làm việc trên cao.', N'Sợi polyester, móc thép', N'Mỹ', 50, 750000, 0.00, 4.9, N'ANSI Z359.1', 12.00),
(N'Mặt nạ phòng độc 3M 6200', 10, N'Mặt nạ bảo hộ chống khí độc, hơi hóa chất.', N'Silicone', N'Mỹ', 60, 550000, 0.00, 4.8, N'EN 140:1998', 10.00),
(N'Găng tay cách điện 35kV', 11, N'Găng tay cách điện bảo vệ khi làm việc với điện áp cao.', N'Cao su cách điện', N'Đức', 40, 650000, 0.00, 4.7, N'IEC 60903', 8.00),
(N'Mũ hàn điện tử tự động', 12, N'Mũ hàn tự động đổi màu kính bảo vệ mắt.', N'Nhựa ABS, kính cảm biến', N'Hàn Quốc', 70, 850000, 0.00, 4.9, N'ANSI Z87.1', 10.00),
(N'Tấm chắn mặt bảo hộ', 13, N'Tấm chắn mặt bảo vệ khỏi hóa chất, tia lửa.', N'Nhựa Polycarbonate', N'Việt Nam', 90, 150000, 0.00, 4.6, N'EN 166', 6.00),
(N'Giày chống tĩnh điện ESD', 14, N'Giày chống tĩnh điện giúp bảo vệ linh kiện điện tử.', N'Da PU, đế PVC', N'Nhật Bản', 80, 400000, 0.00, 4.8, N'ANSI/ESD STM9.1', 7.00),
(N'Bộ đồ chống hóa chất', 15, N'Bộ đồ bảo vệ khi làm việc trong môi trường hóa chất độc hại.', N'Vải chống hóa chất', N'Mỹ', 30, 1200000, 0.00, 4.9, N'EN 14605', 15.00),
(N'Bộ sơ cứu y tế cá nhân', 16, N'Bộ sơ cứu y tế đầy đủ dụng cụ cấp cứu khẩn cấp.', N'Nhựa + vật tư y tế', N'Việt Nam', 100, 180000, 0.00, 4.7, N'CE, FDA', 5.00),
(N'Dây cứu sinh', 17, N'Dây cứu sinh chịu lực cao, sử dụng trong công trình xây dựng.', N'Sợi tổng hợp', N'Pháp', 60, 600000, 0.00, 4.8, N'ANSI Z359.1', 9.00),
(N'Áo chống đâm thủng', 18, N'Áo bảo hộ chống đâm thủng từ vật sắc nhọn.', N'Sợi Kevlar', N'Mỹ', 25, 2500000, 0.00, 4.9, N'NIJ 0115.00', 20.00);


INSERT INTO Tax (TaxName, TaxRate, Description) VALUES 
('VAT', 10.00, 'Thuế giá trị gia tăng'),
('Import Tax', 5.00, 'Thuế nhập khẩu'),
('Environmental Tax', 2.00, 'Thuế môi trường');

UPDATE ProductCategory
SET GroupId = 1
WHERE CategoryId IN (1, 2, 3, 4, 5, 6);  -- Các sản phẩm thuộc nhóm "Trang Thiết bị bảo hộ"

UPDATE ProductCategory
SET GroupId = 2
WHERE CategoryId IN (7, 8);  -- Các sản phẩm thuộc nhóm "An toàn ngành điện"

UPDATE ProductCategory
SET GroupId = 3
WHERE CategoryId IN (9, 10, 11);  -- Các sản phẩm thuộc nhóm "An toàn ngành nước"

UPDATE ProductCategory
SET GroupId = 4
WHERE CategoryId IN (12, 13);  -- Các sản phẩm thuộc nhóm "Thiết bị chống ồn"

UPDATE ProductCategory
SET GroupId = 5
WHERE CategoryId IN (14);  -- Các sản phẩm thuộc nhóm "Thiết bị phòng độc"

UPDATE ProductCategory
SET GroupId = 6
WHERE CategoryId IN (15, 16);  -- Các sản phẩm thuộc nhóm "Phòng cháy chữa cháy"
