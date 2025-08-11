from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CartView, CartItemsView, CartItemDetailView,
)
from .views import OrderViewSet, OrderItemViewSet  # kalau masih dipakai

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'orderitems', OrderItemViewSet, basename='orderitems')

urlpatterns = [
    # router bawaan untuk order/history, dsb.
    *router.urls,

    # Cart RESTful
    path('cart/', CartView.as_view(), name='cart'),  # GET
    path('cart/items/', CartItemsView.as_view(), name='cart-items'),  # POST
    path('cart/items/<int:item_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),  # PUT, DELETE
]
