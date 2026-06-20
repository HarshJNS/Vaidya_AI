from fastapi.testclient import TestClient

from main import app


def test_localhost_and_127_origins_are_allowed_for_frontend_dev():
    client = TestClient(app)

    for origin in ("http://localhost:3000", "http://127.0.0.1:3000"):
        response = client.options(
            "/chat/",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )

        assert response.status_code == 200
        assert response.headers["access-control-allow-origin"] == origin
