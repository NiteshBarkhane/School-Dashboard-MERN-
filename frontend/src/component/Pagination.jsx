import React, { useEffect, useState } from "react";

const Pagination = ({
  totalItem,
  noOfListing,
  currentPage,
  setCurrentPage,
}) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (totalItem && totalItem > 0) {
      const totalPages = Math.ceil(totalItem / noOfListing);
      setPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  }, [totalItem, noOfListing]);

  return (
    <nav className="mt-6 flex justify-between">
      <p className="font-semibold text-base">
        Showing{" "}
        {currentPage * noOfListing - noOfListing + 1 >= totalItem
          ? totalItem
          : currentPage * noOfListing - noOfListing + 1}{" "}
        to{" "}
        {currentPage * noOfListing > totalItem
          ? totalItem
          : currentPage * noOfListing}{" "}
        from {totalItem}
      </p>
      <ul className="w-fit flex items-center justify-center gap-1">
        <li>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`py-1 px-4 w-20 rounded-sm text-white ${
              currentPage === 1 ? "bg-blue-400" : "bg-blue-500"
            } `}
          >
            Previous
          </button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <button
              className={`p-1 rounded-full ${
                currentPage == page ? "bg-blue-500 text-white" : ""
              } w-7 h-7`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className={`py-1 px-4 w-20 rounded-sm text-white bg-blue-500 ${
              currentPage === pages.length ? "bg-blue-400" : "bg-blue-500"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pages.length}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination