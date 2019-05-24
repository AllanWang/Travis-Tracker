import React from 'react';
import {ListItemText} from '@material/react-list';
import {Slug} from "./travis-api";
import {Ablank} from "./components";

export interface RepoListItemTextProps {
  owner: string;
  repo: string;
  slug: Slug;
}

export const RepoListItemText: React.FC<RepoListItemTextProps> = ({owner, repo, slug}) => {
  const userA = <Ablank href={`https://github.com/${owner}`}>{owner}</Ablank>;
  const repoA = <Ablank href={`https://github.com/${slug}`}>{repo}</Ablank>;
  return (
    <ListItemText primaryText={<div>{userA}/{repoA}</div>}/>
  );
};
