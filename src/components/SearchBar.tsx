import styled from "styled-components";
import { useState } from "react";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <StyledWrapper>
      <form onSubmit={handleSearch}>
        <div className="ui-input-container">
          <input
            value={query}
            onChange={handleInputChange}
            required
            placeholder="Search World Best Pizza"
            className="ui-input"
            type="text"
          />
          <div className="ui-input-underline" />
          <div className="ui-input-highlight" />
          <div className="ui-input-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth={2}
                stroke="currentColor"
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              />
            </svg>
          </div>
        </div>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .ui-input-container {
    position: relative;
    width: 400px;
  }

  .ui-input {
    width: 100%;
    padding: 10px 10px 10px 40px;
    font-size: 1em;
    border: none;
    border-bottom: 2px solid #ccc;
    outline: none;
    background-color: transparent;
    transition: border-color 0.3s;
    color: #000000;
  }

  .ui-input:focus {
    border-color: #ff6b00;
  }

  .ui-input-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: #ff6b00;
    transform: scaleX(0);
    transition: transform 0.3s;
  }

  .ui-input:focus + .ui-input-underline {
    transform: scaleX(1);
  }

  .ui-input-highlight {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 0;
    background-color: rgba(255, 107, 0, 0.1);
    transition: width 0.3s;
  }

  .ui-input:focus ~ .ui-input-highlight {
    width: 100%;
  }

  .ui-input-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: rgb(0, 0, 0);
    transition: color 0.3s;
  }

  .ui-input:focus ~ .ui-input-icon {
    color: #ff6b00;
  }

  .ui-input-icon svg {
    width: 20px;
    height: 20px;
  }
`;

export default SearchBar;
