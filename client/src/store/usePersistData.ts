"use client";

import { useState, useEffect } from "react";

// * Use this to get Persist Data from Storage
// * Only use it for getting data

const usePersistData = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default usePersistData;
