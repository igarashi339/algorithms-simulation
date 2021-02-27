import pytest
import json
import urllib.request

BASE_URL = "http://localhost:8000"


def test_ping():
    # APIサーバが起動していることを確認
    with urllib.request.urlopen(BASE_URL) as response:
        assert response.getcode() == 200


def test_dijkstra():
    path = "/dijkstra/"
    method = "POST"
    headers = {
        "Content-Type": "application/json"
    }
    body = {
        "start_node": 0,
        "goal_node": 4,
        "cost_matrix": "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
    }
    json_data = json.dumps(body).encode("utf-8")

    request = urllib.request.Request(BASE_URL + path, data=json_data, method=method, headers=headers)
    with urllib.request.urlopen(request) as response:
        assert response.getcode() == 200
        data_str = response.read().decode()
        data_json = json.loads(data_str)
        assert data_json["status"] == "OK"
        assert data_json.get("search_info")


