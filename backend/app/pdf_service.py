"""PDF generation using ReportLab.

Author: Ana Gabriela Ordoñez Güemes
"""

import io
import secrets
import string
from xml.sax.saxutils import escape as xml_escape

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

from app.models import CreateDocumentRequest


def _escape_text(text: str) -> str:
    """Escapa caracteres que rompen Paragraph/HTML en ReportLab (<, >, &)."""
    if not text:
        return ""
    return xml_escape(str(text))


def _random_code(length: int = 10) -> str:
    """Generate a random alphanumeric code (uppercase + digits)."""
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def generate_code() -> str:
    """Generate unique 10-character document code."""
    return _random_code(10)


def build_pdf(data: CreateDocumentRequest) -> bytes:
    """
    Build a PDF with the template layout and provided data.

    Layout: Title centered, then fields (Nombre, Apellido, Edad, Telefono, Correo).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=inch,
        bottomMargin=inch,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        alignment=1,  # CENTER
        spaceAfter=30,
    )
    body_style = styles["Normal"]
    body_style.spaceAfter = 12

    story = [
        Paragraph("Chelita Software - Fullstack Test", title_style),
        Spacer(1, 0.2 * inch),
        Paragraph(f'<b>Nombre:</b> {_escape_text(data.nombre)}', body_style),
        Paragraph(f'<b>Apellido:</b> {_escape_text(data.apellido)}', body_style),
        Paragraph(f'<b>Edad:</b> {_escape_text(data.edad)}', body_style),
        Paragraph(f'<b>Telefono:</b> {_escape_text(data.telefono)}', body_style),
        Paragraph(f'<b>Correo:</b> {_escape_text(data.correo)}', body_style),
    ]
    doc.build(story)
    buffer.seek(0)
    return buffer.read()
