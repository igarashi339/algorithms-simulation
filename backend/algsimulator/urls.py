from django.urls import path

from . import views

urlpatterns = [
    path('dijkstra/', views.dijkstra, name="dijkstra"),
    path('', views.api_test, name='test'),
]