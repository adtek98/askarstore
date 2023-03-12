import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment method is required");
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push("/placeorder");
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl font-semibold text-center">
          Payment Method
        </h1>
        <div className="mb-4">
          <input
            disabled
            name="paymentMethod"
            className="p-2 outline-none focus:ring-0"
            id={"PayPal"}
            type="radio"
            checked={selectedPaymentMethod === "PayPal"}
            onChange={() => setSelectedPaymentMethod("PayPal")}
          />

          <label className="p-2 text-gray-500">PayPal (coming soon)</label>
        </div>
        <div className="mb-4">
          <input
            disabled
            name="paymentMethod"
            className="p-2 outline-none focus:ring-0"
            id={"Stripe"}
            type="radio"
            checked={selectedPaymentMethod === "Stripe"}
            onChange={() => setSelectedPaymentMethod("Stripe")}
          />

          <label className="p-2 text-gray-500">Stripe (coming soon)</label>
        </div>
        <div className="mb-4">
          <input
            name="paymentMethod"
            className="p-2 outline-none focus:ring-0"
            id={"CashOnDelivery"}
            type="radio"
            checked={selectedPaymentMethod === "CashOnDelivery"}
            onChange={() => setSelectedPaymentMethod("CashOnDelivery")}
          />

          <label className="p-2" htmlFor={"CashOnDelivery"}>
            {"CashOnDelivery"}
          </label>
        </div>
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push("/shipping")}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button" type="submit">
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true;
