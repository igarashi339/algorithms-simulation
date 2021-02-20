from backend.algorithm.models import Graph, DijkstraOneStep, DijkstraSimulation


class Dijkstra:
    """ Dijkstra法による探索を実施するクラス """
    INVALID_NODE_INDEX = -1
    INVALID_NODE_COST = -1

    @staticmethod
    def calc_shortest_path(graph, start_node, goal_node):
        """
        Dijkstra法で最短経路を求める。
        コスト最小ノードを保持するのに優先度つきキューを使用していないため、計算量はO(n^2)
        """
        return Dijkstra.__return_dummy_simulation_object()

    @staticmethod
    def __return_dummy_simulation_object():
        """
        ダミーのシミュレーション結果を返す。
        アルゴリズムが完成するまでのスタブとして用いる。
        """
        cost_matrix = [-1, 5, 8, -1, -1,
                       -1, -1, 1, 3, 10,
                       3, -1, -1, 4, 7,
                       -1, 4, -1, -1, 5,
                       -1, -1, -1, -1, -1]
        steps = list()
        steps.append(DijkstraOneStep(
            min_cost_node=1,
            cost_fixed_nodes=[1],
            updated_labels={1: 0, 2: 5, 3: 8, 4: -1, 5: -1},
            updated_prev_node={1: -1, 2: 1, 3: 1, 4: -1, 5: -1}
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=2,
            cost_fixed_nodes=[1, 2],
            updated_labels={1: 0, 2: 5, 3: 6, 4: 8, 5: 15},
            updated_prev_node={1: -1, 2: 1, 3: 2, 4: 2, 5: 2}
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=3,
            cost_fixed_nodes=[1, 2, 3],
            updated_labels={1: 0, 2: 5, 3: 6, 4: 7, 5: 15},
            updated_prev_node={1: -1, 2: 1, 3: 2, 4: 3, 5: 2}
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=4,
            cost_fixed_nodes=[1, 2, 3, 4],
            updated_labels={1: 0, 2: 5, 3: 6, 4: 7, 5: 12},
            updated_prev_node={1: -1, 2: 1, 3: 2, 4: 3, 5: 4}
        ))
        steps.append(DijkstraOneStep(
            min_cost_node=5,
            cost_fixed_nodes=[1, 2, 3, 4, 5],
            updated_labels={1: 0, 2: 5, 3: 6, 4: 7, 5: 12},
            updated_prev_node={1: -1, 2: 1, 3: 2, 4: 3, 5: 4}
        ))
        return DijkstraSimulation(graph_size=5,
                                  cost_matrix=cost_matrix,
                                  start_node=1,
                                  goal_node=5,
                                  shortest_path=[1, 2, 3, 4, 5],
                                  shortest_path_cost=12,
                                  steps=steps)
