import unittest
from algorithm.models import Graph, DijkstraSimulation, DijkstraOneStep
from algorithm.dijkstra import Dijkstra
from parameterized import parameterized


class TestDijkstra(unittest.TestCase):
    def setUp(self):
        self.graph = Graph("5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1")
        self.dijkstra = Dijkstra(self.graph)

    def test_calc_shortest_path(self):
        assert self.graph.is_valid()
        dijkstra = Dijkstra(self.graph)
        start_node = 0
        goal_node = 4
        dijkstra_simulation = dijkstra.calc_shortest_path(start_node, goal_node)
        expect_dijkstra_simulation = TestDijkstra.get_expect_result1()
        assert dijkstra_simulation.equals(expect_dijkstra_simulation)

    @staticmethod
    def get_expect_result1():
        cost_matrix = [-1, 5, 8, -1, -1,
                       -1, -1, 1, 3, 10,
                       3, -1, -1, 1, 7,
                       -1, 4, -1, -1, 5,
                       -1, -1, -1, -1, -1]
        steps = list()
        steps.append(DijkstraOneStep(
            min_cost_node=0,
            adjacent_nodes=[1, 2],
            cost_fixed_nodes=[0],
            updated_labels=[0, 5, 8, -1, -1],
            updated_prev_node=[-1, 0, 0, -1, -1]
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=1,
            adjacent_nodes=[2, 3, 4],
            cost_fixed_nodes=[0, 1],
            updated_labels=[0, 5, 6, 8, 15],
            updated_prev_node=[-1, 0, 1, 1, 1]
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=2,
            adjacent_nodes=[3, 4],
            cost_fixed_nodes=[0, 1, 2],
            updated_labels=[0, 5, 6, 7, 13],
            updated_prev_node=[-1, 0, 1, 2, 2]
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=3,
            adjacent_nodes=[4],
            cost_fixed_nodes=[0, 1, 2, 3],
            updated_labels=[0, 5, 6, 7, 12],
            updated_prev_node=[-1, 0, 1, 2, 3]
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=4,
            adjacent_nodes=[],
            cost_fixed_nodes=[0, 1, 2, 3, 4],
            updated_labels=[0, 5, 6, 7, 12],
            updated_prev_node=[-1, 0, 1, 2, 3]
        ))
        return DijkstraSimulation(graph_size=5,
                                  cost_matrix=cost_matrix,
                                  start_node=0,
                                  goal_node=4,
                                  shortest_path=[0, 1, 2, 3, 4],
                                  shortest_path_cost=12,
                                  steps=steps)

    @parameterized.expand(
        [
            # ラベルが最も小さいノード番号を返す
            ([], [-1, 2, -1, 1, -1], 3),
            # コストが未確定な中で、最もラベルが小さいノード番号を返す
            ([3], [-1, 2, -1, 1, -1], 1),
            # コスト未確定ノードのラベルがすべて無効値 => ノード番号の無効値を返す
            ([1, 3], [-1, 2, -1, 1, -1], -1)
        ]
    )
    def test_find_min_cost_node(self, cost_fixed_nodes, node_labels, expect_node):
        assert self.dijkstra.find_min_cost_node(cost_fixed_nodes, node_labels) == expect_node

    @parameterized.expand(
        [
            (0, [1, 2]),
            (1, [2, 3, 4]),
            (2, [0, 3, 4]),
            (3, [1, 4]),
            (4, [])
        ]
    )
    def test_get_all_adjacent_nodes(self, target_node, expect_list):
        assert self.dijkstra.get_all_adjacent_nodes(target_node) == expect_list

    @parameterized.expand(
        [
            ([1, -1, 1, 2, 2], 1, 4, [1, 2, 4]),
            ([3, 1, 4, 2, -1], 4, 0, [4, 2, 3, 0])
        ]
    )
    def test_trace(self, prev_node_dict, start_node, goal_node, expect_list):
        assert self.dijkstra.trace(prev_node_dict, start_node, goal_node) == expect_list


if __name__ == "__main__":
    unittest.main()