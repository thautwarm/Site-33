# Log

`NM.Log` is a static class that provides logging utilities.

## Logging Levels

Log levels are crucial for providing insights into the execution of a build system. They offer a spectrum of verbosity, allowing users to tailor the amount of information they receive according to their needs. NoMake's log level design is built upon extensive practice with previous build systems, ensuring clarity, utility, and adaptability.

- `ok`
- `error`
- `warn`
- `info`
- `normal`
- `verbose` (could be used for debugging)

The default severity of the levels is in the order listed above (higher to lower).

## Basic Usage

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.12/mod.ts'

// level: normal
NM.Log.msg("<normal message>")
NM.Log.msg("<normal message>", 'Title')

// level: ok
NM.Log.ok('<successful message>')
NM.Log.ok('<successful message>', 'Title')

// level: error
NM.Log.error('<error message>')
NM.Log.error('<error message>', 'Title')

// level: warn
NM.Log.warn('<warning message>')
NM.Log.warn('<warning message>', 'Title')

// level: info
NM.Log.info('<info message>')
NM.Log.info('<info message>', 'Title')

// level: verbose
NM.Log.verbose("<verbose message>")
NM.Log.verbose("<verbose message>", 'Title')
```

## Adding and Removing Loggers

```typescript
const logger = NM.Log.addTransport('path/to/file')

/*
    do something
*/

NM.Log.rmTransport(logger)
```

The `addTransport` method returns a logger object that can be used to remove the logger from the list of loggers.

## Advanced Usage

### Custom Severity and Level

You could define the severity for your custom logger by using a second argument for the `addTransport`.

```typescript
// a logger that only logs info and above,
// with custom severity
const logger = NM.Log.addTransport('path/to/file', {
    severity: {
        ok: 3,
        error: 3,
        warn: 3,
        info: 2,
        normal: 1,
        verbose: 1,
    },
    level: 'info'
})
```

### Custom Logger

The `addTransport` method can also take a custom logger that implements the following interface:

```typescript
export interface Transport
{
  severity: Record<LogLevel, number>
  level: LogLevel
  log(msg: string, level: LogLevel, title?: string): void;
}
```

There is an example of a custom logger:

```typescript
class CustomLogger implements NM.Transport
{
  severity = {
    ok: 3,
    error: 3,
    warn: 3,
    info: 2,
    normal: 1,
    verbose: 1,
  }
  level = 'info'

  log(msg: string, level: LogLevel, title?: string): void
  {
    title ??= level;
    console.log(`[${title}] ${msg}`);
  }
}
```