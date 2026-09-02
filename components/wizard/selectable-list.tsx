"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem, springSnappy } from "@/lib/animations";

export function SelectableList<T extends { id: string }>({
  items,
  selectedId,
  onSelect,
  searchPlaceholder,
  filter,
  renderItem,
  emptyLabel = "Sin resultados",
}: {
  items: T[];
  selectedId: string | null;
  onSelect: (item: T) => void;
  searchPlaceholder: string;
  filter: (item: T, query: string) => boolean;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  emptyLabel?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => (query.trim() ? items.filter((i) => filter(i, query.trim().toLowerCase())) : items),
    [items, query, filter],
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-faint" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto pr-1 -mr-1">
        {filtered.length === 0 ? (
          <EmptyState icon={<PackageSearch />} title={emptyLabel} />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-2">
            <AnimatePresence>
              {filtered.map((item) => {
                const selected = item.id === selectedId;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    layout
                    variants={staggerItem}
                    exit="exit"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.985 }}
                    transition={springSnappy}
                    onClick={() => onSelect(item)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-sm border px-3.5 py-3 text-left transition-colors",
                      selected
                        ? "border-accent/40 bg-accent/[0.07]"
                        : "border-white/8 bg-surface hover:border-white/15 hover:bg-white/[0.03]",
                    )}
                  >
                    <div className="flex-1 min-w-0">{renderItem(item, selected)}</div>
                    <div
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border",
                        selected ? "bg-accent border-accent" : "border-white/15",
                      )}
                    >
                      {selected && <Check className="size-3 text-ink-inverse" strokeWidth={3} />}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
