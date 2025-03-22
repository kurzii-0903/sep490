import React from "react";

export default function UpdateTaxForm  ({tax,onClose,onUpdate,setLoading}){
    const [newTaxes, setNewTaxes] = React.useState({
        id:tax.taxId,
        name:tax.taxName,
        description:tax.description,
        rate:tax.taxRate,
    });
    const handleChange = (e)=>{
        const {name,value} = e.target;
        setNewTaxes((prev)=>({...prev, [name]:value}));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            onUpdate(newTaxes);
            onClose();
        }catch(e){

        }finally {
            setLoading(false)
        }

    }
    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="space-y-4">
               <form onSubmit={handleSubmit}>
                   <div>
                       <label className="block text-gray-700 font-medium">Tên Thuế</label>
                       <input
                           type="text"
                           name="name"
                           value={newTaxes.name}
                           onChange={handleChange}
                           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Nhập tên danh mục..."
                       />
                   </div>
                   <div>
                       <label className="block text-gray-700 font-medium">Mô tả</label>
                       <textarea
                           name="description"
                           value={newTaxes.description}
                           onChange={handleChange}
                           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Nhập mô tả danh mục..."
                       />
                   </div>
                   <div>
                       <label className="block text-gray-700 font-medium">Tỉ lệ (%)</label>
                       <input
                           name="rate"
                           type={"number"}
                           min={0}
                           value={newTaxes.rate}
                           onChange={handleChange}
                           className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                   </div>
                   <div className="flex justify-end space-x-2">
                       <button
                           onClick={()=>onClose()}
                           className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                       >
                           Hủy
                       </button>
                       <button
                           type={"submit"}
                           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                       >
                           Lưu
                       </button>
                   </div>
               </form>
            </div>
        </div>
    )
}
