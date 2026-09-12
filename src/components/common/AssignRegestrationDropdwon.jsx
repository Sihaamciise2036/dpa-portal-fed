import validationErrors from "@/lib/validationErrors";
import { getAdminService } from "@/services/admin/AdminServices";
import { getFileUrl } from "@/services/CommonService";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import UserPlusIcon from "../icons/UserPlusIcon";
import { InputIcon } from "../ui/inputs/input-icon";

export default function AssignRegestrationDropdwon({ selectAdminId, setSelectAdminId, editAdminId = "" }) {
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dataFilter, setDataFilter] = useState({
        search: "",
        page: 1,
        limit: 10,
        extra_filter: {},
    });

    useEffect(() => {
        getAdmins();
    }, [dataFilter]);

    useEffect(() => {
        if (editAdminId && editAdminId !== "") {
            setDataFilter({ ...dataFilter, extra_filter: { _id: editAdminId } });
        }
    }, [editAdminId]);

    const onChangeFilter = (name, value) => {
        setDataFilter({ ...dataFilter, [name]: value, extra_filter: {} });
    };

    const getAdmins = () => {
        setIsLoading(true);
        dispatch(getAdminService(dataFilter))
            .then((res) => {
                var userArr = res?.data?.data?.data;
                setDataSource(userArr);
                setIsLoading(false);
            })
            .catch(({ message, errorData, statusCode }) => {
                validationErrors(errorData, message);
                setIsLoading(false);
            });
    };

    return (
        <Popover className="sticky top-0">
            <PopoverButton className="flex items-center gap-4 3xl:gap-6 w-full bg-white shadow-120 font-semibold text-start px-4 py-6 3xl:p-6 rounded-[8px] focus:outline-none text-light-900 data-[active]:text-primary data-[hover]:text-primary data-[focus]:outline-0">
                <span className="flex-shrink-0">
                    <UserPlusIcon className="size-6" />
                </span>
                <span className="flex-grow">Assign Regestration to</span>
                <span className="ms-auto flex-shrink-0">
                    <ChevronDownIcon className="size-6" />
                </span>
            </PopoverButton>
            <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y mt-4 divide-white rounded-[10px] bg-white transition duration-200 w-[var(--button-width)] ease-in-out data-[closed]:-translate-y-1 data-[closed]:opacity-0">
                <div className="search-box p-6">
                    <InputIcon
                        onChange={(e) => onChangeFilter("search", e.target.value)}
                        prefixIcon={<SearchIcon className="text-light-850" />}
                        className="bg-light-800 border-0 rounded-full px-6"
                        placeholder="Search"
                        size="lg"
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    <ul className="grid grid-cols-1">
                        {dataSource.length > 0 &&
                            dataSource.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => setSelectAdminId(item?._id)}
                                    className={`py-3 flex gap-3 items-center px-4 sm:px-6 border-s-2 border-s-transparent hover:border-s-secondary hover:bg-teal-100 transition-all duration-300 cursor-pointer ${item?._id && selectAdminId && item?._id === selectAdminId ? "border-s-secondary bg-teal-100" : ""}`}>
                                    <div className="avatar-image size-9 rounded-full overflow-hidden">
                                        <img
                                            src={item?.profile_image ? getFileUrl(item.profile_image, "users") : `/assets/images/avatar/default-user.png`}
                                            className="size-full object-cover object-center"
                                            alt="avatar-image"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <h6 className="text-sm font-medium text-dark-950/70">{item?.name}</h6>
                                        <p className="text-dark-950/50 text-xs">{"2 Registration on progress"}</p>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </PopoverPanel>
        </Popover>
    );
}
