import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { Menu } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "../utils/Store";
import DropdownLink from "./DropdownLink";
import { useRouter } from "next/router";
import { SearchIcon } from "@heroicons/react/outline";
import { ShoppingCartIcon } from "@heroicons/react/outline";

export default function Header() {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const [query, setQuery] = useState("");

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <header>
      <div className="w-full shadow-md h-12 bg-gray-400 text-white">
        <nav className="h-full w-full lg:w-4/6 md:w-5/6 flex justify-between items-center mx-auto px-4 text-black">
          <Link href="/">
            <a className="text-lg font-bold lg:w-1/3 ">AskarEstore</a>
          </Link>
          <form
            onSubmit={submitHandler}
            className="mx-auto  hidden w-1/3 justify-center md:flex"
          >
            <input
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="rounded-tr-none rounded-br-none p-1 text-sm focus:ring-0"
              placeholder="Search products"
            />
            <button
              className="rounded-sm rounded-tl-none rounded-bl-none bg-gray-600 p-1 text-sm "
              type="submit"
              id="button-addon2"
            >
              <SearchIcon className="h-5 w-5 text-white"></SearchIcon>
            </button>
          </form>
          <div className="lg:w-1/3 text-right flex justify-end">
            <Link href="/cart">
              <a className="w-20 my-auto flex">
                <ShoppingCartIcon className="w-7 h-7" />
                {cartItemsCount > 0 && (
                  <span className="rounded-full bg-red-600 h-6 w-6 text-xs font-bold text-white text-center pt-0.5">
                    {cartItemsCount}
                  </span>
                )}
              </a>
            </Link>

            {status === "loading" ? (
              "Loading"
            ) : session?.user ? (
              <Menu as="div" className="relative inline-block">
                <Menu.Button className="text-blue-600 font-semibold">
                  {session.user.name}
                </Menu.Button>
                <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                  <Menu.Item>
                    <DropdownLink className="dropdown-link" href="/profile">
                      Profile
                    </DropdownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <DropdownLink
                      className="dropdown-link"
                      href="/order-history"
                    >
                      Order History
                    </DropdownLink>
                  </Menu.Item>
                  {session.user.isAdmin && (
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/admin/dashboard"
                      >
                        Admin Dashboard
                      </DropdownLink>
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    <a
                      className="dropdown-link"
                      href="#"
                      onClick={logoutClickHandler}
                    >
                      Logout
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <Link href="/login">
                <a className="p-2">Login</a>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
