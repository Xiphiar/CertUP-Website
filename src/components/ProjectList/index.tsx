import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ConnectBanner from '../ConnectBanner';
import { Spacer } from '../../components';
import axios from 'axios';
import { useWallet } from '../../contexts/WalletContext';
import Spinner from 'react-bootstrap/Spinner';

import styles from './styles.module.scss';
import ProjectTile from '../ProjectTile';
import Project from '../../interfaces/Project';
import CUButton from '../CUButton';
import { useProject } from '../../contexts/ProjectContext';
import { Link } from 'react-router-dom';
import { RestrictedAccess } from '../RestrictedAccess';

interface Props {
  setProjectIdForm: (projectId?: string) => void;
  setProjectIdReview: (projectId?: string) => void;
}

export default function ProjectList({ setProjectIdForm, setProjectIdReview }: Props) {
  //const { Client, ClientIsSigner, Wallet, Address, LoginToken } = useWallet();
  const { PendingProjects, LoadingPendingProjects } = useProject();
  const { VerifiedIssuer, LoadingRemainingCerts, queryCredits } = useWallet();

  // const [loading, setLoading] = useState<boolean>(true);
  // const [projects, setProjects] = useState([]);
  // useEffect(() => {
  //   getProjects();
  // }, [Address]);
  // const getProjects = async () => {
  //   console.log('running', LoginToken, Address);
  //   const token = `Permit ${JSON.stringify(LoginToken)}`;
  //   const url = new URL(`/projects/owner/${Address}`, process.env.REACT_APP_BACKEND);
  //   const response = await axios.get(url.toString(), {
  //     headers: {
  //       Authorization: token,
  //     },
  //   });
  //   console.log(response);
  //   setProjects(response.data.data);
  //   setLoading(false);
  // };

  //refresh credits on mount if they are nto verified (to see if they became verified)
  useEffect(() => {
    if (!VerifiedIssuer) queryCredits();
  }, []);

  if (!LoadingRemainingCerts && !VerifiedIssuer)
    return (
      <>
        <Container>
          <Row className="justify-content-center">
            <span className={styles.aboutTitle}>For Issuers</span>

            <Col xs={'auto'}>
              <CUButton onClick={() => setProjectIdForm()} disabled={true}>
                New Certificate
              </CUButton>
            </Col>
          </Row>
        </Container>

        <Spacer height={50} />

        <RestrictedAccess />
      </>
    );

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <span className={styles.aboutTitle}>Issue Certificate</span>

          <Col xs={'auto'}>
            <CUButton onClick={() => setProjectIdForm()} disabled={LoadingRemainingCerts}>
              New Certificate
            </CUButton>
          </Col>
        </Row>
      </Container>

      <Spacer height={50} />

      <Container>
        <h3 className={styles.certsLabel}>Your Certificates</h3>
        {LoadingPendingProjects || LoadingRemainingCerts ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : PendingProjects.length ? (
          <Row className="">
            {PendingProjects.map((p, i) => (
              <ProjectTile
                projectIn={p}
                setProjectIdForm={setProjectIdForm}
                setProjectIdReview={setProjectIdReview}
                key={`project-list-${i}`}
              />
            ))}
          </Row>
        ) : (
          <span className={styles.certStatus}>You dont have any certificate projets yet.</span>
        )}
      </Container>
    </>
  );
}
