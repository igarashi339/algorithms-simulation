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

