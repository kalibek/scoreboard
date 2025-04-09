export function Serve({name, serve, order}) {
    if (serve === order) {
        return <>
            {name} [&bull;]
        </>
    }
    return <>
        {name}
    </>
}