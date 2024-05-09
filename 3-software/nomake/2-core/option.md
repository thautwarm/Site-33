# option()

> [!NOTE]
> Remember to call [`parseOptions()`](./parseOptions.md) before building to handle the options but after defining all options.
> Or the options will not be parsed.


`option()` defines a build option. It registers a custom option that can be passed to the build script via command-line arguments.

## Usage

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.4/mod.ts'

const Config = {
    DEBUG: false
}

// usage 1
NM.option('debug', ({ key, value }) => {
    // key === 'debug'
    if (value)
    {
        Config.DEBUG = true;
    }
});

// usage 2: allow documentations
NM.option('output', {
    callback: ({ key, value }) => {
        // key === 'OUTPUT'
        console.log('User-specified output path:', value);
    },
    doc: 'The output file path.'
})

// `parseOptions()` is required to handling options before building.
NM.parseOptions();

// trigger the build
await NM.makefile()
```

When the build script is run, the options can be passed as command-line arguments:

```bash
deno run -A build.ts -Ddebug # the default value is 'ON'
deno run -A build.ts -Doutput=a.txt
```
