﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BusinessObject.Entities;

public partial class MinhXuanDatabaseContext : DbContext
{
    public MinhXuanDatabaseContext()
    {
    }

    public MinhXuanDatabaseContext(DbContextOptions<MinhXuanDatabaseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AccountVerification> AccountVerifications { get; set; }

    public virtual DbSet<BlogCategory> BlogCategories { get; set; }

    public virtual DbSet<BlogPost> BlogPosts { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCategory> ProductCategories { get; set; }

    public virtual DbSet<ProductCategoryGroup> ProductCategoryGroups { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<ProductReview> ProductReviews { get; set; }

    public virtual DbSet<ProductTaxis> ProductTaxes { get; set; }

    public virtual DbSet<ProductVariant> ProductVariants { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Tax> Taxes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server=localhost;database=MinhXuanDatabase;Integrated Security=True; TrustServerCertificate=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountVerification>(entity =>
        {
            entity.HasKey(e => e.VerificationId).HasName("PK__AccountV__306D4907E6E51BF5");

            entity.Property(e => e.AccountType).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.VerificationCode).HasMaxLength(100);
            entity.Property(e => e.VerificationDate).HasColumnType("datetime");

            entity.HasOne(d => d.Account).WithMany(p => p.AccountVerifications)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_AccountVerifications_Customers");
        });

        modelBuilder.Entity<BlogCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryBlogId).HasName("PK__BlogCate__D724E44F0DD71CA0");

            entity.HasIndex(e => e.Slug, "UQ__BlogCate__BC7B5FB665853FEF").IsUnique();

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.Slug).HasMaxLength(100);
        });

        modelBuilder.Entity<BlogPost>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__BlogPost__AA12601899416081");

            entity.HasIndex(e => e.Slug, "UQ__BlogPost__BC7B5FB6A2429E44").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FileName).HasMaxLength(250);
            entity.Property(e => e.PostUrl)
                .HasMaxLength(500)
                .HasColumnName("PostURL");
            entity.Property(e => e.Slug).HasMaxLength(255);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("Draft");
            entity.Property(e => e.Summary).HasMaxLength(500);
            entity.Property(e => e.Tags).HasMaxLength(255);
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.CategoryBlog).WithMany(p => p.BlogPosts)
                .HasForeignKey(d => d.CategoryBlogId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_BlogPosts_BlogCategories");

            entity.HasOne(d => d.CreateByNavigation).WithMany(p => p.BlogPostCreateByNavigations)
                .HasForeignKey(d => d.CreateBy)
                .HasConstraintName("FK_BlogPosts_Employee_CreateBy");

            entity.HasOne(d => d.UpdateByNavigation).WithMany(p => p.BlogPostUpdateByNavigations)
                .HasForeignKey(d => d.UpdateBy)
                .HasConstraintName("FK_BlogPosts_Employee_UpdateBy");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64D8FBA2D77C");

            entity.HasIndex(e => e.Email, "UQ__Customer__A9D1053448139434").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(400);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.ImageUrl).HasMaxLength(250);
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.UpdateAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__7AD04F1172BC8963");

            entity.HasIndex(e => e.Email, "UQ__Employee__A9D10534458BBCFF").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(400);
            entity.Property(e => e.CreateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(100)
                .HasDefaultValue("Active");
            entity.Property(e => e.UpdateAt).HasColumnType("datetime");

            entity.HasOne(d => d.Role).WithMany(p => p.Employees)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK_Employees_Roles");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PK__Invoices__D796AAB5E3EF4E55");

            entity.HasIndex(e => e.OrderId, "UQ__Invoices__C3905BCEF571EB19").IsUnique();

            entity.HasIndex(e => e.InvoiceNumber, "UQ__Invoices__D776E981EE8C37CC").IsUnique();

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FileName)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.ImagePath)
                .HasMaxLength(4000)
                .IsUnicode(false);
            entity.Property(e => e.InvoiceNumber).HasMaxLength(50);
            entity.Property(e => e.PaymentDate).HasColumnType("datetime");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(50)
                .HasDefaultValue("Cash");
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");
            entity.Property(e => e.QrcodeData).HasColumnName("QRCodeData");

            entity.HasOne(d => d.Order).WithOne(p => p.Invoice)
                .HasForeignKey<Invoice>(d => d.OrderId)
                .HasConstraintName("FK_Receipts_Orders");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E12ADFC1B8D");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RecipientType).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("Active");
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Recipient).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.RecipientId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Notifications_Employees");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCFBF208612");

            entity.ToTable(tb => tb.HasTrigger("trg_UpdateTotalSale"));

            entity.Property(e => e.CustomerAddress).HasMaxLength(500);
            entity.Property(e => e.CustomerEmail).HasMaxLength(100);
            entity.Property(e => e.CustomerName).HasMaxLength(100);
            entity.Property(e => e.CustomerPhone).HasMaxLength(10);
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.OrderDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("Pending");
            entity.Property(e => e.StatusByte).HasDefaultValue((byte)0);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Orders_Customers");
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.OrderDetailId).HasName("PK__OrderDet__D3B9D36CC0AF718F");

            entity.Property(e => e.Color).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ProductDiscount).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.ProductName).HasMaxLength(250);
            entity.Property(e => e.ProductPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductTax)
                .HasDefaultValue(0.00m)
                .HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Size).HasMaxLength(50);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.VariantId).HasDefaultValueSql("(NULL)");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK_OrderDetails_Orders");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK_OrderDetails_Products");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CDFC66EB51");

            entity.ToTable(tb => tb.HasTrigger("trg_Update_Quantity_Products"));

            entity.HasIndex(e => e.Slug, "UQ__Products__BC7B5FB64FAA8807").IsUnique();

            entity.Property(e => e.AverageRating)
                .HasDefaultValue(0.00m)
                .HasColumnType("decimal(4, 2)");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(1200);
            entity.Property(e => e.Discount)
                .HasDefaultValue(0.00m)
                .HasColumnType("decimal(5, 2)");
            entity.Property(e => e.FreeShip).HasDefaultValue(true);
            entity.Property(e => e.Guarantee).HasDefaultValue(0);
            entity.Property(e => e.Material).HasMaxLength(500);
            entity.Property(e => e.Origin).HasMaxLength(500);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductName).HasMaxLength(250);
            entity.Property(e => e.QualityCertificate).HasMaxLength(1200);
            entity.Property(e => e.Slug).HasMaxLength(250);
            entity.Property(e => e.Status).HasDefaultValue(true);
            entity.Property(e => e.TotalSale).HasDefaultValue(0);
            entity.Property(e => e.TotalTax)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(5, 2)");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Products_Category");
        });

        modelBuilder.Entity<ProductCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__ProductC__19093A0B53DC524F");

            entity.ToTable("ProductCategory");

            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);

            entity.HasOne(d => d.Group).WithMany(p => p.ProductCategories)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ProductCategory_ProductCategoryGroup");
        });

        modelBuilder.Entity<ProductCategoryGroup>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("PK__ProductC__149AF36AC2881534");

            entity.ToTable("ProductCategoryGroup");

            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.GroupName).HasMaxLength(100);
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.ProductImageId).HasName("PK__ProductI__07B2B1B84C47F22E");

            entity.ToTable("ProductImage");

            entity.HasIndex(e => e.FileName, "UQ__ProductI__589E6EEC2238DCB8").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(250);
            entity.Property(e => e.FileName).HasMaxLength(250);
            entity.Property(e => e.ImageUrl).HasColumnName("ImageURL");
            entity.Property(e => e.Status).HasDefaultValue(true);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK_ProductImage_Product");
        });

        modelBuilder.Entity<ProductReview>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__ProductR__74BC79CE027CEF81");

            entity.ToTable(tb => tb.HasTrigger("trg_Update_AverageRating"));

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Customer).WithMany(p => p.ProductReviews)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK_ProductReviews_Customers");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductReviews)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK_ProductReviews_Products");
        });

        modelBuilder.Entity<ProductTaxis>(entity =>
        {
            entity.HasKey(e => e.ProductTaxId).HasName("PK__ProductT__1DEAC2BEA3A9BD40");

            entity.ToTable(tb => tb.HasTrigger("trg_CalculateTotalTax"));

            entity.HasIndex(e => new { e.ProductId, e.TaxId }, "UQ__ProductT__631D78E4D2572C8E").IsUnique();

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.TaxId).HasColumnName("TaxID");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductTaxes)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ProductTa__Produ__123EB7A3");

            entity.HasOne(d => d.Tax).WithMany(p => p.ProductTaxes)
                .HasForeignKey(d => d.TaxId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__ProductTa__TaxID__1332DBDC");
        });

        modelBuilder.Entity<ProductVariant>(entity =>
        {
            entity.HasKey(e => e.VariantId).HasName("PK__ProductV__0EA23384D1430759");

            entity.ToTable(tb => tb.HasTrigger("trg_Update_Quantity_ProductVariants"));

            entity.HasIndex(e => new { e.ProductId, e.Size, e.Color }, "UQ__ProductV__9BDF8B24F5C83389").IsUnique();

            entity.Property(e => e.Color).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Discount).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Size).HasMaxLength(50);
            entity.Property(e => e.Status).HasDefaultValue(true);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductVariants)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK_ProductVariants_Products");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1AA77FD424");

            entity.Property(e => e.Description).HasMaxLength(200);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Tax>(entity =>
        {
            entity.HasKey(e => e.TaxId).HasName("PK__Tax__711BE08C3DC283A3");

            entity.ToTable("Tax");

            entity.Property(e => e.TaxId).HasColumnName("TaxID");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.TaxName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.TaxRate).HasColumnType("decimal(5, 2)");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
