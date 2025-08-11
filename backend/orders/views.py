from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from products.models import Product
# from jastip.models import JastipRequest  # aktifkan kalau nanti dukung jastip juga


def _get_or_create_active_cart(user):
    """
    Cart aktif = Order milik user, order_type='product', belum punya Payment (payment is null).
    NOTE: Fungsi ini dipanggil DI DALAM blok transaction.atomic() pada operasi tulis.
    """
    cart_qs = (
        Order.objects
        .filter(user=user, order_type='product', payment__isnull=True)
    )
    # Penting: select_for_update efektif kalau dalam atomic()
    cart = cart_qs.select_for_update().first()
    if not cart:
        cart = Order.objects.create(user=user, order_type='product')
    return cart


# ===== Cart RESTful =====

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = (
            Order.objects
            .filter(user=request.user, order_type='product', payment__isnull=True)
            .prefetch_related('items__product__images')
            .first()
        )
        if not cart:
            return Response({"message": "Keranjang kosong", "items": []}, status=status.HTTP_200_OK)
        return Response(OrderSerializer(cart).data, status=status.HTTP_200_OK)


class CartItemsView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        """
        Body: { "product_id": int, "quantity": int>=1 }
        Perilaku: jika item sudah ada → quantity += input; jika belum → buat.
        Return: Cart terbaru (OrderSerializer).
        """
        product_id = request.data.get("product_id")
        try:
            qty = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            qty = 1

        if not product_id:
            return Response({"detail": "product_id wajib ada"}, status=status.HTTP_400_BAD_REQUEST)
        if qty < 1:
            return Response({"detail": "quantity minimal 1"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"detail": "Produk tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

        cart = _get_or_create_active_cart(request.user)

        # Kunci baris item saat update untuk hindari race condition
        item, created = (
            OrderItem.objects
            .select_for_update()
            .get_or_create(order=cart, product=product, defaults={"quantity": qty})
        )
        if not created:
            item.quantity += qty
            item.save()

        cart.refresh_from_db()
        return Response(OrderSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def put(self, request, item_id: int):
        """
        Idempotent: set quantity persis.
        Body: { "quantity": int>=0 } ; jika 0 → hapus item.
        """
        try:
            qty = int(request.data.get("quantity", 0))
        except (TypeError, ValueError):
            qty = 0

        cart = _get_or_create_active_cart(request.user)
        item = get_object_or_404(OrderItem.objects.select_for_update(), id=item_id, order=cart)

        if qty <= 0:
            item.delete()
            cart.refresh_from_db()
            return Response(status=status.HTTP_204_NO_CONTENT)

        item.quantity = qty
        item.save()
        cart.refresh_from_db()
        return Response(OrderSerializer(cart).data, status=status.HTTP_200_OK)

    @transaction.atomic
    def delete(self, request, item_id: int):
        cart = (
            Order.objects
            .filter(user=request.user, order_type='product', payment__isnull=True)
            .first()
        )
        if not cart:
            return Response(status=status.HTTP_204_NO_CONTENT)

        item = OrderItem.objects.filter(id=item_id, order=cart).first()
        if item:
            item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ===== ViewSet tambahan (read-only) agar router di urls.py tidak error =====

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Opsional: untuk history pesanan user. Tidak mempengaruhi endpoint cart.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .order_by('-created_at')
            .prefetch_related('items__product')
        )


class OrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            OrderItem.objects
            .filter(order__user=self.request.user)
            .select_related('order', 'product')
        )
