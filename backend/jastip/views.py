from rest_framework import viewsets, permissions
from .models import JastipRequest
from .serializers import JastipRequestSerializer

class JastipRequestViewSet(viewsets.ModelViewSet):
    queryset = JastipRequest.objects.all()
    serializer_class = JastipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # Kalau user biasa: hanya bisa lihat data sendiri
        if self.request.user.is_staff:
            return JastipRequest.objects.all()
        return JastipRequest.objects.filter(user=self.request.user)
