import './App.css';
import { useRepositories } from './context/repositories.context';
import RepositoryCard from './components/RepositoryCard';
import { Card, Checkbox } from 'semantic-ui-react';
import Spinner from './components/Spinner';
import LanguageFilter from './components/LanguageFilter';

function App() {
  const {repositories, isLoading, setShowOnlyFavorite} = useRepositories();

  return (
    <div className='App-wrapper'>
      <div className='App-filters'>
        <Checkbox toggle label={'Favorite only'} onChange={(e, data) => {
          setShowOnlyFavorite(data.checked);
        }}/>
        <LanguageFilter />
      </div>
      {isLoading
        ? <Spinner />
        : <div className='App-list-wrapper'>
            <Card.Group>
              {repositories.map(repo => <RepositoryCard key={repo.url} repository={repo} />)}
            </Card.Group>
          </div>
      }
    </div>
  );
}

export default App;
