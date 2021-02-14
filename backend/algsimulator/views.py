from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view


def index(request):
    return HttpResponse("This is Algorithm Simulate App.")


@api_view(["GET", "POST"])
def api_test(request):
    if request.method == "POST":
        return Response({"message": "POST request", "data": request.data})
    return Response({"message": "GET request"})
