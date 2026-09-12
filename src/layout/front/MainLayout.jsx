import { Outlet, useLocation } from "react-router-dom";
import MainHeader from "./MainHeader";
import MainPart from "./MainPart";
import MainSidebar from "./MainSidebar";
import { useEffect, useState } from "react";

function MainLayout() {
    const [adminSideDrawer, setAdminSideDrawer] = useState(true);
    const pathname = useLocation();
    useEffect(() => {
        setAdminSideDrawer(true);
    }, [pathname?.pathname]);
    return (
        <>
            <MainPart adminSideDrawer={adminSideDrawer} setAdminSideDrawer={setAdminSideDrawer}>
                <MainSidebar adminSideDrawer={adminSideDrawer} pathname={pathname} setAdminSideDrawer={setAdminSideDrawer} />
                <div className="flex-grow">
                    <MainHeader adminSideDrawer={adminSideDrawer} setAdminSideDrawer={setAdminSideDrawer} />
                    <Outlet />
                </div>
            </MainPart>
        </>
    );
}

export default MainLayout;
