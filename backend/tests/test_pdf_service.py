"""Unit tests for PDF service."""

import pytest
from app.models import CreateDocumentRequest
from app.pdf_service import build_pdf, generate_code


def test_generate_code_length() -> None:
    """Code must be exactly 10 characters."""
    code = generate_code()
    assert len(code) == 10
    assert code.isalnum()
    assert code.isupper() or any(c.isdigit() for c in code)


def test_generate_code_uniqueness() -> None:
    """Generated codes should be different (high probability)."""
    codes = {generate_code() for _ in range(100)}
    assert len(codes) == 100


def test_build_pdf_returns_bytes() -> None:
    """build_pdf returns non-empty bytes."""
    data = CreateDocumentRequest(
        nombre="Alexis",
        apellido="Piña",
        edad="29",
        telefono="5581064181",
        correo="alexis.pina@chelita.com.mx",
    )
    pdf_bytes = build_pdf(data)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    assert pdf_bytes[:4] == b"%PDF"
