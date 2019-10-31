import React from 'react';
import { Container, Form, SubmitButton, List } from './styles'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

class Main extends React.Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== this.state.repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }
  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    const { newRepo, repositories } = this.state;
    const response = await api.get(`/repos/${newRepo}`);
    const data = {
      name: response.data.full_name,
    }
    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: false,
    });

  }
  render() {
    const { newRepo, loading, repositories } = this.state;
    return (
      <Container >
        <h1>
          <FaGithubAlt />
          Repositórios
      </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            placeholder='Adicionar Repositório'
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ?
              <FaSpinner color='#fff' size='14' /> :
              <FaPlus color='#fff' size={14} />}
          </SubmitButton>
        </Form>

        <List>
          {
            repositories.map(repository => (
              <li key={repository.name}>
                <span>{repository.name}</span>
                <a href="">Detalhes</a>
              </li>
            ))
          }
        </List>
      </Container>
    );
  }
}
export default Main;