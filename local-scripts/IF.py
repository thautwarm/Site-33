from __future__ import annotations
from original_posting.types import CommandEntry, Context, OPDocument
from original_posting.builtin_names import NAME_PythonScope
from original_posting.parsing import process_nest, get_command_entry
import bs4
import wisepy2
import yaml
import io
import shutil

def parse_args(id: str):
    return id

_html_factory = bs4.BeautifulSoup("", "html.parser")


class IFMacroEntry(CommandEntry):
    _inc = 0
    def __init__(self, ctx: Context):
        self.ctx = ctx

    def proc(self, argv: list[str], start: int, end: int):
        scope = self.ctx.storage.setdefault(NAME_PythonScope, {})
        if all(eval(arg, scope) for arg in argv):
            return process_nest(self.ctx, start, end)
        else:
            return ''

    def inline_proc(self, start: int, end: int):
        raise ValueError("inline @if is invalid")
