import typing
from original_posting.types import OPDocument
from original_posting.ptag_dsl import string_to_pattern, match_any_tag
from original_posting.types import CommandEntry, Context, OPDocument
from datetime import datetime, timedelta
import original_posting.builtin_names as names
import bs4
import os
import dataclasses

DATE_FORMAT = '%Y-%m-%d'

def parse_date(s):
    return datetime.strptime(s, DATE_FORMAT)

p = string_to_pattern("Time(~t)")

def default_format(doc: OPDocument):
    return doc.title or doc.output_path_absolute.name


def _create_list(fmt_func, id: str, doc: OPDocument):
    parts1 = ('..', ) * (len(doc.output_path_absolute.relative_to(doc.project_path_absolute).parts) - 1)
    result: list[tuple[datetime, OPDocument, str]] = []
    html = bs4.BeautifulSoup(doc.code, "html.parser")
    ul = html.find("ul", attrs={"id": id})
    if not ul:
        return

    for each in doc.project_docs.values():
        g = {}
        if match_any_tag(p, each.tags, g):
            part2 = each.output_path_absolute.relative_to(doc.project_path_absolute).parts
            path = os.path.join(*parts1, *part2)
            result.append((parse_date(g["t"]), each, path))

    result.sort(key=lambda x: x[0], reverse=True)
    for d, each_doc, path in result:
        display_text = fmt_func(each_doc, d)
        li = html.new_tag("li")
        a = html.new_tag("a", href=path)
        a.append(display_text)
        li.append(a)
        ul.append(li)

    doc.code = str(html)


@dataclasses.dataclass(frozen=True)
class PresentDocRecord:
    id: str
    fmt_func: typing.Callable[[OPDocument, datetime], str]

    def __call__(self, op: OPDocument):
        _create_list(self.fmt_func, self.id, op)

def format_title(op_doc: OPDocument, time: datetime):
    title = op_doc.title or op_doc.output_path_absolute.name
    return f"{title} ({time.strftime(DATE_FORMAT)})"

class SortDocs(CommandEntry):
    def __init__(self, ctx: Context):
        self.ctx = ctx

    def proc(self, argv: list[str], start: int, end: int):
        raise NotImplementedError

    def inline_proc(self, start: int, end: int):
        i = self.ctx.storage.setdefault(SortDocs, 0)
        tag_id = f"sort-docs-{i}"
        callback = PresentDocRecord(tag_id, format_title)
        self.ctx.storage[SortDocs] = i + 1
        if callback not in self.ctx.target_doc.callbacks:
            self.ctx.target_doc.callbacks.append(callback)
        return "<ul id='{}'></ul>".format(tag_id)
