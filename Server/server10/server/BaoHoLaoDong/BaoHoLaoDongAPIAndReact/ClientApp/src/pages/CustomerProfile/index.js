import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import maleAvatar from '../../images/maleAvatar.png';
import femaleAvatar from '../../images/femaleAvatar.png';
import PageWrapper from '../../components/pageWrapper/PageWrapper';

const CustomerProfile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserProfile = async () => {
        try {
            console.log('User from AuthContext:', user);
            if (!user || !user.userId) {
                setError('Vui lòng đăng nhập để xem thông tin');
                setTimeout(() => navigate('/login'), 1000);
                return;
            }

            // Kiểm tra vai trò của user
            if (user.role === 'Admin' || user.role === 'Manager') {
                navigate('/manager');
                return;
            }

            console.log('Fetching user profile for ID:', user.userId);
            const response = await axios.get(`/api/User/get-customer-by-id/${user.userId}`);
            console.log('API response:', response.data);

            if (!response.data) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            const data = response.data;
            setProfile(data);
            setFormData({
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                address: data.address,
                dateOfBirth: data.dateOfBirth || '',
                gender: data.gender === true ? 'Male' : data.gender === false ? 'Female' : data.gender || '',
            });
            setError('');
        } catch (err) {
            console.error('Error fetching profile:', err.response?.data || err.message);
            if (err.response?.status === 404) {
                setError('Không tìm thấy thông tin người dùng. ID có thể không hợp lệ hoặc tài khoản chưa được kích hoạt.');
            } else if (err.response?.status === 401) {
                setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải thông tin người dùng.');
            }
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchUserProfile();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!user || !user.userId) {
            setError('Vui lòng đăng nhập để cập nhật thông tin');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            let genderBool;
            if (formData.gender === 'Male') {
                genderBool = true;
            } else if (formData.gender === 'Female') {
                genderBool = false;
            } else {
                genderBool = true; // Mặc định nếu là "Other" hoặc không chọn
            }

            const updateData = {
                email: profile.email,
                phone: formData.phoneNumber || '',
                name: formData.name,
                address: formData.address || '',
                birthday: formData.dateOfBirth || null,
                gender: genderBool,
            };

            console.log('Sending update data:', updateData);

            const response = await axios.put(`/api/User/update-information`, updateData);

            setSuccess('Cập nhật thông tin thành công!');
            setProfile({
                ...profile,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth,
                gender: genderBool,
            });
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err.response || err);
            if (err.response?.status === 401) {
                setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (err.response?.status === 404) {
                setError('Không tìm thấy thông tin người dùng.');
            } else {
                setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getAvatar = () => {
        if (profile?.imageUrl) return profile.imageUrl;
        const gender = profile?.gender;

        if (typeof gender === 'string') {
            const genderLower = gender.toLowerCase();
            if (genderLower === 'male' || genderLower === 'nam') return maleAvatar;
            if (genderLower === 'female' || genderLower === 'nữ') return femaleAvatar;
        } else if (typeof gender === 'boolean') {
            return gender ? maleAvatar : femaleAvatar;
        }

        return maleAvatar;
    };

    const displayGender = () => {
        const gender = profile?.gender;
        if (typeof gender === 'string') {
            const genderLower = gender.toLowerCase();
            if (genderLower === 'male' || genderLower === 'nam') return 'Nam';
            if (genderLower === 'female' || genderLower === 'femail' || genderLower === 'nữ') return 'Nữ';
            return gender || 'Chưa cập nhật';
        }
        if (typeof gender === 'boolean') return gender ? 'Nam' : 'Nữ';
        return 'Chưa cập nhật';
    };

    return (
        <PageWrapper title="Thông tin cá nhân">
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Thông tin cá nhân</h1>
                        <p className="mt-3 text-lg text-gray-600">Xem và quản lý thông tin tài khoản của bạn</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md animate-fade-in">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md animate-fade-in">
                            {success}
                        </div>
                    )}

                    {isLoading && !isEditing ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : profile ? (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-blue-600 p-6 flex flex-col items-center">
                                <img
                                    src={getAvatar()}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
                                />
                                <h2 className="text-2xl font-semibold text-white">{profile.name}</h2>
                                <p className="text-blue-200">{profile.email}</p>
                            </div>

                            <div className="p-8">
                                {isEditing ? (
                                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="Male">Nam</option>
                                                <option value="Female">Nữ</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 flex gap-4 mt-4">
                                            <button
                                                type="submit"
                                                className={`bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 shadow-md flex items-center justify-center ${
                                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                                        Đang lưu...
                                                    </>
                                                ) : (
                                                    'Lưu'
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200 shadow-md"
                                                disabled={isLoading}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700">Họ tên:</span>
                                            <span className="text-gray-900">{profile.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700">Email:</span>
                                            <span className="text-gray-900">{profile.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700">Xác thực email:</span>
                                            <span className={`text-sm ${profile.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {profile.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700">Số điện thoại:</span>
                                            <span className="text-gray-900">{profile.phoneNumber || 'Chưa cập nhật'}</span>
                                        </div>
                                        <div className="flex space-x-3">
                                            <span className="font-medium text-gray-700">Địa chỉ:</span>
                                            <span className="text-gray-900 line-clamp-2" title={profile.address || 'Chưa cập nhật'}>
                        {profile.address || 'Chưa cập nhật'}
                      </span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700">Ngày sinh:</span>
                                            <span className="text-gray-900">{profile.dateOfBirth || 'Chưa cập nhật'}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700">Giới tính:</span>
                                            <span className="text-gray-900">{displayGender()}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700">Ngày tạo:</span>
                                            <span className="text-gray-900">{new Date(profile.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-700">Trạng thái:</span>
                                            <span className={`text-sm ${profile.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                        {profile.status}
                      </span>
                                        </div>
                                        <div className="md:col-span-2 mt-6">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                                            >
                                                Chỉnh sửa thông tin
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <p className="text-gray-600 text-lg">Không tìm thấy thông tin người dùng.</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                            >
                                Đăng nhập lại
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default CustomerProfile;