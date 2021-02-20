import pytest
import json
import urllib.request

BASE_URL = "http://localhost:8000"


def test_ping():
    # APIサーバが起動していることを確認
    with urllib.request.urlopen(BASE_URL) as response:
        assert response.getcode() == 200


def test_dijkstra_stub():
    # dijkstra法のスタブURLをたたけることを確認
    path = "/dijkstra"
    with urllib.request.urlopen(BASE_URL + path) as response:
        assert response.getcode() == 200
        data_str = response.read().decode()
        data_json = json.loads(data_str)
        assert data_json["status"] == "OK"
        assert data_json.get("search_info")


if __name__ == "__main__":
    test_dijkstra_stub()
