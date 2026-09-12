import React, { useState, useEffect } from "react";
import PaginationText from "./PaginationText";

const TablePagination = (props) => {
    const [pager, setPager] = useState({});

    useEffect(() => {
        if (props.items) {
            setPageFirstTime(props.initialPage);
        }
    }, [props.items]);

    useEffect(() => {
        if (props.per_page) {
            setPageFirstTime(props.initialPage);
        }
    }, [props.per_page]);

    const setPageFirstTime = (page) => {
        let items = props.items;
        let per_page = props.per_page;
        let pagePager = pager;

        // if (page < 1 || page > pagePager.totalPages) {
        //     return;
        // }

        // get new pager object for specified page
        pagePager = getPager(items, page, per_page);

        // update
        setPager(pagePager);
    };

    const setPage = (page) => {
        let items = props.items;
        let per_page = props.per_page;
        let pagePager = pager;

        if (page < 1 || page > pagePager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pagePager = getPager(items, page, per_page);

        // update
        setPager(pagePager);
        props.onChangePage("page", pagePager.currentPage);
    };

    const getPager = (totalItems, currentPage, pageSize) => {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;

        if (totalPages <= 3) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 2) {
                startPage = 1;
                endPage = 3;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 3;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = [...Array(endPage + 1 - startPage).keys()].map((i) => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages,
        };
    };

    return (
        <>
            {!pager.pages || pager.pages.length <= 1 ? (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <PaginationText CountFrom={1} CountTo={props.items} totalCount={props.items} />
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <PaginationText CountFrom={pager.currentPage * pager.pageSize + 1 - pager.pageSize} CountTo={pager.currentPage * pager.pageSize} totalCount={pager.totalItems} />

                        <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate ltr:flex-row rtl:flex-row-reverse" aria-label="Pagination">
                            <button
                                className="relative inline-flex items-center px-2 py-2 text-sm font-medium border rounded-l-md focus:z-20 disabled:opacity-50 bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                                disabled={pager.currentPage === 1 ? true : false}
                                onClick={() => setPage(pager.currentPage - 1)}>
                                <span className="sr-only">Previous</span>
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            {pager.pages &&
                                pager.pages.map((page, index) => {
                                    return (
                                        <button
                                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium border disabled:bg-secondary disabled:text-white focus:z-20 bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                                            aria-current="page"
                                            onClick={() => setPage(page)}
                                            key={index}
                                            title={page}
                                            disabled={pager.currentPage === page ? true : false}>
                                            {page}
                                        </button>
                                    );
                                })}
                            <button
                                className="relative inline-flex items-center px-2 py-2 text-sm font-medium border rounded-r-md focus:z-20 disabled:opacity-50 bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                                disabled={pager.currentPage === pager.totalPages}
                                aria-disabled={pager.currentPage === pager.totalPages}
                                onClick={() => setPage(pager.currentPage + 1)}>
                                <span className="sr-only">Next</span>
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

export default TablePagination;
