import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getMostRecentGithubProjects } from '../services/github.service';

export const RepositoriesContext = createContext({});

export const LOCAL_STORAGE_ITEM_NAME = 'favorites';

const updateLocalStorageMapEntry = (repositoryId, isFavorite) => {
  const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM_NAME));

  current[repositoryId] = !!isFavorite;

  localStorage.setItem(LOCAL_STORAGE_ITEM_NAME, JSON.stringify(current));
}

const getLocalStorageMap = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEM_NAME));
}

export const RepositoriesContextProvider = ({children}) => {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnlyFavorite, setShowOnlyFavorite] = useState(false);
  const [languageFilter, setLanguageFilter] = useState([]);

  const languages = useRef(new Set());

  const markFavorite = useCallback((repositoryId) => {
    setRepositories(repositories.map(item => {
      if (item.id === repositoryId) {

        updateLocalStorageMapEntry(repositoryId, !item.isFavorite);

        return {
          ...item,
          isFavorite: !item.isFavorite,
        }
      }

      return item;
    }));

  }, [repositories])

  // initialize local storage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ITEM_NAME);

    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_ITEM_NAME, '{}');
    }
  }, []);

  // load initial data
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const items = await getMostRecentGithubProjects();
        const storedFavorites = getLocalStorageMap();
        
        for (const item of items) {
          item.isFavorite = !!storedFavorites[item.id];
          
          if (item.language) {
            languages.current.add(item.language);
          }
        }
        
        setRepositories(items);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);


  const filteredRepositories = useMemo(() => {
    let filtered = repositories;

    filtered = repositories.filter(item => {
      let include = true;
      if (showOnlyFavorite) { 
        include = include && item.isFavorite;
      }

      if (languageFilter.length) {
        include = include && languageFilter.includes(item.language)
      }

      return include;
    });

    

    return filtered;
  }, [repositories, showOnlyFavorite, languageFilter]);

  return (
    <RepositoriesContext.Provider value={{
      repositories: filteredRepositories, 
      isLoading, 
      markFavorite, 
      setShowOnlyFavorite,
      setLanguageFilter,
      languages: [...languages.current.values()],
      setRepositories,
    }}>
      {children}
    </RepositoriesContext.Provider>
  )
}

export const useRepositories = () => {
  const repositories = useContext(RepositoriesContext);

  return repositories;
}