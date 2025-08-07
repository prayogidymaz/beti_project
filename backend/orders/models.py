from django.db import models
from users.models import User
from products.models import Product
from jastip.models import JastipRequest

class Order(models.Model):
    ORDER_TYPE = (
        ('product', 'Product'),
        ('jastip', 'Jastip')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_type = models.CharField(max_length=10, choices=ORDER_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    jastip = models.ForeignKey(JastipRequest, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
