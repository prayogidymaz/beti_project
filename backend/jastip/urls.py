from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JastipRequestViewSet

router = DefaultRouter()
router.register(r'', JastipRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
