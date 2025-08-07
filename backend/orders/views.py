from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from products.models import Product
from jastip.models import JastipRequest
from rest_framework.permissions import IsAuthenticated
from payments.models import Payment


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        order_type = self.request.data.get('order_type')
        items_data = self.request.data.get('items', [])

        # Buat order utama
        order = serializer.save(user=self.request.user, order_type=order_type)

        # Tambahkan item-item
        for item in items_data:
            quantity = item.get('quantity', 1)

            if order_type == 'product':
                product_id = item.get('product_id')
                product = Product.objects.filter(id=product_id).first()
                if product:
                    OrderItem.objects.create(order=order, product=product, quantity=quantity)

            elif order_type == 'jastip':
                jastip_id = item.get('jastip_id')
                jastip = JastipRequest.objects.filter(id=jastip_id).first()
                if jastip:
                    OrderItem.objects.create(order=order, jastip=jastip, quantity=quantity)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]


# ✅ Tambahan endpoint: add_to_cart (khusus produk biasa)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    if not product_id:
        return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    order, created = Order.objects.get_or_create(
        user=request.user,
        payment__status='pending',  # ambil order belum dibayar
        order_type='product'
    )

    order_item, item_created = OrderItem.objects.get_or_create(order=order, product=product)
    if not item_created:
        order_item.quantity += quantity
    else:
        order_item.quantity = quantity
    order_item.save()

    return Response({"message": "Produk berhasil ditambahkan ke keranjang."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    try:
        order = Order.objects.filter(
            user=request.user,
            order_type='product'
        ).filter(
            payment__isnull=True  # Ambil order yang belum ada pembayaran
        ).prefetch_related('items__product__images').first()

        if order:
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        else:
            return Response({"message": "Keranjang kosong"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

