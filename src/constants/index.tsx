import { UnitsOfMeasurement } from "@/types/misc";
import { ReactElement } from "react";

export const unitsDict: Record<
  UnitsOfMeasurement,
  { pressure: string; temperature: ReactElement; wind: string }
> = {
  metric: {
    pressure: "hPa",
    temperature: <>&#8451;</>,
    wind: "m/s",
  },
  imperial: {
    pressure: "hPa",
    temperature: <>&#8457;</>,
    wind: "mi/h",
  },
};
