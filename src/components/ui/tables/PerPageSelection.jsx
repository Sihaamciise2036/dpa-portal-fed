import React from "react";

const PerPageSelection = ({ onChangeParPage, limit }) => {
    return (
        <select onChange={(e) => onChangeParPage("limit", e.target.value)} value={limit} className="db-card-filter-select">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
        </select>
    );
};

export default PerPageSelection;
