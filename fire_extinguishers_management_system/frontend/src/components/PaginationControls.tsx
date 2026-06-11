import { Fragment } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type PaginationControlsProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

const pageSizes = [6, 12, 24];

const PaginationControls = ({
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSize,
  totalItems,
  totalPages,
}: PaginationControlsProps) => (
  <div className="mt-6 flex flex-col gap-4 rounded-[24px] bg-[#f8f7f6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm font-semibold text-black/45">
      Showing page <span className="text-black">{currentPage}</span> of <span className="text-black">{totalPages}</span> for{" "}
      <span className="text-black">{totalItems}</span> records
    </p>

    <div className="flex flex-wrap items-center gap-3">
      <select
        className="h-10 rounded-full bg-white px-4 text-sm font-semibold outline-none"
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
        value={pageSize}
      >
        {pageSizes.map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </select>

      <button
        aria-label="Previous page"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white disabled:opacity-40"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <FiChevronLeft aria-hidden="true" />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
        .map((page, index, pages) => (
          <Fragment key={page}>
            {index > 0 && page - pages[index - 1] > 1 ? <span className="px-1 text-sm font-bold text-black/40">...</span> : null}
        <button
          className={`h-10 min-w-10 rounded-full px-3 text-sm font-bold ${page === currentPage ? "bg-black text-white" : "bg-white text-black"}`}
          onClick={() => onPageChange(page)}
          type="button"
        >
          {page}
        </button>
          </Fragment>
        ))}

      <button
        aria-label="Next page"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white disabled:opacity-40"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        <FiChevronRight aria-hidden="true" />
      </button>
    </div>
  </div>
);

export default PaginationControls;
