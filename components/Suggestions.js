const Suggestions = ({ suggestions, suggestionIndex, handleClick }) => {
  return (
    <ul className="suggestions w-full h-64 border m-4 mx-auto p-4 bg-gray-100 overflow-hidden">
      {suggestions.map((suggestion, index) => {
        return (
          <li
            className={index === suggestionIndex ? "active" : ""}
            key={index}
            onClick={handleClick}
          >
            {suggestion}
          </li>
        );
      })}
    </ul>
  );
};

export default Suggestions;
