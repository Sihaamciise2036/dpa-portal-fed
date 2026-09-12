import React from "react";
import { Link } from "react-router-dom";

const MainFooter = () => {
    return (
        <footer className="bg-primary">
            <div className="container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-5 py-8">
                    <p className="text-sm text-white">© FoodScan by iNiLabs 2024, All Rights Reserved</p>
                    <nav className="flex items-center gap-6">
                        <Link className="text-sm capitalize text-white" to={`/table.page`}>
                            Cookies Policy
                        </Link>
                        <Link className="text-sm capitalize text-white" to={`/table.page`}>
                            About Us
                        </Link>
                        <Link className="text-sm capitalize text-white" to={`/table.page`}>
                            Contact Us
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default MainFooter;
