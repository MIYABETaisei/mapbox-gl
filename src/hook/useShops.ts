import { useEffect, useState } from "react";
import { Shop, getShops } from "../lib/firebase/shops";

export type UseShopsOutput = {
  isLoading: boolean;
  shops: Shop[];
};

const DEFAULT_OUTPUT: UseShopsOutput = {
  isLoading: true,
  shops: [],
};

export function useShops(): UseShopsOutput {
  const [output, setOutput] = useState(DEFAULT_OUTPUT);

  useEffect(() => {
    void (async () => {
      const shops = await getShops();
      setOutput({ isLoading: false, shops });
    })();
  }, []);

  return output;
}
