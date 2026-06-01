import { ReactNode, useEffect, useMemo, useState } from "react";
import EmptyState from "./EmptyState";
import PaginationControls from "./PaginationControls";

type PaginatedListProps<T> = {
  className?: string;
  emptyMessage?: string;
  emptyTitle?: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
};

const PaginatedList = <T,>({ className = "grid gap-5 lg:grid-cols-2", emptyMessage, emptyTitle, items, renderItem }: PaginatedListProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length, pageSize]);

  const visibleItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [currentPage, items, pageSize]);

  if (items.length === 0) {
    return <EmptyState message={emptyMessage} title={emptyTitle} />;
  }

  return (
    <>
      <div className={className}>{visibleItems.map(renderItem)}</div>
      <PaginationControls
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSize={pageSize}
        totalItems={items.length}
        totalPages={totalPages}
      />
    </>
  );
};

export default PaginatedList;
