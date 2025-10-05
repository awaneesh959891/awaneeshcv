import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const Contact = () => {
    const formRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { target } = e;
        const { name, value } = target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const username = form.name.trim();
        const user_email = form.email.trim();
        const user_message = form.message.trim();

        if (username === "" || user_email === "" || user_message === "") {
            setLoading(false);
            toast.error("Please fill all the fields.", {
                position: "bottom-right",
            });
            return;
        }

        try {
            // Send data to the backend API
            const apiUrl = process.env.REACT_APP_API_URL || "/api/contact";
            const response = await fetch(
                apiUrl,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: username,
                        email: user_email,
                        message: user_message,
                    }),
                }
            );

            if (response.ok) {
                toast.success("Message sent successfully!", {
                    position: "bottom-right",
                });
                setForm({
                    name: "",
                    email: "",
                    message: "",
                });
            } else {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                toast.error("Failed to send message. Please try again later.", {
                    position: "bottom-right",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send message. Please try again later.", {
                position: "bottom-right",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-0 bg-black w-full min-h-screen flex flex-col justify-between">
            <div className="text-white contact overflow-x-hidden pt-12" id="contact">
                <div className="z-10 w-full sm:w-[650px] m-auto p-8 rounded-2xl">
                    <p className="font-light">REACH OUT TO ME</p>
                    <h2 className="text-5xl font-extrabold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-pink-500">
                        Contact.
                    </h2>
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="mt-12 flex flex-col gap-8"
                    >
                        <label className="flex flex-col">
                            <span className="font-medium mb-4">Your Name</span>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="py-4 px-6 rounded-lg outline-none border-none font-medium bg-gray-900 text-white"
                                required
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="font-medium mb-4">Your email</span>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Ex:abc@gmail.com"
                                className="py-4 px-6 rounded-lg outline-none border-none font-medium bg-gray-900 text-white"
                                required
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="font-medium mb-4">Your Message</span>
                            <textarea
                                rows={7}
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Do you have anything to say?"
                                className="py-4 px-6 rounded-lg outline-none border-none font-medium bg-gray-900 text-white"
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            className="pt-3 pb-3 px-8 rounded-xl outline-none w-fit font-bold shadow-md bg-gray-900 text-white hover:bg-gray-700 flex items-center justify-center"
                        >
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </form>
                </div>
                <ToastContainer />
            </div>
            <Footer />
        </div>
    );
};

export default Contact;