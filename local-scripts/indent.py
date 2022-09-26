from __future__ import annotations
from original_posting.types import CommandEntry, Context, OPDocument
from original_posting.builtin_names import NAME_PythonScope
from original_posting.parsing import process_nest, get_command_entry
import bs4
import wisepy2
import textwrap

_html_factory = bs4.BeautifulSoup("", "html.parser")

def parse_args(title: str):
    return title

def count_indent(x: str):
    i = 0
    for c in x:
        if c == " ":
            i += 1
        elif c == "\t":
            i += 1
        else:
            break
    return x[:i]

class IndentEntry(CommandEntry):
    _inc = 0
    def __init__(self, ctx: Context):
        self.ctx = ctx

    def proc(self, argv: list[str], start: int, end: int):
        text = process_nest(self.ctx, start, end)
        _set = False
        def predicate(s):
            nonlocal _set
            try:
                return _set
            finally:
                _set = True
        return textwrap.indent(text, (self.ctx.col + len("@indent") - 1) * " ", predicate)


    def inline_proc(self, start: int, end: int):
        return super().inline_proc(start, end)
