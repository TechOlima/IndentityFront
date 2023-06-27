import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
        <div>
        <h1>Сервис аутентификации пользователей!</h1>
            <div>Обеспечивает:
                <ul>
                    <li>хранение информации о пользователях</li>
                    <li>добавление/изменение данных пользователей</li>
                    <li>предоставление токена доступа</li>
                </ul>
                </div>
      </div>
    );
  }
}
