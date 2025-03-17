import React, { useState } from 'react';

const RangePicker = ({ onSearch }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSearch = () => {
        onSearch({ startDate, endDate });
    };

    return (
        <div>
            <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Từ ngày"
            />
            <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                placeholder="Đến ngày"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min={startDate}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default RangePicker;