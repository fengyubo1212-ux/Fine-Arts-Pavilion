import { Outlet } from 'react-router-dom';
import BubbleMenu from './BubbleMenu';
import SplashCursor from './SplashCursor';
import CustomCursor from './CustomCursor';
import FloatingParticles from './FloatingParticles';
import ScrollProgress from './ScrollProgress';
import BackToTop from './BackToTop';

export default function PublicLayout() {
  return (
    <>
      <SplashCursor
        RAINBOW_MODE={false}
        COLOR="#d4a860"
        BACK_COLOR={{ r: 0.03, g: 0.02, b: 0.01 }}
        DENSITY_DISSIPATION={2.5}
        VELOCITY_DISSIPATION={1.5}
        SPLAT_RADIUS={0.15}
        SPLAT_FORCE={4000}
        CURL={4}
        SHADING={true}
        COLOR_UPDATE_SPEED={5}
      />
      <FloatingParticles />
      <CustomCursor />
      <ScrollProgress />
      <BubbleMenu menuBg="#0e0e12" menuContentColor="#e0dcd5" />
      <main className="public-main"><Outlet /></main>
      <BackToTop />
    </>
  );
}

