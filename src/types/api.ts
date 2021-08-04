export namespace API {
  export namespace Types {
    export type Location = {
      name: string;
      local_names: Record<string, string>;
      lat: number;
      lon: number;
      country: string;
    };
  }

  export type GetCoordinatesResponse = API.Types.Location[];
}
