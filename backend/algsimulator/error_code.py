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
    UE7 = auto()  # スタートノードとゴールノードが一致

    @staticmethod
    def get_message(e):
        if e == ErrorCode.SE1:
            return "システムエラー：start_node属性がPOST bodyに存在しません。"
        if e == ErrorCode.SE2:
            return "システムエラー：goal_node属性がPOST bodyに存在しません。"
        if e == ErrorCode.SE3:
            return "システムエラー：cost_matrix属性がPOST bodyに存在しません。"
        if e == ErrorCode.SE4:
            return "システムエラー：Jsonのパースに失敗しました。"
        if e == ErrorCode.UE1:
            return "エラー：スタートノードには自然数を指定してください。"
        if e == ErrorCode.UE2:
            return "エラー：ゴールノードには自然数を指定してください。"
        if e == ErrorCode.UE3:
            return "エラー：不正なグラフが入力されています。コスト行列の要素数が「ノード数」で指定した数の二乗個になっているか確認してください。また、コスト行列に-1以外の負の数値が入力されていないか確認してください。"
        if e == ErrorCode.UE4:
            return "エラー：スタートノード番号がグラフ中に存在しません。ノード番号は0から「ノード数 - 1」までの範囲で指定してください。"
        if e == ErrorCode.UE5:
            return "エラー：ゴールノード番号がグラフ中に存在しません。ノード番号は0から「ノード数 - 1」までの範囲で指定してください。"
        if e == ErrorCode.UE6:
            return "エラー：スタートノードからゴールノードに到達するパスが存在しません。"
        if e == ErrorCode.UE7:
            return "エラー：スタートノードとゴールノードが一緒です。異なるノードを指定してください。"
