import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Users, Send, Eye } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
}

interface StreamData {
  id: string;
  title: string;
  streamerName: string;
  streamerAvatar: string;
  streamUrl: string;
  viewersCount: number;
  category: string;
  description: string;
}

const StreamView = () => {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState<StreamData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/auth");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // TODO: Integrar com API de stream
    // GET /api/streams/:streamId
    // Headers: { Authorization: Bearer ${token} }
    // Response: { stream: StreamData }

    // Mock data
    const mockStream: StreamData = {
      id: streamId || "1",
      title: "Desenvolvimento Full Stack - Node.js + React",
      streamerName: "DevMaster",
      streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevMaster",
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      viewersCount: 1234,
      category: "Technology",
      description: "Nesta live vamos construir uma aplicação full stack do zero usando Node.js e React!",
    };

    setStream(mockStream);

    // TODO: Conectar ao WebSocket para chat em tempo real
    // WebSocket: wss://api.example.com/ws/streams/:streamId/chat
    // Headers: { Authorization: Bearer ${token} }
    // 
    // Eventos recebidos:
    // - { type: 'message', data: ChatMessage }
    // - { type: 'viewer_joined', data: { userName, count } }
    // - { type: 'viewer_left', data: { userName, count } }
    //
    // Eventos enviados:
    // - { type: 'send_message', message: string }

    // Mock WebSocket connection
    const mockMessages: ChatMessage[] = [
      {
        id: "1",
        userId: "user1",
        userName: "João Silva",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
        message: "Ótima stream! 🔥",
        timestamp: new Date(Date.now() - 5000),
      },
      {
        id: "2",
        userId: "user2",
        userName: "Maria Santos",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
        message: "Muito bom esse conteúdo!",
        timestamp: new Date(Date.now() - 3000),
      },
    ];

    setMessages(mockMessages);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [streamId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // TODO: Enviar mensagem via WebSocket
    // wsRef.current?.send(JSON.stringify({ type: 'send_message', message: newMessage }));

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || "current-user",
      userName: user?.name || "Você",
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`,
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  if (!stream) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando stream...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/20">
                <Eye className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold">{stream.viewersCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden glass-effect">
              <div className="relative aspect-video bg-black">
                {/* TODO: Integrar player de vídeo (ex: Video.js, HLS.js) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-white text-lg font-semibold">Player de Vídeo</p>
                    <p className="text-white/60 text-sm mt-2">Integrar HLS.js ou Video.js aqui</p>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <span className="live-badge">
                    AO VIVO
                  </span>
                </div>
              </div>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={stream.streamerAvatar} />
                    <AvatarFallback>{stream.streamerName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{stream.title}</h1>
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-muted-foreground">{stream.streamerName}</p>
                      <Badge variant="secondary">{stream.category}</Badge>
                    </div>
                    <p className="text-muted-foreground">{stream.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-1">
            <Card className="glass-effect h-[600px] flex flex-col">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Chat ao Vivo
                </CardTitle>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={msg.userAvatar} />
                        <AvatarFallback>{msg.userName[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold">{msg.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enviar mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StreamView;
