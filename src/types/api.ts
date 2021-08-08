export namespace API {
  export namespace Types {
    export type Location = {
      name: string;
      local_names: Record<string, string>;
      lat: number;
      lon: number;
      country: string;
    };

    export type DailyForecast = {
      /**
       * Time of the forecasted data, Unix, UTC
       */
      dt: number;
      clouds: number;
      humidity: number;
      feels_like: {
        day: number;
        eve: number;
        morn: number;
        night: number;
      };
      temp: {
        day: number;
        eve: number;
        max: number;
        min: number;
        morn: number;
        night: number;
      };
      weather: Array<{
        description: string;
        icon: string;
        id: number;
        main: string;
      }>;
      pressure: number;
      wind_speed: number;
    };
  }

  export type GetWeatherForecastResponse = {
    daily: API.Types.DailyForecast[];
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
  };
  export type GetCoordinatesResponse = API.Types.Location[];
}
