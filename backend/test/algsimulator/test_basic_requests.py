import pytest
import urllib.request

BASE_URL = "http://localhost:8000"


def test_sample():
    # APIサーバが起動していることを確認
    req = urllib.request.Request(BASE_URL)
