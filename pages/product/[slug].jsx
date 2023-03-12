import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
import db from "../../utils/db";
import { Store } from "../../utils/Store";

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
            className="rounded-sm object-contain"
          ></Image>
        </div>
        <div className="flex flex-col items-end md:col-span-2">
          <div className="w-full md:w-3/6 lg:w-4/6">
            <div className="mb-5">
              <p className="font-semibold">{product.brand}</p>

              <h1 className="text-2xl font-bold">
                {product.name} - {product.category}
              </h1>
              <p>
                {product.rating} of {product.numReviews} reviews
              </p>
              <label className="mb-0">Description:</label>
              <div className="bg-gray-100 rounded-sm min p-2">
                {product.description}
              </div>
            </div>

            <div className="card p-5">
              <p>Price: ${product.price}</p>
              <p>
                Status:{" "}
                {product.countInStock > 0 ? (
                  <span className="text-green-500">In stock</span>
                ) : (
                  <span className="text-red-500">Unavailable</span>
                )}
              </p>
              <button
                className="primary-button w-full mt-2"
                onClick={addToCartHandler}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
