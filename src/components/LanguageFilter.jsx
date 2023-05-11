import { Dropdown } from "semantic-ui-react";
import { useRepositories } from "../context/repositories.context";
import { useMemo } from "react";

const LanguageFilter = () => {
  const {setLanguageFilter, languages} = useRepositories();

  const options = useMemo(() => languages.map(lang => ({
    key: lang,
    value: lang,
    text: lang,
  })), [languages])

  const onSelectedLanguagesChange = (e, {value}) => {
    setLanguageFilter(value);
  }

  return (
    <div className="LanguageFilter-dropdown-container">
      <Dropdown 
        placeholder='Languages' 
        fluid
        multiple
        selection
        options={options}
        onChange={onSelectedLanguagesChange}
      />
    </div>
  )
}

export default LanguageFilter;