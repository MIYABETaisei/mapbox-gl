import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
// import '../utils/firebase/init' // Initialize FirebaseApp

export type Shop = {
  id: number;
  name: string;
  category: string;
  postcode: string;
  address: string;
  latitude: number;
  longitude: number;
};

export async function getShops(): Promise<Shop[]> {
  const shops = new Array<Shop>();
  const db = getFirestore();
  const shopsSnapshot = await getDocs(collection(db, "/shops"));

  shopsSnapshot.forEach((doc) => {
    const shop = doc.data() as Shop;
    shops.push({ ...shop, id: Number(doc.id) });
  });

  return shops;
}

export async function addShop(shop: Shop): Promise<void> {
  const db = getFirestore();
  const docRef = doc(db, "shops", String(shop.id));
  await setDoc(
    docRef,
    {
      name: shop.name,
      category: shop.category,
      address: shop.address,
      postcode: shop.postcode,
      latitude: shop.latitude,
      longitude: shop.longitude,
    },
    { merge: true /* ドキュメントが存在する場合はフィールドを追記 */ }
  );
}
