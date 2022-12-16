import graphviz_artist as ga
import graphviz_artist.attr as attr

g = ga.Graph(attr.Rankdir("BT"), directed=True)

class fontname(attr.Attr):
    pass

params = attr.Shape.box, fontname("Source Han Serif")

SourceCode = g.new(attr.Label("M语言源代码"), *params)

AST = g.new(attr.Label("M语法树"), *params)

IR = g.new(attr.Label("IR (BaseMIR)"), *params)

CACHE = g.new(attr.Label("缓存文件"), *params)