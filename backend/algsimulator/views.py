from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from algorithm.dijkstra import Dijkstra
from algorithm.models import Graph
from algsimulator.error_code import ErrorCode
import json


@api_view(["GET", "POST"])
def api_test(request):
    if request.method == "POST":
        return Response({"message": "POST request", "data": request.data})
    return Response({"message": "GET request"})


@api_view(["POST"])
def dijkstra(request):
    """ Dijkstra法の探索結果を返す"""
    datas = None
    try:
        datas = json.loads(request.body)
    except:
        return http_error_response(ErrorCode.SE4)
    if "start_node" not in datas:
        return http_error_response(ErrorCode.SE1)
    if "goal_node" not in datas:
        return http_error_response(ErrorCode.SE2)
    if "cost_matrix" not in datas:
        return http_error_response(ErrorCode.SE3)
    if type(datas["start_node"]) is not int:
        return http_error_response(ErrorCode.UE1)
    if type(datas["goal_node"]) is not int:
        return http_error_response(ErrorCode.UE2)
    start_node = int(datas["start_node"])
    goal_node = int(datas["goal_node"])
    cost_matrix = datas["cost_matrix"]
    graph = Graph(cost_matrix)
    if not graph.is_valid():
        return http_error_response(ErrorCode.UE3)
    if start_node < 0 or graph.size() <= start_node:
        return http_error_response(ErrorCode.UE4)
    if goal_node < 0 or graph.size() <= goal_node:
        return http_error_response(ErrorCode.UE5)
    dijkstra = Dijkstra(graph)
    sim_obj = dijkstra.calc_shortest_path(start_node, goal_node)
    if not sim_obj:
        return http_error_response(ErrorCode.UE6)
    json_str = {
        "status": "OK",
        "search_info": sim_obj
    }
    return HttpResponse(json.dumps(json_str, default=default_method, indent=2))


def http_error_response(e):
    status = "NG"
    error_code = e.__str__()
    error_message = ErrorCode.get_message(e)
    json_str = {
        "status": status,
        "error_code": error_code,
        "error_message": error_message
    }
    return HttpResponse(json.dumps(json_str, default=default_method, indent=2))


def default_method(item):
    if isinstance(item, object) and hasattr(item, '__dict__'):
        return item.__dict__
    else:
        raise TypeError
