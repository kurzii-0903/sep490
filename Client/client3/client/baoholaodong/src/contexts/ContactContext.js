import React, { createContext, useState } from "react";

export const ContactContext = createContext();

const ContactProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const [submissionStatus, setSubmissionStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add your logic to handle form submission, e.g., sending data to an API
        console.log("Form Data Submitted:", formData);
        setSubmissionStatus("Form submitted successfully!");
        setFormData({
            name: "",
            email: "",
            phone: "",
            message: ""
        });
    };

    return (
        <ContactContext.Provider value={{ formData, handleInputChange, handleSubmit, submissionStatus }}>
            {children}
        </ContactContext.Provider>
    );
};

export default ContactProvider;