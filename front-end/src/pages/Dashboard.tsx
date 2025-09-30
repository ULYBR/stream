import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Video, Search, TrendingUp, Users, Eye, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Stream {
  id: string;
  title: string;
  streamerName: string;
  streamerAvatar: string;
  thumbnailUrl: string;
  viewersCount: number;
  category: string;
  isLive: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/auth");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // TODO: Integrar com API de streams
    // GET /api/streams?status=live
    // Headers: { Authorization: Bearer ${token} }
    // Response: { streams: Stream[] }

    // Mock data
    const mockStreams: Stream[] = [
      {
        id: "1",
        title: "Desenvolvimento Full Stack - Node.js + React",
        streamerName: "DevMaster",
        streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevMaster",
        thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        viewersCount: 1234,
        category: "Technology",
        isLive: true,
      },
      {
        id: "2",
        title: "Live Coding: Microservices com NestJS",
        streamerName: "CodeNinja",
        streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CodeNinja",
        thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        viewersCount: 856,
        category: "Backend",
        isLive: true,
      },
      {
        id: "3",
        title: "Vue.js 3 Composition API - Tutorial Completo",
        streamerName: "FrontendPro",
        streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FrontendPro",
        thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        viewersCount: 2341,
        category: "Frontend",
        isLive: true,
      },
      {
        id: "4",
        title: "Kafka e Mensageria - Arquitetura Distribuída",
        streamerName: "CloudArch",
        streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CloudArch",
        thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
        viewersCount: 567,
        category: "DevOps",
        isLive: true,
      },
    ];

    setStreams(mockStreams);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso!");
    navigate("/auth");
  };

  const filteredStreams = streams.filter((stream) =>
    stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.streamerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text hidden sm:block">StreamHub</h1>
            </div>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar streams, streamers, categorias..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <TrendingUp className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-2xl font-bold">Streams ao Vivo</h2>
          </div>
          <p className="text-muted-foreground">
            {filteredStreams.length} stream{filteredStreams.length !== 1 ? 's' : ''} online agora
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStreams.map((stream) => (
            <Card
              key={stream.id}
              className="group cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden glass-effect"
              onClick={() => navigate(`/stream/${stream.id}`)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={stream.thumbnailUrl}
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {stream.isLive && (
                  <div className="absolute top-3 left-3">
                    <span className="live-badge text-xs font-semibold">
                      AO VIVO
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-xs font-semibold text-white">
                    {stream.viewersCount.toLocaleString()}
                  </span>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={stream.streamerAvatar} />
                    <AvatarFallback>{stream.streamerName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {stream.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {stream.streamerName}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {stream.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStreams.length === 0 && (
          <div className="text-center py-16">
            <Video className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma stream encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou volte mais tarde
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
