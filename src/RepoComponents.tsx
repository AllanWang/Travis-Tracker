import React from 'react';
import {ListItemText} from '@material/react-list';
import {Slug} from "./travis-api";

export interface RepoListItemTextProps {
  owner: string;
  repo: string;
  slug: Slug;
}

export const RepoListItemText: React.FC<RepoListItemTextProps> = ({owner, repo, slug}) => {
  const blankTarget = {target: '_blank', rel: 'noopener noreferrer'};

  const userA = <a {...blankTarget}
                   href={`https://github.com/${owner}`}>{owner}</a>;
  const repoA = <a {...blankTarget}
                   href={`https://github.com/${slug}`}>{repo}</a>;
  return (
    <ListItemText primaryText={<div>{userA}/{repoA}</div>}/>
  );
};
