import React, {useEffect, useState} from "react";
import {Plus, Tag, Trash2} from "lucide-react";

export default function AddProductTaxForm  ({ setLoading, onAddProductTax, onDeleteProductTax, close, taxes, product, setProduct })  {
    const [productTaxes, setProductTaxes] = useState(product.taxes || []);
    const [taxMap, setTaxMap] = useState([]);

    useEffect(() => {
        const updatedTaxMap = (taxes || []).map(tax => {
            // Tìm kiếm productTaxId trong productTaxes
            const relatedProductTax = productTaxes.find(productTax => productTax.taxId === tax.taxId);
            return {
                ...tax,
                productTaxId: relatedProductTax ? relatedProductTax.productTaxId : null, // Nếu có productTax thì lấy productTaxId, nếu không có thì gán null
                added: productTaxes.some(productTax => productTax.taxId === tax.taxId) // Kiểm tra xem thuế đã được thêm chưa
            };
        });
        setTaxMap(updatedTaxMap); // Cập nhật lại taxMap
    }, [taxes, productTaxes]);

    const addTax = async (tax) => {
        setLoading(true);
        try {
            const result = await onAddProductTax(product.id, tax.taxId);
            setProduct(result);
            close();
        } catch (error) {
            console.log(error);
            alert("Không thể thêm thuế. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    }

    const removeTax = async (tax) => {
        setLoading(true);
        try {
            const result = await onDeleteProductTax(tax.productTaxId);
            setProduct(result);
            close();
        } catch (error) {
            console.log(error);
            alert("Không thể xóa thuế. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Danh sách thuế</h3>

                {taxMap.length > 0 ? (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên Thuế
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tỷ Lệ (%)
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {taxMap.map((tax) => (
                                <tr key={tax.taxId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {tax.taxName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {tax.taxRate}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {!tax.added ? (
                                            <button
                                                onClick={() => addTax(tax)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <Plus size={14} className="mr-1" /> Thêm
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => removeTax(tax)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <Trash2 size={14} className="mr-1" /> Xóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Tag className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thuế</h3>
                        <p className="mt-1 text-sm text-gray-500">Chưa có thuế nào được thiết lập.</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                    onClick={close}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};
