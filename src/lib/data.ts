export interface Product {
  id: string;
  code: string;
  image: string;
  rank: string;
  price: number;
  skins: string[];
  sisaVP: string;
  agent: string;
  changeNick: string;
  region: string;
  premier: string;
  status: "available" | "sold";
}

export const sampleProducts: Product[] = [
  {
    id: "1", code: "FZ3067", image: "/placeholder.svg", rank: "Platinum 1",
    price: 650000, skins: ["Reaver Vandal", "Prime Phantom", "Glitchpop Classic"],
    sisaVP: "-", agent: "Full Unlock", changeNick: "Ready", region: "IDN", premier: "Can't be changed", status: "available",
  },
  {
    id: "2", code: "FZ2044", image: "/placeholder.svg", rank: "Diamond 2",
    price: 1200000, skins: ["Champions Vandal", "Oni Phantom", "Sovereign Ghost"],
    sisaVP: "320", agent: "Full Unlock", changeNick: "Ready", region: "IDN", premier: "Unranked", status: "available",
  },
  {
    id: "3", code: "FZ1891", image: "/placeholder.svg", rank: "Gold 3",
    price: 350000, skins: ["Spectrum Phantom", "Elderflame Vandal"],
    sisaVP: "-", agent: "20/23", changeNick: "Ready", region: "IDN", premier: "Can't be changed", status: "available",
  },
  {
    id: "4", code: "FZ4120", image: "/placeholder.svg", rank: "Ascendant 1",
    price: 1800000, skins: ["Champions 2022 Vandal", "RGX Vandal", "Reaver Operator", "Ion Sheriff"],
    sisaVP: "1200", agent: "Full Unlock", changeNick: "Ready", region: "IDN", premier: "Gold", status: "sold",
  },
  {
    id: "5", code: "FZ5500", image: "/placeholder.svg", rank: "Silver 3",
    price: 200000, skins: ["Prime Vandal", "Sakura Vandal"],
    sisaVP: "-", agent: "15/23", changeNick: "Not Ready", region: "IDN", premier: "Can't be changed", status: "available",
  },
  {
    id: "6", code: "FZ6789", image: "/placeholder.svg", rank: "Immortal 1",
    price: 2500000, skins: ["Champions Phantom", "Prelude Vandal", "Arcane Sheriff", "BlastX Odin"],
    sisaVP: "800", agent: "Full Unlock", changeNick: "Ready", region: "IDN", premier: "Diamond", status: "available",
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price);
}

export function getWhatsAppLink(product: Product): string {
  const message = encodeURIComponent(
    `Halo, saya tertarik membeli akun ${product.code} (${product.rank}) seharga Rp ${formatPrice(product.price)}. Apakah masih tersedia?`
  );
  return `https://wa.me/6281234567890?text=${message}`;
}
