import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Cookie from '../components/clicker/Cookie'
import RingParticleSystem, { RingParticleEvent } from '../components/clicker/RingParticleSystem'

type Props = {}

const Page = styled.div`
    width: 100vw;
    height: 100vh;
    background: radial-gradient(50% 130.25% at 0% 0%, rgba(49, 131, 255, 0.21) 0%, rgba(251, 49, 255, 0) 63.68%), radial-gradient(32.15% 101.6% at 100% 100%, rgba(0, 255, 163, 0.52) 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(20.18% 63.77% at 70.18% 53.58%, rgba(255, 0, 199, 0.2) 0%, rgba(255, 0, 199, 0) 100%), radial-gradient(50% 50% at 50% 50%, #163B40 0%, #040A0E 64.06%);
`

const PageContainer = styled.div`
    width: 100%;
    max-width: 960px;
    height: 100vh;
    margin-left: auto;
    margin-right: auto;
`

const CookieContainer = styled.div`
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
`

function Clicker({ }: Props) {
    // Ring particles
    const [ringParticles, setRingParticles] = useState<RingParticleEvent[]>([]);
    const cookieClicked: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        setRingParticles([
            ...ringParticles,
            {
                spawnedAt: Date.now(),
                startingPositionX: e.pageX,
                startingPositionY: e.pageY
            }
        ]);
        console.log(ringParticles);
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setRingParticles(ringParticles.filter((p) => p.spawnedAt + 3000 < Date.now()));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Page>
            <PageContainer>
                <RingParticleSystem particles={ringParticles} />
                <CookieContainer>
                    <Cookie onClick={cookieClicked}></Cookie>
                </CookieContainer>
            </PageContainer>
        </Page>
    )
}

export default Clicker