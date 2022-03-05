import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import Link from "next/link";

const PokemonList = ({ pokemonList, setPokemonList }) => {
  const getMorePokemon = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?offset=${pokemonList.length}&limit=25`
    );
    const { results } = await response.json();

    const newPokemon = results.map((item, index) => {
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
        pokemonList.length + index + 1
      }.svg`;
      return {
        ...item,
        image,
      };
    });
    console.log(newPokemon);
    setPokemonList((prevPokemonList) => [...prevPokemonList, ...newPokemon]);
  };

  return (
    <ul className="">
      <InfiniteScroll
        dataLength={pokemonList.length}
        next={getMorePokemon}
        hasMore={true}
        loader={<h3>Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
        className="grid grid-cols-1 md:grid-cols-4 mx-auto gap-4 w-full"
      >
        {pokemonList.map((singlePokemon, index) => (
          <li key={index} className="m-4">
            <Link href={`/pokemon?name=${singlePokemon.name}`}>
              <a className="border p-4 border-gray-200 my-2 w-full capitalize flex flex-col items-center text-xl bg-gray-100 rounded shadow">
                <Image
                  height={100}
                  width={100}
                  src={singlePokemon.image}
                  alt={singlePokemon.name}
                />
                <div className="flex mt-2">
                  <span className="mx-2 font-bold">{index + 1}. </span>
                  {singlePokemon.name}
                </div>
              </a>
            </Link>
          </li>
        ))}
      </InfiniteScroll>
    </ul>
  );
};

export default PokemonList;
