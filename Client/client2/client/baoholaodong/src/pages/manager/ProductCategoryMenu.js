import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ProductCategoryMenu({ groupCategories, setCategorySelect }) {
    const [openIndex, setOpenIndex] = useState(null); // Track the open state of each group

    const handleGroupClick = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle the group dropdown list
    };

    const handleItemClick = (categoryIndex) => {
        // Logic to handle item click inside each group
        console.log(`Item clicked at index: ${categoryIndex}`);
    };

    return (
        <div className="p-4">
            <div
                className="font-bold text-lg cursor-pointer flex items-center" // Add flex and items-center to align text and icon
                onClick={() =>{setCategorySelect({categoryId:0})}} // Toggle the group
            >
                <span>All sản phẩm</span>

            </div>
            {groupCategories.map((groupCategory, groupIndex) => (
                <div key={groupCategory.groupId}>
                    {/* Display group name */}
                    <div
                        className="font-bold text-lg cursor-pointer flex items-center" // Add flex and items-center to align text and icon
                        onClick={() => handleGroupClick(groupIndex)} // Toggle the group
                    >
                        <span>{groupCategory.groupName}</span>
                        {openIndex === groupIndex ? <FaChevronUp className="ml-2"/> : <FaChevronDown className="ml-2"/>}
                    </div>

                    {/* Loop through each category of the group */}
                    {openIndex === groupIndex && (
                        <ul className="pl-4">
                            {groupCategory.productCategories.map((category, categoryIndex) => (
                                <li key={category.categoryId} className="my-2">
                                    {/* Clickable category */}
                                    <div
                                        className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => setCategorySelect(category)} // Handle category click
                                    >
                                        {category.categoryName} {/* Display category name */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}
