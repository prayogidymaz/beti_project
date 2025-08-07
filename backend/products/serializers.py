from rest_framework import serializers
from .models import Product, ProductImage, ProductReview, ProductCategory

class ProductImageSerializer(serializers.ModelSerializer):
    #image = serializers.ImageField(use_url=True)
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'product']

class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory  # ✅ harus ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'description', 'price',
            'country_origin', 'category', 'category_id',
            'seller', 'images', 'reviews'
        ]
        read_only_fields = ['seller']
