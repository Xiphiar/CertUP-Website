// import styles from "./styles.module.scss"
import { CUButton, Spacer } from '../../components';
import Layout from '../../components/Layout';
import CertUpButton from '../../components/CUButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import styles from './styles.module.scss';
import exampleCert from '../../assets/ExampleCert.svg';
import { useWallet } from '../../contexts';
import ConnectBanner from '../../components/ConnectBanner';
import ProjectList from '../../components/ProjectList';
import { useEffect, useState } from 'react';
import ProjectForm from '../../components/ProjectForm';
import Project from '../../interfaces/Project';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { PreviewProvider } from '../../contexts/PreviewContext';
import ProjectReview from '../../components/ProjectReview';

export default function Issuers() {
  const [showProject, setShowProject] = useState(false);
  const [showReview, setShowReview] = useState(false);
  //const [projectInfo, setProjectInfo] = useState<Project | undefined>();
  const [projectId, setProjectId] = useState<string>();
  const [projectStep, setProjectStep] = useState();
  const {
    Client,
    ClientIsSigner,
    Wallet,
    Address,
    LoginToken,
    VerifiedIssuer,
    LoadingRemainingCerts,
  } = useWallet();

  const location = useLocation();

  useEffect(() => {
    processReturn();
  }, []);

  const processReturn = async () => {
    if (location.state?.projectId) {
      if (location.state?.step) setProjectStep(location.state?.step);

      //const project = await getProject(location.state?.projectId);
      console.log('projectId', location.state?.projectId);
      setProjectId(location.state?.projectId);
    }
  };

  const getProject = async (projectId: string): Promise<Project> => {
    console.log('running', LoginToken, Address);
    const token = `Permit ${JSON.stringify(LoginToken)}`;
    const url = new URL(`/projects/${projectId}`, process.env.REACT_APP_BACKEND);
    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: token,
      },
    });
    console.log(response);
    return response.data.data;
  };

  const setProject = (projectId?: string) => {
    setProjectId(projectId);
    setShowProject(true);
  };

  const setReview = (projectId?: string) => {
    setProjectId(projectId);
    setShowReview(true);
  };

  const showList = () => {
    setProjectId(undefined);
    setShowProject(false);
    setShowReview(false);
  };

  if (!Wallet || !Address || !LoginToken)
    return (
      <>
        <Layout>
          <Spacer height={100} />

          <Container>
            <Row>
              <span className={styles.aboutTitle}>Issue Certificate</span>
            </Row>
          </Container>
          <Spacer height={50} />

          <ConnectBanner />

          <Spacer height={150} />
        </Layout>
      </>
    );

  if (showProject)
    return (
      <Layout>
        <Spacer height={100} />
        <PreviewProvider>
          <ProjectForm pid={projectId} backHandler={showList} step={projectStep} />
        </PreviewProvider>
      </Layout>
    );

  if (showReview)
    return (
      <Layout>
        <Spacer height={100} />
        <ProjectReview pid={projectId} backHandler={showList} step={projectStep} />
      </Layout>
    );

  return (
    <Layout>
      <Spacer height={100} />
      <ProjectList setProjectIdForm={setProject} setProjectIdReview={setReview} />
    </Layout>
  );
}
