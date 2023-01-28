import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ConnectButton from './connectButton/connectButton.js';
//<Button variant="primary">Connect Wallet</Button>{' '}

function Header() {
  return (
    <nav class="navbar navbar-dark bg-primary">
      <Container>
        <Navbar.Brand href="#home">SAAS Payment Channels</Navbar.Brand>
        <Navbar.Toggle />
          <ConnectButton />
      </Container>
    </nav>
  );
}

export default Header;