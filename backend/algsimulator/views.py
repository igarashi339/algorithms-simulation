from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from backend.algorithm.dijkstra import Dijkstra
from backend.algorithm.models import Graph
import json


def index(request):
    return HttpResponse("This is Algorithm Simulate App.")


@api_view(["GET", "POST"])
def api_test(request):
    if request.method == "POST":
        return Response({"message": "POST request", "data": request.data})
    return Response({"message": "GET request"})


def dijkstra(request):
    """ Dijkstra法の探索結果を返す(ダミー実装)"""

    cost_matrix_str = ""
    start_node_str = ""
    goal_node_str = ""

    if "cost_matrix" in request.GET:
        cost_matrix_str = request.GET.get("cost_matrix")
    if "start_node" in request.GET:
        start_node_str = request.GET.get("start_node")
    if "goal_node" in request.GET:
        goal_node_str = request.GET.get("goal_node")
    if cost_matrix_str == "" or start_node_str == "" or goal_node_str == "":
        return HttpResponse("bat arguments!")

    # todo: start_node_str と goal_node_str の検証はここで入れるのが良さそう
    # Graph に IsValidNodeIndex() みたいなメソッドを入れる

    graph = Graph(cost_matrix_str)
    sim_obj = Dijkstra.calc_shortest_path(graph, int(start_node_str), int(goal_node_str))
    sim_obj_json = json.dumps(sim_obj)
    return {
        "status": "OK",
        "search_info": sim_obj_json
    }
