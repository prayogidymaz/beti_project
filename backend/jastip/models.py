from django.db import models
from users.models import User

class JastipRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=255)
    brand = models.CharField(max_length=100, blank=True)
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    item_detail = models.TextField()
    country_to_buy = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('accepted', 'Accepted'),
            ('rejected', 'Rejected')
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_name} - {self.user.username}"

