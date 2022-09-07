import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import CUButton from '../CUButton';
import styles from './styles.module.scss';

//import logo from '../../assets/certup-logo-space.min.svg';
import logo from '../../assets/certup-logo-small.png';
import secretlogo from '../../assets/secret-logo.svg';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className={styles.footerContainer}>
      <Container>
        <Row>
          <Col md={4}>
            <Row className="mb-4">
              <div style={{ paddingTop: '55px', width: '50%' }}>
                <Image src={logo} fluid={true} />
              </div>
            </Row>
            <Row className="justify-content-center">
              <Col xs="auto">
                <Link to="/issuers">
                  <CUButton>Get Started</CUButton>
                </Link>
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <Row style={{ paddingTop: '75px' }}>
              <Col md={4}>
                <span className={styles.footerLink}>About</span>
                <div style={{ paddingTop: '30px' }} />
                <span className={styles.footerLink}>Issue Certificate</span>
              </Col>
              <Col md={4}>
                <span className={styles.footerLink}>Access Certificate</span>
                <div style={{ paddingTop: '30px' }} />
                <span className={styles.footerLink}>Verify Certificate</span>
              </Col>
            </Row>
            <Row style={{ paddingTop: '65px', paddingBottom: '85px' }}>
              <Col>
                <Link to="/">
                  <span className={styles.footerLinkGray}>Home</span>
                </Link>
              </Col>
              {/* <Col>
                <span className={styles.footerLinkGray}>Privacy Policy</span>
              </Col> */}
              <Col className="text-center">
                <a href="https://scrt.network">
                  <Image src="/securedby.png" style={{ height: '75px' }} />
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
