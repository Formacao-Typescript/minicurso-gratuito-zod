import { appConfig, AppConfig } from "./envs";

async function main(env: AppConfig) {
  return env
}

main(appConfig).then(console.table).catch(console.error)
