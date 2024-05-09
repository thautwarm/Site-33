# makefile()

This function triggers the build process.

## Usage

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.3/mod.ts'

// define options
NM.option('debug', ({ value }) => NM.Log.verbose(`do stuff with ${value}`))

// parse options
NM.parseOptions()

// define build targets
NM.target(
    {
        name: 'out.txt',
        async build()
        {
            await new NM.Path('out.txt').writeText('Hello, world!')
        }
    })

await NM.makefile()
```