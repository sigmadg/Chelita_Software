"""Unit tests for API endpoints."""

import base64

from fastapi.testclient import TestClient

from app.main import app
from app.store import clear_documents

client = TestClient(app)


def setup_function() -> None:
    """Clear document store before each test."""
    clear_documents()


def test_create_document_returns_success_and_code() -> None:
    """POST /create returns success and 10-char document_code."""
    response = client.post(
        "/create",
        json={
            "nombre": "Alexis",
            "apellido": "Piña",
            "edad": "29",
            "telefono": "5581064181",
            "correo": "alexis.pina@chelita.com.mx",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "document_code" in data
    assert len(data["document_code"]) == 10
    assert data["document_code"].isalnum()


def test_get_document_returns_base64_pdf() -> None:
    """GET /document/{code} returns success and document_b64."""
    create_resp = client.post(
        "/create",
        json={
            "nombre": "Test",
            "apellido": "User",
            "edad": "25",
            "telefono": "1234567890",
            "correo": "test@example.com",
        },
    )
    assert create_resp.status_code == 200
    code = create_resp.json()["document_code"]

    doc_resp = client.get(f"/document/{code}")
    assert doc_resp.status_code == 200
    data = doc_resp.json()
    assert data["success"] is True
    assert "document_b64" in data
    decoded = base64.b64decode(data["document_b64"])
    assert decoded[:4] == b"%PDF"


def test_get_document_invalid_code_404() -> None:
    """GET /document/{code} returns 404 for unknown code."""
    response = client.get("/document/XXXXXXXXXX")
    assert response.status_code == 404


def test_get_document_bad_code_length_400() -> None:
    """GET /document/{code} returns 400 if code is not 10 chars."""
    response = client.get("/document/short")
    assert response.status_code == 400


def test_health() -> None:
    """GET /health returns ok."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_document_validation_422() -> None:
    """POST /create returns 422 when required fields are missing or empty."""
    response = client.post("/create", json={})
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


def test_create_document_empty_field_422() -> None:
    """POST /create returns 422 when a required string is empty."""
    response = client.post(
        "/create",
        json={
            "nombre": "A",
            "apellido": "B",
            "edad": "30",
            "telefono": "1234567890",
            "correo": "",
        },
    )
    assert response.status_code == 422
