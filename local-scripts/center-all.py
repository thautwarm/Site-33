from __future__ import annotations
from original_posting.types import CommandEntry, Context, OPDocument
from original_posting.parsing import process_nest
import bs4

style_sheet = """
body {
    max-width: max-content;
    margin: auto;
}
"""
class ContainerHtml(CommandEntry):
    _inc = 0
    def __init__(self, ctx: Context):
        self.ctx = ctx

    @staticmethod
    def callback(op: OPDocument):
        html = bs4.BeautifulSoup(op.code, "html.parser")
        style = html.new_tag("style")
        style.contents.append(bs4.Stylesheet(style_sheet))
        head = html.find("head")
        if isinstance(head, bs4.Tag):
            head.contents.append(style)
        # else:
        html.contents.insert(0, style)
        op.code = str(html)

    def proc(self, argv: list[str], start: int, end: int):
        self.ctx.target_doc.callbacks.append(self.callback)
        return ''
