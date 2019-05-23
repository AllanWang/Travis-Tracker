import React from 'react';
import List, {ListItem, ListItemGraphic, ListItemMeta, ListItemText} from '@material/react-list';
import Checkbox from '@material/react-checkbox';
import {Repositories} from "./travis_api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export class ReposProps {
  repos: ListItemRepoProps[];

  constructor(repos: ListItemRepoProps[] | Repositories) {
    if (repos instanceof Repositories) {
      this.repos = repos.repositories.map(r => ({owner: r.owner.login, repo: r.name}));
    } else {
      this.repos = repos;
    }
  }
}

const repoKey = ({owner, repo}: ListItemRepoProps) => `repo/${owner}/${repo}`;

export default class Repos extends React.Component<ReposProps> {

  state = {
    selectedIndex: [1],
  };

  render() {
    const {selectedIndex} = this.state;
    return (
      <List
        checkboxList
        selectedIndex={selectedIndex}
        handleSelect={(_, allSelected) => {
          console.log(allSelected);
          this.setState({selectedIndex: allSelected})
        }}
        style={{width: '600px'}}
      > {this.props.repos
      // While type is MDCListIndex, it appears to always be an array for checkbox lists
      // See isIndexValid_(index: MDCListIndex)
        .map((r, i) => ({...r, checked: selectedIndex.includes(i)}))
        .map(r => <ListItemRepo {...r} key={repoKey(r)}/>)}
      </List>
    );
  }
}

export interface ListItemRepoProps {
  owner: string;
  repo: string;
  checked?: boolean;
}

export const ListItemRepo: React.FunctionComponent<ListItemRepoProps> = ({owner, repo, checked}) => {

  const blankTarget = {target: '_blank', rel: 'noopener noreferrer'};

  const userA = <a {...blankTarget}
                   href={`https://github.com/${owner}`}>{owner}</a>;
  // TODO verify that this works for organizations
  const repoA = <a {...blankTarget}
                   href={`https://github.com/${owner}/${repo}`}>{repo}</a>;
  return (
    <ListItem>
      <ListItemGraphic graphic={<FontAwesomeIcon color='black' icon={['fab', 'github']}/>}/>
      <ListItemText primaryText={<div>{userA}/{repoA}</div>}/>
      <ListItemMeta meta={<Checkbox checked={checked}/>}/>
    </ListItem>
  );
};
