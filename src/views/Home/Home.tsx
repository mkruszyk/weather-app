import Head from "next/head";
import { useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";

import api from "@/modules/api";
import { API } from "@/types/api";

function Home() {
  const [searchPhrase, setSearchPhrase] = useState("Wrocław");
  const [cityName] = useDebounce(searchPhrase, 500);

  const locationQuery = useQuery(
    ["GET /city-name", cityName],
    () => api.geo.get<API.GetCoordinatesResponse>(`/direct?q=${cityName}`),
    {
      enabled: !!cityName,
      select: (res) => res.data,
    }
  );

  const forecastQuery = useQuery(
    ["GET /onecall", locationQuery.data?.length],
    () =>
      api.weather.get(
        `/onecall?lat=${locationQuery.data?.[0].lat}&lon=${locationQuery.data?.[0].lon}&exclude=current,minutely,hourly,alerts`
      ),
    {
      enabled: !!locationQuery.data?.length,
      select: (res) => res.data,
    }
  );

  return (
    <>
      <Head>
        <title>Weather App</title>
      </Head>
      <main className="flex m-4 flex-col items-center font-sans">
        <h1 className="text-2xl uppercase">Weather App</h1>
        <input
          className="rounded border-gray-200 shadow-md border outline-none px-4 py-1 max-w-xs mt-4 text-gray-800"
          onChange={(evt) => setSearchPhrase(evt.target.value)}
          value={searchPhrase}
        />
      </main>
    </>
  );
}

export default Home;
