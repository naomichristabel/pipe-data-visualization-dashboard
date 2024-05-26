export function Dropdown({ title, onChange, options }) {
    return (
    <div className="dropdown-container">
      {/* <label style={{ gap: ".5em" }}> {title} */}
        <select name="sort" id="sort-select" onChange={onChange}>
          {options.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      {/* </label> */}
      </div>
    );
  }
  