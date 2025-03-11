import React, { useContext, useState } from "react";
import { ProductContext } from "../../../contexts/AdminProductContext";
import { Edit, Plus, Trash2 } from "lucide-react";
import { FaRegFrown } from "react-icons/fa";
import Modal from "../../../components/Modal/Modal";
import Loading from "../../../components/Loading/Loading";

const Taxes = () => {
    const { taxes } = useContext(ProductContext);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Danh sách Thuế</h3>
                    <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
                        <Plus size={20} className="mr-2" />
                        Thêm thuế
                    </button>
                </div>

                {/* Kiểm tra danh sách thuế */}
                {taxes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-200 text-gray-700 text-left">
                                <th className="p-3 border">ID</th>
                                <th className="p-3 border">Tên thuế</th>
                                <th className="p-3 border">Tỉ lệ (%)</th>
                                <th className="p-3 border">Mô tả</th>
                                <th className="p-3 border text-center">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {taxes.map((tax) => (
                                <tr key={tax.taxId} className="border-b">
                                    <td className="p-3 border">{tax.taxId}</td>
                                    <td className="p-3 border">{tax.taxName}</td>
                                    <td className="p-3 border">{tax.taxRate}%</td>
                                    <td className="p-3 border">{tax.description || "Không có mô tả"}</td>
                                    <td className="p-3 border text-center">
                                        <button className="text-blue-500 hover:text-blue-700 mx-2">
                                            <Edit size={18} />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500">
                        <FaRegFrown size={30} className="inline-block mb-2" />
                        <p>Không có thuế nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Taxes;
