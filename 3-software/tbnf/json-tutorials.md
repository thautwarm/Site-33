# JSON Tutorials

## Setup

Firstly, install the `tbnf` command-line tool from [the release page](https://github.com/thautwarm/Typed-BNF/releases) and add it to your PATH.

Then you setup the project dependencies with the following commands:

<div class="site33-tabs">
    <input type="radio" name="site33-tabs" id="site33-tab1" checked>
    <label for="site33-tab1">C\#</label>
    <input type="radio" name="site33-tabs" id="site33-tab2">
    <label for="site33-tab2">TypeScript</label>

    <div class="site33-tab-content" id="site33-content1" style="min-height: 6em">
        <ul>
            <li> <code> dotnet add package Antlr4.Runtime.Standard </code> </li>
        </ul>

    </div>

    <div class="site33-tab-content" id="site33-content2" style="min-height: 6em">
        <ul>
            <li> <code> npm i antlr4ng --save </code> </li>
            <li> <code> npm i -g antlr-ng </code> </li>
        </ul>
    </div>

</div>

## Create the TBNF grammar file

Create the `Json.tbnf` with the following content at the root of your project (or any where you want):

```ocaml
// Json.tbnf
extern var parseInt : str -> int
extern var parseFlt : str -> float
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

json : <int> { JInt(parseInt(getStr($1))) }
      | <float> { JFlt(parseFlt(getStr($1))) }
      | "null"  { JNull() }
      | <str>   { JStr(unesc(getStr($1))) }
      | "[" "]" { JList([]) }
      | "{" "}" { JDict([]) }
      | "true"  { JBool(true) }
      | "false"  { JBool(false) }
      | "[" seplist(",", json) "]" { JList($2) }
      | "{" seplist(",", jsonpair) "}" { JDict($2) }

```

