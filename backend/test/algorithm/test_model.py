import unittest
from algorithm.models import Graph, DijkstraOneStep, DijkstraSimulation
from parameterized import parameterized


class TestGraph(unittest.TestCase):
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
            ("1.1 3 4 3",    0, False, []),  # グラフサイズが小数
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

    def test_get_cost_matrix_list(self):
        """ graph内部のコストテーブルを返却するメソッドのテスト """
        graph_str = "3 4 6 3 2 7 6 5 3 8"
        graph = Graph(graph_str)
        assert graph.get_cost_matrix_list() == [-1, 6, 3, 2, -1, 6, 5, 3, -1]


class TestDijkstraOneStep(unittest.TestCase):
    def setUp(self):
        self.dijkstra_one_step = DijkstraOneStep(
            min_cost_node=0,
            adjacent_nodes=[2, 3],
            cost_fixed_nodes=[3, 4],
            updated_labels=[2, 4, 3, 9],
            updated_prev_node=[0, 1, 1, 2]
        )

    @parameterized.expand(
        [
            (0, [2, 3], [3, 4], [2, 4, 3, 9], [0, 1, 1, 2], True),
            (1, [2, 3], [3, 4], [2, 4, 3, 9], [0, 1, 1, 2], False),  # min_cost_node
            (0, [1, 3], [3, 4], [2, 4, 3, 9], [0, 1, 1, 2], False),  # adjacent_nodes
            (0, [2, 3], [1, 4], [2, 4, 3, 9], [0, 1, 1, 2], False),  # cost_fixed_nodes
            (0, [2, 3], [3, 4], [2, 4, 3, 2], [0, 1, 1, 2], False),  # updated_labels
            (0, [2, 3], [3, 4], [2, 4, 3, 9], [0, 1, 2, 2], False),  # updated_prev_node
        ]
    )
    def test_equals(self, min_cost_node, adjacent_nodes, cost_fixed_nodes,
                    updated_labels, updated_prev_node, expect_value):
        ref_dijkstra_one_step = DijkstraOneStep(min_cost_node=min_cost_node,
                                                adjacent_nodes=adjacent_nodes,
                                                cost_fixed_nodes=cost_fixed_nodes,
                                                updated_labels=updated_labels,
                                                updated_prev_node=updated_prev_node)
        assert self.dijkstra_one_step.equals(ref_dijkstra_one_step) == expect_value


class TestDijkstraSimulation(unittest.TestCase):
    def setUp(self):
        self.dijkstra_simulation = DijkstraSimulation(
            graph_size=3,
            cost_matrix=[-1, 2, 3, 4, -1, 6, 7, 8, -1],
            start_node=0,
            goal_node=3,
            shortest_path=[0, 1, 2, 3],
            shortest_path_cost=10
        )
        self.dijkstra_one_step = DijkstraOneStep(
            min_cost_node=0,
            adjacent_nodes=[2, 3],
            cost_fixed_nodes=[3, 4],
            updated_labels=[2, 4, 3, 9],
            updated_prev_node=[0, 1, 1, 2]
        )
        self.different_dijkstra_one_step = DijkstraOneStep(
            min_cost_node=-1,
            adjacent_nodes=[],
            cost_fixed_nodes=[],
            updated_labels=[],
            updated_prev_node=[]
        )
        self.dijkstra_simulation.steps.append(self.dijkstra_one_step)

    @parameterized.expand(
        [
            (3, [-1, 2, 3, 4, -1, 6, 7, 8, -1], 0, 3, [0, 1, 2, 3], 10, True, True),
            (2, [-1, 2, 3, 4, -1, 6, 7, 8, -1], 0, 3, [0, 1, 2, 3], 10, True, False),  # graph_size
            (3, [-1, 1, 3, 4, -1, 6, 7, 8, -1], 0, 3, [0, 1, 2, 3], 10, True, False),  # cost_matrix
            (3, [-1, 2, 3, 4, -1, 6, 7, 8, -1], 1, 3, [0, 1, 2, 3], 10, True, False),  # start_node
            (3, [-1, 2, 3, 4, -1, 6, 7, 8, -1], 0, 4, [0, 1, 2, 3], 10, True, False),  # goal_node
            (3, [-1, 2, 3, 4, -1, 6, 7, 8, -1], 0, 3, [0, 2, 2, 3], 10, True, False),  # shortest_path
            (3, [-1, 2, 3, 4, -1, 6, 7, 8, -1], 0, 3, [0, 1, 2, 3], 11, True, False),  # shortest_path_cost
            (3, [-1, 2, 3, 4, -1, 6, 7, 8, -1], 0, 3, [0, 1, 2, 3], 10, False, False)  # steps
        ]
    )
    def test_equals(self, graph_size, cost_matrix, start_node, goal_node,
                    shortest_path, shortest_path_cost, use_self_dijkstra_one_step, expected_value):
        ref_dijkstra_simulation = DijkstraSimulation(
            graph_size=graph_size,
            cost_matrix=cost_matrix,
            start_node=start_node,
            goal_node=goal_node,
            shortest_path=shortest_path,
            shortest_path_cost=shortest_path_cost,
        )
        if use_self_dijkstra_one_step:
            ref_dijkstra_simulation.steps.append(self.dijkstra_one_step)
        else:
            ref_dijkstra_simulation.steps.append(self.different_dijkstra_one_step)
        assert self.dijkstra_simulation.equals(ref_dijkstra_simulation) == expected_value


if __name__ == "__main__":
    unittest.main()
