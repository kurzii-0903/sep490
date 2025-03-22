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
