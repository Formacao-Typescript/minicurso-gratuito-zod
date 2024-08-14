import { type AppConfig, appConfig } from "./config.js";
import { web } from "./presentation/web.js";

async function main(config: AppConfig) {
    const webLayer = await web(config)

    process.on('SIGINT', () => {
        console.log('Received SIGINT, shutting down...')
        webLayer.shutdown()
    })

    process.on('SIGTERM', () => {
        console.log('Received SIGTERM, shutting down...')
        webLayer.shutdown()
    })

    process.on('unhandledRejection', (err) => {
        console.error('Unhandled rejection:', err)
        webLayer.shutdown()
    })

    process.on('uncaughtException', (err) => {
        console.error('Uncaught exception:', err)
        webLayer.shutdown()
    })

    return webLayer.server.listen(config.PORT, () => console.log(`Server listening on port ${config.PORT}`))
}

await main(appConfig)

