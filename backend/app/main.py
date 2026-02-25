"""FastAPI application for Chelita Software reto.

Author: Ana Gabriela Ordoñez Güemes
"""

import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.models import (
    CreateDocumentRequest,
    CreateDocumentResponse,
    DocumentResponse,
    ErrorResponse,
)
from app.pdf_service import build_pdf, generate_code
from app.store import get_document_b64, save_document

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Chelita Software - PDF API",
    description="API para crear y recuperar documentos PDF. Autor: Ana Gabriela Ordoñez Güemes.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "null",  # file:// (HTML standalone)
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def error_json(status_code: int, detail: str) -> JSONResponse:
    """Respuesta JSON estándar para errores (400, 401, 404, 500, etc.)."""
    body = ErrorResponse(success=False, detail=detail, status_code=status_code)
    return JSONResponse(
        status_code=status_code,
        content=body.model_dump(),
        media_type="application/json",
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Todas las HTTPException devuelven JSON con el mismo formato."""
    detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return error_json(exc.status_code, detail)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Errores de validación (422) en el mismo formato JSON."""
    errors = exc.errors()
    detail = "; ".join(
        f"{e.get('loc', [])}: {e.get('msg', '')}" for e in errors[:3]
    ) or "Datos de entrada no válidos"
    return error_json(422, detail)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Cualquier excepción no controlada devuelve 500 en JSON y registra el error."""
    logger.exception("Error no controlado: %s", exc)
    return error_json(500, "Error interno del servidor")


@app.post("/create", response_model=CreateDocumentResponse)
def create_document(body: CreateDocumentRequest) -> CreateDocumentResponse:
    """
    Create a PDF from template data and return a unique 10-digit document code.
    """
    pdf_bytes = build_pdf(body)
    code = generate_code()
    save_document(code, pdf_bytes)
    return CreateDocumentResponse(success=True, document_code=code)


@app.get("/document/{code}", response_model=DocumentResponse)
def get_document(code: str) -> DocumentResponse:
    """
    Return the PDF document for the given 10-digit code, encoded in base64.
    """
    if len(code) != 10:
        raise HTTPException(status_code=400, detail="Código debe tener 10 caracteres")
    document_b64 = get_document_b64(code)
    if document_b64 is None:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return DocumentResponse(success=True, document_b64=document_b64)


@app.get("/health")
def health() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}
