from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet, add_to_cart, get_cart

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'orderitems', OrderItemViewSet, basename='orderitems')

urlpatterns = [
    path('', include(router.urls)),
    path('add-to-cart/', add_to_cart, name='add-to-cart'),
    path('cart/', get_cart, name='get-cart'),
]
