import copy


class Graph:
    INVALID_COST = -1

    def __init__(self, str_graph):
        self.__is_valid = True
        self.__cost_matrix = []
        self.__size = 0
        self.__make_graph_from_str(str_graph)

    def __make_graph_from_str(self, str_graph):
        """
        文字列を受け取ってグラフを生成する。
        ただし、対角成分は必ず無効値で設定する。
        有効な文字列でない場合は有効フラグをFalseにする。
        """
        try:
            elems = str_graph.split()

            # グラフサイズの取得
            graph_size = int(elems[0])
            if not isinstance(graph_size, int):
                raise Exception # グラフサイズは整数値のみ許容
            if graph_size < 0:
                raise Exception # グラフサイズは正値のみ許容
            if len(elems) != graph_size * graph_size + 1:
                raise Exception
            self.__size = graph_size

            # コスト行列の取得
            self.__cost_matrix = [[Graph.INVALID_COST] * graph_size for i in range(graph_size)]
            for row in range(graph_size):
                for col in range(graph_size):
                    target_elem = float(elems[row * graph_size + col + 1])
                    if target_elem == -1:
                        continue
                    if target_elem < 0:
                        raise Exception # グラフのコストは-1(無効値)以外の負値を認めない
                    if row == col:
                        self.__cost_matrix[row][col] = Graph.INVALID_COST
                        continue
                    self.__cost_matrix[row][col] = target_elem
        except Exception:
            self.__cost_matrix.clear()
            self.__size = 0
            self.__is_valid = False

    def is_valid(self):
        """ 自信が有効なGraphオブジェクトである場合Trueを返す。 """
        return self.__is_valid

    def size(self):
        """ グラフサイズを返す。 """
        return self.__size

    def get_cost(self, node1, node2):
        """ ノード間のコストを返す。 """
        return self.__cost_matrix[node1][node2]

    def get_cost_matrix_list(self):
        """ コスト行列を1次元配列にして返す。 """
        cost_matrix_list = []
        for i in range(self.__size):
            for j in range(self.__size):
                cost_matrix_list.append(self.__cost_matrix[i][j])
        return cost_matrix_list


class DijkstraOneStep:
    """ Dijkstra法の1ステップを表すクラス """

    def __init__(self, min_cost_node, adjacent_nodes, cost_fixed_nodes, updated_labels, updated_prev_node):
        # コスト最小のノード
        self.min_cost_node = min_cost_node
        # コスト最小のノードに隣接しているノード
        self.adjacent_nodes = adjacent_nodes
        # コストが確定しているノードの集合
        self.cost_fixed_nodes = copy.deepcopy(cost_fixed_nodes)
        # 更新後の各ノードのラベル
        self.updated_labels = copy.deepcopy(updated_labels)
        # 更新後の「ひとつ前のノード」
        self.updated_prev_node = copy.deepcopy(updated_prev_node)

    # todo: 単体テスト
    def equals(self, other):
        """ otherと自身が同じオブジェクトか判定する """
        if self.min_cost_node != other.min_cost_node:
            return False
        if self.cost_fixed_nodes != other.cost_fixed_nodes:
            return False
        if self.updated_labels != other.updated_labels:
            return False
        if self.updated_prev_node != other.updated_prev_node:
            return False
        return True


class DijkstraSimulation:
    """ Dijkstra法のステップ集合を表すクラス """

    def __init__(self, graph_size, cost_matrix, start_node, goal_node,
                 shortest_path=[], shortest_path_cost=-1, steps=[]):
        # グラフサイズ
        self.graph_size = graph_size
        # コスト行列(1次元)
        self.cost_matrix = copy.deepcopy(cost_matrix)
        # スタートノード
        self.start_node = start_node
        # ゴールノード
        self.goal_node = goal_node
        # スタートノードからゴールノードまでの最短経路
        self.shortest_path = copy.deepcopy(shortest_path)
        # 最短経路のコスト
        self.shortest_path_cost = shortest_path_cost
        # Dijkstraのステップ(DijkstraOneStep)のリスト
        self.steps = copy.deepcopy(steps)

    # todo: 単体テスト
    def equals(self, other):
        """
        otherと自身が同じオブジェクトかどうか判定する
        """
        for i, step in enumerate(self.steps):
            other_step = other.steps[i]
            if not step.equals(other_step):
                return False
        return self.graph_size == other.graph_size and \
            self.cost_matrix == other.cost_matrix and \
            self.start_node == other.start_node and \
            self.goal_node == other.goal_node and \
            self.shortest_path == other.shortest_path and \
            self.shortest_path_cost == other.shortest_path_cost
