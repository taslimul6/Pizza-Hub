import { getList } from "@/lib/api";
import { getShopName } from "@/lib/shop-info";
import type { AdminTransaction } from "@/types";

// Server only. Data helpers shared by the admin pages.

// A transaction as the API sends it (GET /admin/transactions)
type ApiTransaction = {
  _id: string;
  type: AdminTransaction["type"];
  plan: string | null;
  vendor: { name: string | null; email: string | null; shop: string | null };
  customer: { name: string; email: string } | null; // null for subscriptions
  itemName: string;
  amount: number;
  cardLast4: string;
  orderStatus: string | null;
  paymentStatus: AdminTransaction["paymentStatus"];
  createdAt: string;
};

// Every transaction (orders and subscriptions), newest first. Read only.
export async function getAdminTransactions(): Promise<AdminTransaction[]> {
  const raw = await getList<ApiTransaction>("/admin/transactions", { auth: true });

  return raw.map((t) => ({
    id: t._id,
    type: t.type,
    plan: t.plan,
    vendorName: t.vendor.name ?? (t.vendor.shop ? getShopName(t.vendor.shop) : "Unknown vendor"),
    vendorEmail: t.vendor.email,
    vendorShop: t.vendor.shop,
    customerName: t.customer?.name ?? null,
    customerEmail: t.customer?.email ?? null,
    itemName: t.itemName,
    amount: t.amount,
    cardLast4: t.cardLast4,
    orderStatus: t.orderStatus,
    paymentStatus: t.paymentStatus,
    createdAt: t.createdAt,
  }));
}
