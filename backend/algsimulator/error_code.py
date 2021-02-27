from enum import Enum, auto


class ErrorCode(Enum):
    # System Error
    SE1 = auto()  # start_node が存在しない
    SE2 = auto()  # goal_node が存在しない
    SE3 = auto()  # cost_matrix が存在しない
    SE4 = auto()  # jsonをパースできない
    # User Error
    UE1 = auto()  # start_node が自然数になっていない
    UE2 = auto()  # goal_node が自然数になっていない
    UE3 = auto()  # cost_matrix から生成されるグラフが不正
    UE4 = auto()  # start_node がグラフ中に存在しない
    UE5 = auto()  # goal_node がグラフ中に存在しない
    UE6 = auto()  # スタートからゴールに到達できない

    @staticmethod
    def get_message(e):
        if e == ErrorCode.SE1:
            return "start_node is not in the POST body."
        if e == ErrorCode.SE2:
            return "goal_node is not in the POST body."
        if e == ErrorCode.SE3:
            return "cost_matrix is not in the POST body."
        if e == ErrorCode.SE4:
            return "Given Json can't parse."
        if e == ErrorCode.UE1:
            return "The graph generated from cost_matrix is invalid."
        if e == ErrorCode.UE2:
            return "start_node is not exist in the graph."
        if e == ErrorCode.UE3:
            return "goal_node is not exist in the graph."
        if e == ErrorCode.UE4:
            return "There is no path in the graph from start_node to goal_node."
