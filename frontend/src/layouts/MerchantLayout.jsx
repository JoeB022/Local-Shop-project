import { Outlet, Link } from "react-router-dom";
import { HomeIcon, LayoutDashboard, ShoppingCart, Store } from "lucide-react";

function MerchantLayout() {
  return (
    <div className="w-full flex bg-white min-h-screen">
      <aside className="w-44 shrink-0 border-r border-neutral-200 py-4 flex flex-col !px-1">
        <Link
          className="!text-neutral-700 hover:bg-neutral-200 hover:!text-neutral-800 h-8 flex items-center !px-2 gap-2 !no-underline"
          to="/clerk"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link
          className="!text-neutral-700 hover:bg-neutral-200 hover:!text-neutral-800 h-8 flex items-center !px-2 gap-2 !no-underline"
          to="/merchant/stores"
        >
          <Store size={18} />
          Stores
        </Link>
      </aside>

      <main className="p-6 w-full grow">
        <Outlet />{" "}
        {/* This renders the nested page (Dashboard, Products, Items) */}
      </main>
    </div>
  );
}

export default MerchantLayout;
