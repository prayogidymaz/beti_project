from decimal import Decimal
from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    # Info produk ringkas untuk kebutuhan frontend cart
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        # NOTE: 'product' ikut disertakan agar ID tetap ada (pk); product_id juga disertakan eksplisit
        fields = [
            'id', 'product', 'product_id',
            'product_name', 'product_price', 'product_image',
            'quantity', 'line_total'
        ]
        read_only_fields = ['id', 'product', 'product_id', 'product_name', 'product_price', 'product_image', 'line_total']

    def get_product_image(self, obj):
        """
        Ambil satu URL gambar produk (jika ada). Tahan banting untuk variasi related_name.
        Asumsi: Product punya related 'images' dengan field ImageField bernama 'image'.
        """
        try:
            imgs = getattr(obj.product, 'images', None)
            if not imgs:
                return None
            first_img = imgs.first()
            return first_img.image.url if first_img and getattr(first_img, 'image', None) else None
        except Exception:
            return None

    def get_line_total(self, obj):
        try:
            price = Decimal(getattr(obj.product, 'price', 0) or 0)
            qty = Decimal(obj.quantity or 0)
            return price * qty
        except Exception:
            return Decimal('0.00')

    def validate_quantity(self, value):
        if value is not None and int(value) < 1:
            raise serializers.ValidationError("quantity minimal 1")
        return value


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_quantity = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_type', 'status', 'created_at', 'updated_at',
            'items', 'total_quantity', 'total_price'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at', 'items', 'total_quantity', 'total_price']

    def get_total_quantity(self, obj):
        try:
            return sum(int(it.quantity or 0) for it in obj.items.all())
        except Exception:
            return 0

    def get_total_price(self, obj):
        total = Decimal('0.00')
        for it in obj.items.all():
            try:
                price = Decimal(getattr(it.product, 'price', 0) or 0)
                qty = Decimal(it.quantity or 0)
                total += price * qty
            except Exception:
                continue
        return total
