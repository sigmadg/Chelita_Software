"""
Test de integración: flujo completo crear documento → obtener por código.
Valida que la funcionalidad end-to-end de la API funcione correctamente.
"""

import base64

from fastapi.testclient import TestClient

from app.main import app
from app.store import clear_documents

client = TestClient(app)


def setup_function() -> None:
    """Limpia el almacén antes de cada test."""
    clear_documents()


def test_full_flow_create_then_get_document() -> None:
    """
    Flujo completo: crear documento con datos → obtener código → recuperar PDF por código.
    """
    # 1. Crear documento
    create_resp = client.post(
        "/create",
        json={
            "nombre": "María",
            "apellido": "García",
            "edad": "28",
            "telefono": "5512345678",
            "correo": "maria.garcia@example.com",
        },
    )
    assert create_resp.status_code == 200
    create_data = create_resp.json()
    assert create_data["success"] is True
    code = create_data["document_code"]
    assert len(code) == 10

    # 2. Obtener documento por código
    get_resp = client.get(f"/document/{code}")
    assert get_resp.status_code == 200
    get_data = get_resp.json()
    assert get_data["success"] is True
    assert "document_b64" in get_data

    # 3. Verificar que el contenido es un PDF válido
    pdf_bytes = base64.b64decode(get_data["document_b64"])
    assert pdf_bytes[:4] == b"%PDF"
    assert len(pdf_bytes) > 100

    # 4. El mismo código no debe devolver otro documento (mismo contenido)
    get_resp2 = client.get(f"/document/{code}")
    assert get_resp2.status_code == 200
    assert get_resp2.json()["document_b64"] == get_data["document_b64"]
