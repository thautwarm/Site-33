# lc_run.py

from lc import parser
from lc_ast import eval_lc

def add(ctx, x):
    def addx(ctx, y):
        return y, ctx
    return addx, ctx

S = { 'add': add }

def run_code(source_code):
    r, _ = eval_lc(S, parser.parse(source_code))
    print("执行结果为:", r)

run_code("add 1 2") # 3
run_code("(func (x) {add 2 x})(3)") # 5