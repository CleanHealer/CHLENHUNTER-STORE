
import { Product } from './types';

export const ADMIN_PASSWORD = "1234";
export const TELEGRAM_BOT_TOKEN = "8449579104:AAHxquwzBC7fZVpf6GehdNmA93M9dTnOLjI";
export const ADMIN_CHAT_ID = "7335241543";

export const PROMO_CODES: Record<string, number> = {
  "GIFT10": 10,
  "SO2GOLD": 15,
  "ADMIN": 50
};

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Starter Pack", amount: 100, price: 89, image: "https://images.unsplash.com/photo-1595152433602-0da764f69324?auto=format&fit=crop&q=80&w=400", badge: "Новичкам" },
  { id: 2, name: "Guerilla Gold", amount: 500, price: 429, image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=400", badge: "ХИТ" },
  { id: 3, name: "Special Ops", amount: 1000, price: 799, image: "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80&w=400", badge: "-10% СКИДКА" },
  { id: 4, name: "Veteran Cache", amount: 2500, price: 1899, image: "https://images.unsplash.com/photo-1518544830919-094119864703?auto=format&fit=crop&q=80&w=400", badge: "ВЫГОДНО" },
  { id: 5, name: "Legendary Loot", amount: 5000, price: 3499, image: "https://images.unsplash.com/photo-1589410182470-3d779b5c234a?auto=format&fit=crop&q=80&w=400", badge: "VIP" },
  { id: 6, name: "CHLENHUNTER MMEGA", amount: 15000, price: 8999, image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=400", badge: "МАКСИМУМ" },
];

export const CLICK_SOUND_URL = "https://www.soundjay.com/buttons/sounds/button-29.mp3";
