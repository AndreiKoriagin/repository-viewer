import {renderHook, act, waitFor} from '@testing-library/react'
import * as githubService from '../services/github.service';

import { LOCAL_STORAGE_ITEM_NAME, RepositoriesContextProvider, useRepositories } from './repositories.context';

const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    setItem(key, value) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe('RepositoriesContext', () => {
  it('should initialize local storage', async () => {
    githubService.getMostRecentGithubProjects = jest.fn().mockResolvedValue([]);

    renderHook(() =>
      useRepositories(),
      {
        wrapper: RepositoriesContextProvider,
      }
    );

    await waitFor(() => {
      expect(localStorageMock.getItem(LOCAL_STORAGE_ITEM_NAME)).toBe('{}')
    });
  })

  it('should return repositories and isLoading state', async () => {
    const mockRepositories = [
      { id: 1, name: 'Repo 1', language: 'JavaScript' },
      { id: 2, name: 'Repo 2', language: 'Python' },
    ];

    githubService.getMostRecentGithubProjects = jest.fn().mockResolvedValue(mockRepositories);

    const { result } = renderHook(() =>
      useRepositories(),
      {
        wrapper: RepositoriesContextProvider,
      }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.repositories).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    })
    await waitFor(() => {
      expect(result.current.repositories).toEqual(mockRepositories);
    })
  });

  it('should mark a repository as favorite', async () => {
    const mockRepositories = [
      { id: 1, name: 'Repo 1', language: 'JavaScript' },
      { id: 2, name: 'Repo 2', language: 'Python' },
    ];

    githubService.getMostRecentGithubProjects = jest.fn().mockResolvedValue(mockRepositories);

    const { result } = renderHook(() =>
      useRepositories(),
      {
        wrapper: RepositoriesContextProvider,
      }
    );

    await waitFor(() => {
      act(() => {
        result.current.markFavorite(mockRepositories[0].id);
      });
      
      expect(result.current.repositories[0].isFavorite).toBe(true);
    });
  });

  it('should filter repositories by language', async () => {
    const mockRepositories = [
      { id: 1, name: 'Repo 1', language: 'JavaScript' },
      { id: 2, name: 'Repo 2', language: 'Python' },
      { id: 3, name: 'Repo 3', language: 'JavaScript' },
    ];

    githubService.getMostRecentGithubProjects = jest.fn().mockResolvedValue(mockRepositories);

    const { result } = renderHook(() =>
      useRepositories(),
      {
        wrapper: RepositoriesContextProvider,
      }
    );

    await waitFor(() => {
      act(() => {
        result.current.setLanguageFilter(['JavaScript']);
      });
  
      expect(result.current.repositories).toEqual([
        mockRepositories[0],
        mockRepositories[2],
      ]);
    });
  });

  it('should filter repositories by favorite', async () => {
    const mockRepositories = [
      { id: 1, name: 'Repo 1', language: 'JavaScript', isFavorite: true},
      { id: 2, name: 'Repo 2', language: 'Python'},
      { id: 3, name: 'Repo 3', language: 'JavaScript', isFavorite: true},
    ];

    githubService.getMostRecentGithubProjects = jest.fn().mockResolvedValue([]);

    const { result } = renderHook(() =>
      useRepositories(),
      {
        wrapper: RepositoriesContextProvider,
      }
    );

    act(() => {
      result.current.setShowOnlyFavorite(true);
      result.current.setRepositories(mockRepositories);
    });

    await waitFor(() => {
      expect(result.current.repositories).toEqual([
        mockRepositories[0],
        mockRepositories[2],
      ]);
    });
  });

  it('should filter repositories by languages', async () => {
    const mockRepositories = [
      { id: 1, name: 'Repo 1', language: 'JavaScript'},
      { id: 2, name: 'Repo 2', language: 'Python'},
      { id: 3, name: 'Repo 3', language: 'JavaScript'},
    ];

    githubService.getMostRecentGithubProjects = jest.fn().mockResolvedValue([]);

    const { result } = renderHook(() =>
      useRepositories(),
      {
        wrapper: RepositoriesContextProvider,
      }
    );

    act(() => {
      result.current.setLanguageFilter(['Python']);
      result.current.setRepositories(mockRepositories);
    });

    await waitFor(() => {
      expect(result.current.repositories).toEqual([
        mockRepositories[1],
      ]);
    });
  });

  it('should filter repositories by languages and favorites', async () => {
    const mockRepositories = [
      { id: 1, name: 'Repo 1', language: 'JavaScript', isFavorite: true},
      { id: 2, name: 'Repo 2', language: 'Python'},
      { id: 3, name: 'Repo 3', language: 'JavaScript'},
    ];

    githubService.getMostRecentGithubProjects = jest.fn().mockResolvedValue([]);

    const { result } = renderHook(() =>
      useRepositories(),
      {
        wrapper: RepositoriesContextProvider,
      }
    );

    act(() => {
      result.current.setShowOnlyFavorite(true);
      result.current.setLanguageFilter(['JavaScript']);
      result.current.setRepositories(mockRepositories);
    });

    await waitFor(() => {
      expect(result.current.repositories).toEqual([
        mockRepositories[0],
      ]);
    });
  });
})