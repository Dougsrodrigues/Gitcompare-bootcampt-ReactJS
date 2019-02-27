import React, { Component } from "react";
import api from "../../services/api";
import logo from "../../assets/logo.png";
import moment from "moment";
import { Container, Form } from "./styles";

import CompareList from "../../components/compareList";

export default class Main extends Component {
  state = {
    loading: false,
    repositoryError: false,
    reposutoryInput: "",
    repositories: []
  };

  handleAddRepository = async e => {
    e.preventDefault();

    this.setState({
      loading: true
    });

    try {
      const { data: repository } = await api.get(
        `/repos/${this.state.reposutoryInput}`
      );

      repository.lastCommit = moment(repository.pushed_at).fromNow(); // converte a data

      this.setState({
        reposutoryInput: "",
        repositories: [...this.state.repositories, repository],
        repositoryError: false
      });
    } catch (err) {
      this.setState({
        repositoryError: true
      });
    } finally {
      this.setState({
        loading: false
      });
    }
    //criando o localStorage e colocando o nome da chave de repository e o valor c o contenudo q vai p repositories
    window.localStorage.setItem(
      "repository",
      JSON.stringify(this.state.repositories)
    );
  };

  // antes de montar a aplicação é feito a recuperação dos dados do localstorage e inseridos no state
  componentWillMount() {
    localStorage.getItem(
      "repository" &&
        this.setState({
          repositories: JSON.parse(localStorage.getItem("repository"))
        })
    );
  }

  //Removendo do state e do localStorage
  handleRemoveRepository = async id => {
    const { repositories } = this.state;
    const updateRepositories = repositories.filter(
      repository => repository.id !== id
    );

    this.setState({
      repositories: updateRepositories
    });

    await localStorage.setItem(
      "repository",
      JSON.stringify(updateRepositories)
    );
  };

  //Fazendo o update e salvando as alterações
  handleUpdateRepository = async id => {
    //salvando os dados do state na variavel repositories
    const { repositories } = this.state;
    //salvando o repositorio selecionado na variavel repository
    const repository = repositories.find(rep => rep.id === id);
    try {
      const { data } = await api.get(`/repos/${repository.full_name}`);

      data.last_commit = moment(data.pushed_at).fromNow();

      this.setState({
        repositoryError: false,
        repositoryInput: "",
        repositories: repositories.map(rep => (rep.id === data.id ? data : rep))
      });

      await localStorage.setItem("repository", JSON.stringify(repositories));
    } catch (err) {
      this.state({ repositoryError: true });
    }
  };

  render() {
    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form
          onSubmit={this.handleAddRepository}
          withError={this.state.repositoryError}
        >
          <input
            type="text"
            placeholder="Usuário/Repositório"
            value={this.state.reposutoryInput}
            onChange={e => this.setState({ reposutoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? (
              <i className="fa fa-spinner fa-pulse" />
            ) : (
              "OK"
            )}
          </button>
        </Form>
        <CompareList
          repositories={this.state.repositories}
          removeRepository={this.handleRemoveRepository}
          updateRepository={this.handleUpdateRepository}
        />
      </Container>
    );
  }
}
