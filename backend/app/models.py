"""Pydantic models for API request/response.

Author: Ana Gabriela Ordoñez Güemes
"""

from pydantic import BaseModel, Field


class CreateDocumentRequest(BaseModel):
    """Request body for POST /create."""

    nombre: str = Field(..., min_length=1, description="Nombre")
    apellido: str = Field(..., min_length=1, description="Apellido")
    edad: str = Field(..., min_length=1, description="Edad")
    telefono: str = Field(..., min_length=1, description="Teléfono")
    correo: str = Field(..., min_length=1, description="Correo electrónico")


class CreateDocumentResponse(BaseModel):
    """Response for POST /create."""

    success: bool = True
    document_code: str = Field(..., min_length=10, max_length=10)


class DocumentResponse(BaseModel):
    """Response for GET /document/{code}."""

    success: bool = True
    document_b64: str = Field(..., description="Documento PDF en base64")


class ErrorResponse(BaseModel):
    """Formato estándar de error de la API."""

    success: bool = False
    detail: str = Field(..., description="Mensaje de error")
    status_code: int = Field(..., description="Código HTTP")
