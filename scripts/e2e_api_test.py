#!/usr/bin/env python3
"""
Test E2E de la API: crea un documento y lo recupera por código.
Requiere que el backend esté corriendo en BASE_URL (por defecto http://localhost:8000).
Uso: python scripts/e2e_api_test.py
"""

import base64
import os
import sys

try:
    import httpx
except ImportError:
    print("Instala httpx: pip install httpx")
    sys.exit(1)

BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000")


def main() -> int:
    print("E2E API: comprobando flujo crear → obtener documento...")
    create_url = f"{BASE_URL}/create"
    get_url = f"{BASE_URL}/document"

    # 1. Health
    try:
        r = httpx.get(f"{BASE_URL}/health", timeout=5.0)
        r.raise_for_status()
        assert r.json().get("status") == "ok"
        print("  ✓ Health OK")
    except Exception as e:
        print(f"  ✗ Health falló: {e}")
        return 1

    # 2. Crear documento
    payload = {
        "nombre": "E2E",
        "apellido": "Test",
        "edad": "99",
        "telefono": "0000000000",
        "correo": "e2e@test.local",
    }
    try:
        r = httpx.post(create_url, json=payload, timeout=10.0)
        r.raise_for_status()
        data = r.json()
        assert data.get("success") is True
        code = data.get("document_code")
        assert code and len(code) == 10
        print(f"  ✓ Crear documento OK (código: {code})")
    except Exception as e:
        print(f"  ✗ Crear documento falló: {e}")
        return 1

    # 3. Obtener documento por código
    try:
        r = httpx.get(f"{get_url}/{code}", timeout=10.0)
        r.raise_for_status()
        data = r.json()
        assert data.get("success") is True
        b64 = data.get("document_b64")
        assert b64
        pdf_bytes = base64.b64decode(b64)
        assert pdf_bytes[:4] == b"%PDF"
        print("  ✓ Obtener documento OK (PDF válido)")
    except Exception as e:
        print(f"  ✗ Obtener documento falló: {e}")
        return 1

    print("E2E API: todos los pasos OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
