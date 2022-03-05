import { useState } from "react";
import { useRouter } from "next/router";
import PokemonList from "../components/PokemonList";
import useLocalStorage from "../hooks/useLocalStorage";
import { SearchIcon } from "@heroicons/react/outline";
import { v4 as uuidv4 } from "uuid";

// import { FixedSizeGrid as Grid } from "react-window";
import Layout from "../components/Layout";
import Suggestions from "../components/Suggestions";
import SearchedItem from "../components/SearchedItem";

export async function getStaticProps(context) {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=25");
    const { results } = await res.json();
    const pokemon = results.map((result, index) => {
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
        index + 1
      }.svg`;

      return {
        ...result,
        image,
        id: uuidv4(),
      };
    });

    // All Pokemon names
    let allPokemonNames = [];
    const names = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1126");
    const data = await names.json();
    const allPokemon = data.results.map((item, index) => {
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
        index + 1
      }.svg`;
      allPokemonNames.push(item.name);
      return {
        ...item,
        image,
        id: uuidv4(),
      };
    });

    return {
      props: { pokemon, allPokemon, allPokemonNames },
    };
  } catch (error) {
    console.log(error);
  }
}

const Home = ({ pokemon, allPokemon, allPokemonNames }) => {
  const [pokemonList, setPokemonList] = useState(pokemon);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionsActive, setSuggestionsActive] = useState(false);
  const [value, setValue] = useState("");
  const [searchedItem, setSearchedItem] = useLocalStorage("item", []);

  const router = useRouter();

  const filterPokemon = async (query) => {
    // Get matches to current text input
    let matches = allPokemon.filter((item) => {
      const regex = new RegExp(`^${query}`, "gi");
      return item.name.match(regex);
    });

    setPokemonList(matches);
  };

  // Search
  const handleChange = (e) => {
    const query = e.target.value.toLowerCase();
    setValue(query);

    filterPokemon(query);

    if (query.length) {
      const filteredSuggestions = allPokemonNames.filter((suggestion) => {
        const regex = new RegExp(`^${query}`, "gi");
        return suggestion.match(regex);
      });

      setSuggestions(filteredSuggestions);
      setSuggestionsActive(true);
    } else {
      setPokemonList(pokemon);
      setSuggestionsActive(false);
    }
  };

  // On Click of suggestion
  const handleClick = (e) => {
    setSuggestions([]);
    setValue(e.target.innerText);
    setSuggestionsActive(false);
  };

  // Navigate through suggestions with keyboard
  const handleKeyDown = (e) => {
    // UP ARROW
    if (e.keyCode === 38) {
      if (suggestionIndex === 0) {
        return;
      }
      setSuggestionIndex(suggestionIndex - 1);
    } else if (e.keyCode === 40) {
      if (suggestionIndex - 1 === suggestions.length) {
        return;
      }
      setSuggestionIndex(suggestionIndex + 1);
    } else if (e.keyCode === 13) {
      setValue(suggestions[suggestionIndex]);
      setSuggestionIndex(0);
      setSuggestionsActive(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchedItem([...searchedItem, value]);
    router.push(`/pokemon?name=${value}`);
  };

  return (
    <Layout title="Pokemon PokeDex">
      <h1 className="text-4xl mb-8 text-center">Pokemon Pokedex</h1>
      <div className="m-4">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex items-center gap-2 justify-between mb-4"
        >
          <input
            type="text"
            className="border px-4 py-2 flex-1 rounded"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            <SearchIcon className="h-6 w-6 text-white" />
          </button>
        </form>
        {suggestionsActive && (
          <Suggestions
            suggestions={suggestions}
            suggestionIndex={suggestionIndex}
            handleClick={handleClick}
          />
        )}
      </div>

      <div>
        {searchedItem && (
          <div className="mx-4">
            <h1 className="text-4xl mb-4">Your Recent Searches</h1>
            <ul className="flex gap-2">
              {searchedItem.map((item, index) => (
                <SearchedItem key={index} item={item} />
              ))}
            </ul>
          </div>
        )}
      </div>

      <PokemonList pokemonList={pokemonList} setPokemonList={setPokemonList} />
    </Layout>
  );
};

export default Home;
