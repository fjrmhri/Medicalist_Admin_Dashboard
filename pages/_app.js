import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  // Bungkus seluruh halaman agar gaya global dan properti halaman tetap konsisten
  return <Component {...pageProps} />;
}

export default MyApp;
