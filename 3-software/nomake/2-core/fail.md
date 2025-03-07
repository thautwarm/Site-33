# fail()

`fail` is a function that throws a rescueable error. It has the following usage:
1. make the current target fail
2. indicate that a help function has failed to complete, but is fine to be rescueable/not fatal (which is a useful assumption for downstream ruleset libraries)

    <details>

    <summary> Examples </summary>

    ```typescript
    import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.12/mod.ts'

    function operationTolerantToFailures()
    {
        // ...
        NM.fail('the operation failed')
    }

    NM.target(
        {
            name: 'output.txt',
            deps: ['input.txt'],
            async build()
            {
                await NM.allowFailAsync(
                    // trail
                    async () =>
                    {
                        await operationTolerantToFailures();
                    },
                    async () =>
                    {
                        console.log('the operation failed, but it is fine')
                        // go to the alternative path
                    })
            }
        })
    ```

    </details>


## Usage

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.12/mod.ts'

function helper()
{
    NM.fail('the helper function failed')
}
```
