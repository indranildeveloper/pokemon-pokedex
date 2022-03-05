import Link from "next/link";

const SearchedItem = ({ item }) => {
  return (
    <li className="border text-xl p-2 rounded text-blue-600">
      <Link href={`/pokemon?name=${item}`}>
        <a className="capitalize">{item}</a>
      </Link>
    </li>
  );
};
export default SearchedItem;
