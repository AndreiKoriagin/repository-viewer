import dayjs from "dayjs";

export const getMostRecentGithubProjects = () => {
  const startDate = dayjs().subtract(7, 'days').format('YYYY-MM-DD')
  return fetch(`https://api.github.com/search/repositories?q=created:>${startDate}&sort=stars&order=desc`)
  .then(response => response.json())
  .then(
    result => result?.items.map((item) => {
      return {
        name: item.name,
        id: item.id,
        url: item.html_url,
        description: item.description,
        language: item.language,
        stars: Number(item.stargazers_count),
      };
    }));
}