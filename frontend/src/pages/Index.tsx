import { useState } from "react";
import endpoints, { type Endpoint } from "@/data/apiEndpoints";
import { ApiSidebar } from "@/components/ApiSidebar";
import { EndpointPanel } from "@/components/EndpointPanel";
import { TryItPanel } from "@/components/TryItPanel";
import { TopNav } from "@/components/TopNav";

const Index = () => {
  const [selected, setSelected] = useState<Endpoint>(endpoints[0]);
  const [tryItOpen, setTryItOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ApiSidebar selectedId={selected.id} onSelect={(ep) => { setSelected(ep); setTryItOpen(false); }} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <EndpointPanel endpoint={selected} onTryIt={() => setTryItOpen(true)} />
        </main>
      </div>
      <TryItPanel endpoint={selected} open={tryItOpen} onClose={() => setTryItOpen(false)} />
    </div>
  );
};

export default Index;
