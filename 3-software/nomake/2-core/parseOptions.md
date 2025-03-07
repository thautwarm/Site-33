# parseOptions()

This function needs to be called before building to handle the options but after defining all options, or the options will not be parsed.

The reason why this is necessary is to allow fine-grained control over the build process stages.

See [option()](./option.md) for defining build options.

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.12/mod.ts'

NM.option('debug', ({ value }) => NM.Log.verbose(`do stuff with ${value}`))

NM.parseOptions()

// trigger the build
await NM.makefile()
```