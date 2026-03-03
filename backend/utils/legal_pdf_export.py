import io
from datetime import datetime

from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

RISK_COLORS = {
    "high": colors.HexColor("#DC2626"),
    "medium": colors.HexColor("#D97706"),
    "low": colors.HexColor("#16A34A"),
}
RISK_BG = {
    "high": colors.HexColor("#FEF2F2"),
    "medium": colors.HexColor("#FFFBEB"),
    "low": colors.HexColor("#F0FDF4"),
}


def generate_pdf_bytes(summary: dict, clauses: list, filename: str) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
    )
    styles = getSampleStyleSheet()
    story = []

    # ── Custom styles ──────────────────────────────────────────────
    title_style = ParagraphStyle(
        "T",
        parent=styles["Title"],
        fontSize=22,
        textColor=colors.HexColor("#1E1B4B"),
        spaceAfter=4,
    )
    subtitle_style = ParagraphStyle(
        "Sub",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.HexColor("#6B7280"),
        spaceAfter=16,
    )
    section_head = ParagraphStyle(
        "SH",
        parent=styles["Heading2"],
        fontSize=13,
        textColor=colors.HexColor("#4F46E5"),
        spaceBefore=16,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        "B",
        parent=styles["Normal"],
        fontSize=10,
        leading=16,
        textColor=colors.HexColor("#374151"),
    )
    bullet_style = ParagraphStyle(
        "Bul",
        parent=styles["Normal"],
        fontSize=10,
        leading=16,
        leftIndent=16,
        textColor=colors.HexColor("#374151"),
    )
    clause_style = ParagraphStyle(
        "Cl",
        parent=styles["Normal"],
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#374151"),
        fontName="Helvetica-Oblique",
    )
    reason_style = ParagraphStyle(
        "Re",
        parent=styles["Normal"],
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#6B7280"),
    )
    disclaimer_style = ParagraphStyle(
        "Dis",
        parent=styles["Normal"],
        fontSize=8,
        textColor=colors.HexColor("#9CA3AF"),
        leading=12,
    )

    # ── Header ─────────────────────────────────────────────────────
    story.append(Paragraph("Legal Document Analysis Report", title_style))
    story.append(
        Paragraph(
            f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}  |  File: {filename}",
            subtitle_style,
        )
    )
    story.append(
        HRFlowable(width="100%", thickness=2, color=colors.HexColor("#4F46E5"))
    )
    story.append(Spacer(1, 14))

    # ── Verdict banner ─────────────────────────────────────────────
    verdict = summary.get("one_line_verdict", "")
    if verdict:
        vt = Table(
            [[Paragraph(f"<b>Quick Verdict:</b> {verdict}", body_style)]],
            colWidths=[6.5 * inch],
        )
        vt.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFFBEB")),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#FCD34D")),
                    ("LEFTPADDING", (0, 0), (-1, -1), 12),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                    ("TOPPADDING", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
                ]
            )
        )
        story.append(vt)
        story.append(Spacer(1, 10))

    # ── Risk level ─────────────────────────────────────────────────
    severity = summary.get("severity", "low")
    rc = RISK_COLORS.get(severity, colors.green)
    story.append(
        Table(
            [
                [
                    Paragraph("<b>Risk Level:</b>", body_style),
                    Paragraph(
                        f"<b>{severity.upper()}</b>",
                        ParagraphStyle(
                            "rb", parent=styles["Normal"], fontSize=10, textColor=rc
                        ),
                    ),
                ]
            ],
            colWidths=[1.5 * inch, 5 * inch],
        )
    )
    story.append(Spacer(1, 8))

    # ── What is it + Summary ───────────────────────────────────────
    for heading, key in [
        ("What is this document?", "what_is_it"),
        ("Summary in Plain English", "simple_summary"),
    ]:
        story.append(Paragraph(heading, section_head))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB"))
        )
        story.append(Spacer(1, 6))
        story.append(Paragraph(summary.get(key, ""), body_style))
        story.append(Spacer(1, 6))

    # ── Action items + Key dates ───────────────────────────────────
    for heading, key in [
        ("Action Items", "action_items"),
        ("Key Dates & Deadlines", "key_dates"),
    ]:
        items = summary.get(key, [])
        if items and items != ["None found"]:
            story.append(Paragraph(heading, section_head))
            story.append(
                HRFlowable(
                    width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB")
                )
            )
            story.append(Spacer(1, 6))
            for item in items:
                story.append(Paragraph(f"• {item}", bullet_style))
            story.append(Spacer(1, 6))

    # ── Red flags ──────────────────────────────────────────────────
    red_flags = summary.get("red_flags", [])
    if red_flags and red_flags != ["None found"]:
        story.append(Paragraph("Red Flags", section_head))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB"))
        )
        story.append(Spacer(1, 6))
        for flag in red_flags:
            ft = Table(
                [
                    [
                        Paragraph(
                            f"⚠ {flag}",
                            ParagraphStyle(
                                "fl",
                                parent=styles["Normal"],
                                fontSize=10,
                                textColor=colors.HexColor("#DC2626"),
                            ),
                        )
                    ]
                ],
                colWidths=[6.5 * inch],
            )
            ft.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FEF2F2")),
                        ("LEFTPADDING", (0, 0), (-1, -1), 10),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                        ("TOPPADDING", (0, 0), (-1, -1), 6),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                    ]
                )
            )
            story.append(ft)
            story.append(Spacer(1, 4))

    # ── Clause highlighter ─────────────────────────────────────────
    if clauses:
        story.append(Paragraph("Clause Highlighter", section_head))
        story.append(
            HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#E5E7EB"))
        )
        story.append(Spacer(1, 8))
        for c in clauses:
            risk = c.get("risk_level", "low")
            ct = Table(
                [
                    [
                        Paragraph(f'"{c.get("clause", "")}"', clause_style),
                        Paragraph(
                            f"<b>{risk.upper()}</b>",
                            ParagraphStyle(
                                "rb2",
                                parent=styles["Normal"],
                                fontSize=8,
                                textColor=RISK_COLORS.get(risk, colors.green),
                                alignment=2,
                            ),
                        ),
                    ],
                    [
                        Paragraph(c.get("reason", ""), reason_style),
                        Paragraph(
                            c.get("category", "").replace("_", " ").title(),
                            ParagraphStyle(
                                "cat",
                                parent=styles["Normal"],
                                fontSize=8,
                                textColor=colors.HexColor("#9CA3AF"),
                                alignment=2,
                            ),
                        ),
                    ],
                ],
                colWidths=[5.5 * inch, 1 * inch],
            )
            ct.setStyle(
                TableStyle(
                    [
                        (
                            "BACKGROUND",
                            (0, 0),
                            (-1, -1),
                            RISK_BG.get(risk, colors.HexColor("#F0FDF4")),
                        ),
                        ("LEFTPADDING", (0, 0), (-1, -1), 10),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                        ("TOPPADDING", (0, 0), (-1, -1), 8),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                        (
                            "LINEBEFORE",
                            (0, 0),
                            (0, -1),
                            4,
                            RISK_COLORS.get(risk, colors.green),
                        ),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ]
                )
            )
            story.append(ct)
            story.append(Spacer(1, 6))

    # ── Footer disclaimer ──────────────────────────────────────────
    story.append(Spacer(1, 20))
    story.append(
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB"))
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            "⚠ Disclaimer: This report was generated by AI and is for informational "
            "purposes only. It does not constitute legal advice. Please consult a "
            "qualified lawyer before making any legal decisions.",
            disclaimer_style,
        )
    )

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
