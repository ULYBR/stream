export interface StreamHubEvent {
    id: string;
    timestamp: string;
    source:
    | "streamhub.streams"
    | "streamhub.chat"
    | "streamhub.users"
    | "streamhub.system";
    type: string;
    data: Record<string, unknown>;
    metadata?: {
        userId?: string;
        streamId?: string;
        sessionId?: string;
        correlationId?: string;
    };
}

export interface StreamEvent extends StreamHubEvent {
    source: "streamhub.streams";
    type:
    | "Stream Started"
    | "Stream Ended"
    | "Stream Updated"
    | "Viewer Joined"
    | "Viewer Left";
    data: {
        streamId: string;
        title?: string;
        status?: "live" | "ended" | "paused";
        viewerCount?: number;
        userId?: string;
    };
}

export interface ChatEvent extends StreamHubEvent {
    source: "streamhub.chat";
    type:
    | "Message Sent"
    | "User Joined Chat"
    | "User Left Chat"
    | "Moderator Action";
    data: {
        messageId?: string;
        message?: string;
        userId: string;
        streamId: string;
        action?: "ban" | "timeout" | "delete";
    };
}

export interface UserEvent extends StreamHubEvent {
    source: "streamhub.users";
    type:
    | "User Registered"
    | "User Login"
    | "Profile Updated"
    | "Subscription Changed";
    data: {
        userId: string;
        email?: string;
        profileData?: Record<string, unknown>;
        subscriptionTier?: "free" | "premium" | "pro";
    };
}

export interface SystemEvent extends StreamHubEvent {
    source: "streamhub.system";
    type: "Health Check" | "Backup Created" | "Error Occurred" | "Maintenance";
    data: {
        component?: string;
        status?: "healthy" | "degraded" | "down";
        errorMessage?: string;
        backupLocation?: string;
    };
}