import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import Pusher from 'pusher-js';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    pusher: any;
    myid: string;
    channel: any;
    usersOnline: any;
    id: any;
    users: Array<any> = Array(0);
    sessionDesc: any;
    currentcaller: any;
    room: any;
    caller: any;
    localUserMedia: any;
    self: any;
    remote: any;
    btnHide: boolean = true;
    constructor() {
        this.pusher = new Pusher(environment.pusher.key, {
            cluster: environment.pusher.cluster,
            encrypted: true,
            authEndpoint: environment.pusher.authEndpoint
        });
    }

    ngOnInit() {
        this._setRTC();
        this._bindEvents();
    }

    protected _setRTC() {
        this._GetRTCPeerConnection();
        this._GetRTCSessionDescription();
        this._GetRTCIceCandidate();
        this._prepareCaller();
    }

    protected _bindEvents() {

        this.channel = this.pusher.subscribe('presence-videocall');

        this.channel.bind('pusher:subscription_succeeded', (members) => {
            //set the member count
            this.usersOnline = members.count;
            this.id = this.channel.members.me.id;
            this.myid = ` My caller id is : ` + this.id;
            members.each((member) => {
                if (member.id != this.channel.members.me.id) {
                    this.users.push(member.id)
                }
            });
        });

        this.channel.bind('pusher:member_added', (member) => {
            this.users.push(member.id)
        });

        this.channel.bind('pusher:member_removed', (member) => {
            // for remove member from list:
            var index = this.users.indexOf(member.id);
            this.users.splice(index, 1);
            if (member.id == this.room) {
                this._endCall();
            }
        });

        this.channel.bind("client-candidate", (msg) => {
            if (msg.room == this.room) {
                console.log("candidate received");
                this.caller.addIceCandidate(new RTCIceCandidate(msg.candidate));
            }
        });

        this.channel.bind("client-sdp", (msg) => {
            if (msg.room == this.id) {
                console.log("sdp received");
                var answer = confirm("You have a call from: " + msg.from + "Would you like to answer?");
                if (!answer) {
                    return this.channel.trigger("client-reject", { "room": msg.room, "rejected": this.id });
                }
                this.room = msg.room;
                this._getCam()
                    .then(stream => {
                        this.localUserMedia = stream;
                        this._toggleEndCallButton();
                        if (window.URL) {
                            document.getElementById("selfview")["src"] = window.URL.createObjectURL(stream);
                        } else {
                            document.getElementById("selfview")["src"] = stream;
                        }
                        this.caller.addStream(stream);
                        var sessionDesc = new RTCSessionDescription(msg.sdp);
                        this.caller.setRemoteDescription(sessionDesc);
                        this.caller.createAnswer().then((sdp) => {
                            this.caller.setLocalDescription(new RTCSessionDescription(sdp));
                            this.channel.trigger("client-answer", {
                                "sdp": sdp,
                                "room": this.room
                            });
                        });
                    })
                    .catch(error => {
                        console.log('an error occured', error);
                    });
            }
        });


        //Listening for answer to offer sent to remote peer
        this.channel.bind("client-answer", (answer) => {
            if (answer.room == this.room) {
                console.log("answer received");
                this.caller.setRemoteDescription(new RTCSessionDescription(answer.sdp));
            }

        });

        this.channel.bind("client-reject", (answer) => {
            if (answer.room == this.room) {
                console.log("Call declined");
                alert("call to " + answer.rejected + "was politely declined");
                this._endCall();
            }

        });

        this.channel.bind("client-_endCall", (answer) => {
            if (answer.room == this.room) {
                console.log("Call Ended");
                this._endCall();

            }
        });

    }

    protected _toggleEndCallButton() {
        if (document.getElementById("endCall").style.display == 'block') {
            document.getElementById("endCall").style.display = 'none';
        } else {
            document.getElementById("endCall").style.display = 'block';
        }
    }

    protected _endCall() {
        this.room = undefined;
        this.caller.close();
        for (let track of this.localUserMedia.getTracks()) { track.stop() }
        this._prepareCaller();
        this._toggleEndCallButton();
    }

    public endCurrentCall() {
        this.channel.trigger("client-endcall", {
            "room": this.room
        });
        this._endCall();
    }

    //Send the ICE Candidate to the remote peer
    protected _onIceCandidate(peer, evt) {
        if (evt.candidate) {
            this.channel.trigger("client-candidate", {
                "candidate": evt.candidate,
                "room": this.room
            });
        }
    }

    public callUser(user) {
        this._getCam()
            .then(stream => {
                if (window.URL) {
                    document.getElementById("selfview")["src"] = window.URL.createObjectURL(stream);
                } else {
                    document.getElementById("selfview")["src"] = stream;
                }
                this._toggleEndCallButton();
                this.caller.addStream(stream);
                this.localUserMedia = stream;
                this.caller.createOffer().then((desc) => {
                    this.caller.setLocalDescription(new RTCSessionDescription(desc));
                    this.channel.trigger("client-sdp", {
                        "sdp": desc,
                        "room": user,
                        "from": this.id
                    });
                    this.room = user;
                });

            })
            .catch(error => {
                console.log('an error occured', error);
            })
    };

    protected _getCam() {
        //Get local audio/video feed and show it in selfview video element 
        return navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
    }


    protected _prepareCaller() {
        //Initializing a peer connection
        this.caller = new (<any>window).RTCPeerConnection();
        //Listen for ICE Candidates and send them to remote peers
        this.caller.onicecandidate = (evt) => {
            if (!evt.candidate) return;
            console.log("onicecandidate called");
            this._onIceCandidate(this.caller, evt);
        };
        //onaddstream handler to receive remote feed and show in remoteview video element
        this.caller.onaddstream = (evt) => {
            console.log("onaddstream called");
            if (window.URL) {
                document.getElementById("remoteview")["src"] = window.URL.createObjectURL(evt.stream);
            } else {
                document.getElementById("remoteview")["src"] = evt.stream;
            }
        };
    }

    protected _GetRTCIceCandidate() {
        (<any>window).RTCIceCandidate = (<any>window).RTCIceCandidate || (<any>window).webkitRTCIceCandidate ||
            (<any>window).mozRTCIceCandidate || (<any>window).msRTCIceCandidate;

        return (<any>window).RTCIceCandidate;
    }

    protected _GetRTCPeerConnection() {
        (<any>window).RTCPeerConnection = (<any>window).RTCPeerConnection || (<any>window).webkitRTCPeerConnection ||
            (<any>window).mozRTCPeerConnection || (<any>window).msRTCPeerConnection;
        return (<any>window).RTCPeerConnection;
    }

    protected _GetRTCSessionDescription() {
        (<any>window).RTCSessionDescription = (<any>window).RTCSessionDescription || (<any>window).webkitRTCSessionDescription ||
            (<any>window).mozRTCSessionDescription || (<any>window).msRTCSessionDescription;
        return (<any>window).RTCSessionDescription;
    }

}
