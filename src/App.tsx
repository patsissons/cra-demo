import React, {Component} from 'react';

import {
  DisplayText,
  FooterHelp,
  Heading,
  Image,
  Layout,
  Link,
} from '@shopify/polaris';

import logo from './logo.svg';
import styles from './App.module.scss';

export class App extends Component {
  render() {
    return (
      <Layout>
        <div className={styles.App}>
          <Heading element="h1">
            <DisplayText size="extraLarge">create-react-app Demo</DisplayText>
          </Heading>
          <Image alt="logo" className={styles.Logo} source={logo} />
          <FooterHelp>
            Built using <Link url="https://polaris.shopify.com">Polaris</Link>.
          </FooterHelp>
        </div>
      </Layout>
    );
  }
}

export default App;
