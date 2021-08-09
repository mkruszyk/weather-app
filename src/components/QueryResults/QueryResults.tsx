import { memo, ReactText } from "react";

type Option<V> = { label: string; value: V };

type Props<V> = {
  results: Option<V>[];
  searchPhrase: string;
  handleSelectItem: (item: Option<V>) => void;
};

function QueryResults<V extends ReactText = string>({
  results,
  searchPhrase,
  handleSelectItem,
}: Props<V>) {
  return (
    <ul className="z-10 w-full p-2 mt-1 border border-gray-200 rounded-md shadow-xl">
      {results.length > 0 &&
        results.map((result, idx) => (
          <li className="w-full" key={idx}>
            <button
              className="w-full px-2 py-1 text-left rounded outline-none hover:bg-blue-50 active:bg-blue-50 focus:bg-blue-50"
              onClick={() => {
                handleSelectItem(result);
              }}
            >
              {result.label}
            </button>
          </li>
        ))}
      {results.length === 0 && (
        <p className="py-4 text-sm text-center text-gray-300">
          There are no results for your search &quot;<b>{searchPhrase}</b>&quot;
        </p>
      )}
    </ul>
  );
}

export default memo(QueryResults);
