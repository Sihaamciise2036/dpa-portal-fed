import React, { useState } from "react";
import { cn } from "../../lib/utils";

const InDecGroupBox = ({ groupClassName, buttonClassName, inputValue = 1, indexKey = "", inputName = "", onChangeValue }) => {
    const [inDecValue, setInDecValue] = useState(inputValue);

    const handleIncrement = () => {
        setInDecValue(inDecValue + 1);
        if (inputName && inputName != "" && onChangeValue) {
            if (indexKey && indexKey != "") {
                onChangeValue(inputName, inDecValue + 1, indexKey);
            } else {
                onChangeValue(inputName, inDecValue + 1);
            }
        }
    };

    const handleDecrement = () => {
        setInDecValue(inDecValue - 1);
        if (inputName && inputName != "" && onChangeValue) {
            if (indexKey && indexKey != "") {
                onChangeValue(inputName, inDecValue - 1, indexKey);
            } else {
                onChangeValue(inputName, inDecValue - 1);
            }
        }
    };

    return (
        <div className={cn("flex items-center indec-group", groupClassName)}>
            <button
                type="button"
                className={cn(
                    "fa-solid fa-minus text-[8px] w-4 h-4 leading-3 text-center rounded-full border transition text-primary border-primary hover:bg-primary hover:text-white indec-minus",
                    buttonClassName
                )}
                onClick={() => (inDecValue > 1 ? handleDecrement() : "")}></button>
            <input type="number" className="text-center w-5 text-xs font-semibold text-heading indec-value" value={inDecValue} />
            <button
                type="button"
                className={cn(
                    "fa-solid fa-plus text-[8px] w-4 h-4 leading-3 text-center rounded-full border transition text-primary border-primary hover:bg-primary hover:text-white indec-plus",
                    buttonClassName
                )}
                onClick={() => handleIncrement()}></button>
        </div>
    );
};

export default InDecGroupBox;
