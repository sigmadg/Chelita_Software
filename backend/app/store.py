"""In-memory store for generated documents (code -> pdf bytes).

Author: Ana Gabriela Ordoñez Güemes
"""

from __future__ import annotations

import base64
from typing import Dict

# code (10 chars) -> raw PDF bytes
_documents: Dict[str, bytes] = {}


def save_document(code: str, pdf_bytes: bytes) -> None:
    """Store a PDF by its document code."""
    _documents[code] = pdf_bytes


def get_document(code: str) -> bytes | None:
    """Retrieve PDF bytes by code, or None if not found."""
    return _documents.get(code)


def get_document_b64(code: str) -> str | None:
    """Retrieve PDF as base64 string by code, or None if not found."""
    raw = get_document(code)
    if raw is None:
        return None
    return base64.b64encode(raw).decode("ascii")


def clear_documents() -> None:
    """Clear all stored documents (for testing)."""
    _documents.clear()
