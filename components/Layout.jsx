import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + " - AskarEstore" : "AskarEstore"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />

      <div className="min-h-screen ">
        <Header />
        <main className="px-4 py-6 w-full lg:w-4/6 md:w-5/6 mx-auto">
          {children}
        </main>
        <footer className="sticky top-[100vh] flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2023 AskarEstore</p>
        </footer>
      </div>
    </>
  );
}
