from rest_framework import serializers
from .models import JastipRequest

class JastipRequestSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # tampilkan nama user saja

    class Meta:
        model = JastipRequest
        fields = '__all__'
        read_only_fields = ['status', 'created_at', 'user']
