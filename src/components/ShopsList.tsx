import { FC } from "react";
import { useShops } from "../hook/useShops";

export const ShopsList: FC = () => {
  const { isLoading, shops } = useShops();
  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {shops.map((shop) => (
        <li key={shop.id}>
          {shop.name} / {shop.address} / {shop.postcode}
        </li>
      ))}
    </ul>
  );
};
