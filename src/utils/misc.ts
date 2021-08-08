export function formatOMWDate(dt: number) {
  return new Date(dt * 1000).toLocaleDateString(["en"], {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    weekday: "long",
  });
}

export function getMaxValue(values: number[]) {
  return values.sort((a, b) => b - a)[0];
}

export function getMinValue(values: number[]) {
  return values.sort((a, b) => a - b)[0];
}

export function getMeanValue(values: number[]) {
  const totalSum = values.reduce((acc, temp) => acc + temp, 0);

  return (totalSum / values.length).toFixed(1);
}

export function getModeValue(values: number[]) {
  const frequencies = values.reduce<Record<string, number>>((acc, value) => {
    return {
      ...acc,
      [value]: acc[value] ? acc[value] + 1 : 1,
    };
  }, {});

  const maxFreq = Object.values(frequencies).sort((a, b) => b - a)[0];

  // for example - for array of values [1, 2, 3, 4] there is no mode value (maxFreq === 0)
  const isMaxFreqConstant = Object.values(frequencies).every(
    (val) => maxFreq === val
  );

  if (isMaxFreqConstant) {
    return [];
  }

  const mode = Object.entries(frequencies).reduce<number[]>(
    (acc, [key, value]) => {
      if (value === maxFreq) {
        return [...acc, Number(key)];
      }

      return acc;
    },
    []
  );

  return mode;
}
