import json
import urllib.request
from parameterized import parameterized

BASE_URL = "http://localhost:8000/dijkstra/"


class TestDijkstra:
    def setup_method(self):
        self.method = "POST"
        self.headers = {
            "Content-Type": "application/json"
        }
        self.start_node = 0
        self.goal_node = 0
        self.cost_matrix = "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        self.body = {
            "start_node": 0,
            "goal_node": 4,
            "cost_matrix": "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        }

    def get_response(self):
        json_data = json.dumps(self.body).encode("utf-8")

        request = urllib.request.Request(BASE_URL,
                                         data=json_data,
                                         method=self.method,
                                         headers=self.headers)
        return request

    def test_normal_case(self):
        """
        正常系：有効な入力を受け取って経路探索に成功することを確認
        """
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "OK"
            assert data_json.get("search_info")

    def test_some_jsonkey_unexisted(self):
        """
        異常系：必要なキーがJsonに存在しない場合にエラーになることを確認
        """
        # start_node が存在しないケース
        self.body = {
            "goal_node": 4,
            "cost_matrix": "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.SE1"

        # goal_node が存在しないケース
        self.body = {
            "start_node": 0,
            "cost_matrix": "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.SE2"

        # cost_matrix が存在しないケース
        self.body = {
            "start_node": 0,
            "goal_node": 4
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.SE3"

    def test_given_node_index_is_invalid(self):
        """
        異常系：ノード番号が不正である場合にエラーになることを確認
        """
        # start_node が数値でない場合
        self.body = {
            "start_node": "a",
            "goal_node": 4,
            "cost_matrix": "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.UE1"

        # goal_node が数値でない場合
        self.body = {
            "start_node": 0,
            "goal_node": "a",
            "cost_matrix": "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.UE2"

        # cost_matrixから生成されるグラフが不正な場合
        self.body = {
            "start_node": 0,
            "goal_node": 4,
            "cost_matrix": "4 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.UE3"

        # start_node がグラフ中に存在しない場合
        self.body = {
            "start_node": -1,
            "goal_node": 4,
            "cost_matrix": "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.UE4"

        # goal_node がグラフ中に存在しない場合
        self.body = {
            "start_node": 0,
            "goal_node": 5,
            "cost_matrix": "5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1"
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.UE5"

    def test_unreachable_from_start_to_goal(self):
        """
        異常系：スタートノードからゴールノードに到達できない場合エラーになることを確認
        """
        self.body = {
            "start_node": 0,
            "goal_node": 4,
            "cost_matrix": "5 "
                           "-1 5 8 -1 -1 "
                           "-1 -1 1 3 -1 "
                           "3 -1 -1 1 -1 "
                           "-1 4 -1 -1 -1 "
                           "-1 -1 -1 -1 -1"
        }
        with urllib.request.urlopen(self.get_response()) as response:
            assert response.getcode() == 200
            data_str = response.read().decode()
            data_json = json.loads(data_str)
            assert data_json["status"] == "NG"
            assert data_json["error_code"] == "ErrorCode.UE6"

