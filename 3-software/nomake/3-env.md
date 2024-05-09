# Environment Variables

Static checking for the usage of environment variables is hard to achieve in regular build systems. However, NoMake provides a concise way to practically access environment variables with type checking.

## Usage

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.4/mod.ts'

// environment variables of interest in the project scope
const env = NM.Env.create(
    {
        // set the default value
        PORT: '8080',
        HOST: 'localhost',
        DEBUG: undefined,
    })

env.OTHER_VAR // **compile-time error**

console.log(Deno.env.get("PORT")) // "8080"
console.log(env.PORT) // "8080"
env.PORT = "";
console.log(Deno.env.get("PORT")) // ""
console.log(env.PORT) // ""

console.log(env.DEBUG) // undefined
Deno.env.set("DEBUG", "ON")
console.log(env.DEBUG) // "ON"
```
