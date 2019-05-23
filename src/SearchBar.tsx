import React, {FormEvent} from 'react';
import TextField, {Input} from "@material/react-text-field";
import MaterialIcon from "@material/react-material-icon";

export interface SearchBarProps {

}

export default class SearchBar extends React.Component<SearchBarProps> {

  input: React.Ref<HTMLInputElement> = null;
  state = {
    value: ''
  };

  render() {

    const {value} = this.state;
    return (
      <TextField label='Repo Search' leadingIcon={<MaterialIcon icon='search'/>}
                 onTrailingIconSelect={() => this.setState({value: ''})}
                 trailingIcon={<MaterialIcon role='button' icon='close'/>}>
        <Input
          value={value}
          ref={(input: any) => this.input = input}
          onChange={(e: FormEvent<HTMLInputElement>) => this.setState({value: e.currentTarget.value})}/>
      </TextField>
    );
  }
}
