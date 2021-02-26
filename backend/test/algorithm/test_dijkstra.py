import unittest
from algorithm.models import Graph, DijkstraSimulation, DijkstraOneStep
from algorithm.dijkstra import Dijkstra
from parameterized import parameterized


class TestDijkstra(unittest.TestCase):
    def test_calc_shortest_path(self):
        graph = Graph("5 -1 5 8 -1 -1 -1 -1 1 3 10 3 -1 -1 1 7 -1 4 -1 -1 5 -1 -1 -1 -1 -1")
        assert graph.is_valid()
        dijkstra = Dijkstra(graph)
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
            cost_fixed_nodes=[0],
            updated_labels=[0, 5, 8, -1, -1],
            updated_prev_node={0: -1, 1: 0, 2: 0, 3: -1, 4: -1}
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=1,
            cost_fixed_nodes=[0, 1],
            updated_labels=[0, 5, 6, 8, 15],
            updated_prev_node={0: -1, 1: 0, 2: 1, 3: 1, 4: 1}
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=2,
            cost_fixed_nodes=[0, 1, 2],
            updated_labels=[0, 5, 6, 7, 13],
            updated_prev_node={0: -1, 1: 0, 2: 1, 3: 2, 4: 2}
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=3,
            cost_fixed_nodes=[0, 1, 2, 3],
            updated_labels=[0, 5, 6, 7, 12],
            updated_prev_node={0: -1, 1: 0, 2: 1, 3: 2, 4: 3}
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=4,
            cost_fixed_nodes=[0, 1, 2, 3, 4],
            updated_labels=[0, 5, 6, 7, 12],
            updated_prev_node={0: -1, 1: 0, 2: 1, 3: 2, 4: 3}
        ))
        return DijkstraSimulation(graph_size=5,
                                  cost_matrix=cost_matrix,
                                  start_node=0,
                                  goal_node=4,
                                  shortest_path=[0, 1, 2, 3, 4],
                                  shortest_path_cost=12,
                                  steps=steps)


if __name__ == "__main__":
    unittest.main()