const formatVND = (value) => {
    const numericValue = parseInt(value.toString().replace(/\D/g, ""), 10) || 0;
    return numericValue.toLocaleString("vi-VN") + " ₫";
};
const parseVND = (formattedValue) => {
    return parseInt(formattedValue.replace(/[^\d]/g, ""), 10) || 0;
};
const formatPrice   = (value)=>{
    const numericValue = parseInt(value.toString().replace(/\D/g, ""), 10) || 0;
    return numericValue.toLocaleString("vi-VN") ;
};
export {formatVND, parseVND,formatPrice};