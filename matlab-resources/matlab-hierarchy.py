import graphviz_artist as ga
import graphviz_artist.attr as attr

g = ga.Graph(attr.Rankdir("BT"), directed=True)

class fontname(attr.Attr):
    pass

font = fontname("Source Han Serif")

language_features = [
    g.new(attr.Shape.box, attr.Label('varargin'), font),
    g.new(attr.Shape.box, attr.Label('nargout'), fontname("Source Han Serif")),
    g.new(attr.Shape.box, attr.Label('...'), fontname("Source Han Serif")),
]

LangFeature = g.new(attr.Shape.box, attr.Label("语言特性"), fontname("Source Han Serif"))

for each in language_features[:-1]:
    _ = each > LangFeature

_ = language_features[-1][attr.XLabel("(重构支持)"), fontname("Source Han Serif")] > LangFeature

primitive_funcs = [
    g.new(attr.Shape.box, attr.Width(1.5), attr.Label('32位整数\n加法'), fontname("Source Han Serif")),
    g.new(attr.Shape.box, attr.Width(1.5), attr.Label('rand'), fontname("Source Han Serif")),
    g.new(attr.Shape.box, attr.Width(1.5), attr.Label('...'), fontname("Source Han Serif")),
]

BuiltinFun = g.new(attr.Shape.box, attr.Label("内置函数"), fontname("Source Han Serif"))

for each in primitive_funcs[:-1]:
    _ = each > BuiltinFun

_ = primitive_funcs[-1][attr.XLabel("(增量支持)"), fontname("Source Han Serif")] > BuiltinFun


primitive_cmds = [
    g.new(attr.Shape.box, attr.Width(1), attr.Label('clear'), fontname("Source Han Serif")),
    g.new(attr.Shape.box, attr.Width(1), attr.Label('mex'), fontname("Source Han Serif")),
    g.new(attr.Shape.box, attr.Width(1), attr.Label('...'), fontname("Source Han Serif")),
]

BuiltinCmd = g.new(attr.Shape.box, attr.Label("内置命令"), fontname("Source Han Serif"))

for each in primitive_cmds[:-1]:
    _ = each > BuiltinCmd

_ = primitive_cmds[-1][attr.XLabel("(增量支持)"), fontname("Source Han Serif")] > BuiltinCmd

LowLevel = g.new(attr.Shape.box, attr.Label("底层内置功能"), fontname("Source Han Serif"))


_ = LangFeature > LowLevel
_ = BuiltinFun > LowLevel
_ = BuiltinCmd > LowLevel

MATLAB = g.new(attr.Shape.circle, attr.Label("MATLAB代码"), fontname("Source Han Serif"))

_ = LowLevel > MATLAB

EXTERNAL = g.new(attr.Shape.hexagon, attr.Label("外部语言:\nC/C++/Java"), fontname("Source Han Serif"))

HighLevel = g.new(attr.Shape.box, attr.Label("上层应用"), fontname("Source Han Serif"))

_ = MATLAB > HighLevel
_ = EXTERNAL > HighLevel

applications = [
    g.new(attr.Shape.box, attr.Width(2), attr.Label("LibSVM")),
    g.new(attr.Shape.box, attr.Width(2), attr.Label("Mapping Toolbox")),
    g.new(attr.Shape.box, attr.Width(2), attr.Label("Virtual Reality Toolbox")),
    g.new(attr.Shape.box, attr.Width(2), attr.Label("...")),
]

for each in applications:
    _ = HighLevel > each

g.view()