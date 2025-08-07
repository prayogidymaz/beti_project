from django.contrib import admin
from .models import Product, ProductImage, ProductReview, ProductCategory
from django.utils.html import format_html

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ['thumbnail']

    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 60px;" />', obj.image.url)
        return "-"
    thumbnail.short_description = "Preview"

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'seller']
    list_filter = ['category']
    search_fields = ['name']
    inlines = [ProductImageInline]  # Tambahkan ini untuk lihat thumbnail di Product

class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 60px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"

admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(ProductReview)
admin.site.register(ProductCategory)
