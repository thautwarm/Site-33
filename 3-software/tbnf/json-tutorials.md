# JSON Tutorials

## Setup

Firstly, install the `tbnf` command-line tool from
[the release page](https://github.com/thautwarm/Typed-BNF/releases) and add it
to your PATH.

## Create the TBNF grammar

Create the `Json.tbnf` with the following content at the root of your project
(or any where you want):

```ocaml
// Json.tbnf
extern var toInt : str -> int
extern var toFlt : str -> float
extern var getStr : token -> str
extern var unesc : str -> str
extern var appendList : <a> (list<a>, a) -> list<a>

type Json
type JsonPair(name: str, value: Json)

case JInt : int -> Json
case JFlt : float -> Json
case JStr : str -> Json
case JNull : () -> Json
case JList : (elements: list<Json>) -> Json
case JDict : list<JsonPair> -> Json
case JBool : bool -> Json

ignore space

digit = [0-9] ;

start : json { $1 }

int = digit+ ;
float = digit* "." int ;
str = "\"" ( "\\" _ | ! "\"" )* "\"" ;
space = ("\t" | "\n" | "\r" | " ")+;

seplist(sep, elt) : elt { [$1] }
                  | seplist(sep, elt) sep elt
                    { appendList($1, $3) }

jsonpair : <str> ":" json { JsonPair(unesc(getStr($1)), $3) }

json : <int> { JInt(toInt(getStr($1))) }
      | <float> { JFlt(toFlt(getStr($1))) }
      | "null"  { JNull() }
      | <str>   { JStr(unesc(getStr($1))) }
      | "[" "]" { JList([]) }
      | "{" "}" { JDict([]) }
      | "true"  { JBool(true) }
      | "false"  { JBool(false) }
      | "[" seplist(",", json) "]" { JList($2) }
      | "{" seplist(",", jsonpair) "}" { JDict($2) }
```

## Define the type mapper

TBNF has several builtin types:
- `int`
- `float`
- `str`
- `bool`
- `list<a>`
- tuples, e.g.:
    -  `int * str` is a tuple of an `int` and a `str`
    -  `int * str * bool` is a triple of an `int`, a `str` and a `bool`

To associate a type in the target language with all TBNF builtin types, you may define how types map to the target language with the `tbnf.config.js` file:

1. Create `tbnf.config.js` file at the your desired output directory.

2. Define the type mapper in the file:

::: tabs#type-mapper

@tab C\#

```typescript
// file: Grammar/tbnf.config.cs
"use strict";

function rename_type(x) {
    if (x == "str") return "string"
    if (x == "token") return "IToken"
    if (x == "float") return "double"
    if (["int", "bool"].includes(x)) return x
    if ('list' == x) return 'System.Collections.Generic.List'
    if (x == "params") return "Parameters"
    return x
}

function rename_var(x) {
    if (x == 'params') return x + "v"
    return x
}

function rename_field(x) {
    if (x == 'params') return "parameters"
    return x
}

module.exports = { rename_type, rename_var, rename_field }
```


@tab TypeScript

```javascript
// file: src/grammar/tbnf.config.js

"use strict";

function rename_type(x) {
  if (x == "list") return "Array";
  if (x == "int") return "number";
  if (x == "float") return "number";
  if (x == "str") return "string";
  if (x == "bool") return "boolean";
  if (x == "token") return "antlr.Token";
  return x + "_t";
}


module.exports = {
  rename_type
};
```

:::


> [!tip]
> `tbnf.config.cs` files used above is suitable for common use cases.


## Generate the parser

> [!NOTE]
> When targeting C#, you might be aware of the following points:
> 1. Do not use `-lang Json` because it will make conflicts between the `Json` type and `Json` namespace!
> 2. Assure `tbnf`'s `-lang` option is aligned with antlr4's `-package` option!

::: tabs#download

@tab C\#


```bash
# install dependencies
dotnet add package Antlr4.Runtime.Standard

# create the grammar directory
tbnf Json.tbnf -o Grammar/ -lang JsonCS --backend csharp-antlr
antlr4 -Dlanguage=CSharp Grammar/JsonCS.g4 -o Grammar/ -package JsonCS
```

@tab TypeScript

```bash
# install dependencies
pnpm add antlr4ng --save
pnpm add -g antlr-ng

# create the parser
tbnf Json.tbnf -o src/grammar -lang Json -be typescript-antlr -ae tagged-union
antlr-ng -Dlanguage=TypeScript src/grammar/Json.g4 -o src/grammar
```

:::

## Implement the interfaces

In `Json.tbnf`, we see some `extern` declarations:

```ocaml
extern var parseInt : str -> int
extern var parseFlt : str -> float
extern var getStr : token -> str
extern var unesc : str -> str
extern var appendList : <a> (list<a>, a) -> list<a>
```

These declarations are required by the grammar to achieve semantic actions, but
they are not provided by the generated parser itself.

We need to implement these functions in
`<outDir>/<YourLanguage>Require.<suffix>` file, where:

- `<YourLanguage>`

  the language name specified with `-lang/--language` option.

- `<outDir>`

  the output directory specified with `-o/--outDir` option.

- `<suffix>`

  the suffix is decided by the backend you've chosen with `-be/--backend`
  option.

::: tabs#requirements

@tab C\#

We need to implement these functions in `Grammar/JsonCSRequire.cs` file.

```csharp
namespace JsonCS;

using System.Linq;
using System.Collections.Generic;
using Antlr4.Runtime;

public partial class JsonCSParser
{
    public static int toInt(string s)
    {
        return int.Parse(s);
    }

    public static double toFlt(string s)
    {
        return double.Parse(s);
    }

    public static string getStr(IToken s)
    {
        return s.Text ?? "";
    }

    public static List<T> appendList<T>(List<T> x, T y)
    {
        // for modern .NET 
        // return [...x, y];
        return x.Append(y).ToList();
    }

    public static string unesc(string s)
    {
        var r = new System.Text.StringBuilder();
        int i = 1;
        var n = s.Length - 1;
        while (i < n)
        {
            if (s[i] == '\\')
            {
                i++;
                switch (s[i])
                {
                    case 'b':
                        r.Append('\b');
                        break;
                    case 'f':
                        r.Append('\f');
                        break;
                    case 'n':
                        r.Append('\n');
                        break;
                    case 'r':
                        r.Append('\r');
                        break;
                    case 't':
                        r.Append('\t');
                        break;
                    case '\\':
                        r.Append('\\');
                        break;
                    case '"':
                        r.Append('"');
                        break;
                    case '\'':
                        r.Append('\'');
                        break;
                    default:
                        r.Append(s[i]);
                        break;
                }
            }
            else
            {
                r.Append(s[i]);
            }
            i++;
        }
        return r.ToString();
    }
}
```

@tab TypeScript

We need to implement these functions in `src/grammar/JsonRequire.ts` file.

```typescript
import { Token } from "antlr4ng";
export const toInt = parseInt;
export const toFlt = parseFloat;
export const getStr = (x: Token) => x.text ?? "";
export function appendList<T>(x: T[], y: T)
{
    return [...x, y];
}

// we should export these for the generated parser to use
export * from './JsonConstructor';

// JSON.parse is also a valid implementation,
// but we might not use an existing JSON parser to implement the current JSON parser...
export function unesc(s: string)
{
    let r = "";
    let i = 1;
    let n = s.length - 1;
    while (i < n)
    {
        if (s[i] == '\\')
        {
            i++;
            switch (s[i])
            {
                case 'b':
                    r += '\b';
                    break;
                case 't':
                    r += '\t';
                    break;
                case 'n':
                    r += '\n';
                    break;
                case 'f':
                    r += '\f';
                    break;
                case 'r':
                    r += '\r';
                    break;
                case '\\':
                    r += '\\';
                    break;
                case '\"':
                    r += '\"';
                    break;
                case '\'':
                    r += '\'';
                    break;
                default:
                    r += s[i];
                    break;
            }
        }
        else
        {
            r += s[i];
        }
        i++;
    }
    return r;
}
```

:::

## Create the final parser

::: tabs#final-parser

@tab C\#

We finally create the `Program.cs` file to export the parser and handle parse exceptions:


```csharp
// Program.cs
namespace JsonCS;

using Antlr4.Runtime;

sealed class SyntaxError : System.Exception
{
    public int Line { get; }
    public int Column { get; }
    public SyntaxError(string message, int line, int column) : base(message)
    {
        Line = line;
        Column = column;
    }
}

class ExcErrorListener : BaseErrorListener
{
    public override void SyntaxError(TextWriter output, IRecognizer recognizer, IToken offendingSymbol, int line, int charPositionInLine, string msg, RecognitionException e)
    {
        throw new SyntaxError(
            "Syntax error at line " + line + ":" + charPositionInLine + ": " + msg,
            line,
            charPositionInLine
        );
    }
}

class LexerErrorListener : IAntlrErrorListener<int>
{
    public void SyntaxError(TextWriter output, IRecognizer recognizer, int offendingSymbol, int line, int charPositionInLine, string msg, RecognitionException e)
    {
        throw new SyntaxError(msg, line, charPositionInLine);
    }
}

public partial class JsonCSParser
{
    public static Json Parse(string s)
    {
        ICharStream stream = CharStreams.fromString(s);
        var lexer = new JsonCSLexer(stream);
        lexer.RemoveErrorListeners();
        lexer.AddErrorListener(new LexerErrorListener());
        ITokenStream tokens = new CommonTokenStream(lexer);
        var parser = new JsonCSParser(tokens);
        parser.RemoveErrorListeners();
        parser.AddErrorListener(new ExcErrorListener());
        parser.BuildParseTree = false;
        var result = parser.start().result;
        return result;
    }
}


public static class Program
{
    public static void Main(string[] args)
    {
        var json = JsonCSParser.Parse("{\"name\": \"John\", \"age\": 30, \"city\": \"New York\"}");
        Console.WriteLine(json);
    }
}
```

You can then compile/test the package:

```bash
> dotnet run
```

Output:

```
JDict { value = System.Collections.Generic.List`1[JsonCS.JsonPair] }
```

@tab TypeScript

We finally create the `src/index.ts` file to export the parser and handle parse exceptions:

```typescript
// src/index.ts
import * as antlr from "antlr4ng";
import { JsonParser } from "./grammar/JsonParser";
import { JsonLexer } from "./grammar/JsonLexer";
import { CommonTokenStream } from "antlr4ng";

class ExcErrorListener extends antlr.BaseErrorListener {
    syntaxError(recognizer: antlr.Recognizer<any>, offendingSymbol: any, line: number, charPositionInLine: number, msg: string, e: antlr.RecognitionException | null) {
        throw new SyntaxError("Syntax error at line " + line + ":" + charPositionInLine + ": " + msg);
    }
}

export function parseJson(text: string) {
    const m_InputStream = antlr.CharStream.fromString(text);
    const m_Lexer = new JsonLexer(m_InputStream);
    m_Lexer.removeErrorListeners();
    m_Lexer.addErrorListener(new ExcErrorListener());
    const m_tokenStream = new CommonTokenStream(m_Lexer);
    const m_Parser = new JsonParser(m_tokenStream);
    m_Parser.removeErrorListeners();
    m_Parser.addErrorListener(new ExcErrorListener());
    m_Parser.buildParseTrees = false;
    var start = m_Parser.start();
    return start.result;
}

// test the parser
console.log(parseJson(`{"name": "John", "age": 30, "city": "New York"}`));
```

You can then compile/test the package:

```bash
tsc -p . -outDir dist
node dist/index.js
```

Output:

```
{
  '$type': 'JDict',
  value: [
    { name: 'name', value: [Object] },
    { name: 'age', value: [Object] },
    { name: 'city', value: [Object] }
  ]
}
```

:::
