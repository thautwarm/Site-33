from __future__ import annotations
from original_posting.types import CommandEntry, Context, OPDocument
from original_posting.builtin_names import NAME_PythonScope
from original_posting.parsing import process_nest

class EveryDoc(CommandEntry):
    def __init__(self, ctx: Context):
        self.ctx = ctx
        self.ctx.target_doc.callbacks
        self.text = ""

    def append_to_doc(self, doc: OPDocument):
        for _, doc in doc.project_docs.items():
            doc.code = self.text + doc.code

    def proc(self, argv: list[str], start: int, end: int):
        code = process_nest(self.ctx, start, end)
        self.text = code
        self.ctx.target_doc.callbacks.append(self.append_to_doc)
        return ''

