import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";

export async function getServerSideProps({ query }) {
  const name = query.name;
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const singlePokemon = await res.json();
    return {
      props: {
        singlePokemon,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

const pokemon = ({ singlePokemon }) => {
  return (
    <Layout title={singlePokemon.name}>
      <h1 className="text-4xl mb-2 text-center capitalize">
        {singlePokemon.name}
      </h1>
      <div className="mx-auto text-center mt-4">
        <Image
          height={200}
          width={200}
          className="mx-auto"
          src={singlePokemon.sprites.other.dream_world.front_default}
          alt={singlePokemon.name}
        />
        <p>
          <span className="font-bold mr-2">Weight: </span>{" "}
          {singlePokemon.weight}
        </p>
        <p>
          <span className="font-bold mr-2">Height: </span>{" "}
          {singlePokemon.height}
        </p>
        <h2 className="text-2xl mt-6 mb-2">Types</h2>
        {singlePokemon.types.map((type, index) => (
          <p key={index}>{type.type.name}</p>
        ))}
        <p className="mt-10 text-center">
          <Link href="/">
            <a className="text-2xl text-blue-600 underline">Home</a>
          </Link>
        </p>
      </div>
    </Layout>
  );
};
export default pokemon;
