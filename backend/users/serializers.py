from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Tambahkan data tambahan ke token jika perlu
        token['username'] = user.username
        token['is_seller'] = user.is_seller
        token['is_superuser'] = user.is_superuser

        return token
