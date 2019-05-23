import React, {Component} from 'react';
import List, {ListItem, ListItemGraphic, ListItemMeta, ListItemText} from '@material/react-list';
import Checkbox from '@material/react-checkbox';
import MaterialIcon from "@material/react-material-icon";

export interface ReposProps {
  repos: ListItemRepoProps[];
}

const repoKey = ({name, repo}: ListItemRepoProps) => `repo/${name}/${repo}`;

export class Repos extends Component<ReposProps> {

  state = {
    selectedIndex: [1],
  };

  render() {
    return (
      <List
        checkboxList
        selectedIndex={this.state.selectedIndex}
        handleSelect={(activatedItemIndex, allSelected) => {
          console.log(allSelected);
          this.setState({selectedIndex: allSelected})
        }}
        style={{width: '600px'}}
      > {this.props.repos.map((r, i) => <ListItemRepo {...r} key={repoKey(r)}/>)}
      </List>
    );
  }
}

export interface ListItemRepoProps {
  name: string;
  repo: string;
}

export const ListItemRepo: React.FunctionComponent<ListItemRepoProps> = ({name, repo}) => {

  const blankTarget = {target: '_blank', rel: 'noopener noreferrer'};

  const userA = <a {...blankTarget}
                   href={`https://github.com/${name}`}>{name}</a>;
  const repoA = <a {...blankTarget}
                   href={`https://github.com/${name}/${repo}`}>{repo}</a>;
  return (
    <ListItem>
      <ListItemGraphic graphic={<MaterialIcon icon='public'/>}/>
      <ListItemText primaryText={<div>{userA}/{repoA}</div>}/>
      <ListItemMeta meta={<Checkbox/>}/>
    </ListItem>
  );
};

export default Repos
