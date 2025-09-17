import React from "react";
import styles from "./styles/Pagination.module.css";

const range = (from, to) => {
  const result = [];
  for (let i = from; i <= to; i++) result.push(i);
  return result;
};

const Pagination = ({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const maxPagesToShow = 5;

  let pages = [];
  if (totalPages <= maxPagesToShow) {
    pages = range(1, totalPages);
  } else {
    if (currentPage <= 3) {
      pages = [1, 2, 3, 4, "...", totalPages];
    } else if (currentPage >= totalPages - 2) {
      pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    }
  }

  return (
    <div className={styles.paginationContainer}>
      <div>
        <span style={{ color: "#888", fontWeight: 500 }}>
          {pageSize * (currentPage - 1) + 1}-
          {Math.min(pageSize * currentPage, totalItems)} of {totalItems} items
        </span>
      </div>
      <div className={styles.pageNumbers}>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={p}
              className={
                p === currentPage
                  ? `${styles.pageBtn} ${styles.active}`
                  : styles.pageBtn
              }
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>
      <div>
        Show{" "}
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className={styles.rowsDropdown}
        >
          {[10, 20, 30, 50, 100].map(n => (
            <option key={n} value={n}>
              {n} rows
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
