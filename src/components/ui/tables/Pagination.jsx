import React from "react";

const Pagination = () => {
    return (
        <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate ltr:flex-row rtl:flex-row-reverse" aria-label="Pagination">
            <button className="relative inline-flex items-center px-2 py-2 text-sm font-medium border rounded-l-md focus:z-20 disabled:opacity-50 bg-white text-gray-500 border-gray-300 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium border focus:z-20 bg-white text-gray-500 border-gray-300 hover:bg-gray-50" aria-current="page">
                1
            </button>
            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium border focus:z-20 bg-blue-50 border-blue-500 text-primary z-30" aria-current="page" disabled>
                2
            </button>
            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium border focus:z-20 bg-white text-gray-500 border-gray-300 hover:bg-gray-50" aria-current="page">
                3
            </button>
            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium border focus:z-20 bg-white text-gray-500 border-gray-300 hover:bg-gray-50" aria-current="page">
                ...
            </button>
            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium border focus:z-20 bg-white text-gray-500 border-gray-300 hover:bg-gray-50" aria-current="page">
                6
            </button>
            <button className="relative inline-flex items-center px-2 py-2 text-sm font-medium border rounded-r-md focus:z-20 disabled:opacity-50 bg-white text-gray-500 border-gray-300 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </nav>
    );
};

export default Pagination;
