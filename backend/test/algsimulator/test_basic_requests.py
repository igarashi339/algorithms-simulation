import urllib.request

BASE_URL = "http://localhost:8000"


def test_ping():
    # APIサーバが起動していることを確認
    with urllib.request.urlopen(BASE_URL) as response:
        assert response.getcode() == 200



