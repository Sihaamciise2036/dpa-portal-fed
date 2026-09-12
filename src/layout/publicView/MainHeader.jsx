import { NavLink } from "react-router-dom";

const MainHeader = () => {
    return (
        <nav className="public-glass-header border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-[100px]">
                    <div className="flex-shrink-0">
                        <NavLink className="flex-shrink-0" to="/data">
                            <img className="w-auto h-[48px] xl:h-[78px]" src={"/assets/images/logo/primary-logo.webp"} alt="logo" />
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MainHeader;
