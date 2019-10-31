import React from 'react';
import api from '../../services/api';

class Repository extends React.Component {
  state = {
    repository: {},
    issues: [],
    loading: true
  }
  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        }
      })
    ]);
    console.log({ issues, repository })
    this.setState({
      loading: false,
      repository: repository.data,
      issues: issues.data
    })
  }

  render() {
    return (
      <>

      </>
    );
  }
}
export default Repository;
