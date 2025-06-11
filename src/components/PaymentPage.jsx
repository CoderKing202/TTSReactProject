import React, { useState } from "react";
import { CreditCard, Banknote, IndianRupee } from "lucide-react";
import NavBar from "./NavBar";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("debit");

  const renderForm = () => {
    switch (paymentMethod) {
      case "debit":
      case "credit":
        return (
          <form className="space-y-4 w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Card Holder Name"
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Card Number"
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-1/2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-1/2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Pay ₹499
            </button>
          </form>
        );
      case "upi":
        return (
          <form className="space-y-4 w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter your UPI ID (e.g., name@upi)"
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Pay ₹499
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <NavBar/>
    
    <div id="paymentForm">
      <div className="rounded-2xl shadow-xl p-10 w-full max-w-2xl">
        

        {/* Centered Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setPaymentMethod("debit")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base transition duration-200 ${
              paymentMethod === "debit"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <CreditCard size={20} /> Debit Card
          </button>
          <button
            onClick={() => setPaymentMethod("credit")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base transition duration-200 ${
              paymentMethod === "credit"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Banknote size={20} /> Credit Card
          </button>
          <button
            onClick={() => setPaymentMethod("upi")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base transition duration-200 ${
              paymentMethod === "upi"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <IndianRupee size={20} /> UPI
          </button>
        </div>

        {/* Centered Form */}
        {renderForm()}
      </div>
    </div>
    </>
  );
};

export default PaymentPage;
