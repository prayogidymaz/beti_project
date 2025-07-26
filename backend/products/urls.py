from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, ProductImageViewSet,
    ProductReviewViewSet, CategoryViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'images', ProductImageViewSet, basename='product-images')
router.register(r'reviews', ProductReviewViewSet, basename='product-reviews')
router.register(r'categories', CategoryViewSet, basename='product-categories')

urlpatterns = [
    path('', include(router.urls)),
]

