import React, { useMemo } from 'react';
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react'
import { useRepositories } from '../context/repositories.context';

const RepositoryCard = ({repository}) => {
  const {markFavorite} = useRepositories();

  const icon = useMemo(() => {
    if (repository.isFavorite) return <Icon name='star' />
    return <Icon name='star outline' />
  }, [repository]);

  return (
    <Card>
      <Card.Content>
        <Card.Header>{repository.name}</Card.Header>
        <Card.Description>
          <div className='RepositoryCard-description'>
            {repository.description}
          </div>
          <div>
            Language: {repository.language ? repository.language : 'Unknown'}
          </div>
          <a href={repository.url} target='_blank' rel="noreferrer">Link to Github</a>

        </Card.Description>
      </Card.Content>
      <Card.Content extra>
          <Button as='div' labelPosition='right'>
            <Button basic color='blue' onClick={() => markFavorite(repository.id)}>
              {icon}
            </Button>
            <Label as='a' basic color='blue' pointing='left'>
              {repository.stars}
            </Label>
          </Button>
        </Card.Content>
    </Card>
  )
};

export default RepositoryCard