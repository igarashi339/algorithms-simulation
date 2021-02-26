from algorithm.models import Graph, DijkstraOneStep, DijkstraSimulation
import copy


class Dijkstra:
    """ Dijkstra法による探索を実施するクラス """
    INVALID_NODE_INDEX = -1
    INVALID_LABEL = -1  # 適当に大きな値にする

    def __init__(self, graph):
        self.graph = copy.deepcopy(graph)

    def calc_shortest_path(self, start_node, goal_node):
        """
        Dijkstra法で最短経路を求める。
        ただし、スタートノードからゴールノードまで到達不可能な場合はNoneを返す。
        """
        # コストが確定しているノードの集合
        cost_fixed_nodes = []
        # 各ノードのラベル
        node_label_list = [Dijkstra.INVALID_LABEL for i in range(self.graph.size())]
        node_label_list[start_node] = 0
        # 最短経路における一つ前のノード
        prev_node_dict = {i: -1 for i in range(self.graph.size())}
        # dijkstra法シミュレーションオブジェクト
        dijkstra_simulation = DijkstraSimulation(graph_size=self.graph.size(),
                                                 cost_matrix=self.graph.get_cost_matrix_list(),
                                                 start_node=start_node,
                                                 goal_node=goal_node)
        while goal_node not in cost_fixed_nodes:
            min_cost_node = self.find_min_cost_node(cost_fixed_nodes, node_label_list)
            if min_cost_node == Dijkstra.INVALID_NODE_INDEX:
                # start_node から goal_node に到達不可能なので探索打ち切り
                return None
            cost_fixed_nodes.append(min_cost_node)
            # コストを確定したノードに隣接しているノードのコストを更新
            adjacent_nodes = self.get_all_adjacent_nodes(min_cost_node)
            for dst_node in adjacent_nodes:
                if dst_node in cost_fixed_nodes:
                    continue
                new_cost = node_label_list[min_cost_node] + self.graph.get_cost(min_cost_node, dst_node)
                if node_label_list[dst_node] == Dijkstra.INVALID_LABEL or new_cost < node_label_list[dst_node]:
                    prev_node_dict[dst_node] = min_cost_node
                    node_label_list[dst_node] = new_cost
            # シミュレーションオブジェクトを更新
            dijkstra_one_step = DijkstraOneStep(min_cost_node=min_cost_node,
                                                cost_fixed_nodes=cost_fixed_nodes,
                                                updated_labels=node_label_list,
                                                updated_prev_node=prev_node_dict)
            dijkstra_simulation.steps.append(dijkstra_one_step)
        dijkstra_simulation.shortest_path_cost = node_label_list[goal_node]
        dijkstra_simulation.shortest_path = Dijkstra.trace(prev_node_dict, start_node, goal_node)
        return dijkstra_simulation

    # todo: 単体テスト
    def find_min_cost_node(self, cost_fixed_nodes, node_label_list):
        """
        コストが未確定のノードのうちラベルが最も小さいものを返す。
        ただし、コストがInvalidのものしか残っていない場合はノード番号の無効値を返す。
        """
        min_node_index = Dijkstra.INVALID_NODE_INDEX
        min_cost = max(node_label_list) + 1
        for node_index in range(self.graph.size()):
            # コストが確定している場合はスキップ
            if node_index in cost_fixed_nodes:
                continue
            target_cost = node_label_list[node_index]
            # ラベルが無効値の場合はスキップ
            if target_cost == Dijkstra.INVALID_LABEL:
                continue
            if target_cost < min_cost:
                min_cost = target_cost
                min_node_index = node_index
        return min_node_index

    # todo: 単体テスト
    def get_all_adjacent_nodes(self, target_node):
        """
        target_nodeに隣接しているすべてのノードのリストを返す。
        """
        adjacent_nodes = []
        for dst_node in range(self.graph.size()):
            if self.graph.get_cost(target_node, dst_node) != Graph.INVALID_COST:
                adjacent_nodes.append(dst_node)
        return adjacent_nodes

    # todo: 単体テスト
    @staticmethod
    def trace(prev_node_dict, start_node, goal_node):
        """ 探索結果をもとにスタートノードからゴールノードまでのノード列を求める """
        shortest_path = [goal_node]
        target_node = goal_node
        assert prev_node_dict[start_node] == -1
        while prev_node_dict[target_node] != -1:
            target_node = prev_node_dict[target_node]
            shortest_path.append(target_node)
        shortest_path.reverse()
        return shortest_path

