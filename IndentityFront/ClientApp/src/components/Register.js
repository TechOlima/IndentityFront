import React, { Component } from 'react';
import {
    Card, CardHeader, CardBody, FormGroup, Label, Button, CardFooter, Row, Col,
    Input, Alert, Form
} from 'reactstrap';
import settings from './settings.json';

export class Register extends Component {
    static displayName = Register.name;
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            login: '',
            password: '',
            passwordconfirm: '',
            phone: '',
            email:'',
            successMessage: null,
            errorMessage: null,
            redirectUrl: null,
            token: null
        };
        this.registerUser = this.registerUser.bind(this);
    }
    async registerUser() {
        
        let activeUser = {
            name: this.state.name,
            login: this.state.login,
            password: this.state.password,
            passwordconfirm: this.state.passwordconfirm,
            phone: this.state.phone,
            email: this.state.email
        };
        
        const response = await fetch(settings.identityapiurl + '/OAuth/RegisterUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;',
                'accept': 'text/plain'
            },
            body: JSON.stringify(activeUser)
        });
        if (response.ok) {
            this.setState({
                successMessage: 'Пользователь зарегистрирован',
                errorMessage: null
            });
        }
        else {
            this.setState({ errorMessage: 'Произошла ошибка при регистрации', successMessage: null });
        }
    }    

    componentDidMount() {        
        //получаем параметр редиректа
        const search = window.location.search;
        const params = new URLSearchParams(search);
        let redirectUrl = params.get('redirectUrl');
        //console.log(code);
        if (redirectUrl !== null) {
            this.setState({ redirectUrl: redirectUrl });            
        }        
    }  

  render() {
    return (
        <div>
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <Card style={{ width: '100%' }}
                    >
                        <CardHeader>
                            Регистрация пользователя
                        </CardHeader>
                        <CardBody>
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
                            <Row>
                                <Col md={12}>                                    
                                    <Form>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="nameInput">
                                                        Имя
                                                    </Label>
                                                    <Input
                                                        autoComplete="off"
                                                        id="nameInput"                                                        
                                                        value={this.state.name}
                                                        onChange={(ev) => this.setState({ name: ev.target.value })}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="loginInput">
                                                        Логин
                                                    </Label>
                                                    <Input
                                                        autoComplete="off"
                                                        id="loginInput"                                                        
                                                        placeholder=""
                                                        value={this.state.login}
                                                        onChange={(ev) => this.setState({ login: ev.target.value })}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>                                            
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="phoneInput">
                                                        Телефон
                                                    </Label>
                                                    <Input
                                                        autoComplete="off"
                                                        id="phoneInput"                                                        
                                                        value={this.state.phone}
                                                        onChange={(ev) => this.setState({ phone: ev.target.value })}
                                                    >
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="emailInput">
                                                        Почта
                                                    </Label>
                                                    <Input
                                                        autoComplete="off"
                                                        id="emailInput"
                                                        name="email"
                                                        value={this.state.email}
                                                        onChange={(ev) => this.setState({ email: ev.target.value })}
                                                    >
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>

                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="examplepassword">
                                            Пароль
                                        </Label>
                                        <Input
                                            id="examplepassword"
                                            autoComplete="off"
                                            value={this.state.password}
                                            onChange={(ev) => this.setState({ password: ev.target.value })}
                                            type="password"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="examplepasswordconfirm">
                                            Подтерждение пароль
                                        </Label>
                                        <Input
                                            id="examplepasswordconfirm"
                                            autoComplete="off"
                                            value={this.state.passwordconfirm}
                                            onChange={(ev) => this.setState({ passwordconfirm: ev.target.value })}
                                            type="password"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>          
                        </CardBody>
                        <CardFooter>
                            <Button color='primary' onClick={this.registerUser}>
                                Зарегистрироваться
                            </Button>
                        </CardFooter>
                    </Card>

                </Col>
            <Col md={2}></Col>
            </Row>
            
            </div>
    );
  }
}
