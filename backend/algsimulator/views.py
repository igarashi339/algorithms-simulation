from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from algorithm.dijkstra import Dijkstra
from algorithm.models import Graph
import json


@api_view(["GET", "POST"])
def api_test(request):
    if request.method == "POST":
        return Response({"message": "POST request", "data": request.data})
    return Response({"message": "GET request"})


def dijkstra(request):
    """ Dijkstra法の探索結果を返す(ダミー実装)"""
    start_node = 0
    goal_node = 4
    cost_matrix = "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
    graph = Graph(cost_matrix)
    dijkstra = Dijkstra(graph)
    sim_obj = dijkstra.calc_shortest_path(start_node, goal_node)
    json_str = {
        "status": "OK",
        "search_info": sim_obj
    }
    return HttpResponse(json.dumps(json_str, default=default_method, indent=2))


def default_method(item):
    if isinstance(item, object) and hasattr(item, '__dict__'):
        return item.__dict__
    else:
        raise TypeError
