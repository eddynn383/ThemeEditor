"use client";

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

interface CheckboxDemoProps {
    getColor: (key: string, defaultColor: string) => string;
    borderRadius: number;
    uniqueId: string;
}

export function CheckboxDemo({
    getColor,
    borderRadius,
    uniqueId,
}: CheckboxDemoProps) {
    const [items, setItems] = useState([
        {
            id: 1,
            label: "Accept terms and conditions",
            checked: true,
            disabled: false,
        },
        { id: 2, label: "Subscribe to newsletter", checked: false, disabled: false },
        { id: 3, label: "Enable notifications", checked: true, disabled: false },
        {
            id: 4,
            label: "Disabled option (checked)",
            checked: true,
            disabled: true,
        },
        {
            id: 5,
            label: "Disabled option (unchecked)",
            checked: false,
            disabled: true,
        },
    ]);

    const enabledItems = items.filter((item) => !item.disabled);
    const checkedEnabledCount = enabledItems.filter((item) => item.checked).length;
    const allEnabledChecked = checkedEnabledCount === enabledItems.length;
    const someEnabledChecked =
        checkedEnabledCount > 0 && checkedEnabledCount < enabledItems.length;

    const handleSelectAll = (checked: boolean) => {
        setItems(
            items.map((item) => (item.disabled ? item : { ...item, checked }))
        );
    };

    const handleItemChange = (id: number, checked: boolean) => {
        setItems(
            items.map((item) => (item.id === id ? { ...item, checked } : item))
        );
    };

    return (
        <>
            <style>{`
        .checkbox-item-${uniqueId} {
          background-color: ${getColor("uncheckedBg", "bg-100")} !important;
          border-color: ${getColor("uncheckedBorder", "bg-300")} !important;
          border-radius: ${borderRadius}px !important;
        }
        .checkbox-item-${uniqueId}[data-state="checked"] {
          background-color: ${getColor("checkedBg", "accent-400")} !important;
          border-color: ${getColor("checkedBorder", "accent-400")} !important;
        }
        .checkbox-item-${uniqueId}[data-state="checked"] svg {
          color: ${getColor("checkedText", "accent-100")} !important;
        }
        .checkbox-item-${uniqueId}[data-state="indeterminate"] {
          background-color: ${getColor("intermediateBg", "accent-400")} !important;
          border-color: ${getColor("intermediateBorder", "accent-400")} !important;
        }
        .checkbox-item-${uniqueId}[data-state="indeterminate"] svg {
          color: ${getColor("intermediateText", "accent-100")} !important;
        }
        .checkbox-item-${uniqueId}:disabled,
        .checkbox-item-${uniqueId}[disabled] {
          background-color: ${getColor("disabledBg", "bg-200")} !important;
          border-color: ${getColor("disabledBorder", "bg-300")} !important;
          opacity: 0.6;
          cursor: not-allowed;
        }
        .checkbox-item-${uniqueId}:disabled svg,
        .checkbox-item-${uniqueId}[disabled] svg {
          color: ${getColor("disabledText", "text-300")} !important;
        }
        .checkbox-label-${uniqueId} {
          color: ${getColor("uncheckedText", "text-100")};
        }
        .checkbox-label-disabled-${uniqueId} {
          color: ${getColor("disabledText", "text-300")};
          opacity: 0.6;
        }
      `}</style>
            <div className="space-y-3">
                {/* Select All Checkbox */}
                <div
                    className="flex items-center gap-2 pb-2"
                    style={{ borderBottom: "1px solid var(--bg-300)" }}
                >
                    <Checkbox
                        id={`checkbox-select-all-${uniqueId}`}
                        checked={someEnabledChecked ? "indeterminate" : allEnabledChecked}
                        onCheckedChange={handleSelectAll}
                        className={`checkbox-item-${uniqueId}`}
                    />
                    <label
                        htmlFor={`checkbox-select-all-${uniqueId}`}
                        className={`checkbox-label-${uniqueId} cursor-pointer`}
                        style={{ fontWeight: 600 }}
                    >
                        Select All
                    </label>
                </div>

                {/* Individual Checkboxes */}
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 pl-6">
                        <Checkbox
                            id={`checkbox-${item.id}-${uniqueId}`}
                            checked={item.checked}
                            disabled={item.disabled}
                            onCheckedChange={(checked) =>
                                handleItemChange(item.id, checked as boolean)
                            }
                            className={`checkbox-item-${uniqueId}`}
                        />
                        <label
                            htmlFor={`checkbox-${item.id}-${uniqueId}`}
                            className={
                                item.disabled
                                    ? `checkbox-label-disabled-${uniqueId} cursor-not-allowed`
                                    : `checkbox-label-${uniqueId} cursor-pointer`
                            }
                        >
                            {item.label}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
}
