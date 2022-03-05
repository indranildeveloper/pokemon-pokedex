import Head from "next/head";

const Layout = ({ title, children }) => {
  return (
    <div className="">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Pokedex Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto max-w-6xl pt-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};
export default Layout;
