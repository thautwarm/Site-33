import graphviz_artist as ga
import graphviz_artist.attr as attr

g = ga.Graph(attr.Rankdir("TB"), directed=True)

class fontname(attr.Attr):
    pass

font = fontname("Source Han Serif")

class Label(attr.Attr):
    def __init__(self, value: str):
        self.value = '\n'.join(list(value))

attr.Label = Label

File = g.new(attr.Label("文件"), attr.Shape.box, font)

Stmt = g.new(attr.Label("语句"), attr.Shape.box, font)

LHS = g.new(attr.Label("左值"), attr.Shape.box, font)

Expr = g.new(attr.Label("表达式"), attr.Shape.box, font)

# UnaryOp = g.new(attr.Label("一元运算符"), attr.Shape.box, font)

# BinOp = g.new(attr.Label("二元运算符"), attr.Shape.box, font)

# CmpOp = g.new(attr.Label("比较运算符"), attr.Shape.box, font)

StmtGlobal = g.new(attr.Label("global声明语句"), attr.Shape.box, font)

_ = StmtGlobal > g.new(attr.Label("标识符"), attr.Shape.box, font)

_ = Stmt > StmtGlobal

StmtCommand = g.new(attr.Label("命令语句"), attr.Shape.box, font)

_ = StmtCommand > g.new(attr.Label("命令参数: 标识符1 ... 标识符n"), attr.Shape.box, font)

_ = Stmt > StmtCommand

StmtFunction = g.new(attr.Label("函数定义语句"), attr.Shape.box, font)

params = attr.Shape.box, font
_ = StmtFunction > g.new(attr.Label("函数名: 标识符"), *params)
_ = StmtFunction > g.new(attr.Label("返回列表: 标识符1 ... 标识符n"), *params)
_ = StmtFunction > g.new(attr.Label("形式参数: 标识符1 ... 标识符n"), *params)
_ = StmtFunction > g.new(attr.Label("函数体: 语句1 ... 语句n"), *params)

_ = Stmt > StmtFunction

StmtAssign = g.new(attr.Label("赋值语句"), attr.Shape.box, font)

params = attr.Shape.box, font
_ = StmtAssign > g.new(attr.Label("左值"), *params)
_ = StmtAssign > g.new(attr.Label("表达式"), *params)
_ = StmtAssign > g.new(attr.Label("打印: 布尔类型"), *params)

_ = Stmt > StmtAssign

StmtExpr = g.new(attr.Label("表达式语句"), attr.Shape.box, font)
_ = StmtExpr > g.new(attr.Label("表达式"), *params)
_ = StmtExpr > g.new(attr.Label("打印: 布尔类型"), *params)
_ = Stmt > StmtExpr

StmtIf = g.new(attr.Label("if语句"), attr.Shape.box, font)
_ = StmtIf > g.new(attr.Label("条件: 表达式"), *params)
_ = StmtIf > g.new(attr.Label("then分支: 语句1 ... 语句n"), *params)
_ = StmtIf > g.new(attr.Label("else分支: 语句1 ... 语句n"), *params)
_ = Stmt > StmtIf

StmtWhile = g.new(attr.Label("while语句"), attr.Shape.box, font)

_ = StmtWhile > g.new(attr.Label("条件: 表达式"), *params)
_ = StmtWhile > g.new(attr.Label("循环体: 语句1 ... 语句n"), *params)

_ = Stmt > StmtWhile

StmtFor = g.new(attr.Label("for语句"), attr.Shape.box, font)
_ = StmtFor > g.new(attr.Label("循环变量: 标识符"), *params)
_ = StmtFor > g.new(attr.Label("迭代器: 表达式"), *params)
_ = StmtFor > g.new(attr.Label("循环体: 语句1 ... 语句n"), *params)
_ = Stmt > StmtFor

StmtBreak = g.new(attr.Label("break语句"), attr.Shape.box, font)

_ = Stmt > StmtBreak

StmtCont = g.new(attr.Label("continue语句"), attr.Shape.box, font)

_ = Stmt > StmtCont

StmtReturn = g.new(attr.Label("return语句"), attr.Shape.box, font)

_ = Stmt > StmtReturn

g.view()