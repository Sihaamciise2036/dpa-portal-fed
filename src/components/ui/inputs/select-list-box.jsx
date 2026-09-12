import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";

export default function SelectListBox({
    options = [],
    selectedOption,
    onChange,
    defaultText = "Select an option",
    buttonClassName = "",
    listItemClass = "",
    listOptionGroupClass = "",
    groupClassName = "",
}) {
    const [selected, setSelected] = useState(selectedOption || null);

    useEffect(() => {
        setSelected(selectedOption);
    }, [selectedOption]);

    const handleChange = (value) => {
        setSelected(value);
        onChange?.(value);
    };

    return (
        <Listbox as="div" value={selected} onChange={(e) => handleChange(e?.value)} className={groupClassName}>
            <ListboxButton
                className={cn("relative flex items-center justify-between gap-2 w-full rounded-lg bg-white py-1.5 px-3 text-left text-sm text-light-850", "focus:outline-none", buttonClassName)}>
                {selected?.label || defaultText}
                <ChevronDownIcon className="size-4 flex-shrink-0" aria-hidden="true" />
            </ListboxButton>
            <ListboxOptions
                anchor="bottom"
                transition
                className={cn("w-[var(--button-width)] rounded-xl border border-light-850/20 bg-white p-2", "focus:outline-none transition duration-100 ease-in", listOptionGroupClass)}>
                {options.map((data, index) => (
                    <ListboxOption
                        key={index}
                        value={data}
                        className={cn("group flex cursor-default items-center gap-2 rounded-[10px] py-2 px-3 select-none", "data-[focus]:bg-primary/10", listItemClass)}>
                        <CheckIcon className={cn("size-4 text-primary", selected?.value === data.value ? "visible" : "invisible")} />
                        <div className="text-sm text-dark-850">{data.label}</div>
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
}
