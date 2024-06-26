import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Cookie from "../components/clicker/Cookie";
import Counter from "../components/clicker/Counter";
import Header from "../components/clicker/Header";
import MatrixParticleSystem from "../components/clicker/MatrixParticleSystem";
import RingParticleSystem, { RingParticleEvent } from "../components/clicker/RingParticleSystem";
import Upgrade from "../components/clicker/Upgrade";
import WalletDropdown from "../components/clicker/WalletDropdown";
import WelcomeDialog from "../components/clicker/WelcomeDialog";
import useSolana from "../hooks/useSolana";

type Props = {};

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: radial-gradient(50% 130.25% at 0% 0%, rgba(49, 131, 255, 0.21) 0%, rgba(251, 49, 255, 0) 63.68%),
    radial-gradient(32.15% 101.6% at 100% 100%, rgba(0, 255, 163, 0.52) 0%, rgba(0, 0, 0, 0) 100%),
    radial-gradient(20.18% 63.77% at 70.18% 53.58%, rgba(255, 0, 199, 0.2) 0%, rgba(255, 0, 199, 0) 100%),
    radial-gradient(50% 50% at 50% 50%, #163b40 0%, #040a0e 64.06%);
`;

const PageContainer = styled.div`
  width: 100%;
  max-width: 1160px;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  @media (max-width: 800px) {
    order: 3;
    width: 100%;
  }

  & > *:first-child {
    margin-right: 100px;
  }
`;

const CookieContainer = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;

  @media (max-width: 800px) {
    padding-top: 200px;
  }
`;

const FooterContainer = styled.div`
  position: absolute;
  bottom: 15px;
  padding-left: 16px;
  padding-right: 16px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 1160px;
  margin-left: auto;
  margin-right: auto;

  & a {
    color: white;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s ease-in-out;
  }

  & a:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

function Clicker({ }: Props) {
  const solana = useSolana();
  const { currencyTokenBalance, upgradeTokenBalance, handleAirdrop, handleBuyUpgrade } = solana;
  const upgradeCost = 50 + 50 * Math.pow(upgradeTokenBalance, 2);

  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);

  const cookieClicked: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    spawnRingParticle(e.pageX, e.pageY);
    handleAirdrop();
  };

  // Ring particles
  const [ringParticles, setRingParticles] = useState<RingParticleEvent[]>([]);

  const spawnRingParticle = (positionX: number, positionY: number) => {
    setRingParticles([
      ...ringParticles,
      {
        spawnedAt: Date.now(),
        startingPositionX: positionX,
        startingPositionY: positionY,
      },
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRingParticles(ringParticles.filter((p) => p.spawnedAt + 3000 < Date.now()));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check localStorage if page has been visited before
    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited === null) {
      setIsWelcomeDialogOpen(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <Page>
      <WelcomeDialog isOpen={isWelcomeDialogOpen} setIsOpen={setIsWelcomeDialogOpen} />
      <MatrixParticleSystem solana={solana} />
      <PageContainer>
        <Header>
          <Row>
            <Counter text="COINS" count={currencyTokenBalance} />
            <Counter text="LVL" count={1 + Number(upgradeTokenBalance)} />
          </Row>
          <WalletDropdown solana={solana} />
        </Header>
        <RingParticleSystem particles={ringParticles} />
        <CookieContainer>
          <Upgrade coins={currencyTokenBalance} upgradeCost={upgradeCost} onUpgradeClick={() => handleBuyUpgrade()}>
            <Cookie onClick={cookieClicked}></Cookie>
          </Upgrade>
        </CookieContainer>
        <FooterContainer>
          <a onClick={() => setIsWelcomeDialogOpen(true)}>Instructions</a>
          <a href="https://t.me/KingoffTheHills" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </FooterContainer>
      </PageContainer>
    </Page>
  );
}

export default Clicker;
