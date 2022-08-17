from __future__ import annotations
from original_posting.types import CommandEntry, Context, OPDocument
from original_posting.parsing import process_nest
import wisepy2


def parse_args(*, align: str = 'left', width: str = "50%"):
    return align, width

class FloatEntry(CommandEntry):
    _inc = 0
    def __init__(self, ctx: Context):
        self.ctx = ctx

    def proc(self, argv: list[str], start: int, end: int):

        align, width = wisepy2.wise(parse_args)(argv)
        source = process_nest(self.ctx, start, end)
        NL = "\n"
        return rf'<div style="width: {width}; float: {align}; display: inline-block;">{NL}{source}{NL}</div>'

    def inline_proc(self, start: int, end: int):
        raise NotImplementedError()
