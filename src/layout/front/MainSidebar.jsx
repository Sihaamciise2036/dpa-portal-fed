import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import frontSidebarMenusData from "./FrontSidebarMenusData";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { useSelector } from "react-redux";
import { getFileUrl } from "@/services/CommonService";

const MainSidebar = ({ pathname, adminSideDrawer, setAdminSideDrawer }) => {
    const { userData } = useSelector((state) => state?.Auth);
    const pathLoaction = pathname;

    return (
        <>
            <aside
                className={cn(
                    "glass-sidebar max-xl:fixed start-0 max-xl:top-0 flex-shrink-0 xl:z-20 -translate-x-full xl:translate-x-0 transition-all ease-in-out duration-300 max-xl:h-full z-[99] overflow-hidden max-xl:rounded-e-[24px] xl:my-4 xl:ms-4 xl:h-[calc(100vh-32px)] xl:rounded-[24px]",
                    !adminSideDrawer && "glass-sidebar--collapsed",
                    adminSideDrawer ? "w-[305px]" : "w-[90px]",
                    adminSideDrawer ? "max-xl:translate-x-0" : ""
                )}>
                <div className="relative h-full flex flex-col">
                    <div className="sidebar-header">
                        <div className={cn("logo-part flex items-center gap-4 py-4 xl:py-6", adminSideDrawer ? "justify-between px-6" : "justify-center px-4")}>
                            <NavLink className="flex-shrink-0" to={"/home"}>
                                <img className={cn("w-auto object-contain", adminSideDrawer ? "h-[48px] xl:h-[68px]" : "h-10 max-w-[56px]")} src={"/assets/images/logo/primary-logo.webp"} alt="logo" />
                            </NavLink>
                            {adminSideDrawer && (
                                <NavLink className="flex-shrink-0" to={"/home"}>
                                    <img className="w-auto h-[48px] xl:h-[68px] object-contain" src={"/assets/images/logo/secondary-logo.webp"} alt="logo" />
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {adminSideDrawer && (
                        <div className="glass-sidebar-profile text-center mx-4 mb-2 rounded-[20px] p-5">
                            <div className="user-image size-[50px] rounded-full mx-auto mb-2.5">
                                <img
                                    src={userData?.profile_image && userData?.profile_image !== "" ? getFileUrl(userData?.profile_image, "users") : "/assets/images/avatar/default-user.png"}
                                    alt=""
                                    className="size-full object-cover object-center "
                                />
                            </div>
                            <div className="user-text font-poppins ">
                                <h6 className="font-semibold text-white text-base">{userData?.name}</h6>
                                <p className="text-sm font-normal text-white truncate max-w-[180px]" title={userData?.email}>{userData?.email}</p>
                            </div>
                        </div>
                    )}
                    {frontSidebarMenusData.length > 0 && (
                        <nav className="sidebar-nav py-4 overflow-y-auto">
                            <ul className={"sidebar-nav-list font-Inter text-lg font-medium flex flex-col"}>
                                {frontSidebarMenusData.map((menu, index) => (
                                    <React.Fragment key={menu.id}>
                                        {menu.url === "#" ? (
                                            <li
                                                className={cn(
                                                    "sidebar-nav-item py-3.5 before:transition-all before:duration-500 before:absolute before:top-0 before:start-0 before:bg-transparent before:w-1.5 before:h-full before:rounded-tr-[10px] before:rounded-br-[10px] relative transition-all duration-500",
                                                    adminSideDrawer ? "px-6" : "px-0",
                                                    pathLoaction?.pathname === `/${menu.url}` && "active before:bg-primary"
                                                )}
                                                key={menu.id}>
                                                <a href="javascript:void(0);" className="sidebar-nav-title">
                                                    {menu.text}
                                                </a>
                                            </li>
                                        ) : (
                                            <></>
                                        )}

                                        {menu?.children.length > 1 ? (
                                            <li className={cn("sidebar-nav-item")}>
                                                <Disclosure as="div">
                                                    {({ open }) => (
                                                        <>
                                                            <DisclosureButton
                                                                className={cn(
                                                                    "group flex gap-5 w-full items-center justify-center sidebar-nav-item py-3.5 before:transition-all before:duration-500 before:absolute before:top-0 before:start-0 before:bg-transparent before:w-1.5 before:h-full before:rounded-tr-[10px] before:rounded-br-[10px] relative transition-all duration-500",
                                                                    adminSideDrawer ? "px-8" : "px-0",
                                                                    (pathLoaction?.pathname === `/${menu.url}` || open) && "active text-primary before:bg-primary"
                                                                )}>
                                                                <span className={cn("flex-shrink-0", adminSideDrawer ? "" : "mx-auto")}>{menu.icon}</span>
                                                                {adminSideDrawer && <span className="text-base font-medium line-clamp-1 text-start flex-grow">{menu.text}</span>}
                                                                {adminSideDrawer && (
                                                                    <ChevronRightIcon className="size-5 ms-auto fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-90" />
                                                                )}
                                                            </DisclosureButton>
                                                            <DisclosurePanel className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                                                                {adminSideDrawer && (
                                                                    <ul className="ps-5 pt-2">
                                                                        {menu.children.map((child) => (
                                                                            <li
                                                                                className={cn(
                                                                                    "sidebar-nav-item py-2 before:transition-all before:duration-500 before:absolute before:top-0 before:start-0 before:bg-transparent before:w-1.5 before:h-full before:rounded-tr-[10px] before:rounded-br-[10px] relative transition-all duration-500",
                                                                                    adminSideDrawer ? "px-6" : "px-0",
                                                                                    pathLoaction?.pathname === `/${menu.url}` && "active before:bg-primary"
                                                                                )}
                                                                                key={child.id}>
                                                                                <NavLink
                                                                                    to={`/${child.url}`}
                                                                                    className={({ isActive }) =>
                                                                                        cn("flex items-center gap-5", adminSideDrawer ? "justify-start" : "justify-center", isActive && "active")
                                                                                    }>
                                                                                    {/* <span className='flex-shrink-0'>{menu.icon}</span> */}
                                                                                    {adminSideDrawer && <span className="text-base flex-auto">{child.text}</span>}
                                                                                </NavLink>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </DisclosurePanel>
                                                        </>
                                                    )}
                                                </Disclosure>
                                            </li>
                                        ) : (
                                            <li
                                                className={cn(
                                                    "sidebar-nav-item py-3.5 before:transition-all before:duration-500 before:absolute before:top-0 before:start-0 before:bg-transparent before:w-1.5 before:h-full before:rounded-tr-[10px] before:rounded-br-[10px] relative transition-all duration-500",
                                                    adminSideDrawer ? "px-8" : "px-0",
                                                    pathLoaction?.pathname === `/${menu.url}` && "active before:bg-primary"
                                                )}
                                                key={menu.id}>
                                                <NavLink
                                                    to={`/${menu.url}`}
                                                    className={({ isActive }) => cn("flex items-center gap-5", !adminSideDrawer ? "justify-center" : "justify-start", isActive && "active")}>
                                                    <span className="flex-shrink-0">{menu.icon}</span>
                                                    {adminSideDrawer && <span className="text-base flex-auto">{menu.text}</span>}
                                                </NavLink>
                                            </li>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </aside>
            {adminSideDrawer && (
                <div className="bg-overlay xl:hidden fixed top-0 start-0 w-full h-full bg-slate-950/35 backdrop-blur-[2px] z-[98]" onClick={() => setAdminSideDrawer(!adminSideDrawer)}></div>
            )}
        </>
    );
};

export default MainSidebar;
