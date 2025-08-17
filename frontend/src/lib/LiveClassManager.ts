import Peer from 'peerjs';

class LiveClassManager {
    peer: Peer;
    connections: any = {};
    stream: MediaStream | null = null;
    onStream: (stream: MediaStream) => void;
    onPeerLeft: (peerId: string) => void;
    onData: (data: any) => void;

    constructor(userId, onStream, onPeerLeft, onData) {
        this.peer = new Peer(userId);
        this.onStream = onStream;
        this.onPeerLeft = onPeerLeft;
        this.onData = onData;
        this.init();
    }

    init() {
        this.peer.on('call', call => {
            this.stream && call.answer(this.stream);
            call.on('stream', remoteStream => {
                this.onStream(remoteStream);
            });
            this.connections[call.peer] = call;
        });

        this.peer.on('connection', conn => {
            conn.on('data', data => {
                this.onData(data);
            });
        });
    }

    async start(stream: MediaStream) {
        this.stream = stream;
    }

    connect(peerId: string) {
        if (this.stream) {
            const call = this.peer.call(peerId, this.stream);
            call.on('stream', remoteStream => {
                this.onStream(remoteStream);
            });
            this.connections[peerId] = call;
        }
    }

    disconnect(peerId: string) {
        if (this.connections[peerId]) {
            this.connections[peerId].close();
            delete this.connections[peerId];
            this.onPeerLeft(peerId);
        }
    }

    broadcast(data: any) {
        Object.values(this.connections).forEach((conn: any) => {
            if (conn.open) {
                conn.send(data);
            }
        });
    }

    replaceTrack(track: MediaStreamTrack) {
        if (this.stream) {
            const sender = this.peer.connections[Object.keys(this.connections)[0]][0].peerConnection.getSenders().find(s => s.track.kind === track.kind);
            if (sender) {
                sender.replaceTrack(track);
            }
        }
    }

    destroy() {
        this.peer.destroy();
    }
}

export default LiveClassManager;