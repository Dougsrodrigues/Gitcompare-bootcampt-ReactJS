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
        <CompareList repositories={this.state.repositories} />
      </Container>
    );
  }
}
