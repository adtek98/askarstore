import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { TrashIcon } from "@heroicons/react/outline";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
    toast.success("Product updated in the cart");
  };
  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl font-semibold text-center">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 md:gap-5 my-5">
          <div className=" overflow-x-auto md:col-span-3">
            <div className="border-b"></div>
            <div>
              {cartItems.map((item) => (
                <div
                  key={item.slug}
                  className="flex justify-between px-2 py-1 items-center border-t h-20"
                >
                  <div className=" flex md:w-2/3">
                    <Link href={`/product/${item.slug}`}>
                      <a className="">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={70}
                          className="object-contain"
                        ></Image>
                      </a>
                    </Link>
                    <div className="ml-2">
                      <Link href={`/product/${item.slug}`}>
                        <a className="">{item.name}</a>
                      </Link>
                      <p className="text-sm">{item.brand}</p>
                      <p className="font-semibold">${item.price}</p>
                    </div>
                  </div>
                  <div className="">
                    <select
                      className="rounded-sm w-16"
                      value={item.quantity}
                      onChange={(e) => updateCartHandler(item, e.target.value)}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option className="" key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="">
                    <button onClick={() => removeItemHandler(item)}>
                      <TrashIcon className="h-6 w-6 m-auto"></TrashIcon>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5 h-32 md:col-span-2 md:mx-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("login?redirect=/shipping")}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
