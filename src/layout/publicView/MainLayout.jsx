import { Outlet, useLocation } from "react-router-dom";
import MainHeader from "./MainHeader";
import MainPart from "./MainPart";

function MainLayout() {
    const pathname = useLocation();
 
    return (
        <>
            <MainPart >
               <div className="flex-grow">
                    <MainHeader />
                    <Outlet />
                </div>
            </MainPart>
        </>
    );
}

export default MainLayout;
