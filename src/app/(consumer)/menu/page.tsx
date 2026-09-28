"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, SlidersHorizontal } from "@phosphor-icons/react/dist/ssr";
import { useMenu } from "@/features/menu/hooks";
import { useCartStore } from "@/store/cart-store";
import { SearchInput } from "@/components/form/search-input";
import { CategoryChip } from "@/components/food/category-chip";
import { FoodCard } from "@/components/food/food-card";
import { FoodGridSkeleton } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { MiniCartBar } from "@/components/cart/mini-cart-bar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { MenuItem } from "@/types";

export default function MenuPage() {
  const menuQuery = useMenu();
  const addItem = useCartStore((s) => s.addItem);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredItems = useMemo(() => {
    if (!menuQuery.data) return [];
    return menuQuery.data.items.filter((item) => {
      if (activeCategory !== "all" && item.categoryId !== activeCategory) return false;
      if (availableOnly && !item.available) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [menuQuery.data, activeCategory, availableOnly, search]);

  function handleQuickAdd(item: MenuItem) {
    addItem(item.id, 1);
    toast.success(`Added ${item.name}`, { description: "1 item added to your cart." });
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Menu</h1>
        <p className="text-sm text-muted-foreground">Fresh from Main Canteen, made to order.</p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search for dosa, chai, sandwich…" />

      {menuQuery.isLoading ? (
        <FoodGridSkeleton count={8} />
      ) : menuQuery.isError ? (
        <ErrorState
          title="We couldn't load the menu"
          description="Something went wrong while fetching today's menu."
          onRetry={() => menuQuery.refetch()}
        />
      ) : menuQuery.data ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 gap-2 overflow-x-auto pb-1 no-scrollbar">
              <CategoryChip label="All" active={activeCategory === "all"} onClick={() => setActiveCategory("all")} />
              {menuQuery.data.categories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  label={cat.name}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Switch id="available-only" checked={availableOnly} onCheckedChange={setAvailableOnly} />
            <Label htmlFor="available-only" className="flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
              <SlidersHorizontal className="size-3.5" aria-hidden />
              Show available items only
            </Label>
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState
              icon={MagnifyingGlass}
              title="No items found"
              description="Try a different search term or category."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredItems.map((item, index) => (
                <FoodCard key={item.id} item={item} index={index} onQuickAdd={handleQuickAdd} />
              ))}
            </div>
          )}
        </>
      ) : null}

      <MiniCartBar />
    </div>
  );
}
