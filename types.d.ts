declare namespace NodeJS {
  interface ProcessEnv {
    OMW_API_KEY: string;
    OMW_GEO_API_URL: string;
    OMW_WEATHER_API_URL: string;
  }
}

declare module "*.svg" {
  import type { FunctionComponent, SVGProps } from "react";

  const content: FunctionComponent<SVGProps<SVGElement>>;
  export default content;
}
