import sys
import os
from pdf2docx import Converter

def convert_pdf_to_docx(pdf_file, docx_file):
    try:
        cv = Converter(pdf_file)
        cv.convert(docx_file, start=0, end=None)
        cv.close()
        print("SUCCESS")
    except Exception as e:
        print(f"ERROR: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python convert_pdf.py <input_pdf> <output_docx>", file=sys.stderr)
        sys.exit(1)
    
    pdf_in = sys.argv[1]
    docx_out = sys.argv[2]
    convert_pdf_to_docx(pdf_in, docx_out)

