import DotListIcon from "@/components/icons/DotListIcon";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import EditPenIcon from "@/components/icons/EditPenIcon";
import { EyeIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function PopoverTooltip({ buttonClassName }) {
    return (
        <Popover>
            <PopoverButton
                className={cn(
                    "text-sm/6 font-semibold mx-auto flex justify-end text-dark-950 focus:outline-0 data-[active]:text-primary data-[hover]:text-primary data-[focus]:outline-0",
                    buttonClassName
                )}>
                <DotListIcon className="size-6 rotate-180" />
            </PopoverButton>
            <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y border p-1 border-light-850/20 rounded-xl bg-white text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0">
                <ul>
                    <li>
                        <Link to="#" className="flex cursor-default items-center gap-2 rounded-[10px] py-1.5 px-3 select-none hover:bg-primary/10">
                            <EyeIcon className="size-5" /> View
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="flex cursor-default items-center gap-2 rounded-[10px] py-1.5 px-3 select-none hover:bg-primary/10">
                            <EditPenIcon className="size-5" /> Edit
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="flex cursor-default items-center gap-2 rounded-[10px] py-1.5 px-3 select-none hover:bg-primary/10">
                            <TrashIcon className="size-5" /> Delete
                        </Link>
                    </li>
                </ul>
            </PopoverPanel>
        </Popover>
    );
}
