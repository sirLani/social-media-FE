import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import Navbar from "../components/nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd";
import { UserProvider } from "../context";
import ClientOnly from "./Client";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../mocks");
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClientOnly>
      <UserProvider>
        <Navbar />
        <ToastContainer position="top-center" />
        <Component {...pageProps} />
      </UserProvider>
    </ClientOnly>
  );
}
