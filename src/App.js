import "./App.css";
import React, { Component, useState } from "react";
import axios from "axios";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      isModalOpen: false,
      isEditModalOpen: false,
      editUser: {
        id: "",
        name: "",
        email: ""
      },
      newBook: {
        name: "",
        email: ""
      },
      query: ""
    };
    this.addBook = this.addBook.bind(this);
    this.edit = this.edit.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleEditModal = this.toggleEditModal.bind(this);
    this.update = this.update.bind(this);
  }

  addBook() {
    axios
      .post("https://jsonplaceholder.typicode.com/users", this.state.newBook)
      .then(response => {
        console.log(response.data);
        let { users } = this.state;
        users.push(response.data);

        this.setState({
          users,
          isModalOpen: false,
          newBook: {
            name: "",
            email: ""
          }
        });
      });
  }
  componentWillMount() {
    axios.get("https://jsonplaceholder.typicode.com/users").then(response => {
      this.setState({
        users: response.data
      });
    });
  }
  delete(id) {
    axios
      .delete("https://jsonplaceholder.typicode.com/users/" + id)
      .then(response => {
        this.refreshData();
      });
  }
  edit(id, name, email) {
    this.setState({
      isEditModalOpen: !this.state.isEditModalOpen,
      editUser: { id, name, email }
    });
  }

  handleChangeTitle(event) {
    let { newBook } = this.state;
    newBook.name = event.target.value;
    this.setState({
      newBook
    });
  }
  refreshData() {
    axios.get("https://jsonplaceholder.typicode.com/users").then(response => {
      this.setState({
        users: response.data
      });
    });
  }
  searchSubmit(event) {
    let { users, query } = this.state;
    if (query.length == 0) {
      this.refreshData();
    } else {
      let filteredArr = users.filter(e => {
        return e.name.toLowerCase() == query.toLowerCase();
      });
      this.setState({
        users: filteredArr
      });
      event.preventDefault();
    }
  }
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }
  toggleEditModal() {
    this.setState({
      isEditModalOpen: !this.state.isEditModalOpen
    });
  }

  update() {
    let { id, name, email } = this.state.editUser;
    axios
      .put("https://jsonplaceholder.typicode.com/users/" + id, { name, email })
      .then(response => {
        this.refreshData();
        this.setState({
          isEditModalOpen: !this.state.isEditModalOpen,
          editUser: {
            id: "",
            name: "",
            email: ""
          }
        });
      });
  }

  render() {
    let users = this.state.users.map(e => {
      return (
        <tr key={e.id}>
          <td>{e.id}</td>
          <td>{e.name}</td>
          <td>{e.email}</td>
          <td>
            <button
              class="btn btn-success mr-2"
              onClick={this.edit.bind(this, e.id, e.name, e.email)}
            >
              Edit
            </button>
            <button
              class="btn btn-danger"
              onClick={this.delete.bind(this, e.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="App">
        <h1>List of Users</h1>
        <p>
          Note: Since this is using a fake api server, unfortunately the data
          can not be edited or deleted.Since its not my server the DELETE and
          PUT HTTP requests are faked, and only GET and POST work. Check the
          github code to run local my json server in order for all functions to
          work
        </p>
        <Button className="my-3" color="danger" onClick={this.toggleModal}>
          Add User
        </Button>
        <form onSubmit={this.searchSubmit}>
          <input
            type="text"
            value={this.state.query}
            placeholder="Search for name "
            onChange={event => {
              this.setState({
                query: event.target.value
              });
            }}
          ></input>
          <button type="submit">
            Search
            <i class="fa fa-search ml-1"></i>
          </button>
        </form>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Add a new book!</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Book Title</Label>
              <Input
                id="name"
                value={this.state.newBook.name}
                onChange={this.handleChangeTitle}
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Rating</Label>
              <Input
                id="email"
                value={this.state.newBook.email}
                onChange={event => {
                  let { newBook } = this.state;
                  newBook.email = event.target.value;
                  this.setState({
                    newBook
                  });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addBook}>
              Add Book
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.isEditModalOpen}
          toggle={this.toggleEditModal}
        >
          <ModalHeader toggle={this.toggleEditModal}>Edit A User!</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                value={this.state.editUser.name}
                onChange={event => {
                  let { editUser } = this.state;
                  editUser.name = event.target.value;
                  this.setState({
                    editUser
                  });
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                value={this.state.editUser.email}
                onChange={event => {
                  let { editUser } = this.state;
                  editUser.email = event.target.value;
                  this.setState({
                    editUser
                  });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.update}>
              Edit user
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleEditModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        ;
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th>ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{users}</tbody>
        </table>
      </div>
    );
  }
}
