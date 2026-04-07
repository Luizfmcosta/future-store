import { HomeView } from "@/components/home/HomeView";
import { ShopperExperienceProvider } from "@/context/ShopperExperienceContext";

export default function Home() {
  return (
    <ShopperExperienceProvider incrementVisitOnMount>
      <HomeView />
    </ShopperExperienceProvider>
  );
}
