import React from 'react';
import { Container, Form, SubmitButton, List, Input } from './styles'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../services/api';

class Main extends React.Component {

  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    notFindRepo: false,
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

    try {
      this.setState({ loading: true });
      const { newRepo, repositories } = this.state;

      const exist = this.state.repositories.find(item => item.name === newRepo);

      if (!exist) {
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
    } catch (error) {
      this.setState({ ...this.state, notFindRepo: true, loading: false });
    }
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
          <Input
            result={this.state.notFindRepo}
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
          <ul>
            {
              repositories.map((repository, index) => (
                <li key={index}>
                  <span>{repository.name}</span>
                  <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link >
                </li>
              ))
            }
          </ul>

        </List>
      </Container>
    );
  }
}
export default Main;