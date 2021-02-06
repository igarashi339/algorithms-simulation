import unittest
from algorithm.models import Graph
from parameterized import parameterized


class TestModels(unittest.TestCase):
    @parameterized.expand(
        [
            # 正常系
            ("2 3 4 5 3", 2,                True, [[-1, 4], [5, -1]]),
            ("3 4   6  3 2 7 6 5 3 8", 3,   True, [[-1, 6, 3], [2, -1, 6], [5, 3, -1]]),
            ("   2 8    3.4 0   -1", 2,     True, [[-1, 3.4], [0, -1]]),
            # 異常系
            ("2 4 6 3 4 5",  0, False, []),  # グラフのサイズが合っていない
            ("2 3 4 2",      0, False, []),  # グラフのサイズが合っていない
            ("-2 7 6 4 8",   0, False, []),  # グラフサイズが負
            ("1.1 3 4 3",    0, False, []),  # グラフサイズが少数
            ("a 4 5 3 2 4",  0, False, []),  # グラフサイズが数値ではない
            ("2 3 5 -2 7",   0, False, []),  # コストに負数が存在
            ("2 2, 3, 5, 7", 0, False, []),  # コストが数値ではない
            ("2 a 3 5 6 1",  0, False, []),  # コストが数値ではない
        ]
    )
    def test_make_graph_from_str(self, graph_str, graph_size, is_valid, cost_matrix):
        """ 有効な文字列を受け取り、有効な結果となることを確認 """
        graph = Graph(graph_str)
        assert graph.is_valid() == is_valid
        assert graph.size() == graph_size
        for row in range(graph_size):
            for col in range(graph_size):
                assert graph.get_cost(row, col) == cost_matrix[row][col]


if __name__ == "__main__":
    unittest.main()
