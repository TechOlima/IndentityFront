import React, { Component } from 'react';
import { Alert, Button, Modal, ModalHeader, ModalBody, Row, Col, Form, FormGroup, Label, Input, ModalFooter  } from 'reactstrap';
import settings from './settings.json';

export class Users extends Component {
    static displayName = Users.name;

  constructor(props) {
    super(props);
      this.state = {
          users: [],
          roles:[],
          loading: true,
          errorMessage: null,
          showModal: false,
          activeUser: null,
          token: null          
      };
      this.toggleModal = this.toggleModal.bind(this);      
      this.editUser = this.editUser.bind(this);
      this.renderUserTable = this.renderUserTable.bind(this);
      this.changeActiveUser = this.changeActiveUser.bind(this);
      this.getActiveUser = this.getActiveUser.bind(this);
      this.saveActiveUserChanges = this.saveActiveUserChanges.bind(this);
      this.deleteActiveUser = this.deleteActiveUser.bind(this);
      this.populateUsersData = this.populateUsersData.bind(this);
    }
    getActiveUser(user) {
        return {
            id: user?.id ? user.id : null,
            name: user?.name ? user.name : "",
            login: user?.login ? user.login : "",
            phone: user?.phone ? user.phone : "",
            email: user?.email ? user.email : "",
            role: user?.role ? user.role.name : "",
            password: user?.password ? user.password : null,
        };
    }
    async saveActiveUserChanges() {
        let activeUser = this.state.activeUser;
        const response = await fetch(this.state.activeUser.id ? (settings.identityapiurl + '/Users/' + this.state.activeUser.id) : (settings.identityapiurl + '/Users/'), {
            method: this.state.activeUser.id ? 'PUT' : 'POST',
            headers: {
                'Authorization': 'Bearer '+ this.state.token,
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
            body: JSON.stringify(activeUser)
        });
        if (response.ok) {
            if (this.state.activeUser.id !== null) {
                this.setState({
                    successMessage: 'Данные успешно сохранены',
                    errorMessage: null
                },() => {
                    this.populateUsersData();
                });
                
            }
            else {
                const data = await response.json();
                this.setState({ activeUser: this.getActiveUser(data), successMessage: 'Данные успешно сохранены', errorMessage: null });
            }
        }
        else this.setState({ errorMessage: 'Произошла ошибка при сохранении', successMessage: null });

    }
    async deleteActiveUser() {
        try {
            let response = await fetch(settings.identityapiurl + '/Users/' + this.state.activeUser.id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + this.getCookie('token'),
                    'Content-Type': 'application/json;',
                    'accept': 'text/plain'
                }
            });
            if (response.ok) {
                this.setState({ activeUser: this.getActiveUser(), successMessage: 'Данные успешно удалены', errorMessage: null }, () => {
                    this.populateUsersData();
                });
            }
            else this.setState({ errorMessage: 'Произошла ошибка при удалении', successMessage: null });
        }
        catch {
            this.setState({ errorMessage: 'Произошла ошибка при удалении', successMessage: null });
        }
    }
    async editUser(userID) {        
        const response = await fetch(settings.identityapiurl + '/Users/' + userID, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.getCookie('token'),
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            }
        });
        const data = await response.json();
        this.setState({
            activeUser: this.getActiveUser(data),
            successMessage: null,
            errorMessage: null            
        }, () => {
            this.toggleModal();
        });
    }
    changeActiveUser(value, propertie) {
        let changedUser = this.state.activeUser;
        changedUser[propertie] = value;
        this.setState({ activeUser: changedUser });
    }
    renderModal() {
        return (
            <div>
                <Modal isOpen={this.state.showModal} size='xl' toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Карточка пользователя</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={12}>
                                {this.state.successMessage ?
                                    <Alert color="success">
                                        {this.state.successMessage}
                                    </Alert>
                                    : ''}
                                {this.state.errorMessage ?
                                    <Alert color="danger">
                                        {this.state.errorMessage}
                                    </Alert>
                                    : ''}
                                <Form>                                    
                                    <Row>
                                        <Col md={6}>
                                        <FormGroup>
                                            <Label for="nameInput">
                                                Имя
                                            </Label>
                                            <Input
                                                id="nameInput"
                                                name="name"
                                                value={this.state.activeUser ? this.state.activeUser.name : ''}
                                                onChange={(ev) => {
                                                    this.changeActiveUser(ev.target.value, 'name');
                                                }}
                                            />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="loginInput">
                                                    Логин
                                                </Label>
                                                <Input
                                                    id="loginInput"
                                                    name="login"
                                                    placeholder=""
                                                    value={this.state.activeUser ? this.state.activeUser.login : ''}
                                                    onChange={(ev) => {
                                                        this.changeActiveUser(ev.target.value, 'login');
                                                    }}
                                                />
                                            </FormGroup>
                                        </Col>                                                                                
                                    </Row>

                                    <Row>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="roleInput">
                                                    Роль
                                                </Label>
                                                <Input
                                                    id="roleInput"
                                                    name="role"
                                                    type="select"
                                                    value={this.state.activeUser?.role ? this.state.activeUser.role.name : ''}
                                                    onChange={(ev) => {
                                                        this.changeActiveUser(ev.target.value, 'role');
                                                    }}
                                                >
                                                    <option value={null}>
                                                        Не выбран
                                                    </option>
                                                    {this.state.roles.map(role =>
                                                        <option value={role.name} key={role.id}>
                                                            {role.name}
                                                        </option>
                                                    )}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="phoneInput">
                                                    Телефон
                                                </Label>
                                                <Input
                                                    id="phoneInput"
                                                    name="phone"                                                    
                                                    value={this.state.activeUser ? this.state.activeUser.phone : ''}
                                                    onChange={(ev) => {
                                                        this.changeActiveUser(ev.target.value, 'phone');
                                                    }}
                                                >                                                    
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label for="emailInput">
                                                    Почта
                                                </Label>
                                                <Input
                                                    id="emailInput"
                                                    name="email"                                                    
                                                    value={this.state.activeUser ? this.state.activeUser.email : ''}
                                                    onChange={(ev) => {
                                                        this.changeActiveUser(ev.target.value, 'email');
                                                    }}
                                                >                                                    
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                                
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.activeUser ? this.state.activeUser.id ? <Button color="danger" onClick={this.deleteActiveUser}>
                            Удалить
                        </Button> : '' : ''}
                        {' '}
                        <Button color="secondary" onClick={this.saveActiveUserChanges}>
                            Сохранить
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

// возвращает куки с указанным name,
// или undefined, если ничего не найдено
    getCookie(name) {
    //name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
    toggleModal() {
        let newmodal = !this.state.showModal;
        this.setState({ showModal: newmodal });
    }

    componentDidMount() {        
        let token = this.getCookie('token');
        if (token !== null) this.setState({ token: token });
        //alert(this.getCookie('token'));
        this.populateUsersData();
        this.populateRolesData();
  }

    renderUserTable(users) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
                <tr>
                    <th></th>
            <th>Id</th>
            <th>Имя</th>
            <th>Логин</th>
                    <th>Телефон</th>
                    <th>Почта</th>
                    <th>Роль</th>
                    <th>Полномочия</th>
          </tr>
        </thead>
        <tbody>
                {users.map(user =>
                    <tr key={user.id}>
                        <td><Button
                            color="primary"
                            size="sm"
                            onClick={() => { this.editUser(user.id) }}
                        >
                            Изменить
                        </Button></td>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.login}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>{user?.role?.name}</td>
                        <td><ul>{user?.role?.scopes.map(scope =>
                            <li key={scope.id}>{scope.scope.name}</li>
                        )
                        }</ul></td>

            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
          : this.renderUserTable(this.state.users);
      let modal = this.renderModal();

    return (
      <div>
        <h1 id="tabelLabel" >Пользователи</h1>
            <p>Добавление, изменение, удаление пользователей</p>
            {}
            {this.state.errorMessage ?
                <Alert color="danger">
                    {this.state.errorMessage}
                </Alert>
                : ''}            
            {contents}
            {modal}
      </div>
    );
  }
    async populateRolesData() {
        const response = await fetch(settings.identityapiurl + '/Roles');        
        if (response.ok) {
            const data = await response.json();
            this.setState({
                roles: data                
            });
        }
        else this.setState({
            errorMessage: 'Ошибка загрузки данных',
            loading: true
        });        
    }
    async populateUsersData() {
        try {
            const response = await fetch(settings.identityapiurl + '/Users/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.getCookie('token'),
                    'Content-Type': 'application/json;',
                    'accept': 'text/plain'
                }
            });
            if (response.ok) {
                const data = await response.json();
                this.setState({
                    users: data,
                    loading: false,
                    errorMessage: null
                });
            }
            else {                
                this.setState({
                    errorMessage: 'Ошибка загрузки данных'
                });
            }
        }
        catch {
            this.setState({
                errorMessage: 'Ошибка загрузки данных. Необходимо авторизоваться!'
            });
        }            
  }
}
